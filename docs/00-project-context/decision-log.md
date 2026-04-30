# PetQuirky Decision Log

> Purpose: record project decisions that every role must follow.  
> Rule: when a role proposes or relies on a major decision, PM must update this file or explicitly mark the decision as pending.

## Decision Status

Use only these statuses:

- `Proposed`: suggested, not accepted yet.
- `Accepted`: approved and should guide future work.
- `Superseded`: replaced by a newer decision.
- `Rejected`: considered but not used.

## Decision Table

| ID | Date | Status | Decision | Owner | Reason | Impacted Roles | Follow-up |
|---|---|---|---|---|---|---|---|
| D-001 | 2026-03-26 | Accepted | PetQuirky targets Europe with en/de/fr/es, EUR-only pricing, and pet smart gear plus exotic pet differentiation. | PM | Core business positioning from project summary. | All roles | Keep content, pricing, SEO, and product work aligned to EU market. |
| D-002 | 2026-03-26 | Accepted | Returns policy is 14 days. | PM / Compliance | EU consumer expectation and existing project rules. | Developer, QA, Compliance, CRO | Never change to 30 days unless PM explicitly updates this decision. |
| D-003 | 2026-03-26 | Accepted | Seller identity must remain individual seller, not corporate entity. | PM / Compliance | Current seller setup has no company entity. | Developer, Compliance, QA, CRO | Keep footer and policy trust language aligned. |
| D-004 | 2026-04-29 | Proposed | Checkout model must be clarified: true guest checkout vs account-only checkout before PayPal. | PM | Current checkout UI permits anonymous progress, but PayPal APIs require Supabase login. | PM, Developer, QA, CRO, Compliance | User decision required before closing P0 payment flow. |
| D-005 | 2026-04-30 | Accepted | Role progress must be tracked by role-specific sections. | PM | Each role should focus on its own work while PM maintains global summary. | All roles | Update weekly plans and progress trackers by role section. |
| D-006 | 2026-04-30 | Accepted | Subagents may do parallel analysis, but PM owns final merge and progress updates unless explicitly delegated. | PM | Avoid file conflicts and inconsistent project state. | PM, all specialist roles | Follow `parallel-agent-rules.md`. |
| D-007 | 2026-04-30 | Accepted | Product selection uses a dual-track strategy: cat/dog products are primarily traffic and bestseller hooks; exotic pet products are primarily profit and differentiation. | PM / User | User clarified that PetQuirky should focus on pet goods, with cat/dog hits for traffic and exotic pet goods for margin. | PM, Product Selection Lead, Product Researcher, TikTok, SEO, CRO | Evaluate candidates by track instead of using one generic scoring model. |

## Pending Decisions

| ID | Decision Needed | Why It Matters | Options | Needed From |
|---|---|---|---|---|
| D-004 | Checkout model | Blocks PayPal, Supabase order persistence, account order links, and success-page UX. | `Guest checkout` or `Account-only checkout` | User / PM |

## How Roles Use This Log

1. Read this file before making recommendations that affect checkout, payment, product direction, legal/trust content, launch readiness, or channel strategy.
2. If a decision is `Accepted`, follow it.
3. If a decision is `Proposed`, do not implement dependent work as final; mark it as blocked or conditional.
4. If a role discovers a new decision is needed, add it to `Pending Decisions` through PM.
