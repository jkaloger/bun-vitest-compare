---
title: "PokeAPI Demo Application"
type: rfc
status: complete
author: "jkaloger"
date: 2026-04-09
tags: []
---



## Summary

A demo application that fetches Pokemon data from the PokeAPI and renders a browsable list with detail views. The primary purpose is to exercise a full testing stack (unit, integration, E2E) on a Bun + Next.js foundation, managed entirely through Nix.

## Problem

We need a reference project that demonstrates:

- Bun as the sole JS runtime (no Node)
- Next.js App Router with server-side data fetching
- Three tiers of testing via `bun test` and Playwright
- Reproducible dev environment via Nix flake + direnv

## Design

### Runtime and Framework

Next.js 15 on Bun. App Router for routing and server components. No API routes needed; server components fetch directly from PokeAPI.

### UI

Two shadcn/ui components: Card (pokemon display) and Badge (type labels). A single page with a list view, client-side search/filter, and a detail view showing stats.

### Dev Environment

Nix flake provides bun. No Node. direnv via `use flake`. Playwright browsers installed via `bunx playwright install` as a setup step, not managed by Nix.

### Testing

| Tier | Runner | Environment | Scope |
|------|--------|-------------|-------|
| Unit | `bun test` | happy-dom | Data transforms, API response parsing |
| Integration | `bun test` | happy-dom + RTL | React components with mocked fetch boundary |
| E2E | `bunx playwright test` | Chromium | Full page interactions against `next dev` |

`bun test` is the single entry point for unit and integration tests. E2E runs via `bun run test:e2e` which delegates to Playwright's runner.

### Dependencies (minimal)

- `next`, `react`, `react-dom`
- `@testing-library/react`, `@testing-library/dom`
- `happy-dom`
- `playwright`, `@playwright/test`
- shadcn/ui (Card, Badge) + its peer deps (tailwindcss, class-variance-authority, clsx, tailwind-merge, lucide-react)

## Stories

1. **Nix/Flake/Direnv Dev Environment** — flake.nix providing bun, .envrc with `use flake`, setup script for Playwright browsers
2. **Next.js Project Scaffold + shadcn** — `bun create next-app`, shadcn init, import Card + Badge
3. **Pokemon Browser Page** — server-side PokeAPI fetch, list with Card/Badge, client-side search, detail view
4. **Test Infrastructure + Tests** — bun test config with happy-dom, RTL unit/integration tests, Playwright E2E tests
