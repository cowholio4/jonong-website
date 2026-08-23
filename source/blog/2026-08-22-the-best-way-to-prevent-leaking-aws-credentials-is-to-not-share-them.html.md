---
title: The Best Way to Prevent Leaking AWS Credentials Is to Not Share Them
date: 2026-08-22 00:00 PST
author: Jason Pope
ai_model: Claude Sonnet 5
category: Security
archived: false
description: Replacing this site's CircleCI deploy keys with OpenID Connect, so the pipeline that syncs to S3 never holds a secret longer than a single job.
---

Right after [writing about replacing my personal AWS keys with IAM Roles Anywhere](/blog/2026/08/21/the-best-way-to-prevent-leaking-aws-credentials-is-to-not-have-them.html), I went to fix an unrelated CircleCI failure on this site and ran straight into the CI version of the exact same problem. The pipeline that builds this blog and syncs it to S3 was authenticating with a static `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` pair sitting in a CircleCI context, untouched since 2020. Six years old, permanent by construction, and copied into a third party's infrastructure where I don't control the disk, the logs, or who else has access.

That's a worse spot than a laptop. A key on my machine leaks if my machine leaks. A key in a CI context leaks if CircleCI leaks, if a build script echoes an env var by mistake, if a debugging step dumps the environment, or if anyone with context access ever needs to debug something and pastes more than they meant to. More places it's copied to, more ways out.

SPLIT_SUMMARY_BEFORE_THIS

## Same Lesson, Different Machine

The fix follows the same shape as Roles Anywhere: stop storing a secret and start proving identity instead. [OpenID Connect](https://circleci.com/docs/openid-connect-tokens/) is CircleCI's version of the trust anchor. Every job gets a short-lived, signed identity token for free — no setup required on the CircleCI side. AWS just needs to be told to trust tokens signed by CircleCI, the same way it was told to trust certificates signed by my personal CA.

The mapping is almost one-to-one:

| Roles Anywhere (laptop) | OIDC (CI) |
|---|---|
| Trust anchor: a CA cert registered with AWS | Identity provider: CircleCI's OIDC issuer URL registered with AWS |
| Client certificate, signed by the CA | Identity token (JWT), signed by CircleCI |
| `aws_signing_helper` presents the cert | `aws-cli/setup` presents the token |
| Certificate expires in ~825 days, revocable | Token expires with the job, one job at a time |

Same shape, tighter loop. A cert lives for months; a CircleCI OIDC token doesn't outlive the build.

## Setting It Up

**1. Get the identifiers that scope the trust policy.** CircleCI's OIDC issuer URL is keyed on your organization ID, and the token's `sub` claim can be restricted down to a single project:

```bash
circleci org list
# gh/cowholio4  ...  <CIRCLECI_ORG_ID>

circleci project get --project gh/cowholio4/cowholio4-website --json
# "id": "<CIRCLECI_PROJECT_ID>"
```

**2. Register CircleCI as an OIDC identity provider in IAM.** This is the one-time trust anchor setup:

```bash
aws iam create-open-id-connect-provider \
  --url "https://oidc.circleci.com/org/<CIRCLECI_ORG_ID>" \
  --client-id-list "<CIRCLECI_ORG_ID>" \
  --thumbprint-list "<ROOT_CA_THUMBPRINT>"
```

The audience is the org ID itself — every token CircleCI issues for this org carries it, and AWS checks it on every assume-role call.

**3. Create a role whose trust policy is scoped to one project**, not the whole org. This is the part that's easy to get lazy about, and the part that matters most:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {
      "Federated": "arn:aws:iam::<ACCOUNT_ID>:oidc-provider/oidc.circleci.com/org/<CIRCLECI_ORG_ID>"
    },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": {
        "oidc.circleci.com/org/<CIRCLECI_ORG_ID>:aud": "<CIRCLECI_ORG_ID>"
      },
      "StringLike": {
        "oidc.circleci.com/org/<CIRCLECI_ORG_ID>:sub": "org/<CIRCLECI_ORG_ID>/project/<CIRCLECI_PROJECT_ID>/user/*"
      }
    }
  }]
}
```

Without that `StringLike` condition on `sub`, *any* project in the org could assume this role. With it, only jobs running for this one repository can.

**4. Attach a policy scoped to exactly what the job does** — sync a build to one bucket, nothing else:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket", "s3:GetBucketLocation", "s3:PutBucketWebsite"],
      "Resource": "arn:aws:s3:::www-cowholio4-com"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:PutObjectAcl"],
      "Resource": "arn:aws:s3:::www-cowholio4-com/*"
    }
  ]
}
```

No delete permission — this site's sync never deletes remote files, so the role can't either.

**5. Point CircleCI at the role** using the `aws-cli` orb:

```yaml
version: 2.1

orbs:
  aws-cli: circleci/aws-cli@5.4

jobs:
  build:
    steps:
      - checkout
      - aws-cli/install
      - aws-cli/setup:
          role_arn: 'arn:aws:iam::<ACCOUNT_ID>:role/circleci-oidc-www-cowholio4-com-s3-sync'
          region: 'us-west-2'
      - run: bundle exec middleman build
      - run: bundle exec middleman s3_sync --environment=build
```

`aws-cli/setup` exchanges the job's OIDC token for temporary credentials via `AssumeRoleWithWebIdentity` and drops them into the default AWS profile. Nothing is stored — the credentials exist for the lifetime of the container and vanish when the job ends.

## Two Ways I Got the First Draft Wrong

Neither mistake was visible until the pipeline actually ran, which is exactly the case for least-privilege policies in general — you don't get them right by staring at the document, you get them right by running the thing and reading what it complains about.

**Step order.** I first put `aws-cli/setup` right before the `s3_sync` command, since that's the only step that talks to AWS — or so I assumed. The build failed on `bundle exec middleman build`, not on the sync step, because this site's `config.rb` resolves AWS credentials at configuration-evaluation time, on every Middleman invocation, whether or not that invocation touches S3. `aws-cli/setup` had to move earlier, before the first `middleman` command runs at all.

**Missing permission.** With the step order fixed, the very next run failed with a clean, specific `AccessDenied`: `s3:PutBucketWebsite` on the bucket. I'd scoped the policy to what I assumed s3_sync needed — read and write objects — but the gem also calls `PutBucketWebsite` unconditionally on every sync to keep the bucket's static-site configuration (index document, error document) up to date. That's a bucket-level permission, not an object-level one, and it's not optional in the library. One more statement, scoped to the bucket ARN only, and it went green.

Both failures were single-line, unambiguous IAM errors naming the exact missing piece. That's the actual argument for least privilege: not that it's more secure in the abstract, but that when it's wrong, it fails loudly and tells you precisely what to fix, instead of silently working with more access than anything needed.

## The Part That Would Have Made the Old Setup Worse

While gathering account details for this migration, I nearly created a new leak in the process of closing an old one — a stray command printed a plaintext access key to a terminal it shouldn't have, for an account I hadn't even meant to touch yet. It was rotated within minutes, and no harm came of it, but it was a good reminder of the actual failure mode here: it's not that people are careless, it's that static secrets create surface area, and surface area gets used eventually, often by the person trying to fix something else entirely. A key that only exists for the duration of one job can't be printed to a terminal three weeks from now, because by then it doesn't exist anymore.

## The Honest Take

The CI version of this problem is more urgent than the laptop version, not less. A personal machine has one user who's at least nominally paying attention to it. A CI context is shared, long-lived by default, rarely audited, and sits directly upstream of production. The static keys I replaced here had been valid, unrotated, and undifferentiated from full account access to this bucket for six years — not because anyone decided that was fine, but because nothing ever forced the question.

OIDC doesn't require that decision to be made well. It removes the option to get it wrong by removing the secret. There's nothing in a CircleCI context to leak anymore, because there's nothing there — just a role ARN, which is public information by design, doing nothing for anyone without a signed token that expires before they could act on it.
