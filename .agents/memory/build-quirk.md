---
name: build quirk
description: How the production build behaves and what it does/doesn't catch
---

The production build is `vite build` using esbuild only — there is NO `tsc`
type-check step in the build pipeline.

**Why:** esbuild transpiles per-file without whole-program type checking.

**How to apply:** Unused imports/vars and TypeScript type errors will NOT fail
the build. A clean build does not mean the code is type-correct or free of dead
code. After large edits (especially subagent-generated), manually grep for
unused imports and rely on LSP diagnostics rather than trusting the build to
catch them.
