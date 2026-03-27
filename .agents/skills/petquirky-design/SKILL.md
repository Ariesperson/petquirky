---
name: petquirky-design
description: Use when implementing or refining PetQuirky UI, pages, layouts, or responsive behavior. This skill aligns work with the project's editorial design system, maps requested pages to the real stitch design references in the repo, and enforces the visual rules that override generic shadcn or default Next.js aesthetics.
---

# PetQuirky Design

Use this skill for any component or page that changes layout, styling, visual hierarchy, motion, spacing, or responsive behavior.

## Read these files

1. `stitch/quirky_nest/DESIGN.md`
2. [screen-map.md](./references/screen-map.md)
3. The matching `stitch/<screen>/screen.png`
4. The matching `stitch/<screen>/code.html` only as structural reference

## Visual doctrine

- The target style is premium editorial, not SaaS dashboard UI.
- Use warmth, asymmetry, oversized brand typography, and layered surfaces.
- Do not introduce generic boxed cards, thin dividers, sharp corners, or black text.
- Follow the design system's no-line rule: separate regions with tonal shifts, spacing, and layered surfaces instead of `1px` borders.
- Floating elements may use glassmorphism plus blur.
- Primary CTAs should feel tactile through warm gradients, not flat fills.

## Typography and surface rules

- Brand and section-display moments should use `Baloo 2`.
- Body copy should move toward the design doc's editorial intent; the repo currently uses `Quicksand`, so preserve existing fonts unless the task explicitly includes typography migration.
- Prefer large radii and soft containers.
- Avoid cramped layouts. If the page feels dense, increase whitespace before adding more decoration.

## Component behavior rules

- Mobile layouts must be intentional, not desktop grids merely stacked.
- Header, footer, cart drawers, overlays, and bottom-fixed mobile actions should feel layered and tactile.
- Icons should look rounded and friendly. Do not introduce visually thin, brittle iconography without a reason.

## Mapping rules

- `INSTRUCTIONS.md` uses simplified design names such as `homepage/` and `product-listing/`.
- The real local assets live under `stitch/*_interactive/`.
- Use [screen-map.md](./references/screen-map.md) to translate between the planning doc and repository assets.

## What not to do

- Do not copy HTML from stitch files verbatim.
- Do not default to shadcn component styling if it conflicts with the editorial system.
- Do not treat color tokens in `tailwind.config.ts` as the whole design language; combine them with the layered-surface rules from the design doc.

## Handoff expectation

When the UI task is complete, verify:

- visual hierarchy matches the target screen closely
- desktop and mobile both feel designed
- text remains localizable
- styling choices still fit the PetQuirky brand system
