# pokeapi-demo

Next.js app that fetches from the PokeAPI. Used as a test bed for comparing `bun test` and Vitest on the same test suite.

## Test setup

The repo contains two parallel sets of test files covering identical assertions:

| Layer       | Bun file                                 | Vitest file                                     |
| ----------- | ---------------------------------------- | ----------------------------------------------- |
| Unit        | `test/unit/pokemon.test.ts`              | `test/unit/pokemon.vitest.test.ts`              |
| Integration | `test/integration/pokemon-list.test.tsx` | `test/integration/pokemon-list.vitest.test.tsx` |

Each set has 12 tests (7 unit, 5 integration). The test logic is identical; the only differences are the import source (`bun:test` vs `vitest`) and the mocking API (`spyOn`/`mock.module` vs `vi.spyOn`/`vi.mock`).

### DOM environment

Both runners use happy-dom. Vitest configures it via `vitest.config.ts` (`environment: "happy-dom"`). Bun uses `@happy-dom/global-registrator` in a preload script (`test/setup.ts`) to register browser globals before tests run.

### Module mocking

Vitest uses `vi.mock("next/link", ...)` with hoisting. Bun uses `mock.module("next/link", ...)`. Both achieve the same result, but `mock.module` must appear at the top level before the import of the component under test, matching Vitest's hoisting semantics.

### Spy API

Bun provides `spyOn` as a direct import from `bun:test`. Vitest namespaces it under `vi.spyOn`. The call signatures are otherwise identical.

## Performance

Measured on Apple Silicon (M-series), Bun 1.3.11, Vitest 4.1.3. Five consecutive runs each, cold cache cleared between sets.

| Runner                | Median wall-clock time | Notes                                                                     |
| --------------------- | ---------------------- | ------------------------------------------------------------------------- |
| `bun test`            | **135 ms**             | Single binary, no separate transform step                                 |
| `npm run test:vitest` | **300 ms**             | ~50 ms transform, ~115 ms import, ~38 ms tests, ~215 ms environment setup |

Bun is ~2.2x faster end-to-end. The dominant cost in Vitest is happy-dom environment setup (~215 ms), which accounts for most of the gap.

## Tradeoffs

**Bun test** is faster and requires zero config for TypeScript/JSX. DOM testing uses `@happy-dom/global-registrator` in a preload script. `mock.module` is less mature than `vi.mock` and lacks features like `mockImplementationOnce` on module-level mocks.

**Vitest** has first-class environment support (`happy-dom`, `jsdom`, per-file `@vitest-environment` directives), a richer mocking API, and a broader ecosystem of integrations (coverage, UI, browser mode). The cost is startup overhead from Vite's transform pipeline and environment bootstrapping.

For unit tests that don't need a DOM, the two runners are near-equivalent in both API and speed. The gap widens for component tests where environment setup matters.

## Running

```sh
bun test              # runs *.test.ts / *.test.tsx (excludes *.vitest.test.*)
npm run test:vitest   # runs *.vitest.test.ts / *.vitest.test.tsx
npm run test:e2e      # Playwright (requires `npm run setup` first)
```
