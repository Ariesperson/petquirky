# PetQuirky 独立站 — 项目架构与开发计划

> 项目名称：PetQuirky
> 域名：petquirky.com
> 技术栈：Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
> 部署：Vercel Hobby（免费）
> CMS：本地JSON（Phase 1）→ Sanity（Phase 2）
> 支付：PayPal Checkout SDK
> 交给：Codex 开发执行
> 生成日期：2026-03-23

---

## 一、项目概览

### 业务背景
PetQuirky 是一个面向欧洲市场（德/法/西）的宠物用品跨境电商独立站，采用 Dropshipping 模式。产品涵盖猫狗智能玩具、异宠用品（爬行类/小型哺乳类）等。流量来源以 TikTok Organic 和 Google SEO 为主。

### 核心需求
1. 多语言支持（英/德/法/西）
2. PayPal 个人账户集成支付
3. SEO 友好（SSR/SSG）
4. 移动端优先响应式设计
5. GDPR 合规（Cookie Banner + 隐私政策）
6. 产品管理通过本地 JSON 文件（初期简单方案）

### 约束条件
- 个人卖家，无公司主体
- Vercel Hobby 免费计划部署（带宽/构建限制）
- PayPal 个人账户（月限额约 $2500）
- 预算极低，所有工具选免费方案
- 网站需声明"个人卖家，非企业实体"

---

## 二、技术架构

```
petquirky.com/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── [locale]/                 # 多语言路由 (en/de/fr/es)
│   │   │   ├── layout.tsx            # 带locale的根布局
│   │   │   ├── page.tsx              # 首页
│   │   │   ├── products/
│   │   │   │   ├── page.tsx          # 产品列表页
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx      # 产品详情页
│   │   │   ├── cart/
│   │   │   │   └── page.tsx          # 购物车页
│   │   │   ├── checkout/
│   │   │   │   ├── page.tsx          # 结账页
│   │   │   │   └── success/
│   │   │   │       └── page.tsx      # 支付成功页
│   │   │   ├── about/
│   │   │   │   └── page.tsx          # 关于我们
│   │   │   ├── policies/
│   │   │   │   ├── privacy/
│   │   │   │   │   └── page.tsx      # 隐私政策 (GDPR)
│   │   │   │   ├── returns/
│   │   │   │   │   └── page.tsx      # 退货政策
│   │   │   │   └── terms/
│   │   │   │       └── page.tsx      # 使用条款
│   │   │   ├── contact/
│   │   │   │   └── page.tsx          # 联系方式
│   │   │   └── blog/                 # SEO内容博客
│   │   │       ├── page.tsx          # 博客列表
│   │   │       └── [slug]/
│   │   │           └── page.tsx      # 博客文章详情
│   │   ├── api/
│   │   │   ├── paypal/
│   │   │   │   ├── create-order/
│   │   │   │   │   └── route.ts      # 创建PayPal订单
│   │   │   │   └── capture-order/
│   │   │   │       └── route.ts      # 捕获PayPal支付
│   │   │   └── contact/
│   │   │       └── route.ts          # 联系表单提交
│   │   ├── layout.tsx                # 根布局
│   │   ├── not-found.tsx             # 404页面
│   │   └── globals.css               # 全局样式
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx            # 导航栏（含语言切换）
│   │   │   ├── Footer.tsx            # 页脚
│   │   │   ├── MobileMenu.tsx        # 移动端菜单
│   │   │   └── CookieBanner.tsx      # GDPR Cookie横幅
│   │   ├── product/
│   │   │   ├── ProductCard.tsx       # 产品卡片
│   │   │   ├── ProductGallery.tsx    # 产品图片画廊
│   │   │   ├── ProductInfo.tsx       # 产品详情信息
│   │   │   ├── AddToCartButton.tsx   # 加入购物车按钮
│   │   │   └── CategoryFilter.tsx    # 品类筛选
│   │   ├── cart/
│   │   │   ├── CartItem.tsx          # 购物车单项
│   │   │   ├── CartSummary.tsx       # 购物车汇总
│   │   │   └── CartDrawer.tsx        # 侧边购物车抽屉
│   │   ├── checkout/
│   │   │   ├── ShippingForm.tsx      # 收货地址表单
│   │   │   ├── PayPalButton.tsx      # PayPal支付按钮
│   │   │   └── OrderSummary.tsx      # 订单汇总
│   │   ├── home/
│   │   │   ├── HeroBanner.tsx        # 首页主横幅
│   │   │   ├── FeaturedProducts.tsx  # 精选产品
│   │   │   ├── CategoryShowcase.tsx  # 品类展示
│   │   │   ├── TrustBadges.tsx       # 信任标识
│   │   │   └── Newsletter.tsx        # 邮件订阅
│   │   ├── blog/
│   │   │   ├── BlogCard.tsx          # 博客卡片
│   │   │   └── BlogContent.tsx       # 博客正文
│   │   └── ui/                       # shadcn/ui 组件
│   │       └── (shadcn components)
│   │
│   ├── lib/
│   │   ├── products.ts              # 产品数据读取
│   │   ├── cart.ts                   # 购物车逻辑（localStorage）
│   │   ├── paypal.ts                # PayPal SDK 工具函数
│   │   ├── i18n.ts                  # 国际化配置
│   │   ├── seo.ts                   # SEO 元数据生成工具
│   │   └── shipping.ts             # 运费计算逻辑
│   │
│   ├── hooks/
│   │   ├── useCart.ts               # 购物车 Hook
│   │   ├── useLocale.ts            # 语言 Hook
│   │   └── useGDPR.ts              # GDPR 同意状态 Hook
│   │
│   ├── context/
│   │   ├── CartContext.tsx          # 购物车全局状态
│   │   └── LocaleContext.tsx       # 语言全局状态
│   │
│   ├── data/
│   │   ├── products/
│   │   │   ├── index.json          # 产品主数据
│   │   │   └── categories.json     # 品类数据
│   │   ├── shipping.json           # 运费规则
│   │   └── blog/
│   │       └── (markdown files)    # 博客文章 .md
│   │
│   ├── i18n/
│   │   ├── en.json                 # 英文翻译
│   │   ├── de.json                 # 德文翻译
│   │   ├── fr.json                 # 法文翻译
│   │   └── es.json                 # 西文翻译
│   │
│   └── types/
│       ├── product.ts              # 产品类型定义
│       ├── cart.ts                  # 购物车类型定义
│       └── order.ts                # 订单类型定义
│
├── public/
│   ├── images/
│   │   ├── logo/                   # Logo 文件
│   │   │   ├── logo-full.svg       # 完整Logo
│   │   │   ├── logo-icon.svg       # 图标Logo
│   │   │   └── favicon.ico
│   │   ├── products/               # 产品图片
│   │   ├── hero/                   # 首页横幅图
│   │   └── blog/                   # 博客配图
│   └── robots.txt
│
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .env.local                      # 环境变量（PayPal密钥等）
```

---

## 三、数据模型

### 3.1 Product（产品）

```typescript
// src/types/product.ts

interface Product {
  id: string;                    // 唯一ID，如 "smart-cat-snake-toy"
  slug: string;                  // URL slug
  category: ProductCategory;
  name: {                        // 多语言产品名
    en: string;
    de: string;
    fr: string;
    es: string;
  };
  description: {                 // 多语言描述
    en: string;
    de: string;
    fr: string;
    es: string;
  };
  price: {
    amount: number;              // 单位：欧分（如 4900 = €49.00）
    currency: "EUR";
  };
  compareAtPrice?: {             // 划线价（可选）
    amount: number;
    currency: "EUR";
  };
  images: string[];              // 图片路径数组
  badge?: "new" | "bestseller" | "sale";
  stock: "in_stock" | "low_stock" | "out_of_stock";
  weight: number;                // 克，用于运费计算
  specifications: {              // 产品规格
    [key: string]: string;
  };
  seo: {
    title: { en: string; de: string; fr: string; es: string };
    description: { en: string; de: string; fr: string; es: string };
  };
  tags: string[];                // 标签，如 ["cat", "interactive", "smart"]
  petType: PetType[];            // 适用宠物类型
  createdAt: string;             // ISO日期
  featured: boolean;             // 是否首页推荐
}

type ProductCategory =
  | "smart-toys"        // 智能玩具
  | "feeding"           // 喂食用品
  | "enrichment"        // 益智训练
  | "habitat"           // 栖息装备（异宠）
  | "tracking"          // 追踪定位
  | "grooming";         // 清洁护理

type PetType =
  | "cat"
  | "dog"
  | "hamster"
  | "rabbit"
  | "reptile"
  | "bird"
  | "fish"
  | "other";
```

### 3.2 Cart（购物车）

```typescript
// src/types/cart.ts

interface CartItem {
  productId: string;
  quantity: number;
  price: number;          // 加入时的价格（欧分）
}

interface Cart {
  items: CartItem[];
  shippingCountry: string;  // ISO国家代码如 "DE"
  shippingCost: number;     // 欧分
  subtotal: number;         // 欧分
  total: number;            // 欧分
}
```

### 3.3 Order（订单）

```typescript
// src/types/order.ts

interface Order {
  id: string;                 // PayPal订单ID
  status: "pending" | "paid" | "shipped" | "delivered" | "refunded";
  items: CartItem[];
  shipping: {
    name: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  payment: {
    method: "paypal";
    transactionId: string;
    paidAt: string;
  };
  totals: {
    subtotal: number;
    shipping: number;
    total: number;
    currency: "EUR";
  };
  createdAt: string;
}
```

---

## 四、页面规格

### 4.1 首页 (/)

**目的：** 品牌第一印象 + 引导浏览产品

**区块（从上到下）：**

1. **Hero Banner** — 全宽大图/视频背景，标题 "Smart Gear for Unique Pets"，CTA按钮 "Shop Now"
2. **Category Showcase** — 3-4个品类卡片（Smart Toys / Feeding / Enrichment / Habitat），点击进入对应筛选的产品列表
3. **Featured Products** — 4-8个精选产品卡片网格，支持加入购物车
4. **Trust Badges** — 一行图标：Free Shipping over €50 / 14-Day Returns / Secure Payment / CE Certified
5. **About Snippet** — 简短品牌介绍 + "Learn More" 链接
6. **Newsletter Signup** — 邮箱订阅框（用于未来邮件营销，初期可不接后端）
7. **Footer** — 导航链接、社交媒体图标、法律页面链接、"Individual seller, not a corporate entity" 声明

### 4.2 产品列表页 (/products)

**功能：**
- 产品卡片网格（mobile 2列，desktop 3-4列）
- 左侧/顶部筛选：品类（Category）、宠物类型（Pet Type）
- 排序：推荐 / 价格低到高 / 价格高到低 / 最新上架
- 每个卡片显示：图片、名称、价格、Badge、"Add to Cart" 按钮
- 无限滚动或翻页（初期产品少，可不做翻页）

### 4.3 产品详情页 (/products/[slug])

**功能：**
- 图片画廊（主图 + 缩略图切换）
- 产品名称、价格（含划线价如有）、Badge
- 产品描述（多语言）
- 规格表
- 数量选择器 + Add to Cart 按钮
- 运费预估（基于用户所在国）
- 适用宠物类型标签
- SEO结构化数据（JSON-LD Product Schema）

### 4.4 购物车页 (/cart)

**功能：**
- 购物车商品列表（图片、名称、单价、数量调整、删除、小计）
- 运费计算（基于选择的国家）
- 折扣码输入（Phase 2，初期可预留UI）
- 合计金额
- "Proceed to Checkout" 按钮
- "Continue Shopping" 链接

### 4.5 结账页 (/checkout)

**功能：**
- 收货信息表单：姓名、邮箱、地址、城市、邮编、国家（下拉选择欧洲国家）
- 订单汇总（产品+运费+合计）
- PayPal Checkout 按钮（PayPal JavaScript SDK）
- 无需注册/登录即可下单

### 4.6 支付成功页 (/checkout/success)

**功能：**
- 感谢信息
- 订单编号
- 预计发货时间
- 客服邮箱
- "Continue Shopping" 按钮

### 4.7 博客 (/blog)

**目的：** SEO 内容获取 Google 搜索流量

**功能：**
- 文章列表（卡片：封面图、标题、摘要、日期）
- 文章详情页（Markdown渲染）
- 文章内可插入产品推荐卡片
- 结构化数据（JSON-LD Article Schema）

### 4.8 法律页面 (/policies/*)

- Privacy Policy — GDPR 合规隐私政策
- Returns Policy — 14天无理由退货（欧盟要求）
- Terms of Service — 使用条款
- 所有页面需包含 "Individual seller" 声明

---

## 五、品牌视觉规范（给 Codex 的设计指令）

### 5.1 配色

```css
:root {
  /* Primary */
  --color-primary: #D85A30;
  --color-primary-light: #FF8A65;
  --color-primary-tint: #FFF0EB;

  /* Neutral */
  --color-text: #2D2D2D;
  --color-text-muted: #888888;
  --color-background: #F5F5F0;
  --color-white: #FFFFFF;
  --color-border: #E5E5E0;

  /* Semantic */
  --color-success: #1D9E75;
  --color-warning: #BA7517;
  --color-error: #D32F2F;
}
```

### 5.2 字体

```css
/* Google Fonts Import */
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Quicksand:wght@400;500;600;700&display=swap');

/* Usage */
--font-heading: 'Baloo 2', cursive;     /* Logo, H1, H2 */
--font-body: 'Quicksand', sans-serif;   /* 正文, UI, 导航 */
```

### 5.3 字号

| Element       | Font      | Size    | Weight | Line Height |
|---------------|-----------|---------|--------|-------------|
| Hero Title    | Baloo 2   | 48px    | 800    | 1.2         |
| H1            | Baloo 2   | 32px    | 700    | 1.3         |
| H2            | Baloo 2   | 24px    | 700    | 1.4         |
| H3            | Quicksand | 18px    | 600    | 1.4         |
| Body          | Quicksand | 16px    | 400    | 1.7         |
| Small         | Quicksand | 13px    | 400    | 1.5         |
| Button        | Quicksand | 15px    | 600    | 1           |

### 5.4 按钮

| Type      | Background | Text   | Border        | Radius |
|-----------|-----------|--------|---------------|--------|
| Primary   | #D85A30   | white  | none          | 8px    |
| Secondary | transparent | #D85A30 | 1px #D85A30 | 8px    |
| Ghost     | transparent | #2D2D2D | none        | 8px    |

### 5.5 设计原则

- **温暖活泼**：圆角（8-16px）、暖色调、友好字体
- **移动优先**：所有页面先设计 mobile，再适配 desktop
- **留白充足**：不要拥挤，内容间距用 24px / 32px / 48px
- **图片主导**：产品图片要大要清晰，文字辅助
- **信任优先**：显著位置放置退货政策、安全支付、CE认证标识

---

## 六、多语言 (i18n) 方案

### 路由结构
```
petquirky.com/en/          # 英文（默认）
petquirky.com/de/          # 德文
petquirky.com/fr/          # 法文
petquirky.com/es/          # 西文
```

### 实现方式
使用 Next.js App Router 的 `[locale]` 动态路由 + JSON 翻译文件。

### middleware.ts
```typescript
// 检测用户浏览器语言，自动重定向到对应locale
// 默认 fallback 到 en
import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'de', 'fr', 'es'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 检查路径是否已包含locale
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // 从 Accept-Language header 检测语言
  const acceptLang = request.headers.get('accept-language') || '';
  const detectedLocale = locales.find(locale =>
    acceptLang.toLowerCase().includes(locale)
  ) || defaultLocale;

  return NextResponse.redirect(
    new URL(`/${detectedLocale}${pathname}`, request.url)
  );
}

export const config = {
  matcher: ['/((?!api|_next|images|favicon.ico).*)'],
};
```

### 翻译文件结构（示例）
```json
// src/i18n/en.json
{
  "nav": {
    "home": "Home",
    "products": "Products",
    "about": "About",
    "contact": "Contact",
    "blog": "Blog",
    "cart": "Cart"
  },
  "home": {
    "hero_title": "Smart Gear for Unique Pets",
    "hero_subtitle": "Discover quirky accessories for every companion",
    "hero_cta": "Shop Now",
    "featured_title": "Featured Products",
    "trust_shipping": "Free Shipping over €50",
    "trust_returns": "14-Day Returns",
    "trust_payment": "Secure Payment",
    "trust_certified": "CE Certified"
  },
  "product": {
    "add_to_cart": "Add to Cart",
    "in_stock": "In Stock",
    "low_stock": "Only a few left",
    "out_of_stock": "Out of Stock",
    "specifications": "Specifications",
    "suitable_for": "Suitable for"
  },
  "cart": {
    "title": "Your Cart",
    "empty": "Your cart is empty",
    "subtotal": "Subtotal",
    "shipping": "Shipping",
    "total": "Total",
    "checkout": "Proceed to Checkout",
    "continue": "Continue Shopping"
  },
  "footer": {
    "individual_seller": "Individual seller, not a corporate entity",
    "privacy": "Privacy Policy",
    "returns": "Returns Policy",
    "terms": "Terms of Service"
  }
}
```

---

## 七、PayPal 集成方案

### 环境变量
```env
# .env.local
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret
PAYPAL_MODE=sandbox    # sandbox | live
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_client_id
```

### API 路由：创建订单
```typescript
// src/app/api/paypal/create-order/route.ts
// POST: 接收购物车数据，创建PayPal订单
// 返回 PayPal order ID 给前端
```

### API 路由：捕获支付
```typescript
// src/app/api/paypal/capture-order/route.ts
// POST: 接收 PayPal order ID，确认支付
// 记录订单到本地JSON或发送确认邮件
```

### 前端：PayPal 按钮
```typescript
// 使用 @paypal/react-paypal-js
// 在 checkout 页面渲染 PayPal Smart Payment Buttons
// 支持 PayPal 余额 + 信用卡/借记卡
```

---

## 八、运费规则

```json
// src/data/shipping.json
{
  "zones": [
    {
      "name": "Europe Standard",
      "countries": ["DE", "FR", "ES", "IT", "NL", "BE", "AT", "PT"],
      "rates": [
        { "minWeight": 0, "maxWeight": 500, "cost": 499 },
        { "minWeight": 501, "maxWeight": 1000, "cost": 799 },
        { "minWeight": 1001, "maxWeight": 2000, "cost": 1199 }
      ],
      "freeShippingThreshold": 5000,
      "estimatedDays": "5-10"
    },
    {
      "name": "Europe Express",
      "countries": ["DE", "FR", "ES"],
      "rates": [
        { "minWeight": 0, "maxWeight": 2000, "cost": 1499 }
      ],
      "estimatedDays": "3-5"
    }
  ],
  "defaultCurrency": "EUR"
}
```

备注：cost 单位为欧分，5000 = €50.00 免运费阈值。

---

## 九、SEO 规范

### 每个页面需要
1. `<title>` 和 `<meta name="description">` — 多语言
2. `<link rel="canonical">` — 指向当前语言版本
3. `<link rel="alternate" hreflang="xx">` — 所有语言版本互指
4. Open Graph 标签（og:title, og:description, og:image）
5. Twitter Card 标签

### 产品页额外需要
```json
// JSON-LD Product Schema
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "...",
  "description": "...",
  "image": "...",
  "offers": {
    "@type": "Offer",
    "price": "49.00",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock"
  }
}
```

### 博客文章额外需要
```json
// JSON-LD Article Schema
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "datePublished": "...",
  "author": { "@type": "Organization", "name": "PetQuirky" }
}
```

### robots.txt
```
User-agent: *
Allow: /
Sitemap: https://petquirky.com/sitemap.xml
```

### sitemap.xml
Next.js App Router 可通过 `app/sitemap.ts` 自动生成，需包含：
- 所有语言版本的首页
- 所有产品页（所有语言）
- 所有博客文章（所有语言）
- 法律页面

---

## 十、GDPR 合规清单

### Cookie Banner
- 首次访问显示底部横幅
- 选项："Accept All" / "Necessary Only" / "Manage Preferences"
- 选择结果存入 localStorage
- 只有用户同意后才加载分析脚本（如 Google Analytics）

### 隐私政策页必须包含
- 收集哪些数据（姓名、邮箱、地址、支付信息）
- 数据用途（订单处理、客户支持）
- 第三方数据共享（PayPal、物流商）
- 用户权利（访问、删除、修改数据的权利）
- 联系方式（可回复的邮箱）
- Cookie 使用说明

### 退货政策页必须包含
- 14天无理由退货（欧盟消费者权益指令）
- 退货流程说明
- 退款时间
- 买家承担退货运费

---

## 十一、开发分期计划

### Phase 1（第1-2周）：基础框架
- [ ] `npx create-next-app@latest petquirky --typescript --tailwind --app`
- [ ] 安装依赖：shadcn/ui, @paypal/react-paypal-js
- [ ] 配置 Tailwind 品牌色和字体
- [ ] 实现 [locale] 路由和 i18n 基础设施
- [ ] 创建 Layout（Header + Footer）
- [ ] 创建首页基本区块
- [ ] 部署到 Vercel（连接 GitHub repo, private）

### Phase 2（第3-4周）：产品系统
- [ ] 创建产品数据 JSON 和类型定义
- [ ] 实现产品列表页（筛选 + 排序）
- [ ] 实现产品详情页（图片画廊 + 信息 + Schema）
- [ ] 创建 3-5 个示例产品数据
- [ ] SEO 元数据和 sitemap

### Phase 3（第5-6周）：购物车 + 支付
- [ ] 实现购物车（Context + localStorage）
- [ ] CartDrawer 侧边栏
- [ ] 购物车页面
- [ ] 结账页面（收货表单）
- [ ] PayPal SDK 集成（sandbox 测试）
- [ ] 支付成功页

### Phase 4（第7-8周）：内容 + 完善
- [ ] 博客系统（Markdown 渲染）
- [ ] 撰写 2-3 篇 SEO 博客文章
- [ ] 法律页面内容填充
- [ ] Cookie Banner
- [ ] 域名绑定（petquirky.com → Vercel）
- [ ] PayPal 切换到 live 模式
- [ ] 性能优化（图片优化、Lighthouse 审计）

---

## 十二、环境变量清单

```env
# .env.local（不提交到Git）

# PayPal
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_MODE=sandbox
NEXT_PUBLIC_PAYPAL_CLIENT_ID=

# Site
NEXT_PUBLIC_SITE_URL=https://petquirky.com
NEXT_PUBLIC_CONTACT_EMAIL=hello@petquirky.com

# Analytics（Phase 2，GDPR同意后才加载）
NEXT_PUBLIC_GA_ID=
```

---

## 十三、示例产品数据

```json
// src/data/products/index.json（前3个示例）
[
  {
    "id": "smart-snake-cat-toy",
    "slug": "smart-snake-cat-toy",
    "category": "smart-toys",
    "name": {
      "en": "Smart Interactive Snake Toy",
      "de": "Intelligentes interaktives Schlangenspielzeug",
      "fr": "Jouet serpent interactif intelligent",
      "es": "Juguete serpiente interactivo inteligente"
    },
    "description": {
      "en": "Motion-sensing snake toy that slithers and moves automatically, keeping your cat entertained for hours. USB rechargeable with 2-hour battery life.",
      "de": "Bewegungssensierendes Schlangenspielzeug...",
      "fr": "Jouet serpent à détection de mouvement...",
      "es": "Juguete serpiente con sensor de movimiento..."
    },
    "price": { "amount": 4500, "currency": "EUR" },
    "compareAtPrice": { "amount": 5900, "currency": "EUR" },
    "images": ["/images/products/snake-toy-1.jpg", "/images/products/snake-toy-2.jpg"],
    "badge": "bestseller",
    "stock": "in_stock",
    "weight": 180,
    "specifications": {
      "Material": "ABS + Silicone",
      "Battery": "USB Rechargeable, 600mAh",
      "Play Time": "~2 hours",
      "Charging Time": "~1 hour",
      "Certification": "CE, RoHS"
    },
    "seo": {
      "title": { "en": "Smart Snake Toy for Cats | PetQuirky", "de": "...", "fr": "...", "es": "..." },
      "description": { "en": "Keep your cat entertained with our motion-sensing smart snake toy. USB rechargeable, CE certified. Free shipping over €50.", "de": "...", "fr": "...", "es": "..." }
    },
    "tags": ["cat", "interactive", "smart", "usb", "motion-sensor"],
    "petType": ["cat"],
    "createdAt": "2026-03-23",
    "featured": true
  },
  {
    "id": "puzzle-slow-feeder-set",
    "slug": "puzzle-slow-feeder-set",
    "category": "feeding",
    "name": {
      "en": "Puzzle Slow Feeder & Snuffle Mat Set",
      "de": "Puzzle-Langsam-Futternapf & Schnüffelmatte Set",
      "fr": "Set gamelle puzzle anti-glouton & tapis de fouille",
      "es": "Set comedero puzzle lento y alfombra olfativa"
    },
    "description": {
      "en": "3-piece enrichment feeding set: maze slow feeder bowl + snuffle mat + treat pouch. Helps reduce eating speed by 80% and provides mental stimulation.",
      "de": "...", "fr": "...", "es": "..."
    },
    "price": { "amount": 4900, "currency": "EUR" },
    "images": ["/images/products/feeder-set-1.jpg"],
    "badge": "new",
    "stock": "in_stock",
    "weight": 350,
    "specifications": {
      "Includes": "Slow feeder bowl + Snuffle mat + Treat pouch",
      "Material": "Food-grade silicone + Polyester",
      "Bowl Size": "20cm diameter",
      "Mat Size": "45 x 45cm"
    },
    "seo": {
      "title": { "en": "Slow Feeder & Snuffle Mat Set | PetQuirky", "de": "...", "fr": "...", "es": "..." },
      "description": { "en": "...", "de": "...", "fr": "...", "es": "..." }
    },
    "tags": ["dog", "cat", "feeding", "enrichment", "puzzle"],
    "petType": ["dog", "cat"],
    "createdAt": "2026-03-23",
    "featured": true
  },
  {
    "id": "led-rolling-ball-pet",
    "slug": "led-rolling-ball-pet",
    "category": "smart-toys",
    "name": {
      "en": "LED Smart Rolling Ball",
      "de": "LED Intelligenter Rollball",
      "fr": "Balle roulante LED intelligente",
      "es": "Bola rodante LED inteligente"
    },
    "description": {
      "en": "Self-rolling LED ball with automatic obstacle avoidance. Changes direction when hitting walls. Keeps pets active and curious. USB-C rechargeable.",
      "de": "...", "fr": "...", "es": "..."
    },
    "price": { "amount": 2900, "currency": "EUR" },
    "images": ["/images/products/led-ball-1.jpg"],
    "stock": "in_stock",
    "weight": 120,
    "specifications": {
      "Diameter": "52mm",
      "Battery": "USB-C Rechargeable",
      "Play Time": "~3 hours",
      "Material": "ABS + TPU",
      "Certification": "CE"
    },
    "seo": {
      "title": { "en": "LED Smart Rolling Ball for Pets | PetQuirky", "de": "...", "fr": "...", "es": "..." },
      "description": { "en": "...", "de": "...", "fr": "...", "es": "..." }
    },
    "tags": ["cat", "dog", "interactive", "led", "smart"],
    "petType": ["cat", "dog"],
    "createdAt": "2026-03-23",
    "featured": true
  }
]
```

---

## 十四、Codex 开发注意事项

1. **GitHub 仓库设为 Private** — 不要公开
2. **不要提交 .env.local** — 加入 .gitignore
3. **所有价格用欧分整数** — 避免浮点数精度问题，显示时 / 100
4. **图片优化** — 使用 Next.js `<Image>` 组件，设置合理的 sizes 和 priority
5. **购物车用 localStorage** — 不要用 sessionStorage，用户关闭标签页后购物车要保留
6. **PayPal 先用 sandbox 测试** — 上线前切换到 live
7. **代码注释用英文** — 保持代码一致性
8. **commit message 用英文** — 如 "feat: add product detail page"
9. **Tailwind 配置品牌色** — 在 tailwind.config.ts 中扩展主题
10. **每个 Phase 完成后部署一次** — 确保 Vercel 构建无报错

---

*本文档为 Codex 开发的完整输入，涵盖架构、数据模型、页面规格、设计规范、i18n、支付、SEO 和 GDPR 合规。按 Phase 1-4 分期执行。*
