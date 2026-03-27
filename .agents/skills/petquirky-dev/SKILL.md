---
name: petquirky-dev
description: Use when implementing PetQuirky features end to end. This skill turns the execution plan into concrete files, routes, and verification steps for Next.js 16 App Router work, while enforcing locale routing, server/client boundaries, commerce rules, and per-phase acceptance criteria.
---

# PetQuirky Dev

Use this skill once task scope is clear and you are ready to implement.

## Read order

1. `$petquirky-project`
2. `$petquirky-design` for UI-facing work
3. [phase-map.md](./references/phase-map.md)
4. Task-specific files under `src/`

## Implementation workflow

1. Map the request to a Phase, route, and acceptance checklist in `INSTRUCTIONS.md`.
2. Confirm the target files from [phase-map.md](./references/phase-map.md).
3. Check the latest local Next.js docs for any touched convention:
   - routing and layouts
   - `proxy.ts`
   - forms and route handlers
   - CSS and styling
4. Implement with server components first. Add client components only where interaction, context, local storage, or browser APIs are required.
5. Keep translation boundaries explicit. New UI strings must be dictionary-backed.
6. Run the smallest useful verification, then the project-level verification if the change is broad.

## PetQuirky-specific engineering rules

- Keep page files thin. Move reusable UI into `src/components/...` and business logic into `src/lib/...`, `src/context/...`, or `src/hooks/...` as appropriate.
- Route params in App Router may be async. Match the style already used in this repo when reading `params`.
- For locale validation, use the existing `isLocale` and dictionary helpers unless you are intentionally replacing them.
- Product, cart, checkout, auth, blog, and SEO work all have multi-page side effects. Update adjacent routes and metadata when the task implies them.
- Static content such as reviews should stay deterministic unless the requirements explicitly add user-generated submission.
- For checkout and auth tasks, prefer additive changes that keep guest checkout working.

## Verification defaults

- Always run `npm run build` after broad route or type changes.
- Run `npm run lint` when touching multiple React files or introducing new hooks/context.
- If a task changes locale handling, manually inspect redirect behavior and dictionary usage.
- If a task changes SEO or structured data, verify the relevant metadata path and schema output.

## Stop conditions

Pause and call out the gap if:

- the task depends on a missing PRD or architecture detail that materially changes data modeling
- a referenced design asset does not exist and nearby screens are not enough to infer intent
- the requested solution conflicts with `14-day returns`, locale routing, or other explicit product rules
