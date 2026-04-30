# PetQuirky Role Progress Sync Protocol

> Purpose: prevent progress loss when specialist roles finish work.  
> Rule: every role must update its own progress file before the final response.

## Non-Negotiable Rule

When acting as any PetQuirky role, do not finish with only a chat summary. Before the final response, update that role's progress ledger.

If the user explicitly says `只回答，不更新文档`, skip the update and say it was skipped.

If the update cannot be completed, the final response must include:

```text
Progress Sync Failed:
- Intended ledger:
- Reason:
- Manual update needed:
```

## Progress Files

Each role writes to its own file:

```text
docs/04-weekly/role-progress/YYYY-MM-DD-to-YYYY-MM-DD/<role-slug>.md
```

Role slugs:

| Role | File |
|---|---|
| PM / Project Lead | `pm.md` |
| Website Product Manager | `website-product-manager.md` |
| Technical Development Engineer | `developer.md` |
| QA Launch Checker | `qa-launch-checker.md` |
| Compliance and Customer Experience | `compliance-support.md` |
| Product and Supply Chain Analyst | `product-researcher.md` |
| Product Selection Lead | `product-selection-lead.md` |
| Conversion and Ecommerce Operations | `cro-ecommerce-operator.md` |
| TikTok Content Operator | `tiktok-operator.md` |
| SEO Content Operator | `seo-operator.md` |
| Review and Data Analyst | `analyst.md` |

## Required Update

Append or update these sections in the role file:

```text
## Current Status

## Completed This Session

## Deliverables

## Blockers

## Risks

## Decisions Needed

## Next Actions

## Changelog
```

## Final Response Requirement

Every role final response must include:

```text
Progress Sync:
- Updated:
- Role ledger:
- Weekly plan status touched:
- Remaining for this role:
- Decisions needed:
```

## PM Summary Rule

PM should summarize progress from role ledgers first:

1. Read `docs/04-weekly/role-progress/<week>/*.md`.
2. Read weekly plan.
3. Read shared progress tracker only as secondary context.
4. Report by role.
5. Update shared progress tracker after summarizing if needed.

## Parallel Agent Rule

When multiple subagents run in parallel:

- Subagents should not edit the shared weekly plan or shared progress tracker.
- Subagents may write only their assigned role ledger if the PM gives explicit permission.
- If not given write permission, subagents return a `Progress Update Block` and PM writes the ledger.
