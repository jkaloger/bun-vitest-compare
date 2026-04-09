---
title: Next.js Scaffold and shadcn Setup
type: iteration
status: complete
author: agent
date: 2026-04-09
tags: []
related:
- implements: STORY-002
---



## Test Plan

- Manual: `bun dev` starts dev server, visit localhost:3000, page renders
- Manual: verify `components/ui/card.tsx` and `components/ui/badge.tsx` exist
- Manual: inspect package.json deps — only next, react, react-dom, tailwindcss, class-variance-authority, clsx, tailwind-merge, lucide-react, and shadcn peer deps

## Changes

1. **Initialize Next.js project** — Run `bun create next-app` with App Router, TypeScript, Tailwind, no src dir. Creates standard Next.js scaffold. Target files: `package.json`, `app/layout.tsx`, `app/page.tsx`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`. ACs addressed: 1, 2, 4. Verification: `bun dev` starts without errors.
2. **Initialize shadcn/ui** — Run `bunx shadcn@latest init` to set up shadcn config. Creates `components.json` and utility files. Target files: `components.json`, `lib/utils.ts`. ACs addressed: 3. Verification: `components.json` exists with correct config.
3. **Add Card and Badge components** — Run `bunx shadcn@latest add card badge`. Target files: `components/ui/card.tsx`, `components/ui/badge.tsx`. ACs addressed: 3. Verification: both files exist and export their components.
4. **Clean up default page** — Replace default Next.js boilerplate in `app/page.tsx` with a minimal placeholder that imports Card and Badge to verify they work. Target file: `app/page.tsx`. ACs addressed: 2. Verification: page renders at localhost:3000 without errors.

## Notes

- Use `--no-eslint` flag if available to minimize deps
- shadcn components are copied into the project, not installed as a package
