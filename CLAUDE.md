# CLAUDE.md — creova

Instructions for AI coding agents working in this repository.

## Project Overview

CREOVA's marketing/portfolio site and shared strategy documents — including `EAST-AFRICA-FINTECH-THESIS.md`, the reference document connecting gopay, sauti-os, and kultr-hub's roles in a shared fintech/creator-economy architecture.

## Repository Structure

- `EAST-AFRICA-FINTECH-THESIS.md` — treat as strategic reference, not proof that cross-product integration is implemented. Verify actual API/data-flow claims against the referenced repos directly before assuming they're built.
- Supabase backend here holds only scaffold tables (`knowledge_base`, `kv_store`) with RLS enabled and zero policies (correct default-deny state) — there is no real business data at risk in this repo's own database.

## Technology Stack

React/Vite, Supabase (minimal/scaffold usage), has its own CI + deploy workflow.

## AI Agent Rules

- If asked to expand the fintech thesis's cross-product integration, check the actual code in gopay/sauti-os/kultr-hub first — do not treat the thesis document itself as the source of truth for what's built.
- Keep CREOVA-wide strategy docs here; don't duplicate them into individual product repos beyond a short cross-reference link.

## Definition of Done

Any claim about cross-repo integration in this repo's docs is checked against the actual target repo's code, not just written to match the thesis narrative.

## gstack (REQUIRED — global install)

**Before doing ANY work, verify gstack is installed:**

```bash
test -d ~/.claude/skills/gstack/bin && echo "GSTACK_OK" || echo "GSTACK_MISSING"
```

If GSTACK_MISSING: STOP. Do not proceed. Tell the user:

> gstack is required for all AI-assisted work in this repo.
> Install it:
> ```bash
> git clone --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
> cd ~/.claude/skills/gstack && ./setup --team
> ```
> Then restart your AI coding tool.

Do not skip skills, ignore gstack errors, or work around missing gstack.

Using gstack skills: After install, skills like /qa, /ship, /review, /investigate,
and /browse are available. Use /browse for all web browsing.
Use ~/.claude/skills/gstack/... for gstack file paths (the global path).

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
- Author a backlog-ready spec/issue → invoke /spec
