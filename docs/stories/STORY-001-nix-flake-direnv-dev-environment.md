---
title: Nix Flake Direnv Dev Environment
type: story
status: complete
author: jkaloger
date: 2026-04-09
tags: []
related:
- implements: RFC-001
---



## Context

This story sets up the Nix-based developer environment for the PokeAPI demo application. All tooling (bun, direnv) is provided through a Nix flake so that every developer gets an identical, reproducible environment from a fresh clone. Playwright browsers are installed via a setup script rather than Nix to avoid Nix store complexity for browser binaries.

## Acceptance Criteria

- **Given** a fresh clone of the repository
  **When** the developer runs `direnv allow`
  **Then** bun is available on PATH

- **Given** direnv has loaded the flake environment
  **When** the developer runs `bun --version`
  **Then** it prints a valid semver version string

- **Given** direnv has loaded the flake environment
  **When** the developer runs `bun run setup`
  **Then** Playwright browsers are installed successfully

- **Given** direnv has loaded the flake environment
  **When** the developer runs `node --version`
  **Then** the command is not found (Node.js is not provided by the flake)

## Scope

### In Scope

- `flake.nix` providing bun as a dev dependency
- `.envrc` with `use flake` directive
- A `setup` script in `package.json` that runs `bunx playwright install`

### Out of Scope

- Next.js scaffold or application code (Story 2)
- shadcn/ui component library setup (Story 2)
- Pokemon browser page implementation (Story 3)
- Test infrastructure and test files (Story 4)
- Node.js as a runtime dependency
