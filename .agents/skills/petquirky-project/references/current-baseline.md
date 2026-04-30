# Current Baseline

## Available documents

- `INSTRUCTIONS.md`: main execution plan, page scope, phase checklist, and acceptance rules.
- `docs/00-project-context/PetQuirky-项目阶段性总结.md`: business context, decisions, completed work, and next-stage operating plan.
- `docs/00-project-context/PetQuirky-Architecture.md`: technical architecture, data models, page specs, i18n, PayPal, shipping, and SEO rules.
- `docs/00-project-context/PetQuirky-多角色协作体系.md`: role system and operating model.
- `docs/01-launch/launch-checklist.md`: current pre-launch QA record and release gate.
- `stitch/quirky_nest/DESIGN.md`: visual system and styling doctrine.
- `stitch/*/screen.png`: screen-level visual targets.
- `stitch/*/code.html`: layout hints only, not copy-paste source.
- `src/`: actual implementation baseline.

## Missing but referenced

- `PetQuirky-PRD-v1.md`
- Some historical docs still mention `design-reference/*`; the actual local design files live under `stitch/*`.

## Real repository state at skill creation time

- The app already contains:
  - `src/app/[locale]/layout.tsx`
  - `src/app/[locale]/page.tsx`
  - `src/lib/i18n.ts`
  - `src/proxy.ts`
  - `src/types/product.ts`
- The app now contains implemented storefront, cart, checkout, account, blog, policy, PayPal, Supabase, Resend, and test areas.
- Existing styling mixes Tailwind 4 tokens in `globals.css` with a traditional `tailwind.config.ts`; follow the current codebase unless intentionally migrating.

## Guardrails derived from local docs

- Prefer route-aware work under `src/app/[locale]/`.
- Keep Next 16 naming and file conventions. Do not reintroduce `middleware.ts` unless the local docs or user explicitly require it.
- Prefer server components by default. Add `"use client"` only when interaction or browser APIs require it.
- Treat design fidelity and multi-locale coverage as first-class acceptance criteria, not polish work.
