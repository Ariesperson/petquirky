<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:petquirky-role-commands -->
# PetQuirky 快捷多角色指令

当用户在本项目中使用下面的短指令时，直接按对应角色工作。优先读取对应 `.agents/roles/*.md` 角色卡；如果任务涉及代码，再读取相关源码和测试。

## 最推荐入口：皮蛋

用户如果用 `皮蛋` 开头，自动进入 PetQuirky 多角色调度模式。不要要求用户记具体角色名，先根据目标判断该使用哪个角色。

示例：

- `皮蛋：帮我制定本周计划`
- `皮蛋：帮我完成上线前准备`
- `皮蛋：帮我评估这个产品链接`
- `皮蛋：给这个产品做 7 天 TikTok 内容`
- `皮蛋：检查网站还有没有上线阻断问题`
- `皮蛋：这是本周数据，帮我复盘`

调度规则：

- 如果是计划、优先级、任务拆解、下一步安排，按 `/pm` 处理。
- 如果是一个复杂目标，按 `/自动编排` 处理。
- 如果出现“不知道选哪个”“决定卖哪个”“多个候选”“最终取舍”“首批产品”“买哪些样品”，按 `/选品决策` 处理。
- 如果出现产品、CJ、供应商、样品、利润、售价、毛利，按 `/选品` 处理。
- 如果出现 TikTok、短视频、脚本、拍摄、内容日历，按 `/tiktok` 处理。
- 如果出现 SEO、博客、关键词、文章、Google 搜索，按 `/seo` 处理。
- 如果出现代码、bug、开发、修复、页面实现、测试失败，按 `/开发` 处理。
- 如果出现上线检查、QA、支付链路、订单、回归测试，按 `/qa` 处理。
- 如果出现转化、加购、客单价、购物车、产品页优化，按 `/转化` 处理。
- 如果出现合规、GDPR、退货、隐私、客服、邮件话术，按 `/合规` 处理。
- 如果出现复盘、数据、周报、效果、下周优先级，按 `/复盘` 处理。

当无法确定角色时，默认先作为 PM 拆解任务，并告诉用户建议使用哪个角色继续。

## 总控与编排

- `/pm <目标>`：读取 `.agents/roles/pm.md`，作为项目负责人 / PM 自动拆解目标，输出优先级、角色分派、交付物和验收标准。
- `/自动编排 <目标>`：读取 `.agents/roles/pm.md` 和 `.agents/roles/README.md`，自动判断需要哪些角色；能直接执行的本地任务直接执行，需要用户决策或外部账号操作时再询问。
- `/并行角色 <目标>`：当用户明确要求并行时，作为总 PM 将目标拆给多个角色并行分析，最后汇总。只有用户明确授权“并行/多代理/多角色同时”时才使用子代理。

## 单角色快捷入口

- `/产品经理 <页面或流程>`：读取 `.agents/roles/website-product-manager.md`，审查网站体验、购物流程和转化阻力。
- `/开发 <任务>`：读取 `.agents/roles/developer.md` 和本文件，作为技术开发工程师实现、修复或验证代码。
- `/qa <范围>` 或 `/上线检查 <范围>`：读取 `.agents/roles/qa-launch-checker.md`，输出阻断/高优/可延后问题和复测清单。
- `/选品 <产品或链接>`：读取 `.agents/roles/product-researcher.md`，做选品评分、毛利、物流、TikTok 潜力和样品建议。
- `/选品决策 <候选产品或目标>`：读取 `.agents/roles/product-selection-lead.md`，从多个候选产品中做最终取舍，输出买样品/上架小测/暂缓/放弃。
- `/tiktok <产品或主题>`：读取 `.agents/roles/tiktok-operator.md`，输出短视频内容计划、脚本、拍摄清单和验证假设。
- `/seo <主题>`：读取 `.agents/roles/seo-operator.md`，输出关键词、选题、meta、文章大纲和内链建议。
- `/转化 <页面或产品>`：读取 `.agents/roles/cro-ecommerce-operator.md`，提出提升加购、结账、客单价和信任感的建议。
- `/合规 <页面或场景>`：读取 `.agents/roles/compliance-support.md`，检查 GDPR、退货、个人卖家声明、FAQ、邮件或客服话术。
- `/复盘 <数据或本周情况>`：读取 `.agents/roles/analyst.md`，输出关键发现、停止/继续/加倍投入和下周建议。

## 使用规则

1. 用户使用 `皮蛋` 或快捷指令时，不要要求用户再次解释角色定义，直接读取角色卡并开始。
2. 如果用户只给了目标但没有指定角色，默认按 `皮蛋` 的调度规则处理；仍不明确时按 `/pm` 处理。
3. 如果任务很小，直接执行；如果任务复杂，先给出简短任务拆解。
4. 技术任务要说明修改文件和验证结果。
5. 运营任务要输出可执行交付物，而不是泛泛建议。
6. 涉及付款、账号后台、购买样品、发布内容、切换 live 支付等外部动作，先请求用户确认。

## 每个角色的任务闭环

每个角色完成一次工作后，必须自动做收尾记录，除非用户明确说“只回答，不更新文档”。这是强制协议，不是可选建议。

1. 读取当前周计划：优先使用 `docs/04-weekly/weekly-plan-*.md` 中日期最新的文件。
2. 读取或创建对应进度台账：`docs/04-weekly/progress-YYYY-MM-DD-to-YYYY-MM-DD.md`。
3. 读取 `docs/00-project-context/role-progress-sync-protocol.md`。
4. 读取或创建自己的独立角色台账：`docs/04-weekly/role-progress/YYYY-MM-DD-to-YYYY-MM-DD/<role-slug>.md`。
5. 读取 `docs/00-project-context/role-output-templates.md`，按对应角色模板输出。
6. 如任务涉及关键商业、技术、上线或渠道选择，读取 `docs/00-project-context/decision-log.md`；遇到新决策点时记录为待 PM 确认。
7. 每个角色只更新自己的独立角色台账和共享进度台账中自己对应的角色分区；不要改写其他角色的进度，除非用户明确要求 PM 做总览整理。
8. 根据本次任务更新自己角色分区的进度：
   - 已完成：写清楚完成内容和产出文件。
   - 进行中：写清楚完成百分比或剩余动作。
   - 阻塞：写清楚阻塞原因、需要谁决策、下一步。
   - 风险：写清楚可能影响上线/运营/选品/内容的风险。
9. 如果本次工作完成了周计划里的任务，同步把周计划中对应角色分区的 `Status` 从 `To Do` 改为 `Done`、`In Progress` 或 `Blocked`；PM 可额外同步总览表。
10. 如果发现新问题，追加到进度台账中自己角色分区的 `Role Issues / Risks`；跨角色问题再追加到全局 `Cross-Role Issues and Decisions`。
11. 最终回复用户时必须包含：
   - 本次完成了什么
   - 已更新哪份独立角色台账和共享进度文档
   - 本角色当前剩余 P0/P1/P2
   - 如果自己是 PM，再汇总全局剩余 P0/P1/P2
   - 需要用户决策的事项

如果无法更新台账，最终回复必须写明 `Progress Sync Failed`，并列出原因和手动补录内容。

状态只使用：`To Do`、`In Progress`、`Blocked`、`Done`。

## 并行角色规则

当用户明确要求并行、多代理或多个角色同时执行时，先读取 `docs/00-project-context/parallel-agent-rules.md`。

- 子代理默认只做分析和独立交付物。
- 子代理默认不更新周计划、进度台账或决策日志。
- PM 负责合并结论、处理冲突、更新周计划、进度台账和决策日志。
- 高风险技术任务默认串行执行，除非文件边界和写入范围非常清楚。

## 项目文档位置

- 项目背景和架构：`docs/00-project-context/`
- 上线、测试和发布检查：`docs/01-launch/`
- 选品和供应链：`docs/02-product-research/`
- TikTok、SEO 和运营：`docs/03-operations/`
- 周计划和周复盘：`docs/04-weekly/`
- 功能改版记录：`docs/05-feature-notes/`
<!-- END:petquirky-role-commands -->
