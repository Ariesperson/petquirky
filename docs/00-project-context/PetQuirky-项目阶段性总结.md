# PetQuirky 项目阶段性总结

> 生成日期：2026-03-26
> 用途：在新的Claude会话中，将本文件作为第一条消息发送，Claude即可恢复完整项目上下文继续工作。

---

## 一、项目概述

**项目名称：** PetQuirky — Smart Gear for Unique Pets
**项目类型：** 面向欧洲市场（德/法/西）的宠物用品跨境电商独立站
**商业模式：** Dropshipping（一件代发），供应商为 CJ Dropshipping
**目标用户：** 欧洲25-40岁宠物主人，涵盖猫狗+异宠（爬行类、仓鼠等）
**卖家身份：** 个人卖家，无公司主体
**域名：** petquirky.com（已在阿里云万网注册完成）

---

## 二、已完成的全部决策

### 产品方向
- [DECISION] 主线产品：宠物智能用品（猫狗智能玩具+慢食碗套装起步）
- [DECISION] 差异化方向：异宠用品（爬行类/仓鼠等），欧洲异宠市场CAGR 8.4%
- [DECISION] 客单价目标：€50+
- [DECISION] 供应商：CJ Dropshipping（账号已注册）

### 品牌与设计
- [DECISION] 品牌名：PetQuirky（"Pet" + "Quirky"古灵精怪）
- [DECISION] 品牌视觉：Concept A 暖珊瑚色方案
  - 主色：#D85A30（暖珊瑚）
  - 辅助色：#FF8A65（浅珊瑚）
  - 浅底色：#FFF0EB
  - 文字色：#2D2D2D
  - 背景色：#F5F5F0
- [DECISION] 字体：Baloo 2（标题，700/800）+ Quicksand（正文，400/600）
- [DECISION] Logo：圆角方形爪印图标 + "PetQuirky"文字，"Quirky"用品牌珊瑚色

### 技术方案
- [DECISION] 技术栈：Next.js 14 (App Router) + Tailwind CSS + shadcn/ui + Supabase
- [DECISION] 支付：PayPal 个人账户（月限额约$2500）
- [DECISION] 部署：Vercel Hobby（免费）
- [DECISION] 数据库：Supabase Free Tier（用户/地址/订单三张表）
- [DECISION] 邮件服务：Resend Free Tier（100封/天）
- [DECISION] 货币：仅支持欧元（EUR）
- [DECISION] 多语言：英/德/法/西 四语言同时上线

### 功能决策
- [DECISION] 评价系统：V1为静态展示（站长手动维护JSON），V2再开放用户提交
- [DECISION] 用户系统：保留（邮箱+密码注册登录，查订单+地址管理）
- [DECISION] 登录方式：仅邮箱+密码，不做第三方登录（Google/Apple）
- [DECISION] Badge类型：仅限 New / Bestseller / Sale 三种
- [DECISION] 退货政策：14天（欧盟要求）
- [DECISION] Header导航：Home, Products, Blog, About, Contact + 搜索图标 + EN▾ + 用户图标 + 购物车图标
- [DECISION] Footer必须包含："Individual seller, not a corporate entity." + 年份2026

### 提现方案
- [DECISION] 提现路径：PayPal → Payoneer → 国内银行卡
  - PayPal交易手续费：4.4% + €0.35/笔
  - PayPal→Payoneer提现费：固定$35/笔（建议攒够$500+再提）
  - Payoneer→国内银行卡：1.2%手续费（优惠链接可降到1%）
  - 不占个人5万美元年结汇额度

---

## 三、已生成的全部文档

### 选品与调研类
| 文件名 | 内容 |
|--------|------|
| 选品深度分析-三方向对比.md | 家居健康科技/智能家居/宠物三大方向完整对比 |
| 供应商筛选指南-LED面部美容仪.md | CJ/Spocket/AliExpress供应商对比、样品计划、定价策略 |
| 宠物智能用品-深度选品分析.md | 5个产品方向、供应商、TikTok策略、利润测算 |

### 品牌设计类
| 文件名 | 内容 |
|--------|------|
| PetQuirky-Brand-Design.html | 3套Logo视觉方案对比（最终选定Concept A暖珊瑚色） |
| PetQuirky-Brand-Guide.docx | 品牌规范文档（配色/字体/按钮/设计Token） |

### 需求与架构类
| 文件名 | 内容 |
|--------|------|
| PetQuirky-PRD-v1.md | 完整PRD（13章节，含评价系统简化为静态展示的更新） |
| PetQuirky-Architecture.md | 技术架构（目录结构、数据模型、i18n、PayPal、运费规则、示例数据） |
| INSTRUCTIONS.md | Codex开发执行指令v2（初始化命令、Tailwind配置、4 Phase开发顺序、邮件系统） |

### Codex开发配置类
| 文件名 | 内容 |
|--------|------|
| CODEX-README.md | Codex主入口文件（文档阅读顺序、开发规则、分期计划、检查清单） |
| AGENTS.md | Codex自动加载的项目指令（34行精简版） |
| petquirky-skills.zip | Codex Skills包（含3个SKILL.md：project/design/dev） |

### 设计类
| 文件名 | 内容 |
|--------|------|
| PetQuirky-Stitch-Prompts.md | 16个页面的Google Stitch设计Prompt清单 |
| Stitch导出zip（用户本地） | 16个页面的设计文件（每个含code.html + screen.png） |

---

## 四、UI设计完成状态（16个页面全部通过审核）

| # | 页面 | 状态 | 审核中反复出现的问题（Codex开发时注意） |
|---|------|------|----------------------------------------|
| 1 | 首页 | ✅ 通过 | Header导航必须统一；Hero图要体现多元宠物（含异宠） |
| 2 | 产品列表页 | ✅ 通过 | 筛选分两组（Category下拉 + Pet Type药丸）；Badge仅限New/Bestseller/Sale |
| 3 | 产品详情页 | ✅ 通过 | 评价区需有评分分布柱状图 + Verified Purchase标识；移动端Add to Cart固定底部 |
| 4 | 购物车页 | ✅ 通过 | 退货政策14天（非30天）；免运费进度条逻辑要正确 |
| 5 | 结账页（收货信息） | ✅ 通过 | 简化Header（仅Logo+Back to Cart）；Footer年份2026 |
| 6 | 结账页（确认+支付） | ✅ 通过 | PayPal按钮 + 信用卡选项 + 法律声明 |
| 7 | 支付成功页 | ✅ 通过 | Guest用户显示"Create Account"引导 |
| 8 | 账户中心 | ✅ 通过 | 侧边栏导航 + 订单卡片三种状态（Processing/Shipped/Delivered） |
| 9 | 博客列表页 | ✅ 通过 | Featured文章大卡片 + 分类药丸筛选 + 文章网格 |
| 10 | 博客文章详情页 | ✅ 通过 | 文内产品推荐卡片（珊瑚色底）+ 标签 + 分享 + Related Articles |
| 11 | 登录页 | ⚠️ 通过（需移除Google/Apple按钮） | 不要第三方登录按钮！ |
| 12 | 注册页 | ✅ 通过 | 密码强度指示器 + 隐私政策同意勾选 |
| 13 | 隐私政策页 | ✅ 通过 | 6个章节 + 目录导航 + GDPR权利列表 |
| 14 | Cookie Banner + Settings | ✅ 通过 | 底部横幅3选项 + 展开面板3级Cookie控制 |
| 15 | 404页面 | ✅ 通过 | 猫咪插图 + Go Home/Browse Products两按钮 |
| 16 | 购物车抽屉 | ✅ 通过 | 右侧滑出 + 免运费进度条 + View Cart/Checkout双按钮 |

---

## 五、开发计划（4个Phase）

### Phase 1（第1-2周）：基础框架 + 布局 + 首页
- 项目初始化（Next.js + Tailwind + shadcn/ui + Supabase + Resend）
- 多语言路由（[locale]）+ middleware + 四种语言翻译文件
- Header + Footer + MobileMenu + CookieBanner 全局组件
- 首页5个区块（Hero + Categories + Featured Products + Trust Badges + Newsletter）
- 首次部署到Vercel

### Phase 2（第3-4周）：产品系统
- 产品数据JSON + 静态评价JSON + 运费规则JSON
- 产品列表页（筛选+排序+搜索+卡片网格）
- 产品详情页（图片画廊+信息+规格+静态评价+评分分布图+相关推荐+运费预估）
- 产品搜索（Header搜索框+实时匹配+下拉结果）
- SEO：JSON-LD Product Schema + sitemap

### Phase 3（第5-6周）：购物车 + 结账 + 用户系统
- 购物车（Context+localStorage+CartDrawer抽屉+购物车页）
- Supabase数据库配置（profiles+addresses+orders表）
- 用户注册/登录（邮箱+密码，无第三方登录）
- 账户中心（订单历史+个人信息+地址管理）
- 结账流程（收货信息→确认→PayPal支付→成功页）
- PayPal SDK集成（先sandbox后live）
- Guest Checkout支持

### Phase 4（第7-8周）：博客 + 内容 + 邮件 + 上线
- 博客系统（Markdown渲染+文内产品推荐+分类标签）
- 法律页面（隐私政策+退货政策14天+使用条款）+ 404页面
- SEO全面优化（元数据+hreflang+OG+JSON-LD+sitemap）
- 邮件通知系统（Resend）：订单确认邮件（发客户）+ 新订单通知（发卖家）+ Supabase Auth SMTP配置
- 上线准备：域名绑定+PayPal切live+Lighthouse优化+Search Console提交

---

## 六、待完成的工作

### 即将进行（开发前准备）
- ⬜ 创建GitHub Private仓库，把所有文档和设计文件放入
- ⬜ 注册Supabase账号，创建项目
- ⬜ 注册Resend账号，获取API Key
- ⬜ 注册PayPal个人账户（获取sandbox凭据）
- ⬜ 注册Payoneer个人账户（审核需2-5个工作日）
- ⬜ 开始Codex开发Phase 1

### 后续工作（开发完成后）
- ⬜ 在CJ Dropshipping上筛选具体产品并收藏
- ⬜ 下单产品样品（预算约¥1000）
- ⬜ 拍摄产品图片/视频
- ⬜ TikTok账号注册和内容规划
- ⬜ 撰写3-5篇SEO博客文章（异宠护理方向优先）
- ⬜ Vercel部署+域名绑定petquirky.com
- ⬜ PayPal切换到live模式
- ⬜ Google Search Console提交sitemap

### 未来版本（V1.1/V2.0）
- ⬜ 用户提交评价功能（评价迁移到数据库）
- ⬜ 优惠码/折扣系统
- ⬜ Newsletter邮件订阅对接
- ⬜ 收藏/心愿单
- ⬜ 暗色模式
- ⬜ 管理后台
- ⬜ 接入Stripe（注册公司后）

---

## 七、项目仓库建议结构

```
petquirky/
├── AGENTS.md                          # Codex自动加载（34行）
├── CODEX-README.md                    # 开发主入口
├── PetQuirky-PRD-v1.md                # 需求文档
├── PetQuirky-Architecture.md          # 技术架构
├── INSTRUCTIONS.md                    # 开发执行指令v2
├── PetQuirky-Brand-Guide.docx         # 品牌规范
├── .agents/skills/                    # Codex Skills
│   ├── petquirky-project/SKILL.md     # 项目上下文
│   ├── petquirky-design/SKILL.md      # 设计系统
│   └── petquirky-dev/SKILL.md         # 开发规则
├── design-reference/                  # Stitch导出的设计文件
│   ├── homepage/                      # code.html + screen.png
│   ├── product-listing/
│   ├── product-detail/
│   ├── cart/
│   ├── cart-drawer/
│   ├── checkout-shipping/
│   ├── checkout-review/
│   ├── order-confirmation/
│   ├── login/
│   ├── register/
│   ├── account/
│   ├── blog-listing/
│   ├── blog-detail/
│   ├── privacy-policy/
│   ├── cookie-banner/
│   └── 404/
└── src/                               # Codex开发代码
```

---

## 八、如何在新会话中恢复上下文

在新的Claude会话中，发送以下消息：

```
请阅读附件中的项目阶段性总结，这是PetQuirky跨境电商独立站项目的完整上下文。
我们已经完成了选品调研、品牌设计、PRD需求文档、16个页面的UI设计（Google Stitch）、
技术架构设计、Codex开发计划和Skills配置。

接下来我要进行 [你想做的具体任务]。

项目的所有决策和文档清单在总结文件中，请基于这些上下文继续工作。
```

然后附上本文件即可。如果需要讨论具体某个文档的细节，再单独上传对应的文档。

---

*本总结涵盖截至2026-03-26的全部项目进展。项目当前处于"开发前准备"阶段，下一步是创建GitHub仓库并开始Codex Phase 1开发。*
