# Current Baseline

## Available documents

- `INSTRUCTIONS.md`: main execution plan, page scope, phase checklist, and acceptance rules.
- `stitch/quirky_nest/DESIGN.md`: visual system and styling doctrine.
- `stitch/*/screen.png`: screen-level visual targets.
- `stitch/*/code.html`: layout hints only, not copy-paste source.
- `src/`: actual implementation baseline.

## Missing but referenced

- `PetQuirky-PRD-v1.md`
- `PetQuirky-Architecture.md`
- `.agents/skills/` existed conceptually in `INSTRUCTIONS.md` before these new skills were created.

## Real repository state at skill creation time

- The app already contains:
  - `src/app/[locale]/layout.tsx`
  - `src/app/[locale]/page.tsx`
  - `src/lib/i18n.ts`
  - `src/proxy.ts`
  - `src/types/product.ts`
- The current home page is only a thin placeholder, not the approved design implementation.
- Existing styling mixes Tailwind 4 tokens in `globals.css` with a traditional `tailwind.config.ts`.

## Guardrails derived from local docs

- Prefer route-aware work under `src/app/[locale]/`.
- Keep Next 16 naming and file conventions. Do not reintroduce `middleware.ts` unless the local docs or user explicitly require it.
- Prefer server components by default. Add `"use client"` only when interaction or browser APIs require it.
- Treat design fidelity and multi-locale coverage as first-class acceptance criteria, not polish work.
