# Design System: High-End Editorial for PetQuirky

## 1. Overview & Creative North Star
**Creative North Star: "The Curated Tactile Nest"**

This design system rejects the "SaaS-ification" of pet commerce. We are moving away from rigid, boxed-in layouts toward a digital experience that feels like a premium lifestyle magazine. The "Curated Tactile Nest" approach uses organic, rounded forms and a sophisticated "layered" depth to evoke the warmth of a home. We break the template by using **intentional asymmetry**—large, high-quality product imagery that bleeds off-center, paired with over-scaled, playful typography. This creates a sense of personality and "quirk" while maintaining the elite status of a European boutique.

---

## 2. Colors & Surface Logic

Our palette moves beyond flat fills. We use the "Coral-to-Clay" spectrum to create warmth and a sense of "Human-Touch" trust.

### Color Tokens
*   **Primary (Warm Coral):** `#a5360d` (Used for key brand moments and high-impact CTAs).
*   **Primary Container:** `#c74d24` (A softer coral for secondary interaction zones).
*   **Surface:** `#fcf9f8` (Our clean, warm canvas).
*   **Secondary (Earthy Terracotta):** `#9f4122` (For sophisticated accents).
*   **Tertiary (Eucalyptus Green):** `#00694c` (Used for 'Success' and eco-friendly indicators).

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined solely through background color shifts. To separate a product grid from a hero section, transition from `surface` to `surface-container-low`.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine paper. 
*   **Level 0 (The Floor):** `surface` (#fcf9f8).
*   **Level 1 (The Room):** `surface-container-low` (#f6f3f2).
*   **Level 2 (The Object):** `surface-container-highest` (#e4e2e1) for interactive cards.
By nesting a `surface-container-lowest` card inside a `surface-container-low` section, you create natural, soft-edged focus without a single line.

### The "Glass & Gradient" Rule
For floating elements like "Quick Add" buttons or navigation bars, use **Glassmorphism**. Apply a semi-transparent `surface` color with a `backdrop-blur` of 20px. 
*   **Signature Textures:** Use subtle linear gradients from `primary` to `primary-container` on primary CTAs to give them a 3D, "touchable" quality.

---

## 3. Typography: Editorial Authority

We pair the friendly, rounded character of **Baloo 2** with the legible, modern geometric style of **Plus Jakarta Sans**.

*   **Display (Baloo 2, 700-800):** Used for "Brand Moments." Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) to create a bold, playful impact.
*   **Headline (Baloo 2, 700):** For section titles. The rounded terminals convey "warmth" and "inclusivity."
*   **Body (Plus Jakarta Sans, 400-600):** Our workhorse. `body-lg` (1rem) is the standard for product descriptions. It balances the "quirk" of the headings with a sophisticated, European editorial feel.
*   **Label (Plus Jakarta Sans, 700, All Caps):** Use `label-md` for small metadata like "NEW ARRIVAL" or "EUR (€)".

---

## 4. Elevation & Depth: Tonal Layering

Shadows and borders are secondary to color-blocking. We achieve depth through the **Layering Principle**.

*   **Ambient Shadows:** If an element must float (e.g., a modal), use a diffused shadow: `box-shadow: 0 20px 40px rgba(165, 54, 13, 0.06)`. Note the tint—we use a fraction of the Primary color in the shadow to make it feel like natural light reflecting off the coral accents.
*   **The "Ghost Border" Fallback:** If accessibility requires a border (e.g., in high-contrast modes), use the `outline-variant` token at **15% opacity**. Never use a 100% opaque border.
*   **The Soft Edge:** All main containers must use the `lg` (2rem) radius. This mimics the "rounded" nature of Baloo 2 and creates a safe, friendly environment for pet owners.

---

## 5. Components

### Buttons
*   **Primary:** Rounded (8px), gradient-filled (`primary` to `primary-container`), white text. 
*   **Secondary:** No background, `outline-variant` (ghost border), coral text.
*   **Motion:** On hover, buttons should scale slightly (1.02x) rather than just changing color.

### Cards & Lists
*   **The "No-Divider" Rule:** In lists, do not use lines. Use `1.2rem` (spacing-3.5) of vertical whitespace to separate items.
*   **Editorial Cards:** Product images should occupy 60% of the card area. Use `surface-container-lowest` for the card background against a `surface-container-low` page background.

### Input Fields
*   **Style:** Minimalist. No bottom line. Use a `surface-container-highest` fill with a `md` (1.5rem) radius to make the inputs feel like soft "pillows" for text.

### Contextual Components
*   **The "Heritage" Footer:** Use `surface-dim` for the background. The text "Individual seller, not a corporate entity" must be styled in `body-sm` with an opacity of 0.7, emphasizing transparency and trust.

---

## 6. Do's and Don'ts

### Do:
*   **Embrace Whitespace:** If it feels like "too much" space, add a little more. High-end brands breathe.
*   **Use Asymmetry:** Place a product image so it slightly overlaps the edge of a container or sits off-center from the text.
*   **Localize Currencies:** Ensure "€" always follows the price for the European market (e.g., 45,00 €).

### Don't:
*   **No Black:** Never use #000000. Use `on-surface` (#1b1c1c) for text to maintain a soft, premium feel.
*   **No Hard Edges:** Avoid 0px or 4px radiuses. They feel "corporate" and "sharp," which contradicts the "warm and playful" tone.
*   **No Generic Icons:** Use thick-stroke, rounded-end icons that match the weight of Baloo 2.

### Accessibility Note:
While we use soft tonal shifts, ensure the contrast between `on-surface` text and `surface` backgrounds always meets WCAG AA standards. The "Ghost Border" should be used where color shifts are too subtle for low-vision users.