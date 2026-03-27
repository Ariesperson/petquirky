---
name: petquirky-project
description: Use when starting any PetQuirky development task, scoping a feature, or checking project guardrails. This skill loads the project's real source of truth, confirms the current Next.js 16 / React 19 / Tailwind 4 setup, flags missing docs referenced by INSTRUCTIONS.md, and establishes non-negotiable product rules before implementation.
---

# PetQuirky Project

Use this skill first for any PetQuirky feature or bugfix unless the task is already narrowly limited to visual polish inside a single finished screen.

## Load order

1. Read `AGENTS.md`.
2. Read `INSTRUCTIONS.md`.
3. Read `package.json`, `src/lib/i18n.ts`, `src/proxy.ts`, and the route files related to the task.
4. Read the relevant Next.js 16 docs from `node_modules/next/dist/docs/` before writing code that depends on routing, proxy, layout, data fetching, or styling conventions.
5. Read [current-baseline.md](./references/current-baseline.md).

## Source-of-truth rules

- In this repository, `INSTRUCTIONS.md` is the highest available product document.
- `PetQuirky-PRD-v1.md` and `PetQuirky-Architecture.md` are referenced by `INSTRUCTIONS.md` but are not present in the current workspace.
- Treat any requirement derived from those missing docs as provisional unless it is restated in `INSTRUCTIONS.md`, existing code, or design references.
- `README.md` is scaffold-level context only and should not override project-specific instructions.

## Current technical baseline

- Framework: Next.js `16.2.1` App Router.
- Runtime model: React `19.2.4`.
- Styling baseline: Tailwind CSS `4`, `@tailwindcss/postcss`, `tw-animate-css`, `shadcn/tailwind.css`.
- Locale routing already uses `src/proxy.ts`. In Next.js 16, Proxy replaces the old Middleware naming.
- Current locales are `en`, `de`, `fr`, `es`.
- Translation loading currently falls back to `en` for all locales; new work must preserve type safety and avoid hardcoded UI text.

## Non-negotiable product rules

- All customer-facing routes live under `src/app/[locale]/...`.
- UI copy must come from dictionaries via `getDictionary(locale)` or a task-appropriate localization helper.
- Returns policy is `14 days`, never `30 days`.
- Price formatting for EU-facing UI must place `€` after the amount, e.g. `45,00 €`.
- Supported auth is email + password only unless the user explicitly changes requirements.
- Badge rules for product cards are restricted to `New`, `Bestseller`, and `Sale`.

## Task startup checklist

- Map the request to a Phase and page list in `INSTRUCTIONS.md`.
- Confirm whether the required design reference and route already exist.
- Confirm whether the task needs server components, client components, or both.
- Check whether the change affects i18n, SEO, cookies, cart, auth, or checkout because those have cross-page constraints.
- If a referenced document or asset is missing, call it out in the work log and continue using the best available local source.

## When to read more

- For UI-heavy work, switch to `$petquirky-design`.
- For feature implementation, switch to `$petquirky-dev`.
