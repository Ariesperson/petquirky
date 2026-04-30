# PetQuirky 联调记录

项目：`PetQuirky`  
日期：`____-__-__`  
执行人：`________`  
环境：`Local / Preview / Production`  
分支/版本：`________`

## 1. 环境变量

- [ ] `NEXT_PUBLIC_SITE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
- [ ] `PAYPAL_CLIENT_ID`
- [ ] `PAYPAL_CLIENT_SECRET`
- [ ] `PAYPAL_ENV`
- [ ] `RESEND_API_KEY`
- [ ] `RESEND_FROM_EMAIL`
- [ ] `SELLER_EMAIL`

记录：

- 缺失项：
- 备注：

## 2. 数据库迁移

执行命令：

```bash
supabase db push
```

检查项：

- [ ] `public.orders` 表存在
- [ ] `public.orders.items` 字段存在
- [ ] `shipping_address` 字段存在
- [ ] RLS 已开启
- [ ] 用户仅能访问自己的订单

记录：

- 执行结果：
- 异常信息：
- 备注：

## 3. Supabase Auth

检查项：

- [ ] Email/Password 登录开启
- [ ] SMTP 已切到 Resend
- [ ] 注册邮件可发送
- [ ] 重置密码邮件可发送

记录：

- Dashboard 配置情况：
- 邮件测试结果：
- 备注：

## 4. 本地构建验证

执行命令：

```bash
npm run lint
npm run build
npm run dev
```

检查项：

- [ ] `lint` 通过
- [ ] `build` 通过
- [ ] 本地站点可访问

记录：

- lint 结果：
- build 结果：
- 本地地址：
- 备注：

## 5. 页面与路由

检查页面：

- [ ] `/en`
- [ ] `/de`
- [ ] `/fr`
- [ ] `/es`
- [ ] `/[locale]/products`
- [ ] `/[locale]/products/[slug]`
- [ ] `/[locale]/blog`
- [ ] `/[locale]/blog/[slug]`
- [ ] `/[locale]/policies/privacy`
- [ ] `/[locale]/policies/terms`
- [ ] `/[locale]/policies/returns`
- [ ] `/[locale]/about`
- [ ] `/[locale]/contact`
- [ ] 不存在路径触发 404

记录：

- 正常页面：
- 异常页面：
- 截图/说明：

## 6. SEO

检查项：

- [ ] `/robots.txt` 正常
- [ ] `/sitemap.xml` 正常
- [ ] sitemap 包含 locale 页面
- [ ] sitemap 包含产品页
- [ ] sitemap 包含博客页
- [ ] sitemap 包含政策页

记录：

- robots 结果：
- sitemap 结果：
- 备注：

## 7. 认证流程

测试项：

- [ ] 注册
- [ ] 登录
- [ ] 忘记密码
- [ ] 重置密码
- [ ] 退出登录
- [ ] 账户页显示当前用户

记录：

- 注册邮箱：
- 登录结果：
- 重置密码结果：
- 备注：

## 8. 购物车与结账

测试项：

- [ ] 商品可加入购物车
- [ ] cart drawer 正常
- [ ] `/[locale]/cart` 正常
- [ ] checkout 收货信息可填写
- [ ] subtotal 正确
- [ ] shipping 正确
- [ ] total 正确
- [ ] 满 `50 €` 免运费正确

记录：

- 测试商品：
- 金额校验：
- 备注：

## 9. PayPal Sandbox

测试项：

- [ ] PayPal 按钮可见
- [ ] create order 成功
- [ ] capture order 成功
- [ ] 成功页跳转正常
- [ ] 支付后购物车清空

记录：

- Sandbox 买家账号：
- PayPal 订单号：
- 支付结果：
- 备注：

## 10. 订单持久化

测试项：

- [ ] `orders` 表新增记录
- [ ] `items` 写入成功
- [ ] `shipping_address` 写入成功
- [ ] `payer_email` 写入成功
- [ ] `/[locale]/account` 可见订单
- [ ] `/[locale]/account/orders/[id]` 可见详情

记录：

- Supabase 记录 ID：
- 订单状态：
- 页面显示情况：
- 备注：

## 11. 邮件通知

测试项：

- [ ] 客户确认邮件收到
- [ ] 卖家通知邮件收到
- [ ] 客户邮件内容正确
- [ ] 卖家邮件内容正确

记录：

- 客户邮箱：
- 卖家邮箱：
- 邮件主题：
- 内容校验：
- 备注：

## 12. 上线切换前检查

测试项：

- [ ] PayPal 仍为 sandbox
- [ ] 生产环境变量已准备
- [ ] Resend 发件域已验证
- [ ] `NEXT_PUBLIC_SITE_URL` 正确
- [ ] Vercel 环境变量待同步

记录：

- 当前模式：
- 待切换项：
- 备注：

## 最终结论

- [ ] 可进入预发布
- [ ] 可进入生产
- [ ] 有阻塞问题

阻塞问题：

1. 
2. 
3. 

建议动作：

1. 
2. 
3. 
