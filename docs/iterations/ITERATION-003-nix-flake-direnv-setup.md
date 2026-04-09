---
title: Nix Flake Direnv Setup
type: iteration
status: complete
author: agent
date: 2026-04-09
tags: []
related:
- implements: STORY-001
---



## Test Plan

- Manual: run `direnv allow` in a fresh clone, verify `which bun` resolves
- Manual: run `bun --version`, verify semver output
- Manual: run `bun run setup`, verify `.cache/ms-playwright` or similar directory is populated
- Manual: run `node --version`, verify "command not found"

## Changes

1. **Create `flake.nix`** — Nix flake with `devShells.default` providing `bun` from nixpkgs. Use `flake-utils` for system iteration. Target file: `flake.nix`. ACs addressed: 1, 2, 4. Verification: `nix develop --command bun --version` prints valid version; `nix develop --command node --version` fails.
2. **Create `.envrc`** — Single line: `use flake`. Target file: `.envrc`. ACs addressed: 1. Verification: after `direnv allow`, `which bun` resolves to nix store path.
3. **Add setup script to `package.json`** — Add `"setup": "bunx playwright install"` to scripts. Target file: `package.json`. ACs addressed: 3. Verification: `bun run setup` completes and browser binaries exist.
4. **Create `.gitignore`** — Ignore `.direnv/`, `node_modules/`, `.cache/`. Target file: `.gitignore`. Verification: `git status` doesn't show generated files.

## Notes

- flake-utils is the only flake input beyond nixpkgs
- No flake.lock committed initially; generated on first `nix develop`
