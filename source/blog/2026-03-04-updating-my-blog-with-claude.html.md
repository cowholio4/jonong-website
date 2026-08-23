---
title: Updating My Blog With Claude
date: 2026-03-04 00:00 PST
author: Jason Pope
ai_model: Claude Sonnet 5
category: AI
archived: false
description: How I used Claude AI to add new blog entries to my Middleman-powered website.
---

A few years back I set up this Middleman-powered blog and then… promptly let it collect dust. Life gets busy. Motivation comes and goes. The friction of spinning up a dev environment, remembering the Slim templating syntax, and figuring out what to write is enough to keep most updates from ever happening.

So I tried something different: I asked Claude to do it for me.

SPLIT_SUMMARY_BEFORE_THIS

## The Setup

This site is a [Middleman](https://middlemanapp.com/) static site with blog posts stored as Markdown or Slim files in `source/blog/`. Each file follows a `YYYY-MM-DD-title-slug.html.md` naming convention and has YAML frontmatter at the top with a title, date, and a few other fields.

I opened up Claude Code, pointed it at the repo, and asked it to add a new blog post about using Claude to update the blog. Very meta.

## What Claude Did

Claude explored the repository structure, read a handful of existing posts to understand the conventions, and then wrote and committed this entry — including the correct frontmatter format, the `SPLIT_SUMMARY_BEFORE_THIS` summary separator, and the right filename pattern.

The whole thing took less than a minute.

It also handled the git branching and push automatically, working on a dedicated `claude/` branch as part of the workflow.

## The Honest Take

Is this cheating? Maybe a little. But I'd argue that a blog that gets updated — even with AI help — is more useful than one that sits frozen in 2019.

The real value isn't in offloading the writing entirely; it's in removing the activation energy. Once the post exists as a starting point, it's easy to go back and refine it. The blank page problem is the hardest part, and Claude is very good at solving that.

I plan to keep experimenting with this workflow for future posts. If nothing else, it means this blog might actually have content in it again.
