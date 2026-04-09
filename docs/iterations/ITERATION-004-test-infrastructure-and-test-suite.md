---
title: Test Infrastructure and Test Suite
type: iteration
status: complete
author: agent
date: 2026-04-09
tags: []
related:
- implements: STORY-004
---



## Test Plan

- **Unit tests** for `lib/pokemon.ts` data transforms: test response parsing, edge cases (empty list, missing fields). Use happy-dom. Mock global fetch.
- **Integration tests** for `components/pokemon-list.tsx`: render with RTL, verify Cards and Badges render from mock data, verify search filtering works. Mock fetch at module boundary.
- **E2E tests** with Playwright: visit home page, verify Pokemon list loads, type in search and verify filtering, click a Pokemon and verify detail page shows stats.
- Test property tradeoffs: unit tests are fast/isolated but don't test rendering; integration tests cover component behavior but mock the network; E2E tests are slow but cover the full stack. All three tiers together provide confidence without over-relying on any single approach.

## Changes

1. **Configure bun test with happy-dom** — Add `bunfig.toml` with `[test]` section setting `preload` to a setup file that registers happy-dom. Create `test/setup.ts` that sets up happy-dom as global DOM. Target files: `bunfig.toml`, `test/setup.ts`. ACs addressed: 1. Verification: `bun test` runs and has DOM globals available.
2. **Add test dependencies** — Install `@testing-library/react`, `@testing-library/dom`, `happy-dom` as dev deps. Target file: `package.json`. ACs addressed: 1. Verification: deps in devDependencies.
3. **Write unit tests for Pokemon data layer** — Test `fetchPokemonList` and `fetchPokemon` from `lib/pokemon.ts`. Mock `fetch` globally. Verify response parsing and type mapping. Target file: `test/unit/pokemon.test.ts`. ACs addressed: 2. Verification: `bun test test/unit` passes.
4. **Write integration tests for PokemonList component** — Render `PokemonList` with RTL, pass mock Pokemon data as props. Assert Cards render with correct names, Badges show types, search input filters the list. Target file: `test/integration/pokemon-list.test.tsx`. ACs addressed: 3. Verification: `bun test test/integration` passes.
5. **Configure Playwright** — Create `playwright.config.ts` targeting Chromium, with webServer config pointing to `bun dev` on port 3000. Add `"test:e2e": "bunx playwright test"` to package.json scripts. Install `playwright` and `@playwright/test` as dev deps. Target files: `playwright.config.ts`, `package.json`. ACs addressed: 4. Verification: `bun run test:e2e` launches browser.
6. **Write E2E tests** — Test home page loads Pokemon list, search filters results, clicking a Pokemon navigates to detail page with stats. Target file: `test/e2e/pokemon-browser.spec.ts`. ACs addressed: 4, 5. Verification: `bun run test:e2e` passes all specs.

## Notes

- happy-dom chosen over jsdom for speed with bun
- RTL queries should follow the priority: getByRole > getByLabelText > getByText > getByTestId
- Playwright webServer config handles starting/stopping next dev automatically
