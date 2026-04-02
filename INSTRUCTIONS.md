# INSTRUCTIONS.md — Codex 开发执行指令（v2）

> 本文件基于 PetQuirky-PRD-v1.md（最新需求）和 16 个已通过审核的 UI 设计稿重写。 每一步都标注了对应的设计参考文件和 PRD 章节，Codex 开发时必须逐步对照。 上次更新：2026-03-26

------

## 前提条件

开始前确保已阅读：

- `PetQuirky-PRD-v1.md` — 需求定义（最高权威）
- `PetQuirky-Architecture.md` — 数据模型和技术方案
- `.agents/skills/` — 三个 Skill 文件（project / design / dev）

开发过程中，对照每个页面的设计参考：

- `design-reference/{page-name}/screen.png` — 视觉还原目标（≥90%匹配）
- `design-reference/{page-name}/code.html` — 仅参考布局结构，不要复制代码

------

## 项目初始化（执行一次）

```bash
# 1. 创建项目
npx create-next-app@latest petquirky --typescript --tailwind --app --src-dir --import-alias "@/*"
cd petquirky

# 2. 安装 shadcn/ui
npx shadcn@latest init

# 3. 安装核心依赖
npm install @paypal/react-paypal-js          # PayPal 支付
npm install @supabase/supabase-js            # 数据库（用户/订单）
npm install @supabase/auth-helpers-nextjs    # Supabase Auth
npm install bcryptjs                         # 密码哈希
npm install gray-matter remark remark-html   # 博客 Markdown 解析
npm install resend                           # 邮件服务（订单确认+卖家通知）

# 4. 安装开发依赖
npm install -D @types/bcryptjs
```

## Tailwind 配置

`tailwind.config.ts`：

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D85A30',
          light: '#FF8A65',
          tint: '#FFF0EB',
        },
        dark: '#2D2D2D',
        muted: '#888888',
        background: '#F5F5F0',
        success: '#1D9E75',
        warning: '#BA7517',
        error: '#D32F2F',
      },
      fontFamily: {
        heading: ['"Baloo 2"', 'cursive'],
        body: ['"Quicksand"', 'sans-serif'],
      },
      borderRadius: {
        brand: '8px',
        'brand-lg': '16px',
      },
    },
  },
  plugins: [],
};
export default config;
```

`src/app/globals.css` 顶部：

```css
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Quicksand:wght@400;500;600;700&display=swap');
```

## 环境变量

创建 `.env.local`（加入 .gitignore，不提交）：

```env
# PayPal
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_ENV=sandbox
NEXT_PUBLIC_PAYPAL_CLIENT_ID=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
# 当前前台与订单流程未直接使用，保留给后续需要服务端高权限任务时再配置
SUPABASE_SERVICE_ROLE_KEY=

# Site
NEXT_PUBLIC_SITE_URL=https://petquirky.com
# 当前代码未读取，保留给后续联系方式配置扩展
NEXT_PUBLIC_CONTACT_EMAIL=hello@petquirky.com

# Email (Resend)
RESEND_API_KEY=
SELLER_EMAIL=hello@petquirky.com
```

------

## Phase 1：基础框架 + 布局 + 首页（第1-2周）

> 目标：项目跑起来，首页可在 Vercel 上访问 设计参考：`design-reference/homepage/screen.png` PRD参照：§4.5 多语言模块、§4.7 GDPR合规、§6 页面清单

### Step 1.1: 多语言基础设施

```
创建文件：
├── src/middleware.ts                    # 语言检测 + 重定向
├── src/lib/i18n.ts                      # 翻译读取工具函数
├── src/i18n/en.json                     # 英文翻译（完整）
├── src/i18n/de.json                     # 德文翻译（完整）
├── src/i18n/fr.json                     # 法文翻译（完整）
├── src/i18n/es.json                     # 西文翻译（完整）
├── src/app/[locale]/layout.tsx          # 带 locale 的根布局
└── src/types/product.ts                 # Product / Cart / Order 类型定义
```

**要求：**

- middleware 检测浏览器 Accept-Language，重定向到 /en/, /de/, /fr/, /es/
- 四种语言翻译文件必须同时创建，内容结构一致
- 翻译 key 参考 PRD §4.5 和 Architecture 文档中的示例
- 所有 UI 文字通过 `getDictionary(locale)` 获取，零硬编码

### Step 1.2: 全局布局组件

```
创建文件：
├── src/components/layout/Header.tsx         # 顶部导航栏
├── src/components/layout/MobileMenu.tsx      # 移动端汉堡菜单
├── src/components/layout/Footer.tsx          # 页脚
├── src/components/layout/CookieBanner.tsx    # GDPR Cookie 横幅
└── src/components/layout/CookieSettings.tsx  # Cookie 偏好设置面板
```

**Header 规范（对照 design-reference/homepage/screen.png 顶部）：**

- 左侧：PetQuirky 文字 Logo（"Pet" #2D2D2D + "Quirky" #D85A30，Baloo 2 字体）
- 中间：Home, Products, Blog, About, Contact（导航链接）
- 右侧：🔍搜索图标 + "EN▾"语言下拉 + 👤用户图标 + 🛒购物车图标（带数量badge）
- 移动端：Logo + 汉堡菜单图标 + 购物车图标
- Sticky 定位，白色背景

**Footer 规范（对照 design-reference/homepage/screen.png 底部）：**

- 四列：Shop | Support | Legal（Privacy, Terms, Cookie Settings）| Social（TikTok, Instagram）
- 底部栏："© 2026 PetQuirky. Individual seller, not a corporate entity."
- 深色背景 #2D2D2D，白色文字

**Cookie Banner（对照 design-reference/cookie-banner/screen.png）：**

- 底部固定横幅：文字 + "Accept All"(coral) + "Necessary Only"(outline) + "Manage Preferences"(link)
- 展开面板：Necessary(始终开启) + Analytics(默认关闭) + Marketing(默认关闭)
- 选择存入 localStorage key: `petquirky-gdpr`

### Step 1.3: 首页

```
设计参考：design-reference/homepage/screen.png

创建文件：
├── src/components/home/HeroBanner.tsx         # Hero 区域
├── src/components/home/CategoryShowcase.tsx    # 品类卡片
├── src/components/home/FeaturedProducts.tsx    # 精选产品网格
├── src/components/home/TrustBadges.tsx         # 信任标识
├── src/components/home/Newsletter.tsx          # 邮件订阅
└── src/app/[locale]/page.tsx                   # 首页组装
```

**区块从上到下：**

1. Hero Banner — "Smart Gear for Unique Pets" + "Shop Now" CTA + 多宠物拼贴图
2. Shop by Category — 4个品类卡片（Smart Toys / Feeding & Enrichment / Habitat & Equipment / All Products）
3. Trending Essentials — 4个 ProductCard 网格
4. Trust Badges — Free Shipping over €50 / 14-Day Returns / Secure Payment / CE Certified
5. Newsletter — "Stay in the loop" + 邮件输入 + Subscribe
6. Footer

### Step 1.4: 首次部署

```bash
git init && git add . && git commit -m "feat: initial setup with homepage"
# 连接 Vercel 部署
```

**Phase 1 检查清单：**

- [ ] `npm run build` 无报错
- [ ] Vercel 部署成功
- [ ] 四种语言切换正常
- [ ] 移动端（375px）布局正常
- [ ] Cookie Banner 首次显示，选择后不再重复
- [ ] Header/Footer 视觉匹配设计稿 ≥90%

------

## Phase 2：产品系统（第3-4周）

> 设计参考：`design-reference/product-listing/screen.png` + `design-reference/product-detail/screen.png` PRD参照：§4.1 产品展示模块

### Step 2.1: 产品数据

```
创建文件：
├── src/data/products/index.json         # 至少5个示例产品（多语言）
├── src/data/products/categories.json    # 品类数据
├── src/data/reviews.json                # 静态评价（每产品3-5条，站长维护）
├── src/data/shipping.json               # 运费规则
├── src/lib/products.ts                  # 产品读取/筛选/排序
└── src/lib/shipping.ts                  # 运费计算
```

**评价数据要点：** 静态JSON展示，无用户提交。含 authorName, rating, title, content, date, verified 字段。

### Step 2.2: 产品列表页

```
设计参考：design-reference/product-listing/screen.png

创建文件：
├── src/components/product/ProductCard.tsx       # 全站复用
├── src/components/product/CategoryFilter.tsx    # 品类下拉
├── src/components/product/PetTypeFilter.tsx     # 宠物类型药丸
├── src/components/product/SortSelect.tsx        # 排序（5种）
├── src/components/product/SearchBar.tsx         # 搜索框
└── src/app/[locale]/products/page.tsx
```

**筛选：** Category下拉 + Pet Type药丸（分开的两组，不要混在一起） **排序：** Recommended / Price Low→High / Price High→Low / Newest / Top Rated **Badge仅限：** New / Bestseller / Sale（不要 Premium / Eco Friendly / Limited） **网格：** 移动2列 / 平板3列 / 桌面4列

### Step 2.3: 产品详情页

```
设计参考：design-reference/product-detail/screen.png

创建文件：
├── src/components/product/ProductGallery.tsx
├── src/components/product/ProductInfo.tsx
├── src/components/product/ProductSpecs.tsx
├── src/components/product/ReviewSection.tsx      # 静态评价展示
├── src/components/product/ReviewCard.tsx
├── src/components/product/RatingDistribution.tsx # 评分分布柱状图
├── src/components/product/RelatedProducts.tsx
├── src/components/product/ShippingEstimate.tsx
├── src/components/product/AddToCartButton.tsx    # 移动端底部固定
└── src/app/[locale]/products/[slug]/page.tsx
```

**关键：**

- 评价区读取 reviews.json，显示平均分+分布柱状图+评价卡片（含"✓ Verified Purchase"绿色标识）
- 移动端 Add to Cart 固定底部
- JSON-LD Product Schema

### Step 2.4: 产品搜索

```
创建文件：
├── src/components/layout/SearchOverlay.tsx
└── src/lib/search.ts
```

Header搜索图标 → 展开 → 实时匹配（debounce 300ms）→ 下拉结果（最多5条）

**Phase 2 检查清单：**

- [ ] 筛选/排序/搜索功能正常
- [ ] 评价区正确显示静态数据+分布图
- [ ] 运费预估正确计算
- [ ] 产品页 JSON-LD 通过验证
- [ ] sitemap 包含所有产品页×4语言
- [ ] 移动端 Add to Cart 固定底部

------

## Phase 3：购物车 + 结账 + 用户系统（第5-6周）

> 设计参考：`design-reference/cart/`, `cart-drawer/`, `checkout-shipping/`, `checkout-review/`, `order-confirmation/`, `login/`, `register/`, `account/` PRD参照：§4.2 购物流程、§4.3 用户账户

### Step 3.1: 购物车

```
创建文件：
├── src/types/cart.ts
├── src/types/order.ts
├── src/context/CartContext.tsx
├── src/hooks/useCart.ts
├── src/components/cart/CartDrawer.tsx        # 右侧滑出抽屉
├── src/components/cart/CartItem.tsx
├── src/components/cart/CartSummary.tsx
├── src/components/cart/FreeShippingBar.tsx   # 免运费进度条
└── src/app/[locale]/cart/page.tsx
```

**退货政策写14天（不是30天！）** **免运费阈值 €50：** 超过显示"✓ You've qualified!" + Shipping: FREE(绿色)

### Step 3.2: 用户系统（Supabase）

```
创建文件：
├── src/lib/supabase/client.ts
├── src/lib/supabase/server.ts
├── src/lib/auth.ts
├── src/context/AuthContext.tsx
├── src/hooks/useAuth.ts
├── src/app/[locale]/auth/register/page.tsx
├── src/app/[locale]/auth/login/page.tsx
├── src/app/[locale]/auth/forgot-password/page.tsx
├── src/app/[locale]/auth/reset-password/page.tsx
├── src/app/[locale]/account/page.tsx
├── src/app/[locale]/account/orders/[id]/page.tsx
├── src/app/[locale]/account/profile/page.tsx
├── src/components/auth/RegisterForm.tsx
├── src/components/auth/LoginForm.tsx
└── src/components/account/OrderCard.tsx
```

**注册/登录：邮箱+密码，不要第三方登录按钮（不要Google/Apple）**

### Step 3.3: 结账 + PayPal

```
创建文件：
├── src/components/checkout/ShippingForm.tsx
├── src/components/checkout/OrderReview.tsx
├── src/components/checkout/PayPalButton.tsx
├── src/components/checkout/OrderSummary.tsx
├── src/app/[locale]/checkout/page.tsx
├── src/app/[locale]/checkout/success/page.tsx
├── src/app/api/paypal/create-order/route.ts
├── src/app/api/paypal/capture-order/route.ts
└── src/app/api/contact/route.ts
```

**结账页用简化Header（仅Logo + Back to Cart），进度条3步** **支持Guest Checkout，成功后提示创建账户**

**Phase 3 检查清单：**

- [ ] Guest 完整购物流程走通
- [ ] 注册用户流程走通（地址自动填充）
- [ ] PayPal sandbox 支付成功
- [ ] 支付后购物车清空 + 订单写入数据库
- [ ] 免运费进度条和运费计算正确

------

## Phase 4：博客 + 内容 + SEO 完善（第7-8周）

> 设计参考：`design-reference/blog-listing/`, `blog-detail/`, `privacy-policy/`, `404/` PRD参照：§4.6 SEO与博客、§10 合规需求

### Step 4.1: 博客系统

```
创建文件：
├── src/data/blog/*.md                          # 至少3篇示例文章
├── src/lib/blog.ts
├── src/components/blog/BlogCard.tsx
├── src/components/blog/BlogContent.tsx
├── src/components/blog/ProductRecommendation.tsx  # 文内产品推荐
├── src/app/[locale]/blog/page.tsx
└── src/app/[locale]/blog/[slug]/page.tsx
```

**文内产品推荐：** 用 `[product:slug]` 标记，渲染为珊瑚色底卡片（含图片+名称+价格+评分+View Product按钮）

### Step 4.2: 法律页面 + 404

```
创建文件：
├── src/app/[locale]/policies/privacy/page.tsx
├── src/app/[locale]/policies/returns/page.tsx     # 14天退货！
├── src/app/[locale]/policies/terms/page.tsx
├── src/app/[locale]/about/page.tsx
├── src/app/[locale]/contact/page.tsx
└── src/app/not-found.tsx
```

### Step 4.3: SEO 优化

```
创建文件：
├── src/lib/seo.ts
├── src/app/sitemap.ts
├── src/app/robots.ts
└── src/components/seo/JsonLd.tsx
```

所有页面：title + description + canonical + hreflang + OG + Twitter Card 产品页：JSON-LD Product Schema | 博客：JSON-LD Article Schema

### Step 4.4: 邮件通知系统（Resend）

> 使用 Resend 免费方案（100封/天，初期足够） 这是上线前的最后一个功能模块

**安装：**

```bash
npm install resend
```

**环境变量（添加到 .env.local）：**

```env
RESEND_API_KEY=
SELLER_EMAIL=hello@petquirky.com
创建文件：
├── src/lib/email.ts                              # Resend 客户端 + 邮件工具函数
├── src/emails/OrderConfirmation.tsx                # 订单确认邮件模板（发给客户）
├── src/emails/NewOrderNotification.tsx             # 新订单通知模板（发给卖家）
├── src/app/api/email/order-confirmation/route.ts   # 订单确认邮件 API
└── src/app/api/email/order-notification/route.ts   # 卖家通知邮件 API
```

**触发时机：** PayPal 支付成功（capture-order）后自动触发两封邮件：

**邮件1 — 订单确认（发给客户）：**

- 收件人：客户填写的邮箱
- 主题："Your PetQuirky Order #PQ-XXXXXXXX is Confirmed!"
- 内容：订单号、商品清单（名称+数量+价格）、收货地址、总金额、预计发货时间（5-10 business days）、联系邮箱
- 多语言：根据客户下单时的语言版本发送对应语言的邮件

**邮件2 — 新订单通知（发给你）：**

- 收件人：SELLER_EMAIL（hello@petquirky.com）
- 主题："🎉 New Order #PQ-XXXXXXXX — €XX.XX"
- 内容：订单号、客户姓名+邮箱、商品清单、收货地址、总金额、PayPal交易ID
- 固定英文即可

**集成到 PayPal capture 流程：**

```typescript
// src/app/api/paypal/capture-order/route.ts 中，支付成功后：
// 1. 订单写入 Supabase
// 2. 调用 /api/email/order-confirmation（发给客户）
// 3. 调用 /api/email/order-notification（发给卖家）
// 4. 返回成功响应给前端
```

**Supabase Auth 邮件配置：**

- 在 Supabase Dashboard → Authentication → Email Templates 中配置
- SMTP 指向 Resend（Settings → SMTP → 填入 Resend 的 SMTP 凭据）
- 这样注册验证邮件和密码重置邮件也通过 Resend 发送，避免进垃圾箱

### Step 4.5: 上线准备

- [ ] 四种语言翻译完整
- [ ] Lighthouse > 80（移动端）
- [ ] petquirky.com 绑定 Vercel
- [ ] PayPal sandbox → live
- [ ] Google Search Console 提交 sitemap
- [ ] Resend 配置完成，测试订单确认邮件和卖家通知邮件
- [ ] Supabase Auth SMTP 指向 Resend

**Phase 4 检查清单：**

- [ ] 博客文章正确渲染，文内产品推荐可点击
- [ ] 隐私政策/退货政策/使用条款四种语言完整
- [ ] 404 页面友好展示
- [ ] sitemap.xml 完整
- [ ] 下单后客户收到确认邮件
- [ ] 下单后卖家收到通知邮件
- [ ] 注册后用户收到验证邮件（通过 Resend SMTP）
- [ ] Lighthouse 移动端 > 80
- [ ] petquirky.com 可正常访问

------

## 页面与设计参考对照表

| 页面          | 路由                       | 设计参考            | Phase |
| ------------- | -------------------------- | ------------------- | ----- |
| 首页          | /[locale]/                 | homepage/           | 1     |
| Cookie Banner | (组件)                     | cookie-banner/      | 1     |
| 产品列表      | /[locale]/products         | product-listing/    | 2     |
| 产品详情      | /[locale]/products/[slug]  | product-detail/     | 2     |
| 购物车        | /[locale]/cart             | cart/               | 3     |
| 购物车抽屉    | (组件)                     | cart-drawer/        | 3     |
| 结账-收货     | /[locale]/checkout         | checkout-shipping/  | 3     |
| 结账-确认支付 | /[locale]/checkout (step2) | checkout-review/    | 3     |
| 支付成功      | /[locale]/checkout/success | order-confirmation/ | 3     |
| 注册          | /[locale]/auth/register    | register/           | 3     |
| 登录          | /[locale]/auth/login       | login/              | 3     |
| 账户中心      | /[locale]/account          | account/            | 3     |
| 博客列表      | /[locale]/blog             | blog-listing/       | 4     |
| 博客详情      | /[locale]/blog/[slug]      | blog-detail/        | 4     |
| 隐私政策      | /[locale]/policies/privacy | privacy-policy/     | 4     |
| 404           | not-found                  | 404/                | 4     |

------

*Codex 开发执行指令 v2。每个 Phase 完成后部署到 Vercel 并通知项目负责人审核。*
