# PetQuirky Parallel Agent Rules

> Purpose: use multiple agents safely without corrupting project state or creating conflicting work.

## Default Rule

Parallel agents are allowed for independent analysis and deliverables. They should not directly edit shared project management files unless PM explicitly delegates that write.

## Best Uses for Parallel Agents

- Product scoring and supplier analysis.
- TikTok content scripts.
- SEO topic planning.
- Compliance and trust review.
- Conversion recommendations.
- Competitive or market research.
- Read-only code exploration with clear, separate questions.

## Avoid Parallel Agents For

- PayPal payment flow implementation.
- Supabase order persistence.
- Auth, account, and permission changes.
- Database migrations.
- Large edits to shared `src/i18n/*.json`.
- Multiple agents editing the same page or component.
- Multiple agents editing weekly plan/progress files at the same time.

## Write Ownership

When parallel agents are used:

| Work Type | Who May Write |
|---|---|
| Role analysis documents | The assigned role may write its own output file if PM assigns a unique path. |
| Code | Only one agent per file/module unless PM explicitly splits ownership. |
| Weekly plan | PM only. |
| Weekly progress tracker | PM only by default; specialist roles may update only their own section if not running in parallel. |
| Decision log | PM only. |

## PM Parallel Workflow

1. PM chooses which tasks are independent.
2. PM assigns each agent:
   - role
   - task
   - read files
   - allowed write paths
   - forbidden write paths
   - required output format
3. Agents work independently.
4. PM reviews outputs for conflicts.
5. PM merges accepted results.
6. PM updates:
   - `decision-log.md`
   - weekly plan
   - weekly progress tracker

## Prompt Template

```text
You are not alone in the codebase.
Role:
Task:
Read:
Allowed write paths:
Forbidden write paths:
Output required:
Do not update weekly plan, progress tracker, or decision log. PM will merge.
```

## Conflict Rules

- If two outputs conflict, PM does not merge either blindly.
- PM records the conflict as a decision needed.
- If implementation depends on that decision, mark downstream tasks as `Blocked`.

## Recommended Command

```text
皮蛋：请判断哪些任务适合并行。子代理只做分析和独立交付物，不更新周计划、进度台账或决策日志。最后由 PM 汇总并更新。
```
