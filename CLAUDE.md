# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Site overview

This is a [Middleman](https://middlemanapp.com/) static site (`config.rb`) for jonongmusic.com, styled with Tailwind CSS + daisyUI. It's a portfolio site for composer Jon Ong with three pages: `source/index.html.slim` (home/bio), `source/press.html.slim` (press links), and `source/music.html.slim` (reel embed). Shared chrome lives in `source/layouts/layout.slim` and `source/_navbar.html.slim`.

This codebase was migrated from `cowholio4-website` (Jason Pope's personal blog) — the blog, category pages, coronavirus page, and Instagram photo-album proxy were all removed as part of that migration, since they don't apply here.

Run the dev server with:

```
bundle exec middleman server --bind-address=0.0.0.0 -p 3000
```

## Deploy is not yet configured

`config.rb`'s `s3_sync` block and `.circleci/config.yml`'s `deploy` job are both commented out. They previously pointed at cowholio4's own AWS account/S3 bucket — do not uncomment or re-enable them without first setting a real bucket name and OIDC role ARN for this project, or a build here could overwrite cowholio4.com's production site.

## Other docs

See [README.md](README.md) for dev environment setup and social-preview validation steps.
