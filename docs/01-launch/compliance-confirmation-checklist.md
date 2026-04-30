# PetQuirky Compliance Confirmation Checklist

> 当前阶段：个人卖家起步，预上线检查  
> 目标市场：欧洲消费者  
> 目的：把上线前需要人工确认的合规、信任、客服事项拆成可询问、可记录、可执行的清单。  
> 说明：本文不是法律意见，只用于准备律师/顾问/供应商/平台服务方确认。

## 0. 使用方式

每一项确认时记录：

- 确认对象：律师/合规顾问、供应商、PayPal、物流服务方、税务顾问、平台后台资料。
- 结论：可以上线 / 需要改文案 / 暂不支持上线 / 待补材料。
- 证据：邮件、合同、后台截图、供应商文件、政策链接、发票或检测报告。
- 网站动作：需要修改哪个页面、邮件或 FAQ。

建议先完成 P0，再进入真实订单上线。

## 0.1 当前仓库已发现的高风险文案

> 供合规文案角色优先修改。以下内容来自当前代码仓库的政策页、首页、购物车、产品详情和订单邮件文案。  
> 处理原则：先删掉绝对化承诺、免费退货、未确认税费、未确认认证、公司化表达；再补充保守、透明、需要人工确认的说明。

| 位置 | 当前表述 | 风险 | 建议动作 |
|---|---|---|---|
| `src/i18n/en.json` cart.taxes_notice | `Taxes calculated at checkout. Free returns within 14 days for all European customers.` | 如果 checkout 未实际计算 VAT/进口税，可能误导；`Free returns` 与退货运费未确认冲突。 | 改为税费可能适用 + 14 天退货申请，不承诺免费退货。 |
| `src/i18n/en.json` home.trust_desc_payment | `100% encrypted` | 绝对化支付安全承诺；支付由 PayPal 处理，不应暗示 PetQuirky 自己保证支付安全。 | 改为 `Payment is processed securely by PayPal. PetQuirky does not store your PayPal login or card details.` |
| `src/i18n/en.json` home.trust_title_certified / product_detail.certified | `CE Certified` / `CE certified` | 未拿到每个产品的 CE 文件前，不能全站泛称认证。 | 删除全站认证 badge；仅在产品级文件确认后写入对应产品页。 |
| `src/i18n/en.json` home.trust_desc_certified | `Safety guaranteed` | 对宠物用品、电子、电池、玩具等构成过度安全承诺。 | 改为监督使用、安全提示或删除。 |
| `src/data/policies.ts` returns.intro | `strict 14-day returns window` | EU 14 天通常涉及撤回权，且告知不充分时可能延长；`strict` 容易被理解为限制消费者法定权利。 | 改为 `You may request a return within 14 days after delivery...` 并补撤回权说明。 |
| `src/data/policies.ts` returns.shipping | `Standard delivery estimates are 5 to 10 business days.` | 没有说明处理时间、目的地差异、节假日、海关/承运商延误。 | 改为 `Estimated delivery is usually 5-10 business days after order processing...` |
| `src/i18n/en.json` about/account/checkout | `small team`, `our quirky team` | 与个人卖家起步、不包装成公司的定位冲突。 | 改为 `individual seller`, `support`, `your order is being prepared`。 |
| `src/emails/OrderConfirmation.tsx` eta | `Estimated dispatch and delivery: 5-10 business days.` | 把发货和送达混在一起，容易形成总时效承诺。 | 改为 `Estimated delivery is usually 5-10 business days after order processing.` |
| `src/emails/OrderConfirmation.tsx` support | `969939390@qq.com` | 面向欧洲消费者的信任与专业性较弱，也不利于隐私/客服统一管理。 | 上线前换成域名客服邮箱，例如 `support@petquirky.com`。 |
| 产品/列表营销文案 | `Bestseller`, `Top Rated`, `reviews`, `most loved`, `community` | 如果没有真实销售、评价或社区数据支撑，可能构成误导。 | 无证据时删除或改为中性分类，如 `Featured`、`Selected`。 |

### 建议替换文案草案

税费与退货：

```text
Taxes, duties, or import charges may apply depending on your destination and shipping route. You may request a return within 14 days after delivery.
```

支付：

```text
Payment is processed securely by PayPal. PetQuirky does not store your PayPal login or card details.
```

配送：

```text
Estimated delivery is usually 5-10 business days after order processing. Delivery times are estimates and may vary by destination, carrier availability, holidays, or customs checks.
```

个人卖家说明：

```text
PetQuirky is operated by an individual seller, not a company. For order, return, privacy, or product questions, contact us at [support email]. We usually reply within 1-2 business days.
```

产品安全：

```text
Use under supervision and choose the size that matches your pet. Check the product regularly and stop using it if it becomes damaged.
```

## 1. 卖家身份与披露

### 要确认的问题

- 个人持续经营独立站并面向欧盟消费者销售时，是否会被认定为 trader / business seller？
- 网站是否必须展示真实姓名？
- 是否必须展示可送达地址或经营地址？
- 是否必须展示退货地址？
- 是否需要展示 VAT、税务编号、商业登记信息或等效身份信息？
- 是否可以只展示邮箱和联系表单？
- “individual seller, not a corporate entity” 这种表述是否足够清楚？

### 建议询问对象

- 欧盟消费者法/跨境电商律师或合规顾问。
- 税务顾问，尤其是 VAT 和进口税相关事项。

### 未确认前的保守文案

```text
PetQuirky is operated by an individual seller, not a company. For order, return, privacy, or product questions, contact us at [support email]. We usually reply within 1-2 business days.
```

### 上线前动作

- 不使用 company、corporate、studio、our team 等容易公司化的表达。
- footer、About、政策页、订单邮件中保持个人卖家身份一致。
- 准备一个正式客服邮箱，不建议使用个人 QQ 邮箱作为欧洲消费者主联系邮箱。

## 2. 14 天退货与撤回权

### 要确认的问题

- 14 天期限从下单日、付款日还是收货日开始计算？
- 用户是否需要先联系 PetQuirky 才能退货？
- 是否必须提供欧盟撤回权标准表格或等效撤回说明？
- 哪些商品可以例外不退？宠物用品已使用、污染、卫生风险是否可拒绝？
- 退货运费由谁承担？
- 原始配送费是否需要退还？
- 退款必须在几天内完成？
- 退款是收到退货后处理，还是用户提供退货证明后处理？
- 损坏、错发、缺件时是否必须承担退货/补发费用？

### 建议询问对象

- 欧盟消费者法律师或合规顾问。
- 物流服务方，确认实际退货流程和费用。

### 未确认前的保守文案

```text
You may request a return within 14 days after delivery. Items should be unused, clean, and returned in their original condition. Please contact us before sending anything back so we can confirm the return address and next steps.
```

```text
Refunds are issued to the original payment method after the returned item has been received and checked. Original shipping fees and return shipping costs may not be refundable unless the item arrived damaged, defective, or incorrect.
```

### 上线前动作

- 删除或替换 “Free returns within 14 days”。
- 政策页写清退货申请方式、退货条件、退款方式、客服邮箱。
- 订单确认邮件加入 14 天退货入口或说明。

## 3. 配送时效、发货地与物流责任

### 要确认的问题

- 实际发货地在哪里？
- 标准配送时效是否真的能做到 5-10 business days？
- 是否存在处理时间，例如 1-3 business days before dispatch？
- 是否覆盖全部欧盟国家，还是只覆盖部分欧洲国家？
- 偏远地区、节假日、清关、承运商延误如何说明？
- 是否提供 tracking number？
- 包裹丢失、长期未更新、无法投递时如何处理？

### 建议询问对象

- 供应商/CJ Dropshipping。
- 物流服务方。
- PayPal 卖家保护政策资料。

### 未确认前的保守文案

```text
Estimated delivery is usually 5-10 business days after order processing. Delivery times are estimates and may vary by destination, carrier availability, holidays, or customs checks.
```

### 上线前动作

- 把所有 delivery 文案改成 estimated，不写 guaranteed。
- 如果有处理时间，在产品页、退货配送政策、订单邮件中写清。
- FAQ 增加 “When will my order arrive?” 和 “Will I receive tracking?”。

## 4. VAT、税费、关税与进口费用

### 要确认的问题

- 商品价格是否含 VAT？
- 是否需要注册 EU VAT / IOSS？
- 欧盟消费者是否可能被额外收取进口税、关税或清关费？
- checkout 是否需要展示 taxes？
- 当前 PayPal 订单金额是否能正确反映商品、运费和税费？
- 如果费用不含 VAT 或进口费，是否会构成误导？

### 建议询问对象

- 跨境电商税务顾问。
- PayPal 商家支持。
- 供应商/物流服务方。

### 未确认前的保守文案

```text
Taxes, duties, or import charges may apply depending on the destination and shipping route. We are confirming the final checkout wording before accepting live orders.
```

### 上线前动作

- 不要在正式上线时含糊写 “taxes calculated at checkout”，除非 checkout 真的计算并展示。
- 如果税费政策未确认，先不要接真实订单。

## 5. 隐私政策与 GDPR

### 要确认的问题

- 谁是 data controller？是否必须写真实姓名或地址？
- 收集哪些数据：账户、订单、配送地址、支付相关信息、客服消息、Cookie 偏好、设备/浏览数据。
- 每类数据的处理目的和法律依据是什么？
- 数据保存多久？
- 用户如何请求访问、更正、删除、导出、限制处理、反对处理？
- 用户是否可以撤回营销同意？
- 用户如何投诉，是否要写数据保护监管机构？
- PayPal、Supabase、Resend、Vercel 分别作为服务商/处理方如何披露？
- 是否涉及 EU 以外数据传输？需要怎样写 SCC、adequacy 或 DPA？

### 建议询问对象

- GDPR 合规顾问或律师。
- PayPal、Supabase、Resend、Vercel 官方 DPA/隐私资料。

### 未确认前的保守文案方向

隐私政策至少补齐以下模块：

- Who operates PetQuirky and how to contact us.
- What data we collect.
- Why we use the data and legal bases.
- Service providers.
- International transfers.
- Retention periods.
- Your privacy rights.
- Cookies and consent.
- Marketing emails and unsubscribe.
- Complaints.

### 上线前动作

- 不要只保留三段式简版隐私政策。
- 在注册、checkout、footer、订单邮件中确保隐私政策可访问。
- 确认客服邮箱能处理 privacy request。

## 6. Cookie 与追踪工具

### 要确认的问题

- 当前是否已经接入 Google Analytics、Meta Pixel、TikTok Pixel、广告再营销或热力图工具？
- 非必要 Cookie 是否默认关闭？
- 用户点击 Necessary Only 后，分析/营销脚本是否不会加载？
- 用户能否随时修改 Cookie 偏好？
- 是否需要单独 Cookie Policy 表格？
- 每个 Cookie 的名称、提供方、用途、有效期、类别是什么？

### 建议询问对象

- 技术开发工程师。
- GDPR/Cookie 合规顾问。
- 各追踪工具官方文档。

### 未确认前的保守文案

```text
Necessary cookies keep the cart, language selection, checkout, and security features working. Optional analytics or marketing cookies are used only if you choose to allow them.
```

### 上线前动作

- 如果还没有接入分析/营销工具，Cookie 提示可以保留偏好控制，但政策要说明目前使用范围。
- 如果接入追踪工具，必须技术验证拒绝后不加载。

## 7. PayPal 支付信任表达

### 要确认的问题

- PayPal checkout 是否使用正式商家账号？
- 客户付款后账单/PayPal 记录显示什么商家名称？
- 是否可以声明 “processed securely by PayPal”？
- PetQuirky 是否会接触或保存卡号/PayPal 登录信息？
- PayPal 卖家保护、退款、争议流程如何影响客服话术？

### 建议询问对象

- PayPal 商家后台/客服。
- 技术开发工程师。

### 建议文案

```text
Payment is processed securely by PayPal. PetQuirky does not store your PayPal login or card details.
```

### 上线前动作

- 不写 “100% encrypted”。
- 不暗示 PetQuirky 自己处理支付安全。
- checkout、订单确认页、订单邮件保持同一口径。

## 8. 产品安全、认证与供应商文件

### 要确认的问题

- 哪些产品需要 CE、RoHS、食品接触材料、电池、充电器、无线设备或玩具相关认证？
- 每个供应商是否能提供 CE declaration、test report、材质说明、警示语？
- 产品是否适合欧盟销售？
- 产品页面是否需要年龄、宠物类型、尺寸、监督使用等警示？
- 图片和文案是否存在侵权或夸大疗效/安全承诺？

### 建议询问对象

- 供应商。
- 产品合规顾问。
- 选品与供应链分析师。

### 未确认前的保守文案

```text
Use under supervision and choose the size that matches your pet. Check the product regularly and stop using it if it becomes damaged.
```

### 上线前动作

- 删除全站 “CE Certified / Safety guaranteed”。
- 只有拿到对应产品文件时，才在该产品页写认证。
- 给每个产品建立供应商文件夹或记录表。

## 9. 订单确认邮件与后台通知

### 要确认的问题

- 客户订单确认邮件是否包含订单号、金额、商品、收货地址、付款方式、配送估算、客服邮箱、退货入口？
- 邮件是否明确 PayPal 处理付款？
- 邮件是否避免公司化表达？
- 后台通知是否包含发货所需完整信息？
- 如果邮件发送失败，后台是否还有订单记录和人工补救方式？

### 建议询问对象

- 技术开发工程师。
- QA 与上线检查员。
- 合规与客服体验负责人。

### 建议客户邮件补充文案

```text
Your payment was processed by PayPal. Estimated delivery is usually 5-10 business days after order processing. You may request a return within 14 days after delivery. PetQuirky is operated by an individual seller, and support replies usually arrive within 1-2 business days.
```

### 建议后台通知补充字段

- fulfillment status。
- 是否已发货。
- tracking number。
- 客服备注。
- 是否需要人工联系客户。
- 是否已发送客户确认邮件。

## 10. FAQ 与客服话术

### 上线前最小 FAQ

至少准备以下问题：

- Who operates PetQuirky?
- When will my order arrive?
- Will I receive tracking?
- How do I request a return?
- Are returns free?
- What if my item arrives damaged or incorrect?
- How is my payment handled?
- Can I change or cancel an order after payment?
- How can I contact support?
- How long does support take to reply?

### 客服基础话术

退货申请：

```text
Thanks for contacting PetQuirky. Please send your order number, the item you want to return, and the reason for the return. We will confirm the return address and next steps before you send the item back.
```

物流咨询：

```text
Thanks for your message. Please send your order number and the email used at checkout. We will check the latest shipping status and reply within 1-2 business days.
```

损坏/错发：

```text
I'm sorry the item did not arrive as expected. Please send your order number, a short description of the issue, and clear photos of the item and packaging. We will review it and help with the next step.
```

身份说明：

```text
PetQuirky is operated by an individual seller, not a company. This helps us keep support direct, but it also means replies are handled during business days.
```

## 11. 上线前 P0 确认表

| 项目 | 负责人 | 状态 | 证据/链接 | 网站动作 |
|---|---|---|---|---|
| 个人卖家身份披露是否足够 | 人工法律确认 | 待确认 |  |  |
| 是否必须公开真实姓名/地址 | 人工法律确认 | 待确认 |  |  |
| 14 天退货细则 | 人工法律确认 | 待确认 |  |  |
| 退货运费谁承担 | 人工法律确认 | 待确认 |  |  |
| VAT/进口税/关税说明 | 税务顾问 | 待确认 |  |  |
| 隐私政策 GDPR 模块 | 人工法律确认 | 待确认 |  |  |
| PayPal 正式商家显示名称 | PayPal/技术 | 待确认 |  |  |
| 供应商产品认证材料 | 供应商/选品 | 待确认 |  |  |
| 配送时效真实性 | 供应商/物流 | 待确认 |  |  |
| Cookie 拒绝后不加载追踪 | 技术/QA | 待确认 |  |  |
| 订单确认邮件合规文案 | 技术/客服 | 待确认 |  |  |
| FAQ 最小集合 | 客服体验 | 待确认 |  |  |

## 12. 给律师或合规顾问的一次性咨询问题

```text
I am preparing to launch PetQuirky, a small online pet product store targeting European consumers. It is operated by me as an individual seller, not a company.

Please help confirm:
1. What seller identity information must be displayed before accepting orders?
2. Do I need to show my real name, physical address, VAT number, or business registration details?
3. How should I phrase the 14-day return/right of withdrawal policy?
4. Who pays return shipping by default, and when must refunds be issued?
5. What must be included in the privacy policy for PayPal, Supabase, Resend, and Vercel?
6. What should I disclose about cookies, analytics, and marketing tracking?
7. Can I avoid CE/safety claims unless suppliers provide product-specific documents?
8. What tax, VAT, duty, or import-charge information must be shown before checkout?
9. What order confirmation information must customers receive by email?
10. Is the wording "operated by an individual seller, not a company" clear and compliant for EU consumers?
```

## 13. 给供应商的确认问题

```text
Please confirm the following for each product:
1. Shipping origin and average delivery time to EU countries.
2. Whether tracking is provided.
3. Return address and return process.
4. Product materials and safety warnings.
5. CE declaration or other applicable compliance documents.
6. Test reports, if available.
7. Whether product images and descriptions can be used on PetQuirky.
8. Whether the product is suitable for sale to EU consumers.
```

## 14. 给 PayPal 的确认问题

```text
Please confirm:
1. What business/seller name buyers will see during checkout and in PayPal receipts.
2. Whether PayPal processes the payment securely and PetQuirky does not store card or PayPal login details.
3. What refund flow should be used for customer returns.
4. What information should be included in order records for seller protection.
5. Whether any wording is recommended or prohibited when describing PayPal checkout.
```
