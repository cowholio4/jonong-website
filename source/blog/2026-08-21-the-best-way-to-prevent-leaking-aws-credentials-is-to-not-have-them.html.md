---
title: The Best Way to Prevent Leaking AWS Credentials Is to Not Have Them
date: 2026-08-21 00:00 PST
author: Jason Pope
ai_model: Claude Sonnet 5
category: Security
archived: false
description: How I replaced long-lived AWS access keys with IAM Roles Anywhere, so there's no static secret sitting on disk to leak in the first place.
---

I recently went digging through my `~/.aws/config` and found exactly what you'd expect from a file nobody's looked at in years: two profiles, each with a plaintext `aws_access_key_id` and `aws_secret_access_key` sitting right there. One of them turned out to be a root account key. Not an IAM user with scoped permissions — the actual root credential, with the ability to do anything, including closing the account, stored as plaintext on my laptop.

That's the setup most people have. It works fine for years, right up until a laptop gets stolen, a dotfiles repo gets pushed to the wrong place, or a debugging script accidentally logs the environment.

The fix isn't a better way to store the secret. It's not needing one at all.

SPLIT_SUMMARY_BEFORE_THIS

## The Problem With Static Keys

Long-lived AWS access keys are a liability by construction. They don't expire on their own, they're trivial to accidentally commit or log, and once one leaks, whoever has it can use it from anywhere until someone notices and rotates it. Every additional place a key is copied to — a laptop, a CI variable, a teammate's `.env` file — is another place it can leak from.

The obvious mitigations (rotate keys regularly, restrict permissions, use a secrets manager) all still assume you have a secret to protect. [IAM Roles Anywhere](https://docs.aws.amazon.com/rolesanywhere/latest/userguide/introduction.html) sidesteps the problem: instead of a static key, your machine authenticates with an X.509 certificate and gets back **temporary, auto-expiring** credentials — typically good for an hour. There's no long-lived secret on disk to leak. If a certificate does leak, it's revocable and it expires anyway.

## How It Works

Roles Anywhere has four moving pieces:

1. **A trust anchor** — a CA certificate registered with AWS. This is the root of trust; AWS will accept any certificate signed by it.
2. **An IAM role** — a normal IAM role, except its trust policy allows `rolesanywhere.amazonaws.com` to assume it, scoped to a specific trust anchor and (optionally) certificate attributes like the subject CN.
3. **A Roles Anywhere profile** — maps the trust anchor to one or more roles it's allowed to request.
4. **A client certificate + private key** — issued from your CA, unique to your machine (or hardware key). This is what actually gets presented for authentication.

When you run an AWS CLI command, instead of reading a static key from `~/.aws/credentials`, the CLI shells out to a small binary — AWS's official [`aws_signing_helper`](https://github.com/aws/rolesanywhere-credential-helper) — via a `credential_process` entry in `~/.aws/config`. That binary signs a request with your private key, presents your certificate, and exchanges it for a temporary session via the Roles Anywhere `CreateSession` API. The private key itself never leaves your machine and is never transmitted anywhere.

## Setting It Up

**1. Install the credential helper.**

```bash
curl -o aws_signing_helper https://rolesanywhere.amazonaws.com/releases/1.6.0/Aarch64/Darwin/aws_signing_helper
xattr -c aws_signing_helper
chmod +x aws_signing_helper
sudo mv aws_signing_helper /usr/local/bin/
```

**2. Create a CA and a client certificate.** For personal use, a self-signed CA is far cheaper than AWS Private CA and works just as well as a trust anchor:

```bash
mkdir -p ~/.aws/rolesanywhere && cd ~/.aws/rolesanywhere

openssl ecparam -name prime256v1 -genkey -noout -out ca.key
openssl req -x509 -new -nodes -key ca.key -sha256 -days 3650 \
  -subj "/CN=my-personal-rolesanywhere-ca" \
  -addext "basicConstraints=critical,CA:true" \
  -addext "keyUsage=critical,keyCertSign,cRLSign" \
  -out ca.pem

openssl ecparam -name prime256v1 -genkey -noout -out client.key
openssl req -new -key client.key -subj "/CN=my-macbook" -out client.csr
openssl x509 -req -in client.csr -CA ca.pem -CAkey ca.key -CAcreateserial \
  -days 825 -sha256 -out client.pem
chmod 600 ca.key client.key
```

**3. Register the trust anchor, role, and profile in each AWS account** you want to authenticate into. This is the one part that needs the AWS API directly (`boto3` or the CLI, whichever has current `rolesanywhere` support):

```python
import boto3, json

ra = boto3.client("rolesanywhere")
iam = boto3.client("iam")

ca_pem = open("ca.pem").read()
trust_anchor = ra.create_trust_anchor(
    name="my-macbook-ca",
    source={"sourceType": "CERTIFICATE_BUNDLE", "sourceData": {"x509CertificateData": ca_pem}},
    enabled=True,
)["trustAnchor"]["trustAnchorArn"]

trust_policy = {
    "Version": "2012-10-17",
    "Statement": [{
        "Effect": "Allow",
        "Principal": {"Service": "rolesanywhere.amazonaws.com"},
        "Action": ["sts:AssumeRole", "sts:TagSession", "sts:SetSourceIdentity"],
        "Condition": {
            "StringEquals": {"aws:PrincipalTag/x509Subject/CN": "my-macbook"},
            "ArnEquals": {"aws:SourceArn": trust_anchor}
        }
    }]
}

role_arn = iam.create_role(
    RoleName="RolesAnywhere-my-macbook",
    AssumeRolePolicyDocument=json.dumps(trust_policy),
)["Role"]["Arn"]

iam.attach_role_policy(RoleName="RolesAnywhere-my-macbook",
    PolicyArn="arn:aws:iam::aws:policy/AdministratorAccess")

profile_arn = ra.create_profile(
    name="my-macbook", roleArns=[role_arn], enabled=True,
)["profile"]["profileArn"]

print(trust_anchor, role_arn, profile_arn)
```

Scope the attached policy down from `AdministratorAccess` to whatever the profile actually needs — this example mirrors what a personal account's static key could already do, which is exactly the kind of blanket permission worth narrowing once you know your real usage pattern.

**4. Point the profile at the helper** in `~/.aws/config`, and delete the static keys:

```ini
[profile my-account]
region = us-west-2
credential_process = /usr/local/bin/aws_signing_helper credential-process \
  --certificate /Users/you/.aws/rolesanywhere/client.pem \
  --private-key /Users/you/.aws/rolesanywhere/client.key \
  --trust-anchor-arn arn:aws:rolesanywhere:us-west-2:ACCOUNT_ID:trust-anchor/TA_ID \
  --profile-arn arn:aws:rolesanywhere:us-west-2:ACCOUNT_ID:profile/PROFILE_ID \
  --role-arn arn:aws:iam::ACCOUNT_ID:role/RolesAnywhere-my-macbook
```

```bash
aws sts get-caller-identity --profile my-account
```

If that returns an `assumed-role/RolesAnywhere-my-macbook/...` ARN instead of your old IAM user or root ARN, it worked. One CA and one client certificate can register as a trust anchor in as many AWS accounts as you have — you don't need a separate identity per account, just a separate trust anchor/role/profile in each.

## Going Further: Keep the Private Key Off the Filesystem Entirely

Even with static keys gone, `client.key` is still a file on disk — better than an AWS secret that grants direct API access, but still something that could theoretically be copied off the machine. If you have a YubiKey (or any PKCS#11-compatible hardware token), you can generate the key *on the device* instead, so it's never exportable at all:

```bash
brew install yubico-piv-tool

yubico-piv-tool -s 9c -a generate -A ECCP256 -o yubikey-pub.pem
yubico-piv-tool -s 9c -a verify-pin -a request-certificate \
  -S "/CN=my-macbook/" -i yubikey-pub.pem -o yubikey-req.csr

openssl x509 -req -in yubikey-req.csr -CA ca.pem -CAkey ca.key -CAcreateserial \
  -days 825 -sha256 -out yubikey-client.pem

yubico-piv-tool -s 9c -a import-certificate -i yubikey-client.pem
```

Then swap `--private-key` for a PKCS#11 URI referencing the key on the device, and add `--pkcs11-lib`:

```ini
credential_process = /usr/local/bin/aws_signing_helper credential-process \
  --certificate /Users/you/.aws/rolesanywhere/yubikey-client.pem \
  --private-key "pkcs11:id=%02" \
  --pkcs11-lib /opt/homebrew/lib/libykcs11.dylib \
  --trust-anchor-arn ... --profile-arn ... --role-arn ...
```

Now every AWS command prompts for your YubiKey PIN, and the signing happens on the device — the private key material never touches the filesystem, not even briefly.

One macOS-specific snag: AWS's official `aws_signing_helper` binary ships with Hardened Runtime enabled and no library-validation exemption, so by default it refuses to load a third-party PKCS#11 module like a Homebrew-built one (signed by a different developer than Amazon). The fix is re-signing the binary locally with an ad-hoc signature that adds the `com.apple.security.cs.disable-library-validation` entitlement:

```bash
plutil -create xml1 entitlements.plist
plutil -insert com.apple.security.cs.disable-library-validation -bool YES entitlements.plist
codesign --sign - --entitlements entitlements.plist --force /usr/local/bin/aws_signing_helper
```

## The Honest Take

None of this is exotic — Roles Anywhere has been around for a while, and none of the pieces are novel on their own. What made me actually do it wasn't a threat model, it was embarrassment: finding a root access key just sitting in a plaintext config file is the kind of thing that's obviously wrong the moment you see it, after years of not looking.

The bigger habit change is realizing that "store the secret more carefully" was never the right axis to optimize. The real fix is having fewer secrets that matter. A certificate that signs a request and expires in an hour just isn't the same category of risk as a key that works forever until someone remembers to rotate it.
