---
title: Next.js Project Scaffold and shadcn
type: story
status: complete
author: jkaloger
date: 2026-04-09
tags: []
related:
- implements: RFC-001
---



## Context

This story covers the initial project scaffold for the PokeAPI demo application. It sets up Next.js 15 on Bun with App Router, initializes shadcn/ui, and imports the Card and Badge components needed by downstream stories. The result is a clean, runnable starting point that other stories (Pokemon Browser Page, Test Infrastructure) build on.

## Acceptance Criteria

- **Given** the dev environment is set up
  **When** the developer runs `bun dev`
  **Then** Next.js starts on localhost:3000

- **Given** Next.js is running
  **When** the developer visits localhost:3000
  **Then** a page renders without errors

- **Given** shadcn is initialized
  **When** inspecting the components directory
  **Then** Card and Badge components are present

- **Given** the project is scaffolded
  **When** checking package.json
  **Then** only minimal dependencies are listed (next, react, react-dom, shadcn/ui peer deps: tailwindcss, class-variance-authority, clsx, tailwind-merge, lucide-react)

## Scope

### In Scope

- Next.js 15 app creation via `bun create next-app`
- App Router configuration
- shadcn/ui initialization
- Importing Card and Badge components from shadcn/ui
- Tailwind CSS configuration
- Basic root layout

### Out of Scope

- PokeAPI integration (Story 3: Pokemon Browser Page)
- Page content beyond the default scaffold (Story 3)
- Tests (Story 4: Test Infrastructure + Tests)
- Nix/flake/direnv setup (Story 1: Nix/Flake/Direnv Dev Environment)
