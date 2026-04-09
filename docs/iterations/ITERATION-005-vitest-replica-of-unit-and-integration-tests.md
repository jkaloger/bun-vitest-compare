---
title: Vitest Replica of Unit and Integration Tests
type: iteration
status: accepted
author: agent
date: 2026-04-09
tags: []
related:
- implements: STORY-004
---



## Goal

Add vitest as a parallel test runner so bun test and vitest can be benchmarked against each other on the same test suite. Existing bun tests remain untouched.

## Translation Notes

Key differences between bun:test and vitest APIs relevant to this codebase:

- `import { describe, it, expect, ... } from "bun:test"` → `import { describe, it, expect, vi, ... } from "vitest"`
- `spyOn` from bun:test → `vi.spyOn` from vitest
- `mock.module("next/link", ...)` (bun module mocking) → `vi.mock("next/link", ...)` (vitest module mocking)
- `mockResolvedValueOnce` / `mockRestore` → identical API on vitest spy objects
- happy-dom setup: vitest has native `environment: "happy-dom"` support via `vitest.config.ts`, eliminating the need for the manual `test/setup.ts` polyfill
- Path aliases (`@/`): vitest needs explicit `resolve.alias` config or `vite-tsconfig-paths` plugin

## Changes

1. **Install vitest dependency**
   - ACs: prerequisite for all other tasks
   - Run `bun add -d vitest vite-tsconfig-paths`
   - `vite-tsconfig-paths` resolves the `@/` tsconfig path alias that the integration test uses
   - Verification: `bunx vitest --version` succeeds

2. **Create `vitest.config.ts`**
   - ACs: vitest runner configured with happy-dom environment
   - File: `vitest.config.ts` (project root)
   - Configure: `environment: "happy-dom"`, include pattern `test/**/*.vitest.test.{ts,tsx}`, exclude `test/e2e/**`
   - Use `vite-tsconfig-paths` plugin for `@/` alias resolution
   - Verification: `bunx vitest --config vitest.config.ts --run` exits cleanly (no tests found yet, but config parses)

3. **Create vitest unit test replica**
   - ACs: unit tests for data transforms pass under vitest
   - Source: `test/unit/pokemon.test.ts`
   - Target: `test/unit/pokemon.vitest.test.ts`
   - Translation: replace `import { ... } from "bun:test"` with `import { ... } from "vitest"`, replace `spyOn(globalThis, "fetch")` with `vi.spyOn(globalThis, "fetch")`
   - All test logic, assertions, and structure remain identical
   - Verification: `bunx vitest --config vitest.config.ts --run test/unit/pokemon.vitest.test.ts` passes

4. **Create vitest integration test replica**
   - ACs: integration tests for React components pass under vitest
   - Source: `test/integration/pokemon-list.test.tsx`
   - Target: `test/integration/pokemon-list.vitest.test.tsx`
   - Translation: replace `import { ..., mock } from "bun:test"` with `import { ..., vi } from "vitest"`, replace `mock.module("next/link", ...)` with `vi.mock("next/link", ...)`
   - The `vi.mock` factory function syntax differs slightly: vitest hoists `vi.mock` calls automatically, so the import order issue bun requires (mock before import) is handled natively
   - Verification: `bunx vitest --config vitest.config.ts --run test/integration/pokemon-list.vitest.test.tsx` passes

5. **Add `test:vitest` script to `package.json`**
   - ACs: developer can run vitest suite via a single command
   - File: `package.json`
   - Add script: `"test:vitest": "bunx vitest --config vitest.config.ts --run"`
   - Verification: `bun run test:vitest` runs all vitest tests and passes

6. **Verify bun test suite is unaffected**
   - ACs: existing bun tests still pass, bunfig.toml unchanged
   - Update `bunfig.toml` to also ignore `*.vitest.test.*` files so bun doesn't pick up the vitest copies
   - Verification: `bun test` passes with same test count as before

## Test Plan

- `bun run test:vitest` runs 2 test files (unit + integration), all assertions pass
- `bun test` still runs the original 2 test files, all assertions pass, vitest files excluded
- Both runners report the same number of passing tests (10 total: 4 in fetchPokemonList, 4 in fetchPokemon, 5 in PokemonList... wait, let me recount)
- Unit: 7 tests (3 fetchPokemonList + 4 fetchPokemon)
- Integration: 5 tests (PokemonList)
- Both runners should report 12 passing tests across 2 files

## Notes

- The `test/setup.ts` file is bun-specific (manual happy-dom polyfill). Vitest's native `environment: "happy-dom"` handles this, so the vitest tests do not need a setup file.
- The `*.vitest.test.*` naming convention keeps bun and vitest tests clearly separated and allows glob-based inclusion/exclusion by each runner.
- E2E tests (Playwright) are out of scope since Playwright is its own runner independent of both bun and vitest.
