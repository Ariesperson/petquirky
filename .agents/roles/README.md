# PetQuirky Roles

这个目录保存 PetQuirky 后续运营和开发可直接调用的角色卡。

## 推荐用法

在新会话或当前会话中这样使用：

```text
请阅读 .agents/roles/pm.md。
你现在作为 PetQuirky 的项目负责人 / PM，帮我制定本周计划。
```

或者：

```text
请阅读 .agents/roles/product-researcher.md。
你现在作为 PetQuirky 的选品与供应链分析师，帮我评估下面这个 CJ 产品。
```

## 角色列表

| 文件 | 角色 | 适用场景 |
|---|---|---|
| `pm.md` | 项目负责人 / PM | 周计划、任务拆解、优先级、跨角色协调 |
| `website-product-manager.md` | 网站产品经理 | 页面体验、购物流程、产品页结构、用户路径 |
| `developer.md` | 技术开发工程师 | Next.js、Supabase、PayPal、Resend、测试、修 bug |
| `qa-launch-checker.md` | QA 与上线检查员 | 上线前检查、回归测试、阻断问题清单 |
| `product-researcher.md` | 选品与供应链分析师 | CJ 选品、利润、物流、样品优先级 |
| `product-selection-lead.md` | 选品决策官 | 多个候选产品的最终取舍、样品采购顺序、首批产品组合 |
| `tiktok-operator.md` | TikTok 内容运营 | 短视频脚本、内容日历、拍摄清单 |
| `seo-operator.md` | SEO 内容运营 | 博客选题、关键词、文章大纲、多语言 SEO |
| `cro-ecommerce-operator.md` | 转化率与电商运营 | 加购、客单价、产品页信任、活动与套装 |
| `compliance-support.md` | 合规与客服体验 | GDPR、退货政策、FAQ、邮件、客服话术 |
| `analyst.md` | 复盘与数据分析师 | 周报、指标复盘、实验结论、下周建议 |

## 使用规则

1. 一个会话优先只使用一个主角色。
2. 大任务先用 `pm.md` 拆解，再交给专业角色。
3. 技术任务使用 `developer.md` 时，同时阅读 `AGENTS.md` 和相关代码。
4. 上线、支付、订单、登录、邮件相关任务必须经过 `qa-launch-checker.md`。
5. 每周至少使用一次 `analyst.md` 做复盘。

## 任务结束闭环

每个角色完成任务后都要更新本周进度：

1. 找到最新的 `docs/04-weekly/weekly-plan-*.md`。
2. 更新或创建同周期的 `docs/04-weekly/progress-*.md`。
3. 读取 `docs/00-project-context/role-progress-sync-protocol.md`。
4. 更新自己的独立角色台账：`docs/04-weekly/role-progress/<week>/<role-slug>.md`。
5. 使用 `docs/00-project-context/role-output-templates.md` 中对应角色模板。
6. 只更新自己角色的分区；不要改写其他角色分区，除非当前角色是 PM 并且任务是总览整理。
7. 如果任务对应周计划中自己角色分区的条目，同步更新 `Status`。
8. 记录完成内容、产出文件、剩余动作、阻塞点、风险和用户决策项。
9. 如果产生或依赖关键决策，交给 PM 更新 `docs/00-project-context/decision-log.md`。
10. 最终回复必须说明本角色当前剩余 P0/P1/P2；PM 需要额外汇总全局剩余 P0/P1/P2。

如果无法更新独立角色台账，必须在最终回复中写 `Progress Sync Failed`，不能静默跳过。

## 并行规则

需要多角色并行时，先按 `docs/00-project-context/parallel-agent-rules.md` 执行。默认由子代理输出分析，PM 统一合并并更新周计划、进度台账和决策日志。
