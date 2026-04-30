# INSTRUCTIONS.md — Codex 开发执行指令

> 本文件是给 Codex 的直接执行指令，配合 PetQuirky-Architecture.md 一起使用。
> Architecture 文档包含完整的数据模型、页面规格和设计规范，本文件是精简的任务清单。

---

## 项目初始化

```bash
npx create-next-app@latest petquirky --typescript --tailwind --app --src-dir --import-alias "@/*"
cd petquirky
npx shadcn@latest init
npm install @paypal/react-paypal-js
```

## Tailwind 配置

在 `tailwind.config.ts` 中扩展以下品牌配置：

```typescript
theme: {
  extend: {
    colors: {
      primary: { DEFAULT: '#D85A30', light: '#FF8A65', tint: '#FFF0EB' },
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
}
```

在 `src/app/globals.css` 顶部添加 Google Fonts import：
```css
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Quicksand:wght@400;500;600;700&display=swap');
```

## 开发顺序

严格按以下顺序执行，每完成一步确保无构建错误。

### Step 1: 项目骨架
1. 创建 `src/app/[locale]/layout.tsx` — 带语言参数的根布局
2. 创建 `src/app/middleware.ts` — 语言检测和重定向
3. 创建 `src/i18n/en.json` — 英文翻译（其他语言后续补充）
4. 创建 `src/lib/i18n.ts` — 读取翻译的工具函数
5. 创建 `src/types/product.ts` — 类型定义（参照Architecture文档）

### Step 2: 布局组件
1. `src/components/layout/Header.tsx` — Logo + 导航 + 语言切换 + 购物车图标
2. `src/components/layout/Footer.tsx` — 链接 + 社交 + 法律声明
3. `src/components/layout/MobileMenu.tsx` — 移动端汉堡菜单
4. `src/components/layout/CookieBanner.tsx` — GDPR Cookie 横幅

### Step 3: 首页
1. `src/components/home/HeroBanner.tsx` — 全宽横幅 + CTA
2. `src/components/home/CategoryShowcase.tsx` — 品类卡片
3. `src/components/home/FeaturedProducts.tsx` — 精选产品网格
4. `src/components/home/TrustBadges.tsx` — 信任标识
5. `src/app/[locale]/page.tsx` — 组装首页

### Step 4: 产品系统
1. 创建 `src/data/products/index.json` — 示例产品数据
2. `src/lib/products.ts` — 产品数据读取和筛选函数
3. `src/components/product/ProductCard.tsx`
4. `src/app/[locale]/products/page.tsx` — 产品列表
5. `src/components/product/ProductGallery.tsx`
6. `src/components/product/ProductInfo.tsx`
7. `src/app/[locale]/products/[slug]/page.tsx` — 产品详情

### Step 5: 购物车
1. `src/types/cart.ts` — 购物车类型
2. `src/context/CartContext.tsx` — 购物车 Context Provider
3. `src/hooks/useCart.ts` — 购物车操作 Hook
4. `src/components/cart/CartDrawer.tsx` — 侧边购物车
5. `src/components/cart/CartItem.tsx`
6. `src/components/cart/CartSummary.tsx`
7. `src/app/[locale]/cart/page.tsx`

### Step 6: 结账 + PayPal
1. `src/lib/paypal.ts` — PayPal 工具函数
2. `src/app/api/paypal/create-order/route.ts`
3. `src/app/api/paypal/capture-order/route.ts`
4. `src/components/checkout/ShippingForm.tsx`
5. `src/components/checkout/PayPalButton.tsx`
6. `src/components/checkout/OrderSummary.tsx`
7. `src/app/[locale]/checkout/page.tsx`
8. `src/app/[locale]/checkout/success/page.tsx`

### Step 7: 内容页面
1. `src/app/[locale]/about/page.tsx`
2. `src/app/[locale]/contact/page.tsx`
3. `src/app/[locale]/policies/privacy/page.tsx`
4. `src/app/[locale]/policies/returns/page.tsx`
5. `src/app/[locale]/policies/terms/page.tsx`

### Step 8: 博客 + SEO
1. `src/data/blog/` — Markdown 博客文章
2. `src/app/[locale]/blog/page.tsx`
3. `src/app/[locale]/blog/[slug]/page.tsx`
4. `src/app/sitemap.ts` — 自动生成 sitemap
5. 每个页面添加 JSON-LD 结构化数据

## 设计要求

- 字体：标题用 Baloo 2 (700/800)，正文用 Quicksand (400/600)
- 主色：#D85A30（暖珊瑚），用于按钮、链接、Logo中的"Quirky"
- 圆角：按钮和卡片统一 8px，大卡片 16px
- 移动优先：所有组件先写移动端样式
- 产品卡片：图片占比大，白色背景，轻阴影，hover 时微上移
- 暗色模式：Phase 1 不需要，保持浅色主题

## 关键约束

- 价格全部用欧分整数存储和计算，显示时除以 100
- 购物车存 localStorage，key 为 "petquirky-cart"
- 不要安装不必要的依赖，保持 bundle 精简
- 图片全部用 Next.js Image 组件
- 所有面向用户的文字都要通过 i18n，不要硬编码
- PayPal 按钮使用 @paypal/react-paypal-js 的 PayPalButtons 组件
