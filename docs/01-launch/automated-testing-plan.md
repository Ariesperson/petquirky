# PetQuirky 自动化测试方案

## 1. 基线与前提

- 需求与验收基线以 [INSTRUCTIONS.md](/Users/chensiyan/business/dtcsites/website/petquirky/INSTRUCTIONS.md) 为主。
- `PetQuirky-PRD-v1.md` 当前不在仓库内；架构基线见 `docs/00-project-context/PetQuirky-Architecture.md`。测试断言以已落地代码和本地文档为准。
- 技术栈以 Next.js 16 App Router、React 19、Tailwind 4、`src/proxy.ts` locale 路由、Supabase、PayPal、Resend 为准。

## 2. 测试分层

### 单元测试：`Vitest`

- 目标：稳定验证纯函数、数据规则、SEO 生成逻辑、API 输入校验。
- 覆盖重点：
  - locale 与 `proxy.ts` 重定向
  - 商品筛选、排序、价格格式、徽章白名单
  - 运费、免邮阈值、结账 payload 构建
  - sitemap / robots / metadata / 法务文案关键约束
  - PayPal route 的配置缺失、输入非法、成功链路

### 集成测试：`Vitest + Next route handlers`

- 目标：验证 Route Handler 与业务模块协同，而不是只测单个函数。
- 覆盖重点：
  - `/api/paypal/create-order`
  - `/api/paypal/capture-order`
- 外部依赖全部 mock：
  - `@/lib/paypal`
  - `@/lib/orders-server`
  - `@/lib/email`

### E2E 烟雾测试：`Playwright`

- 目标：验证关键用户流在真实浏览器中至少能跑通基础路径。
- 首批建议覆盖：
  - 四语言入口可访问
  - 产品列表页与详情页关键内容可见
  - 购物车 / 结账主路由可达
- 当前仓库已补 `playwright.config.ts` 与首批 smoke spec；执行前需要安装浏览器二进制。

## 3. 功能测试矩阵

| 模块 | 自动化层级 | 关键用例 |
| --- | --- | --- |
| 多语言 / Proxy | Unit + E2E | `/` 按 `Accept-Language` 重定向；已带 locale 路径不重复跳转；四语言路由均可访问 |
| Header / Footer / Cookie | E2E | 语言容器正确；Cookie 首次展示、接受后不重复；Legal 链接可达 |
| 首页 | E2E | 首页可加载；核心 CTA 与 trust badges 可见 |
| 产品列表 | Unit + E2E | 分类、宠物类型、搜索、排序；只允许 `New/Bestseller/Sale` |
| 产品详情 | Unit + E2E | slug 查找、关联商品、评分分布、14 天退货与免邮信息、JSON-LD 输出 |
| 运费 / 购物车 | Unit | `50 €` 免邮阈值、购物车金额汇总、价格格式 |
| 结账 | Unit + Integration + E2E | 地址完整性校验、payload 构建、PayPal create/capture 输入校验 |
| 账户 / 认证 | E2E | 登录页、注册页、账户页路由可达；后续补 Supabase mock 场景 |
| 博客 | Unit + E2E | metadata、Article JSON-LD、详情路由可达 |
| 法务页 | Unit | Returns 文案必须为 `14-day`，不能退回 `30-day` |
| SEO | Unit | `canonical`、`hreflang`、`sitemap.xml`、`robots.txt` |

## 4. 执行策略

### 本地执行

```bash
npm run test:unit
npm run test:coverage
npm run test:e2e
```

### CI 建议

1. `npm ci`
2. `npm run lint`
3. `npm run test:unit`
4. `npx playwright install --with-deps chromium`
5. `npm run test:e2e`
6. `npm run build`

## 5. 维护规则

- 新页面或 API 合入前，至少补一条对应的自动化断言。
- 涉及价格、运费、退货政策、locale、支付链路的改动，必须补单元测试。
- 涉及真实第三方服务的测试默认 mock；只在预发布环境跑 sandbox 冒烟。
- 每次 Phase 完成后，把 [INSTRUCTIONS.md](/Users/chensiyan/business/dtcsites/website/petquirky/INSTRUCTIONS.md) 的验收清单映射为自动化断言，避免“文档通过但测试空白”。
