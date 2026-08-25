# DG Site Kit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up `dg-site-kit`, a clonable Astro template repo that harvests the proven EduLayout build from client #1 (`the-future-language-centre-website`) into reusable, generalized components/theme/schema, plus bare skeletons for three not-yet-proven segments (Landing/FnB/Retail).

**Architecture:** Single Astro 7 + Tailwind 4 project (no monorepo, no shared npm package). `EduLayout` and its 7 section components are copied from client #1 and generalized (client-specific hardcoding removed, comments genericized). `LandingLayout`/`FnBLayout`/`RetailLayout` are intentionally-bare skeletons with TODO markers — they have no real client behind them yet, per Rule-of-Three. Content is data-driven via a Zod-validated collection (`src/content.config.ts`) + one example JSON client (`_example-edu.json`) whose every value is `[MOCK: ...]`-prefixed and whose images are hand-authored placeholder SVGs — never copies of client #1's real photos (several of which are identifiable minors, per that repo's own README warnings).

**Tech Stack:** Astro 7, Tailwind CSS 4 (via `@tailwindcss/vite`), TypeScript (astro/tsconfigs/strict), Zod (via `astro:content`), self-hosted fonts (Playfair Display, Be Vietnam Pro). No new dependencies beyond what client #1 already uses.

**Spec:** `docs/superpowers/specs/2026-08-25-dg-site-kit-design.md`

## Global Constraints

- No new npm dependencies — only `@astrojs/check`, `@tailwindcss/vite`, `astro`, `tailwindcss`, `typescript` (same as client #1's `package.json`).
- Zero client-side JS: no `client:*` directives anywhere. Interactivity (mobile menu, testimonial carousel) stays pure CSS/`<details>`/radio-input, matching client #1's approach.
- Any placeholder content value must be wrapped `"[MOCK: ...]"` per the DG mock-content convention; no fabricated realistic-looking phone/address/price data.
- No image asset from `the-future-language-centre-website/src/assets/` may be copied into this repo — those are the real client's photos (some of identifiable minors). All example images are hand-authored placeholder SVGs.
- Git: local commits only in this repo, no remote/push.
- Do not modify anything inside `the-future-language-centre-website` — read-only source for this plan.

---

### Task 1: Repo scaffold & install

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`

**Interfaces:**
- Consumes: nothing (first task).
- Produces: an installable Astro project (`npm install` creates `node_modules/`, `npx astro` resolves) that every later task builds on top of.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "dg-site-kit",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "@astrojs/check": "^0.9.10",
    "@tailwindcss/vite": "^4.3.3",
    "astro": "^7.2.4",
    "tailwindcss": "^4.3.3",
    "typescript": "^6.0.3"
  }
}
```

- [ ] **Step 2: Create `astro.config.mjs`**

```javascript
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://example.dg-site-kit.workers.dev', // placeholder — mỗi client thật sẽ đổi khi clone kit này
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*.astro", "**/*.ts"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Create `.gitignore`**

```
node_modules/
dist/
.astro/
.env
.DS_Store
dev.log
preview.log

# Wrangler
.wrangler/
```

- [ ] **Step 5: Install dependencies**

Run: `npm install`
Expected: exits 0, creates `node_modules/` and `package-lock.json`.

- [ ] **Step 6: Sanity-check the Astro CLI resolves**

Run: `npx astro --version`
Expected: prints an Astro version string (e.g. `astro v7.x.x`), no error.

- [ ] **Step 7: Commit**

```bash
git add package.json astro.config.mjs tsconfig.json .gitignore package-lock.json
git commit -m "chore: scaffold dg-site-kit Astro project"
```

---

### Task 2: Global styles, fonts, themes, favicon

**Files:**
- Copy: `the-future-language-centre-website/public/fonts/*.woff2` → `dg-site-kit/public/fonts/`
- Create: `public/favicon.svg`
- Copy: `the-future-language-centre-website/src/styles/fonts.css` → `src/styles/fonts.css` (verbatim, generated file)
- Create: `src/styles/global.css` (adapted — imports `theme-teal.css` by default, genericized font-choice comment)
- Create: `src/styles/themes/theme-teal.css` (completed with tokens components actually reference — gold/paper/ink-400 — as the kit's working default)
- Create: `src/styles/themes/theme-example.css` (genericized copy of client #1's navy/gold theme, as a worked example of a custom theme)

**Interfaces:**
- Consumes: nothing yet (no components reference these until Task 5+).
- Produces: CSS custom properties `--color-brand-{50..950}`, `--color-gold-{300,400,600}`, `--color-paper`, `--color-paper-line`, `--color-ink-{400,500,700,900}`, `--font-display`, `--font-sans`, and utilities `.eyebrow`, `.rise-in`, `.lift`/`.lift-line`/`.lift-zoom`, `.reveal`/`.reveal-curtain`/`.stagger`, `.read-progress` — all consumed by EduLayout and the section components in later tasks.

- [ ] **Step 1: Copy font files**

Run:
```bash
mkdir -p public/fonts
cp "../the-future-language-centre-website/public/fonts/"*.woff2 public/fonts/
```
Expected: 12 `.woff2` files now in `public/fonts/`.

- [ ] **Step 2: Create `public/favicon.svg`**

A generic placeholder mark (dg-teal square + neutral circle — deliberately not any specific client's logo mark):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#0d9488" />
  <circle cx="32" cy="32" r="14" fill="#ffffff" />
</svg>
```

- [ ] **Step 3: Copy `src/styles/fonts.css` verbatim**

Run:
```bash
mkdir -p src/styles/themes
cp "../the-future-language-centre-website/src/styles/fonts.css" src/styles/fonts.css
```
Expected: file copied unchanged (self-hosted `@font-face` rules for Playfair Display 700 + Be Vietnam Pro 400/600/700, latin/latin-ext/vietnamese subsets).

- [ ] **Step 4: Create `src/styles/themes/theme-teal.css`**

```css
/*
 * Theme mặc định DG — dg-teal #0d9488.
 * Đây là theme dùng khi client mới chưa có bộ màu riêng.
 * Đổi khách có brand màu riêng: copy file này thành theme-<khach>.css,
 * đổi giá trị token (giữ nguyên TÊN token), rồi sửa dòng @import trong
 * src/styles/global.css sang file mới. KHÔNG sửa component — mọi section
 * chỉ tham chiếu TÊN token (--color-brand-*, --color-gold-*, --color-paper*,
 * --color-ink-*), không tham chiếu giá trị cụ thể.
 */
@theme {
  --color-brand-50: #f0fdfa;
  --color-brand-100: #ccfbf1;
  --color-brand-200: #99f6e4;
  --color-brand-300: #5eead4;
  --color-brand-400: #2dd4bf;
  --color-brand-500: #14b8a6;
  --color-brand-600: #0d9488; /* dg-teal */
  --color-brand-700: #0f766e;
  --color-brand-800: #115e59;
  --color-brand-900: #134e4a;
  --color-brand-950: #042f2e;

  /* Nhấn phụ — cùng vai trò với "gold" trong theme-example.css: badge nổi bật, CTA phụ. */
  --color-gold-300: #fcd34d;
  --color-gold-400: #fbbf24;
  --color-gold-600: #d97706;

  /* Nền sáng cho các section xen kẽ với nền trắng */
  --color-paper: #f6f9f8;
  --color-paper-line: #dfe7e5;

  /* Chữ */
  --color-ink-400: #94a3b8;
  --color-ink-500: #64748b;
  --color-ink-700: #334155;
  --color-ink-900: #0f172a;
}
```

- [ ] **Step 5: Create `src/styles/themes/theme-example.css`**

```css
/*
 * Ví dụ theme tùy biến — minh họa cách tạo theme riêng khi khách có bộ màu
 * thương hiệu cụ thể (ví dụ: lấy màu từ banner/logo khách cung cấp).
 * Copy file này (hoặc theme-teal.css) thành theme-<khach>.css, đổi giá trị
 * token, rồi sửa dòng @import trong src/styles/global.css. KHÔNG sửa component.
 *
 * Bộ màu dưới đây là ví dụ thật lấy từ một dự án đã triển khai (navy + gold
 * đầy đủ) — giữ lại để minh họa một theme hoàn chỉnh khác với mặc định.
 */
@theme {
  --color-brand-50: #eef2ff;
  --color-brand-100: #dee6fe;
  --color-brand-200: #c2d0fc;
  --color-brand-300: #97b0f9;
  --color-brand-400: #6486f4;
  --color-brand-500: #3a5ce9;
  --color-brand-600: #0134a3;
  --color-brand-700: #01288f;
  --color-brand-800: #011d7b;
  --color-brand-900: #001762;
  --color-brand-950: #000d3d;

  --color-gold-50: #fffbeb;
  --color-gold-100: #fff5c9;
  --color-gold-200: #fee98d;
  --color-gold-300: #fedd51;
  --color-gold-400: #fdd41c;
  --color-gold-500: #eabb00;
  --color-gold-600: #c29200;
  --color-gold-700: #916a00;

  --color-paper: #f4f6f9;
  --color-paper-line: #dfe4ec;

  --color-ink-400: #94a3b8;
  --color-ink-500: #64748b;
  --color-ink-700: #334155;
  --color-ink-900: #0f172a;
}
```

- [ ] **Step 6: Create `src/styles/global.css`**

```css
@import 'tailwindcss';
@import './fonts.css';
@import './themes/theme-teal.css';

@theme {
  /* Playfair Display: serif tương phản cao, hợp các thương hiệu giáo dục cần
     sự trang trọng. Dùng RẤT tiết chế: chỉ tiêu đề và trích dẫn. */
  --font-display: 'Playfair Display', Georgia, 'Times New Roman', serif;

  /* Be Vietnam Pro: bộ chữ thiết kế riêng cho tiếng Việt. Dấu thanh đặt cân,
     không bị đè lên chữ hoa như phần lớn font Latin — quan trọng cho trang
     tiếng Việt. */
  --font-sans: 'Be Vietnam Pro', system-ui, -apple-system, 'Segoe UI', sans-serif;
}

/*
 * Nhãn nhỏ chữ hoa giãn rộng, đặt bằng font serif — dùng cho mọi eyebrow label
 * trên trang để nhận diện thương hiệu chạy xuyên suốt.
 */
@utility eyebrow {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.6875rem;
  line-height: 1;
  letter-spacing: 0.32em;
  text-transform: uppercase;
}

/* Cuộn mượt cho anchor menu — tắt khi người dùng bật giảm chuyển động */
html {
  scroll-behavior: smooth;
  scroll-padding-top: 5rem;
}

body {
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* Tiêu đề serif cần siết chữ lại, mặc định của Playfair hơi rộng ở cỡ lớn */
.font-display {
  letter-spacing: -0.015em;
}

/* Focus bàn phím luôn nhìn thấy được (yêu cầu bắt buộc trong sàn chất lượng).
   Vòng kép: gold nổi trên nền brand đậm, viền brand bao ngoài nổi trên nền trắng.
   Nhờ vậy dùng chung một quy tắc cho mọi section, không cần biến thể riêng. */
:focus-visible {
  outline: 3px solid var(--color-gold-400);
  outline-offset: 2px;
  border-radius: 4px;
  box-shadow: 0 0 0 6px rgb(0 23 98 / 0.55);
}

/* Mở màn: các dòng ở hero hiện lên theo thứ tự đọc.
   Chỉ dùng CSS, không JS — và tắt hoàn toàn khi người dùng giảm chuyển động. */
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(1.1rem);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@utility rise-in {
  animation: rise 1.1s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}

/* ---------------------------------------------------------------------------
 * Làm nổi phần tử khi rê chuột.
 *
 * Cách dùng — đặt class lên phần tử bao ngoài:
 *   .lift        khối được nâng lên khi rê chuột
 *   .lift-line   nét kẻ bên trong khối, sẽ đổi sang màu gold  (tuỳ chọn)
 *   .lift-zoom   khung bao ảnh, ảnh bên trong sẽ phóng nhẹ    (tuỳ chọn)
 * ------------------------------------------------------------------------- */
.lift {
  transition:
    transform 0.9s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.9s ease;
}

.lift:hover,
.lift:focus-within {
  transform: translateY(-6px);
  border-color: var(--color-gold-400);
}

.lift-line {
  transition: border-color 0.4s ease;
}
.lift:hover .lift-line,
.lift:focus-within .lift-line {
  border-color: var(--color-gold-400);
}

.lift-zoom {
  overflow: hidden;
}
.lift-zoom img {
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.lift:hover .lift-zoom img,
.lift:focus-within .lift-zoom img {
  transform: scale(1.06);
}

/* ---------------------------------------------------------------------------
 * Hiệu ứng theo cuộn — CSS scroll-driven animations, KHÔNG dùng JS.
 * Hai lớp bảo vệ, bắt buộc phải có:
 *   1. @supports — trình duyệt không hỗ trợ thì nội dung hiện bình thường.
 *   2. prefers-reduced-motion: no-preference — người bật giảm chuyển động không thấy gì cả.
 * ------------------------------------------------------------------------- */

@keyframes reveal-up {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes curtain-up {
  from {
    clip-path: inset(100% 0 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}

@keyframes read-progress {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

.read-progress {
  position: fixed;
  inset-block-start: 0;
  inset-inline: 0;
  z-index: 50;
  height: 3px;
  transform: scaleX(0);
  transform-origin: 0 50%;
  background: var(--color-gold-400);
  pointer-events: none;
}

@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .reveal {
      animation: reveal-up linear both;
    }
    [class~='reveal'] {
      animation-timeline: view();
      animation-range: entry 0% entry 100%;
    }

    .reveal-curtain {
      animation: curtain-up linear both;
    }
    [class~='reveal-curtain'] {
      animation-timeline: view();
      animation-range: entry 0% entry 100%;
    }

    .stagger > * {
      animation: reveal-up linear both;
    }
    [class~='stagger'] > * {
      animation-timeline: view();
    }
    .stagger > *:nth-child(1) {
      animation-range: entry 0% entry 80%;
    }
    .stagger > *:nth-child(2) {
      animation-range: entry 10% entry 90%;
    }
    .stagger > *:nth-child(3) {
      animation-range: entry 20% entry 100%;
    }
    .stagger > *:nth-child(4) {
      animation-range: entry 30% entry 110%;
    }
    .stagger > *:nth-child(5) {
      animation-range: entry 40% entry 120%;
    }
    .stagger > *:nth-child(6) {
      animation-range: entry 50% entry 130%;
    }
    .stagger > *:nth-child(7) {
      animation-range: entry 60% entry 140%;
    }
    .stagger > *:nth-child(n + 8) {
      animation-range: entry 70% entry 150%;
    }
  }

  @supports (animation-timeline: scroll()) {
    .read-progress {
      animation: read-progress linear;
    }
    [class~='read-progress'] {
      animation-timeline: scroll(root block);
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
  .read-progress {
    display: none;
  }
}
```

- [ ] **Step 7: Commit**

```bash
git add public/fonts public/favicon.svg src/styles
git commit -m "feat: add global styles, fonts, and default/example themes"
```

---

### Task 3: Icon UI component

**Files:**
- Create: `src/components/ui/Icon.astro` (verbatim copy — pure icon set, no client-specific content)

**Interfaces:**
- Consumes: nothing.
- Produces: `Icon` component with `Props.name: 'users' | 'route' | 'chart' | 'badge' | 'calendar' | 'shield' | 'phone' | 'chat' | 'pin' | 'clock' | 'mail' | 'check'` and `Props.class?: string` — consumed by `EduLayout`, `WhyUs`, `ContactBlock` in later tasks.

- [ ] **Step 1: Create `src/components/ui/Icon.astro`**

```astro
---
/* Bộ icon inline, chỉ đúng những icon đang dùng. Không kéo cả icon library. */
interface Props {
  name: 'users' | 'route' | 'chart' | 'badge' | 'calendar' | 'shield' | 'phone' | 'chat' | 'pin' | 'clock' | 'mail' | 'check';
  class?: string;
}

const { name, class: className = 'size-6' } = Astro.props;

const paths: Record<Props['name'], string> = {
  users: 'M18 18.7a3 3 0 0 0-6 0M15 12.7a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8M8.4 18.7a3 3 0 0 0-5.4-1.8M6.6 12.7a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8',
  route: 'M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4M18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4M8 17h6a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h6',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  badge: 'M12 3 14.3 7.9l5.4.7-3.9 3.8.9 5.4-4.7-2.5-4.7 2.5.9-5.4L4.3 8.6l5.4-.7z',
  calendar: 'M8 3v4M16 3v4M3 10h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2',
  shield: 'M12 3l7 3v5.5c0 4.3-2.9 8.3-7 9.5-4.1-1.2-7-5.2-7-9.5V6z M9.2 12.2l2 2 3.6-3.9',
  phone: 'M15.5 21A13.5 13.5 0 0 1 3 8.5 3 3 0 0 1 6 5.5h1.5a1 1 0 0 1 1 .8l.7 3a1 1 0 0 1-.5 1.1l-1.3.7a10 10 0 0 0 5 5l.7-1.3a1 1 0 0 1 1.1-.5l3 .7a1 1 0 0 1 .8 1V18a3 3 0 0 1-3 3',
  chat: 'M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12',
  pin: 'M12 21s7-5.8 7-11a7 7 0 1 0-14 0c0 5.2 7 11 7 11M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M12 7v5l3.2 1.9',
  mail: 'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1M3.5 6.5 12 13l8.5-6.5',
  check: 'm5 12.5 4.2 4.2L19 7',
};
---

<svg
  class={className}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.7"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  <path d={paths[name]} />
</svg>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/Icon.astro
git commit -m "feat: add Icon ui component"
```

---

### Task 4: Content schema (`src/content.config.ts`)

**Files:**
- Create: `src/content.config.ts` (verbatim copy from client #1 — this schema is EduLayout's proven contract; kept at the same path Astro 7 actually resolved it at in client #1, not the illustrative nested `content/config.ts` path from the Notion roadmap sketch)

**Interfaces:**
- Consumes: nothing.
- Produces: the `clients` collection with Zod-validated shape `{ name, shortName, tagline, logo, logoLight, seo, contact, hero, courses, whyUs, activities, testimonials, contactSection }` (full field list below) — consumed by `EduLayout` and every Edu section component, and by `_example-edu.json` in Task 8.

- [ ] **Step 1: Create `src/content.config.ts`**

```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Schema nội dung cho phân khúc "trung tâm ngoại ngữ" (EduLayout).
 *
 * Nguyên tắc: mọi thứ đổi theo từng khách đều nằm ở đây và trong file JSON.
 * Component chỉ nhận props, không hardcode nội dung.
 * Khi bàn giao gói bảo trì, khách/DG chỉ sửa JSON — không đụng code.
 *
 * Nhiều trường để optional một cách có chủ đích: khách chưa công bố thời lượng,
 * sĩ số hay học phí của mọi khóa. Thiếu thì component ẩn dòng đó đi,
 * KHÔNG bịa số cho đủ chỗ.
 */

const cta = z.object({
  label: z.string(),
  href: z.string(),
});

const clients = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/clients' }),
  schema: ({ image }) =>
    z.object({
      // --- Nhận diện & SEO ---
      name: z.string(),
      shortName: z.string(),
      tagline: z.string(),
      logo: image(),
      logoLight: image(),
      seo: z.object({
        title: z.string().max(70),
        description: z.string().max(180),
        locale: z.string().default('vi_VN'),
      }),

      // --- Liên hệ ---
      contact: z.object({
        // Nhiều số: mỗi số gắn với một người phụ trách.
        phones: z
          .array(z.object({ name: z.string(), number: z.string(), display: z.string() }))
          .min(1),
        zaloUrl: z.string().url(),
        facebookUrl: z.string().url().optional(),
        instagramUrl: z.string().url().optional(),
        email: z.string().email(),
        // Nhiều cơ sở: mỗi cơ sở có bản đồ riêng.
        locations: z
          .array(
            z.object({
              label: z.string(),
              address: z.string(),
              mapEmbedUrl: z.string().optional(),
              mapDirectionsUrl: z.string().optional(),
            }),
          )
          .min(1),
        openingHours: z.string(),
      }),

      // --- Các section ---
      hero: z.object({
        eyebrow: z.string(),
        heading: z.string(),
        subheading: z.string(),
        primaryCta: cta,
        secondaryCta: cta,
        image: image(),
        imageAlt: z.string(),
        // Cam kết dạng gạch đầu dòng — dùng thay cho số liệu, vì khách
        // chưa công bố số học viên / tỉ lệ đầu ra nào có thể kiểm chứng.
        commitments: z.array(z.string()).min(2).max(6),
      }),

      courses: z.object({
        heading: z.string(),
        intro: z.string(),
        items: z
          .array(
            z.object({
              slug: z.string(),
              name: z.string(),
              summary: z.string(),
              audience: z.string().optional(),
              duration: z.string().optional(),
              classSize: z.string().optional(),
              tuition: z.string().optional(),
              featured: z.boolean().default(false),
            }),
          )
          .min(1),
      }),

      whyUs: z.object({
        heading: z.string(),
        items: z
          .array(
            z.object({
              // Chỉ nhận icon đã có sẵn trong ui/Icon.astro — sai tên là build fail ngay,
              // không phải chờ tới lúc xem trang mới phát hiện.
              icon: z.enum(['users', 'route', 'chart', 'badge', 'calendar', 'shield']),
              title: z.string(),
              body: z.string(),
            }),
          )
          .min(3)
          .max(6),
      }),

      activities: z.object({
        heading: z.string(),
        intro: z.string(),
        items: z
          .array(
            z.object({
              title: z.string(),
              caption: z.string(),
              image: image(),
              imageAlt: z.string(),
            }),
          )
          .min(1),
      }),

      testimonials: z.object({
        heading: z.string(),
        intro: z.string().optional(),
        items: z.array(
          z.object({
            quote: z.string(),
            author: z.string(),
            role: z.string(),
            image: image().optional(),
            imageAlt: z.string().optional(),
          }),
        ),
      }),

      contactSection: z.object({
        heading: z.string(),
        intro: z.string(),
      }),
    }),
});

export const collections = { clients };
```

- [ ] **Step 2: Commit**

```bash
git add src/content.config.ts
git commit -m "feat: add Edu client content schema"
```

---

### Task 5: EduLayout

**Files:**
- Create: `src/layouts/EduLayout.astro` (adapted from client #1 — only the `theme-color` meta value changes, to match the kit's new teal default; everything else copied verbatim since it's proven Edu-segment structure)

**Interfaces:**
- Consumes: `Icon` (Task 3, `name` prop), `src/styles/global.css` (Task 2), `CollectionEntry<'clients'>['data']` type (Task 4).
- Produces: `EduLayout` component with `Props.client: CollectionEntry<'clients'>['data']`, rendering `<slot />` inside `<main id="noi-dung">` — consumed by `pages/index.astro` in Task 9.

- [ ] **Step 1: Create `src/layouts/EduLayout.astro`**

```astro
---
import '../styles/global.css';
import { Image } from 'astro:assets';
import Icon from '../components/ui/Icon.astro';
import type { CollectionEntry } from 'astro:content';

interface Props {
  client: CollectionEntry<'clients'>['data'];
}

const { client } = Astro.props;
const { seo, contact, name, shortName, tagline, logo, logoLight } = client;
const mainPhone = contact.phones[0];

const nav = [
  { label: 'Khóa học', href: '#khoa-hoc' },
  { label: 'Vì sao chọn', href: '#vi-sao' },
  { label: 'Hoạt động', href: '#hoat-dong' },
  { label: 'Cảm nhận', href: '#cam-nhan' },
  { label: 'Liên hệ', href: '#lien-he' },
];

const canonical = new URL(Astro.url.pathname, Astro.site).href;

const socials = [
  contact.facebookUrl && { label: 'Facebook', href: contact.facebookUrl },
  contact.instagramUrl && { label: 'Instagram', href: contact.instagramUrl },
].filter(Boolean) as { label: string; href: string }[];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name,
  description: seo.description,
  url: canonical,
  email: contact.email,
  telephone: contact.phones.map((p) => p.number),
  sameAs: socials.map((s) => s.href),
  address: contact.locations.map((loc) => ({
    '@type': 'PostalAddress',
    streetAddress: loc.address,
    addressCountry: 'VN',
  })),
};
---

<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{seo.title}</title>
    <meta name="description" content={seo.description} />
    <link rel="canonical" href={canonical} />

    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

    {/* Hai file font cần cho khối chữ đầu tiên người dùng nhìn thấy */}
    <link rel="preload" href="/fonts/playfair-700-latin.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/bevietnam-400-vietnamese.woff2" as="font" type="font/woff2" crossorigin />
    {/* Khớp --color-brand-900 của theme đang import trong global.css — đổi theme thì đổi luôn giá trị này */}
    <meta name="theme-color" content="#134e4a" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content={name} />
    <meta property="og:title" content={seo.title} />
    <meta property="og:description" content={seo.description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:locale" content={seo.locale} />
    <meta property="og:image" content={new URL(client.hero.image.src, Astro.site).href} />
    <meta name="twitter:card" content="summary_large_image" />

    <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
  </head>

  <body class="bg-white text-ink-700">
    {/* Vach tien do doc — chay theo % da cuon, thuan CSS */}
    <div class="read-progress" aria-hidden="true"></div>

    <a
      href="#noi-dung"
      class="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-brand-900 focus:px-4 focus:py-2 focus:text-white"
    >
      Bỏ qua, tới nội dung chính
    </a>

    <header class="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="/" class="flex min-w-0 items-center gap-3">
          <Image src={logo} alt="" width={44} height={57} class="h-9 w-auto" loading="eager" />
          <span class="min-w-0 border-l border-slate-200 pl-3">
            <span class="eyebrow block truncate text-brand-900">{shortName}</span>
            <span class="mt-1.5 block truncate text-xs leading-tight text-ink-500">{tagline}</span>
          </span>
        </a>

        <nav aria-label="Điều hướng chính" class="hidden lg:block">
          <ul class="flex items-center gap-1">
            {
              nav.map((item) => (
                <li>
                  <a
                    href={item.href}
                    class="rounded-lg px-3 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
                  >
                    {item.label}
                  </a>
                </li>
              ))
            }
          </ul>
        </nav>

        <div class="flex items-center gap-2">
          <a
            href={`tel:${mainPhone.number}`}
            class="hidden items-center gap-2 rounded-full bg-brand-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800 sm:inline-flex"
          >
            <Icon name="phone" class="size-4" />
            Gọi tư vấn
          </a>

          <details class="group relative lg:hidden">
            <summary
              class="grid size-10 cursor-pointer list-none place-items-center rounded-lg text-brand-900 ring-1 ring-slate-200 [&::-webkit-details-marker]:hidden"
              aria-label="Mở menu"
            >
              <svg
                class="size-5 group-open:hidden"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                aria-hidden="true"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
              <svg
                class="hidden size-5 group-open:block"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </summary>
            <nav
              aria-label="Điều hướng trên di động"
              class="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
            >
              <ul>
                {
                  nav.map((item) => (
                    <li>
                      <a
                        href={item.href}
                        class="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-brand-50 hover:text-brand-700"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))
                }
              </ul>
              <a
                href={`tel:${mainPhone.number}`}
                class="mt-1 flex items-center justify-center gap-2 rounded-lg bg-brand-900 px-3 py-2.5 text-sm font-semibold text-white sm:hidden"
              >
                <Icon name="phone" class="size-4" />
                Gọi tư vấn
              </a>
            </nav>
          </details>
        </div>
      </div>

    </header>

    <main id="noi-dung">
      <slot />
    </main>

    <footer class="bg-brand-950 text-brand-200">
      <div class="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div class="sm:col-span-2 lg:col-span-1">
            <Image src={logoLight} alt={name} width={62} height={80} class="h-12 w-auto" />
            <p class="mt-4 max-w-xs text-sm leading-relaxed">{client.hero.subheading}</p>
            {
              socials.length > 0 && (
                <ul class="mt-5 flex gap-2">
                  {socials.map((s) => (
                    <li>
                      <a
                        href={s.href}
                        rel="noopener"
                        class="inline-block rounded-lg px-3 py-1.5 text-sm font-medium text-white ring-1 ring-white/20 transition-colors hover:bg-white/10"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )
            }
          </div>

          <div>
            <h2 class="eyebrow text-gold-400">Cơ sở</h2>
            <ul class="mt-4 space-y-4 text-sm">
              {
                contact.locations.map((loc) => (
                  <li>
                    <p class="font-semibold text-white">{loc.label}</p>
                    <p class="mt-1 leading-relaxed">{loc.address}</p>
                  </li>
                ))
              }
            </ul>
          </div>

          <div>
            <h2 class="eyebrow text-gold-400">Liên hệ</h2>
            <ul class="mt-4 space-y-2.5 text-sm">
              {
                contact.phones.map((p) => (
                  <li class="flex gap-2">
                    <Icon name="phone" class="size-4 shrink-0 translate-y-0.5 text-gold-400" />
                    <a href={`tel:${p.number}`} class="hover:text-white">
                      {p.display} <span class="text-brand-300">({p.name})</span>
                    </a>
                  </li>
                ))
              }
              <li class="flex gap-2">
                <Icon name="mail" class="size-4 shrink-0 translate-y-0.5 text-gold-400" />
                <a href={`mailto:${contact.email}`} class="break-all hover:text-white">
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 class="eyebrow text-gold-400">Giờ hỗ trợ</h2>
            <p class="mt-4 flex gap-2 text-sm">
              <Icon name="clock" class="size-4 shrink-0 translate-y-0.5 text-gold-400" />
              {contact.openingHours}
            </p>
          </div>
        </div>

        <p class="mt-12 border-t border-white/10 pt-6 text-xs text-brand-300">
          © {new Date().getFullYear()} {name}. Website thiết kế bởi DashGrow.
        </p>
      </div>
    </footer>
  </body>
</html>
```

Note: the header's brand span was hardcoded to the literal text `"The Future"` in the original file — replaced above with `{shortName}` (the schema's existing field for exactly this "short brand name" slot) so the kit has no client-specific string baked into a proven-structure file. This is the only content change beyond `theme-color`.

- [ ] **Step 2: Commit**

```bash
git add src/layouts/EduLayout.astro
git commit -m "feat: add EduLayout (generalized from client #1)"
```

---

### Task 6: Generic sections — Hero, WhyUs, ContactBlock, MapEmbed

**Files:**
- Create: `src/components/sections/Hero.astro` (verbatim)
- Create: `src/components/sections/WhyUs.astro` (verbatim)
- Create: `src/components/sections/MapEmbed.astro` (verbatim)
- Create: `src/components/sections/ContactBlock.astro` (verbatim)

**Interfaces:**
- Consumes: `Icon` (Task 3), `MapEmbed` (this task, from `ContactBlock`), field types from the `clients` collection schema (Task 4): `hero`, `whyUs`, `contact`, `contactSection`.
- Produces: `Hero` (`Props.hero`), `WhyUs` (`Props.whyUs`), `MapEmbed` (`Props.embedUrl?`, `Props.title`), `ContactBlock` (`Props.contact`, `Props.contactSection`, `Props.centreName: string`) — consumed by `pages/index.astro` in Task 9.

- [ ] **Step 1: Create `src/components/sections/Hero.astro`**

```astro
---
import { Image } from 'astro:assets';
import type { CollectionEntry } from 'astro:content';

interface Props {
  hero: CollectionEntry<'clients'>['data']['hero'];
}

const { hero } = Astro.props;
---

{/* Trang bìa: chỉ có chữ. Ảnh banner chạy nguyên khổ ngay dưới, thay vì bị
    bóp vào nửa cột — nếu banner của khách rất rộng, nhét vào cột hẹp sẽ làm
    chữ trên banner nhỏ đến mức không đọc được. */}
<section class="relative overflow-hidden bg-brand-900">
  <div
    class="pointer-events-none absolute inset-0 opacity-[0.06]"
    style="background-image:linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px);background-size:64px 64px"
    aria-hidden="true"
  >
  </div>

  <div class="relative mx-auto max-w-5xl px-4 pt-20 pb-0 sm:px-6 sm:pt-28">
    <p class="eyebrow rise-in text-gold-400" style="animation-delay:120ms">
      {hero.eyebrow}
    </p>

    <h1
      class="rise-in mt-7 font-display text-[2.75rem] leading-[1.05] font-bold text-white sm:text-6xl lg:text-7xl"
      style="animation-delay:280ms"
    >
      {hero.heading}
    </h1>

    <p
      class="rise-in mt-7 max-w-2xl text-lg leading-relaxed text-brand-100 sm:text-xl"
      style="animation-delay:440ms"
    >
      {hero.subheading}
    </p>

    <div class="rise-in mt-9 flex flex-col gap-3 sm:flex-row" style="animation-delay:600ms">
      <a
        href={hero.primaryCta.href}
        class="inline-flex items-center justify-center rounded-full bg-gold-400 px-8 py-4 text-base font-semibold text-brand-900 transition-colors hover:bg-gold-300"
      >
        {hero.primaryCta.label}
      </a>
      <a
        href={hero.secondaryCta.href}
        class="inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-semibold text-white ring-1 ring-white/25 transition-colors hover:bg-white/10"
      >
        {hero.secondaryCta.label}
      </a>
    </div>

    {/* Dải cam kết chạy hết chân trang bìa, ngăn bằng nét mảnh — đọc như
        măng-sét của một ấn phẩm, không phải danh sách tick mặc định. */}
    <ul
      class="rise-in mt-16 grid grid-cols-2 border-t border-white/15 lg:grid-cols-4"
      style="animation-delay:760ms"
    >
      {
        hero.commitments.map((item) => (
          <li class="border-b border-white/15 py-5 pr-4 lg:border-b-0 lg:border-r lg:last:border-r-0 lg:pr-6 lg:pl-6 lg:first:pl-0">
            <span class="block h-px w-8 bg-gold-400" aria-hidden="true" />
            <span class="mt-3 block text-sm leading-snug font-medium text-white sm:text-base">
              {item}
            </span>
          </li>
        ))
      }
    </ul>
  </div>
</section>

{/* Ảnh banner/poster tuyển sinh, nguyên khổ */}
<figure class="bg-brand-900">
  <Image
    src={hero.image}
    alt={hero.imageAlt}
    widths={[640, 1024, 1600, 2035]}
    sizes="100vw"
    loading="eager"
    fetchpriority="high"
    class="w-full"
  />
</figure>
```

- [ ] **Step 2: Create `src/components/sections/WhyUs.astro`**

```astro
---
import Icon from '../ui/Icon.astro';
import type { CollectionEntry } from 'astro:content';

interface Props {
  whyUs: CollectionEntry<'clients'>['data']['whyUs'];
}

const { whyUs } = Astro.props;
---

{/* Không dùng thẻ có viền và đổ bóng — chỉ nét mảnh ngăn cột, để phần này
    lùi lại phía sau mục lục khóa học thay vì tranh sự chú ý với nó. */}
<section id="vi-sao" class="scroll-mt-20 bg-white py-20 sm:py-28">
  <div class="mx-auto max-w-5xl px-4 sm:px-6">
    <p class="eyebrow text-brand-600">Cam kết của trung tâm</p>
    <h2 class="mt-5 max-w-2xl font-display text-4xl leading-tight font-bold text-brand-900 sm:text-5xl">
      {whyUs.heading}
    </h2>

    <div class="stagger mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {
        whyUs.items.map((item) => (
          <div class="lift border-t border-paper-line pt-6">
            <Icon name={item.icon} class="size-6 text-brand-600" />
            <h3 class="mt-4 font-display text-xl font-bold text-brand-900">{item.title}</h3>
            <p class="mt-2 text-sm leading-relaxed text-ink-500">{item.body}</p>
          </div>
        ))
      }
    </div>
  </div>
</section>
```

- [ ] **Step 3: Create `src/components/sections/MapEmbed.astro`**

```astro
---
interface Props {
  embedUrl?: string;
  title: string;
}

const { embedUrl, title } = Astro.props;
const isReady = embedUrl?.startsWith('https://');
---

{
  isReady ? (
    <iframe
      src={embedUrl}
      title={title}
      width="100%"
      height="100%"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      class="size-full min-h-72 border-0"
    />
  ) : (
    <div class="grid size-full min-h-72 place-items-center bg-slate-100 p-6 text-center text-sm text-ink-500">
      <p>Chưa có bản đồ cho cơ sở này.</p>
    </div>
  )
}
```

- [ ] **Step 4: Create `src/components/sections/ContactBlock.astro`**

```astro
---
import Icon from '../ui/Icon.astro';
import MapEmbed from './MapEmbed.astro';
import type { CollectionEntry } from 'astro:content';

type Client = CollectionEntry<'clients'>['data'];

interface Props {
  contact: Client['contact'];
  contactSection: Client['contactSection'];
  centreName: string;
}

const { contact, contactSection, centreName } = Astro.props;
const mainPhone = contact.phones[0];
const mapped = contact.locations.find((loc) => loc.mapEmbedUrl);
---

<section id="lien-he" class="scroll-mt-20 bg-white py-20 sm:py-28">
  <div class="mx-auto max-w-5xl px-4 sm:px-6">
    <p class="eyebrow text-brand-600">Liên hệ</p>
    <h2 class="mt-5 max-w-2xl font-display text-4xl leading-tight font-bold text-brand-900 sm:text-5xl">
      {contactSection.heading}
    </h2>
    <p class="mt-5 max-w-2xl text-lg leading-relaxed text-ink-500">{contactSection.intro}</p>

    <div class="mt-9 flex flex-col gap-3 sm:flex-row">
      <a
        href={`tel:${mainPhone.number}`}
        class="inline-flex items-center justify-center gap-2.5 rounded-full bg-brand-900 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-brand-800"
      >
        <Icon name="phone" class="size-5" />
        Gọi {mainPhone.display}
      </a>
      <a
        href={contact.zaloUrl}
        rel="noopener"
        class="inline-flex items-center justify-center gap-2.5 rounded-full bg-gold-400 px-8 py-4 text-base font-semibold text-brand-900 transition-colors hover:bg-gold-300"
      >
        <Icon name="chat" class="size-5" />
        Nhắn Zalo
      </a>
    </div>

    <div class="stagger mt-16 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      <div class="lift border-t border-paper-line pt-5">
        <span class="eyebrow block text-ink-400">Điện thoại</span>
        <ul class="mt-3 space-y-1.5">
          {
            contact.phones.map((p) => (
              <li class="text-sm">
                <a href={`tel:${p.number}`} class="font-semibold text-ink-900 hover:text-brand-700">
                  {p.display}
                </a>
                <span class="block text-ink-500">{p.name}</span>
              </li>
            ))
          }
        </ul>
      </div>

      {
        contact.locations.map((loc) => (
          <div class="lift border-t border-paper-line pt-5">
            <span class="eyebrow block text-ink-400">{loc.label}</span>
            <p class="mt-3 text-sm leading-relaxed text-ink-700">{loc.address}</p>
            {loc.mapDirectionsUrl && (
              <a
                href={loc.mapDirectionsUrl}
                rel="noopener"
                class="mt-2 inline-block text-sm font-semibold text-brand-700 hover:underline"
              >
                Xem chỉ đường
              </a>
            )}
          </div>
        ))
      }

      <div class="lift border-t border-paper-line pt-5">
        <span class="eyebrow block text-ink-400">Email</span>
        <a
          href={`mailto:${contact.email}`}
          class="mt-3 block text-sm break-all text-ink-700 hover:text-brand-700"
        >
          {contact.email}
        </a>
        <span class="eyebrow mt-5 block text-ink-400">Giờ hỗ trợ</span>
        <p class="mt-3 text-sm text-ink-700">{contact.openingHours}</p>
      </div>
    </div>

    <div class="mt-14 overflow-hidden rounded-sm border border-paper-line">
      <MapEmbed
        embedUrl={mapped?.mapEmbedUrl}
        title={`Bản đồ đường tới ${centreName} — ${mapped?.label ?? ''}`}
      />
    </div>
  </div>
</section>
```

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Hero.astro src/components/sections/WhyUs.astro src/components/sections/MapEmbed.astro src/components/sections/ContactBlock.astro
git commit -m "feat: add generic sections (Hero, WhyUs, ContactBlock, MapEmbed)"
```

---

### Task 7: Edu-specific sections — CourseIndex, Activities, Testimonials

**Files:**
- Create: `src/components/sections/CourseIndex.astro` (comment de-specialized — removed the "trung tâm có 5 khóa" reference tied to client #1's exact course count)
- Create: `src/components/sections/Activities.astro` (verbatim)
- Create: `src/components/sections/Testimonials.astro` (verbatim)

**Interfaces:**
- Consumes: field types `courses`, `activities`, `testimonials` from the `clients` collection schema (Task 4).
- Produces: `CourseIndex` (`Props.courses`, `Props.ctaHref: string`), `Activities` (`Props.activities`), `Testimonials` (`Props.testimonials`) — consumed by `pages/index.astro` in Task 9.

- [ ] **Step 1: Create `src/components/sections/CourseIndex.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';

interface Props {
  courses: CollectionEntry<'clients'>['data']['courses'];
  ctaHref: string;
}

const { courses, ctaHref } = Astro.props;
---

{/*
  Khóa học trình bày như MỤC LỤC CHƯƠNG TRÌNH của một trường, không phải lưới thẻ:
  tên khóa đặt lớn bằng serif, thông tin phụ xếp cột phải, các dòng ngăn bằng nét mảnh.
  Lý do: khi thông tin giữa các khóa không đều (một số có học phí công bố, một số
  chưa), lưới thẻ sẽ phơi ra chỗ trống; mục lục thì không. Trên điện thoại kiểu này
  cũng quét nhanh hơn thẻ.
*/}
<section id="khoa-hoc" class="scroll-mt-20 bg-paper py-20 sm:py-28">
  <div class="mx-auto max-w-5xl px-4 sm:px-6">
    <p class="eyebrow text-brand-600">Chương trình đào tạo</p>
    <h2 class="mt-5 max-w-2xl font-display text-4xl leading-tight font-bold text-brand-900 sm:text-5xl">
      {courses.heading}
    </h2>
    <p class="mt-5 max-w-2xl text-lg leading-relaxed text-ink-500">{courses.intro}</p>

    <ul class="stagger mt-14 border-t border-paper-line">
      {
        courses.items.map((course) => (
          <li>
            <a
              href={ctaHref}
              class="group relative block border-b border-paper-line py-8 transition-colors hover:bg-white"
            >
              {/* Nét gold kéo ngang khi rê chuột hoặc focus bàn phím */}
              <span
                class="absolute inset-x-0 bottom-[-1px] h-px origin-left scale-x-0 bg-gold-400 transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
                aria-hidden="true"
              />

              <div class="grid gap-4 lg:grid-cols-12 lg:items-baseline lg:gap-8">
                <div class="lg:col-span-7">
                  {course.featured && (
                    <span class="eyebrow mb-2.5 block text-gold-600">Được chọn nhiều nhất</span>
                  )}
                  <h3 class="font-display text-2xl leading-snug font-bold text-brand-900 sm:text-3xl">
                    {course.name}
                  </h3>
                  <p class="mt-2.5 max-w-xl text-base leading-relaxed text-ink-500">
                    {course.summary}
                  </p>
                </div>

                <div class="lg:col-span-3">
                  {course.audience && (
                    <>
                      <span class="eyebrow block text-ink-400">Dành cho</span>
                      <p class="mt-2 text-sm leading-relaxed text-ink-700">{course.audience}</p>
                    </>
                  )}
                </div>

                <div class="lg:col-span-2 lg:text-right">
                  {course.tuition ? (
                    <>
                      <span class="eyebrow block text-ink-400">Học phí</span>
                      <p class="mt-2 text-sm leading-relaxed font-semibold text-brand-700">
                        {course.tuition}
                      </p>
                    </>
                  ) : (
                    <p class="text-sm font-semibold text-brand-700">Liên hệ nhận báo giá</p>
                  )}
                  <span class="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-900">
                    Tư vấn
                    <span class="sr-only">khóa {course.name}</span>
                    <svg
                      class="size-4 transition-transform duration-300 group-hover:translate-x-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>
          </li>
        ))
      }
    </ul>
  </div>
</section>
```

- [ ] **Step 2: Create `src/components/sections/Activities.astro`**

```astro
---
import { Image } from 'astro:assets';
import type { CollectionEntry } from 'astro:content';

interface Props {
  activities: CollectionEntry<'clients'>['data']['activities'];
}

const { activities } = Astro.props;

// Ảnh đầu chạy khổ lớn, phần còn lại xếp lưới. Nếu ảnh của khách đã có sẵn
// khung/chữ in trên ảnh, để chúng cùng một cỡ đều tăm tắp sẽ rất nặng mắt.
const [lead, ...rest] = activities.items;
---

<section id="hoat-dong" class="scroll-mt-20 bg-paper py-20 sm:py-28">
  <div class="mx-auto max-w-5xl px-4 sm:px-6">
    <p class="eyebrow text-brand-600">Tại trung tâm</p>
    <h2 class="mt-5 max-w-2xl font-display text-4xl leading-tight font-bold text-brand-900 sm:text-5xl">
      {activities.heading}
    </h2>
    <p class="mt-5 max-w-2xl text-lg leading-relaxed text-ink-500">{activities.intro}</p>

    <figure class="reveal lift mt-14">
      <div class="lift-zoom">
      <Image
        src={lead.image}
        alt={lead.imageAlt}
        widths={[640, 1024, 1600]}
        sizes="(min-width: 1024px) 64rem, 100vw"
        loading="lazy"
        class="reveal-curtain w-full rounded-sm"
      />
      </div>
      <figcaption class="lift-line mt-4 flex flex-col gap-1 border-t border-paper-line pt-4 sm:flex-row sm:gap-6">
        <span class="eyebrow shrink-0 pt-1 text-brand-900 sm:w-56">{lead.title}</span>
        <span class="text-sm leading-relaxed text-ink-500">{lead.caption}</span>
      </figcaption>
    </figure>

    <ul class="stagger mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {
        rest.map((item) => (
          <li>
            <figure class="lift">
              <div class="lift-zoom rounded-sm">
              <Image
                src={item.image}
                alt={item.imageAlt}
                widths={[320, 640]}
                sizes="(min-width: 1024px) 20rem, (min-width: 640px) 50vw, 100vw"
                loading="lazy"
                class="reveal-curtain aspect-4/3 w-full rounded-sm object-cover"
              />
              </div>
              <figcaption class="lift-line mt-4 border-t border-paper-line pt-4">
                <span class="eyebrow block text-brand-900">{item.title}</span>
                <p class="mt-2.5 text-sm leading-relaxed text-ink-500">{item.caption}</p>
              </figcaption>
            </figure>
          </li>
        ))
      }
    </ul>
  </div>
</section>
```

- [ ] **Step 3: Create `src/components/sections/Testimonials.astro`**

```astro
---
import { Image } from 'astro:assets';
import type { CollectionEntry } from 'astro:content';

interface Props {
  testimonials: CollectionEntry<'clients'>['data']['testimonials'];
}

const { testimonials } = Astro.props;
const items = testimonials.items;
const n = items.length;

// Chỉ số slide trước / sau, nối vòng đầu-cuối.
const prevOf = (i: number) => (i - 1 + n) % n;
const nextOf = (i: number) => (i + 1) % n;

/*
  Luật CSS sinh theo số slide. Radio nào được chọn thì:
   - hiện slide của nó,
   - hiện cặp mũi tên của nó (trỏ tới slide trước/sau, cuối vòng về đầu),
   - làm nổi ô khuôn mặt tương ứng.
  Sinh từ vòng lặp nên thêm/bớt cảm nhận trong JSON là CSS tự khớp.
*/
const rules = items
  .map((_, i) => {
    const k = i + 1;
    return [
      `#cn-q${k}:checked ~ .cn-viewport .cn-slide-${k} { opacity: 1; visibility: visible; }`,
      `#cn-q${k}:checked ~ .cn-viewport .cn-arrows-${k} { display: block; }`,
      `#cn-q${k}:checked ~ .cn-controls .cn-thumb-${k} { opacity: 1; border-color: var(--color-gold-400); }`,
      `#cn-q${k}:focus-visible ~ .cn-controls .cn-thumb-${k} { outline: 3px solid var(--color-gold-400); outline-offset: 3px; }`,
    ].join('\n');
  })
  .join('\n');

const css = `
.cn { position: relative; }

/* Radio ẩn khỏi mắt nhưng vẫn nhận được focus bàn phím.
   Dùng clip-path chứ KHÔNG display:none — display:none sẽ mất điều hướng bàn phím. */
.cn-input {
  position: absolute;
  width: 1px; height: 1px;
  margin: -1px; padding: 0;
  overflow: hidden; clip-path: inset(50%);
  white-space: nowrap;
}

/* Chừa máng hai bên cho mũi tên để chúng không đè lên chữ */
.cn-viewport {
  position: relative;
  padding-inline: 3.25rem;
}
@media (min-width: 640px) {
  .cn-viewport { padding-inline: 4rem; }
}

/* Các slide chồng cùng một ô lưới, chỉ slide đang chọn hiện ra */
.cn-stage { display: grid; }
.cn-slide {
  grid-area: 1 / 1;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.7s ease;
}

.cn-arrows { display: none; }

/* Mũi tên: giữa chiều cao, sát hai mép */
.cn-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: grid;
  place-items: center;
  width: 2.75rem; height: 2.75rem;
  cursor: pointer;
  color: #fff;
  border: 1px solid rgb(255 255 255 / 0.25);
  background: rgb(0 23 98 / 0.6);
  backdrop-filter: blur(4px);
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;
}
.cn-arrow-prev { left: 0; }
.cn-arrow-next { right: 0; }
.cn-arrow svg { width: 1.25rem; height: 1.25rem; }
.cn-arrow:hover {
  color: var(--color-brand-900);
  background: var(--color-gold-400);
  border-color: var(--color-gold-400);
}
@media (min-width: 640px) {
  .cn-arrow { width: 3rem; height: 3rem; }
}

.cn-thumb {
  display: block;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  padding-bottom: 0.5rem;
  opacity: 0.5;
  transition: opacity 0.2s, border-color 0.2s;
}
.cn-thumb:hover { opacity: 1; }
${rules}
`;
---

{/*
  Carousel chạy bằng radio + chuyển cảnh mờ dần, không một dòng JS nào.

  Vì sao mờ dần chứ không trượt ngang: nếu bấm liên tục thì phải lặp vòng tròn.
  Nếu trượt, bước từ thẻ cuối về thẻ đầu phải tua ngược qua mọi thẻ ở giữa — nhìn giật.
  Mờ dần thì mọi bước như nhau, kể cả bước vòng lại.

  Không tự động chạy, nên không cần nút tạm dừng.
*/}
<section id="cam-nhan" class="scroll-mt-20 bg-brand-900 py-20 sm:py-28">
  <div class="mx-auto max-w-5xl px-4 sm:px-6">
    <p class="eyebrow text-gold-400">Cảm nhận học viên</p>
    <h2 class="mt-5 max-w-2xl font-display text-4xl leading-tight font-bold text-white sm:text-5xl">
      {testimonials.heading}
    </h2>
    {
      testimonials.intro && (
        <p class="mt-5 max-w-2xl text-lg leading-relaxed text-brand-200">{testimonials.intro}</p>
      )
    }

    <div
      class="cn mt-14"
      role="region"
      aria-roledescription="carousel"
      aria-label="Cảm nhận của học viên"
    >
      {/* Radio ẩn khỏi mắt nhưng vẫn nhận focus: bàn phím chuyển slide bằng phím mũi tên */}
      {
        items.map((item, i) => (
          <input
            type="radio"
            name="cam-nhan"
            id={`cn-q${i + 1}`}
            class="cn-input"
            checked={i === 0}
            aria-label={`Cảm nhận ${i + 1} trên ${n} — ${item.role}`}
          />
        ))
      }

      <div class="cn-viewport">
        <div class="cn-stage" aria-live="polite">
          {
            items.map((item, i) => (
              <figure
                class={`cn-slide cn-slide-${i + 1} grid gap-6 sm:grid-cols-12 sm:gap-8`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} trên ${n} — ${item.role}`}
              >
                {item.image && (
                  <div class="sm:col-span-5">
                    <div class="border-l-2 border-gold-400 pl-4">
                      <Image
                        src={item.image}
                        alt={item.imageAlt ?? ''}
                        widths={[280, 560]}
                        sizes="(min-width: 640px) 14rem, 60vw"
                        loading={i === 0 ? 'eager' : 'lazy'}
                        class="aspect-3/4 w-full object-cover object-[center_28%]"
                      />
                    </div>
                  </div>
                )}

                <div class="flex flex-col justify-center sm:col-span-7">
                  <blockquote>
                    <p class="font-display text-xl leading-[1.45] font-bold text-white sm:text-2xl lg:text-[1.7rem]">
                      {item.quote}
                    </p>
                  </blockquote>
                  <figcaption class="mt-6 border-t border-white/15 pt-5">
                    <span class="block text-sm font-semibold text-white">{item.author}</span>
                    <span class="eyebrow mt-2 block text-gold-400">{item.role}</span>
                  </figcaption>
                </div>
              </figure>
            ))
          }
        </div>

        {/* Mỗi slide có cặp mũi tên riêng, đặt giữa chiều cao và sát hai mép */}
        {
          items.map((_, i) => (
            <div class={`cn-arrows cn-arrows-${i + 1}`}>
              <label class="cn-arrow cn-arrow-prev" for={`cn-q${prevOf(i) + 1}`}>
                <span class="sr-only">Cảm nhận trước</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </label>
              <label class="cn-arrow cn-arrow-next" for={`cn-q${nextOf(i) + 1}`}>
                <span class="sr-only">Cảm nhận tiếp theo</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </label>
            </div>
          ))
        }
      </div>

      {/* Chọn thẳng một cảm nhận. Dùng khuôn mặt thay chấm tròn: biết trước sẽ nghe ai. */}
      <div class="cn-controls mt-10">
        <ul class="flex gap-3">
          {
            items.map((item, i) => (
              <li>
                <label class={`cn-thumb cn-thumb-${i + 1}`} for={`cn-q${i + 1}`}>
                  {item.image && (
                    <Image
                      src={item.image}
                      alt=""
                      widths={[56, 112]}
                      sizes="3rem"
                      loading="lazy"
                      class="size-12 object-cover object-[center_28%]"
                    />
                  )}
                  <span class="sr-only">
                    Xem cảm nhận {i + 1} trên {n} — {item.role}
                  </span>
                </label>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  </div>
</section>

<style is:inline set:html={css} />
```

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/CourseIndex.astro src/components/sections/Activities.astro src/components/sections/Testimonials.astro
git commit -m "feat: add Edu-specific sections (CourseIndex, Activities, Testimonials)"
```

---

### Task 8: Example client content — placeholder images + `_example-edu.json`

**Files:**
- Create: `src/assets/placeholder-logo.svg`
- Create: `src/assets/placeholder-logo-light.svg`
- Create: `src/assets/placeholder-hero.svg`
- Create: `src/assets/placeholder-activity.svg`
- Create: `src/assets/placeholder-testimonial.svg`
- Create: `src/content/clients/_example-edu.json`

**Interfaces:**
- Consumes: the `clients` collection schema (Task 4) — `_example-edu.json` must validate against it.
- Produces: a valid `clients` collection entry (id `_example-edu`) — consumed by `pages/index.astro` in Task 9. All five SVGs are hand-authored placeholders, never copies of client #1's real photos.

- [ ] **Step 1: Create the five placeholder SVGs**

`src/assets/placeholder-logo.svg` (small mark, ~44:57 aspect to match the logo slot):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 57">
  <rect width="44" height="57" rx="6" fill="#134e4a" />
  <text x="22" y="34" font-family="Georgia, 'Times New Roman', serif" font-size="20" font-weight="700" fill="#f0fdfa" text-anchor="middle">DG</text>
</svg>
```

`src/assets/placeholder-logo-light.svg` (white-on-transparent variant for the dark footer):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 57">
  <rect width="44" height="57" rx="6" fill="#ffffff" fill-opacity="0.12" />
  <text x="22" y="34" font-family="Georgia, 'Times New Roman', serif" font-size="20" font-weight="700" fill="#ffffff" text-anchor="middle">DG</text>
</svg>
```

`src/assets/placeholder-hero.svg` (wide banner, matches the 2035px-wide full-bleed use in `Hero.astro`):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2035 760">
  <rect width="2035" height="760" fill="#0d9488" />
  <text x="1017" y="400" font-family="'Be Vietnam Pro', system-ui, sans-serif" font-size="56" font-weight="700" fill="#ffffff" text-anchor="middle">[MOCK: Ảnh banner mẫu]</text>
</svg>
```

`src/assets/placeholder-activity.svg` (4:3, reused across all `activities.items`):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#f6f9f8" />
  <rect x="1" y="1" width="798" height="598" fill="none" stroke="#dfe7e5" stroke-width="2" />
  <text x="400" y="300" font-family="'Be Vietnam Pro', system-ui, sans-serif" font-size="28" fill="#64748b" text-anchor="middle">[MOCK: Ảnh hoạt động mẫu]</text>
</svg>
```

`src/assets/placeholder-testimonial.svg` (3:4 portrait, reused across all `testimonials.items`):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800">
  <rect width="600" height="800" fill="#134e4a" />
  <circle cx="300" cy="320" r="110" fill="#5eead4" fill-opacity="0.3" />
  <text x="300" y="600" font-family="'Be Vietnam Pro', system-ui, sans-serif" font-size="26" fill="#f0fdfa" text-anchor="middle">[MOCK: Ảnh học viên mẫu]</text>
</svg>
```

- [ ] **Step 2: Create `src/content/clients/_example-edu.json`**

```json
{
  "name": "[MOCK: Tên trung tâm mẫu]",
  "shortName": "[MOCK: Tên ngắn mẫu]",
  "tagline": "[MOCK: Trung tâm Ngoại ngữ mẫu]",
  "logo": "../../assets/placeholder-logo.svg",
  "logoLight": "../../assets/placeholder-logo-light.svg",
  "seo": {
    "title": "[MOCK: Tiêu đề SEO mẫu — Trung tâm Ngoại ngữ]",
    "description": "[MOCK: Mô tả SEO mẫu, dùng để xem thử cách EduLayout hiển thị nội dung dài tới khoảng 180 ký tự.]",
    "locale": "vi_VN"
  },
  "contact": {
    "phones": [
      { "name": "[MOCK: Người phụ trách]", "number": "0900000000", "display": "0900 000 000" }
    ],
    "zaloUrl": "https://zalo.me/0900000000",
    "email": "mock@example.com",
    "locations": [
      { "label": "[MOCK: Cơ sở 1]", "address": "[MOCK: Địa chỉ mẫu, Quận X, Thành phố Y]" }
    ],
    "openingHours": "[MOCK: Giờ hỗ trợ mẫu]"
  },
  "hero": {
    "eyebrow": "[MOCK: Nhãn nhỏ trên tiêu đề]",
    "heading": "[MOCK: Tiêu đề hero mẫu]",
    "subheading": "[MOCK: Mô tả ngắn dưới tiêu đề hero, minh họa độ dài thực tế của một câu subheading.]",
    "primaryCta": { "label": "[MOCK: Đăng ký tư vấn]", "href": "#lien-he" },
    "secondaryCta": { "label": "[MOCK: Xem khóa học]", "href": "#khoa-hoc" },
    "image": "../../assets/placeholder-hero.svg",
    "imageAlt": "[MOCK: Ảnh banner mẫu]",
    "commitments": [
      "[MOCK: Cam kết 1]",
      "[MOCK: Cam kết 2]",
      "[MOCK: Cam kết 3]",
      "[MOCK: Cam kết 4]"
    ]
  },
  "courses": {
    "heading": "[MOCK: Các khóa học mẫu]",
    "intro": "[MOCK: Giới thiệu ngắn về danh sách khóa học mẫu.]",
    "items": [
      {
        "slug": "khoa-mau-1",
        "name": "[MOCK: Khóa học mẫu 1]",
        "summary": "[MOCK: Mô tả khóa học mẫu 1, minh họa trường hợp đã có học phí công bố.]",
        "audience": "[MOCK: Đối tượng mẫu]",
        "tuition": "[MOCK: 1.000.000đ/tháng — giá minh họa]",
        "featured": true
      },
      {
        "slug": "khoa-mau-2",
        "name": "[MOCK: Khóa học mẫu 2]",
        "summary": "[MOCK: Mô tả khóa học mẫu 2, minh họa trường hợp chưa công bố học phí.]",
        "featured": false
      }
    ]
  },
  "whyUs": {
    "heading": "[MOCK: Vì sao chọn mẫu]",
    "items": [
      { "icon": "badge", "title": "[MOCK: Lý do 1]", "body": "[MOCK: Diễn giải lý do 1.]" },
      { "icon": "route", "title": "[MOCK: Lý do 2]", "body": "[MOCK: Diễn giải lý do 2.]" },
      { "icon": "users", "title": "[MOCK: Lý do 3]", "body": "[MOCK: Diễn giải lý do 3.]" }
    ]
  },
  "activities": {
    "heading": "[MOCK: Hoạt động mẫu]",
    "intro": "[MOCK: Giới thiệu ngắn về hoạt động mẫu.]",
    "items": [
      {
        "title": "[MOCK: Hoạt động 1]",
        "caption": "[MOCK: Mô tả hoạt động 1.]",
        "image": "../../assets/placeholder-activity.svg",
        "imageAlt": "[MOCK: Ảnh hoạt động mẫu]"
      },
      {
        "title": "[MOCK: Hoạt động 2]",
        "caption": "[MOCK: Mô tả hoạt động 2.]",
        "image": "../../assets/placeholder-activity.svg",
        "imageAlt": "[MOCK: Ảnh hoạt động mẫu]"
      }
    ]
  },
  "testimonials": {
    "heading": "[MOCK: Cảm nhận mẫu]",
    "intro": "[MOCK: Giới thiệu ngắn phần cảm nhận mẫu.]",
    "items": [
      {
        "quote": "[MOCK: Trích dẫn cảm nhận mẫu 1.]",
        "author": "[MOCK: Học viên mẫu]",
        "role": "[MOCK: Lớp mẫu]",
        "image": "../../assets/placeholder-testimonial.svg",
        "imageAlt": "[MOCK: Ảnh học viên mẫu]"
      },
      {
        "quote": "[MOCK: Trích dẫn cảm nhận mẫu 2.]",
        "author": "[MOCK: Học viên mẫu]",
        "role": "[MOCK: Lớp mẫu]",
        "image": "../../assets/placeholder-testimonial.svg",
        "imageAlt": "[MOCK: Ảnh học viên mẫu]"
      }
    ]
  },
  "contactSection": {
    "heading": "[MOCK: Đăng ký tư vấn mẫu]",
    "intro": "[MOCK: Mô tả ngắn phần liên hệ mẫu.]"
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/assets src/content/clients/_example-edu.json
git commit -m "feat: add example Edu client content with placeholder images"
```

---

### Task 9: Wire the demo page — `pages/index.astro` (first full build smoke test)

**Files:**
- Create: `src/pages/index.astro`

**Interfaces:**
- Consumes: `EduLayout` (Task 5), `Hero`/`CourseIndex`/`WhyUs`/`Activities`/`Testimonials`/`ContactBlock` (Tasks 6–7), `_example-edu` collection entry (Task 8).
- Produces: the site's only route (`/`) — the end-to-end proof that schema → content → layout → sections compile and build together.

- [ ] **Step 1: Create `src/pages/index.astro`**

```astro
---
import { getEntry } from 'astro:content';
import EduLayout from '../layouts/EduLayout.astro';
import Hero from '../components/sections/Hero.astro';
import CourseIndex from '../components/sections/CourseIndex.astro';
import WhyUs from '../components/sections/WhyUs.astro';
import Activities from '../components/sections/Activities.astro';
import Testimonials from '../components/sections/Testimonials.astro';
import ContactBlock from '../components/sections/ContactBlock.astro';

const entry = await getEntry('clients', '_example-edu');
if (!entry) {
  throw new Error('Không tìm thấy src/content/clients/_example-edu.json');
}
const client = entry.data;
---

<EduLayout client={client}>
  <Hero hero={client.hero} />
  <CourseIndex courses={client.courses} ctaHref="#lien-he" />
  <WhyUs whyUs={client.whyUs} />
  <Activities activities={client.activities} />
  <Testimonials testimonials={client.testimonials} />
  <ContactBlock
    contact={client.contact}
    contactSection={client.contactSection}
    centreName={client.name}
  />
</EduLayout>
```

- [ ] **Step 2: Run the full build**

Run: `npm run build`
Expected: `astro check` reports 0 errors, `astro build` completes and writes `dist/index.html`. This is the first point the whole EduLayout stack — schema, layout, all 7 sections, theme, fonts, example content — compiles and renders together.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: wire example Edu demo page (full build smoke test)"
```

---

### Task 10: Skeleton layouts — Landing, FnB, Retail

**Files:**
- Create: `src/layouts/LandingLayout.astro`
- Create: `src/layouts/FnBLayout.astro`
- Create: `src/layouts/RetailLayout.astro`

**Interfaces:**
- Consumes: `src/styles/global.css` (Task 2).
- Produces: three unwired layout shells with `Props.title: string` / `Props.description: string` — deliberately not typed against the Edu-specific `clients` collection, since no schema exists yet for these segments. Not consumed by any page in this plan; the next real client in one of these segments defines its own schema and wires one of these in.

- [ ] **Step 1: Create `src/layouts/LandingLayout.astro`**

```astro
---
/**
 * Skeleton layout — chưa có khách thật thuộc phân khúc "landing 1 trang, 1 CTA"
 * (vd: spa, khóa học ngắn hạn, sự kiện). KHÔNG tự thêm section/nav ở đây.
 *
 * Định hình cụ thể khi có khách #2/#3 thật thuộc phân khúc này, theo đúng
 * nguyên tắc Rule-of-Three — xem docs/superpowers/specs/2026-08-25-dg-site-kit-design.md.
 */
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---

<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  </head>
  <body class="bg-white text-ink-700">
    <header>
      {/* TODO: header thật (logo, 1 CTA chính) khi có khách thật thuộc phân khúc này */}
    </header>
    <main>
      <slot />
    </main>
    <footer>
      {/* TODO: footer thật khi có khách thật thuộc phân khúc này */}
    </footer>
  </body>
</html>
```

- [ ] **Step 2: Create `src/layouts/FnBLayout.astro`**

```astro
---
/**
 * Skeleton layout — chưa có khách thật thuộc phân khúc F&B (quán cafe/nhậu),
 * trọng tâm dự kiến là ProductGrid (menu). KHÔNG tự thêm section/nav ở đây.
 *
 * Định hình cụ thể khi có khách #2/#3 thật thuộc phân khúc này, theo đúng
 * nguyên tắc Rule-of-Three — xem docs/superpowers/specs/2026-08-25-dg-site-kit-design.md.
 */
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---

<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  </head>
  <body class="bg-white text-ink-700">
    <header>
      {/* TODO: header thật (logo, giờ mở cửa, CTA đặt bàn/chỉ đường) khi có khách thật */}
    </header>
    <main>
      <slot />
    </main>
    <footer>
      {/* TODO: footer thật khi có khách thật thuộc phân khúc này */}
    </footer>
  </body>
</html>
```

- [ ] **Step 3: Create `src/layouts/RetailLayout.astro`**

```astro
---
/**
 * Skeleton layout — chưa có khách thật thuộc phân khúc bán lẻ, trọng tâm
 * dự kiến là catalog sản phẩm. KHÔNG tự thêm section/nav ở đây.
 *
 * Định hình cụ thể khi có khách #2/#3 thật thuộc phân khúc này, theo đúng
 * nguyên tắc Rule-of-Three — xem docs/superpowers/specs/2026-08-25-dg-site-kit-design.md.
 */
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---

<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  </head>
  <body class="bg-white text-ink-700">
    <header>
      {/* TODO: header thật (logo, danh mục, giỏ hàng nếu cần) khi có khách thật */}
    </header>
    <main>
      <slot />
    </main>
    <footer>
      {/* TODO: footer thật khi có khách thật thuộc phân khúc này */}
    </footer>
  </body>
</html>
```

- [ ] **Step 4: Re-run the full build to confirm the skeletons don't break anything**

Run: `npm run build`
Expected: same as Task 9 — `astro check` 0 errors, build succeeds. `astro check` type-checks every `.astro` file in the project (referenced by a page or not), so this confirms the three new unwired layouts are still valid Astro/TypeScript on their own.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/LandingLayout.astro src/layouts/FnBLayout.astro src/layouts/RetailLayout.astro
git commit -m "feat: add unwired skeleton layouts for Landing/FnB/Retail segments"
```

---

### Task 11: Kit documentation & final verification

**Files:**
- Create: `README.md`
- Create: `CLAUDE.md`

**Interfaces:**
- Consumes: the whole repo (documents it).
- Produces: nothing consumed by other tasks — this is the last task.

- [ ] **Step 1: Create `README.md`**

```markdown
# DG Site Kit

Repo template để clone khi bắt đầu khách mới thuộc phân khúc **Nhóm A** (website
giới thiệu, không backend riêng). Không phải monorepo, không phải npm package —
chỉ là một repo Astro proven, sẵn sàng để copy.

Xem lý do và phạm vi ở `docs/superpowers/specs/2026-08-25-dg-site-kit-design.md`.

## Trạng thái từng layout

| Layout | Trạng thái | Ghi chú |
|---|---|---|
| `EduLayout` | **Đã proven** — copy từ khách #1 (trung tâm ngoại ngữ) | Dùng ngay cho khách Edu tiếp theo |
| `LandingLayout` | Skeleton, chưa có khách thật | Định hình khi có khách #2/#3 phân khúc landing 1 CTA |
| `FnBLayout` | Skeleton, chưa có khách thật | Định hình khi có khách #2/#3 phân khúc quán cafe/nhậu |
| `RetailLayout` | Skeleton, chưa có khách thật | Định hình khi có khách #2/#3 phân khúc bán lẻ |

## Bắt đầu khách mới (phân khúc Edu — layout đã proven)

1. Clone repo này sang thư mục dự án khách mới, `npm install`.
2. Xóa `src/content/clients/_example-edu.json` và 5 ảnh mẫu trong `src/assets/`
   (`placeholder-*.svg`).
3. Thêm ảnh thật của khách vào `src/assets/`.
4. Tạo `src/content/clients/<ten-khach>.json` theo đúng schema ở
   `src/content.config.ts`. Nội dung chưa có → bọc `"[MOCK: ...]"`, không bịa
   số/giá/địa chỉ nghe hợp lý như thật.
5. Sửa `src/pages/index.astro`: đổi `'_example-edu'` trong `getEntry('clients', ...)`
   thành slug file JSON mới.
6. Nếu khách có bộ màu riêng: copy `src/styles/themes/theme-teal.css` hoặc
   `theme-example.css` thành `theme-<khach>.css`, đổi giá trị token (giữ nguyên
   TÊN token), sửa dòng `@import` trong `src/styles/global.css`. Đồng thời sửa
   `content="..."` của thẻ `<meta name="theme-color">` trong `EduLayout.astro`
   cho khớp `--color-brand-900` mới.
7. Sửa `site` trong `astro.config.mjs` sang domain thật khi khách chốt.
8. Trước khi build production: `grep -rn "MOCK:" src/` phải trả về rỗng.
9. **Không sửa component nào** (`src/components/`, `src/layouts/EduLayout.astro`)
   trừ khi cả 3 khách Edu liên tiếp cùng cần một thay đổi giống nhau
   (nguyên tắc Rule-of-Three).

## Bắt đầu khách mới (phân khúc Landing/FnB/Retail — layout còn là skeleton)

Chưa có gì để "chỉ đổi JSON" ở đây — các layout này chưa được kiểm chứng bằng
khách thật. Khi có khách #1 thật của một trong ba phân khúc này: viết
`content.config.ts` riêng cho phân khúc đó, dựng section components theo đúng
nhu cầu khách đó (không cố tổng quát hóa trước), rồi mới cân nhắc đưa layout đó
vào trạng thái "đã proven" như `EduLayout` — sau khi dùng thật lần thứ ba.

## Lệnh

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # astro check + build ra dist/
npm run preview
```
```

- [ ] **Step 2: Create `CLAUDE.md`**

```markdown
# CLAUDE.md — Hướng dẫn cho Claude Code

Đây là **DG Site Kit** — repo template dùng để clone khi bắt đầu website khách
mới (dịch vụ Nhóm A của DashGrow). File này là quy ước kỹ thuật; khi làm việc
trong repo đã clone từ kit cho một khách cụ thể, người dùng sẽ cung cấp bối
cảnh khách đó (tên, ngành, nội dung) trực tiếp trong câu lệnh.

## Stack bắt buộc

| Layer | Công nghệ |
|---|---|
| Framework | Astro (+ React islands chỉ khi thật sự cần) |
| CSS | Tailwind CSS |
| Deploy | Cloudflare Pages |
| Ảnh | `<Image />` của `astro:assets` |
| Nội dung | Astro Content Collections (JSON + schema Zod) |

**KHÔNG dùng, kể cả khi thấy phù hợp hơn:** Next.js, Vercel, shadcn/ui,
framer-motion, styled-components, bất kỳ CSS-in-JS nào.

**KHÔNG tự thêm dependency mới.** Nếu thấy cần một package, hãy dừng lại và
hỏi trước, kèm lý do và phương án thay thế không cần package.

## 4 tiêu chí quyết định (áp dụng cho MỌI đề xuất)

1. **Rẻ nhất có thể** — ưu tiên free tier, không tạo chi phí cố định hàng tháng.
2. **Nhanh gọn lẹ** — giải pháp đơn giản, ít cấu hình. Tránh over-engineering.
3. **Scale được khi cần** — bắt đầu tối giản, có đường nâng cấp rõ ràng. Không
   đầu tư trước cho nhu cầu chưa tồn tại.
4. **Đúng quy mô khách hàng** — SMB không cần giải pháp enterprise.

## Quy tắc code

### Zero JS mặc định
Chỉ thêm `client:*` directive khi thành phần đó thật sự cần tương tác. Menu
mobile, accordion, carousel — ưu tiên HTML/CSS thuần (xem `Testimonials.astro`,
`EduLayout.astro` header mobile menu bằng `<details>`).

### KHÔNG over-abstract
Viết component đơn giản nhất chạy được cho khách hiện tại. **Rule-of-Three**:
một component/layout chỉ được tổng quát hóa/đưa vào trạng thái "đã proven" khi
đã dùng thật ở lần thứ ba. `LandingLayout`/`FnBLayout`/`RetailLayout` trong kit
này CÒN LÀ SKELETON chính vì lý do đó — không tự ý dựng đầy đủ khi chưa có
khách thật.

### Tách nội dung khỏi code
Mọi nội dung riêng của khách nằm trong `src/content/clients/*.json`, có schema
Zod validate ở `src/content.config.ts`. Component chỉ nhận props, không
hardcode nội dung.

### Nội dung nháp (mockup) vs nội dung thật
Mọi giá trị nháp phải bọc `"[MOCK: ...]"`. Ảnh mẫu dùng SVG tự vẽ
(`src/assets/placeholder-*.svg`) — **không** copy ảnh thật của bất kỳ khách nào
vào kit dùng chung. Trước khi build production: `grep -rn "MOCK:" src/` phải
trả về rỗng.

### Commit
Commit từng bước nhỏ, có ý nghĩa.

## Sàn chất lượng bắt buộc (mọi site trước khi giao khách)

- [ ] Responsive xuống 375px (iPhone SE) không vỡ layout
- [ ] Lighthouse Performance ≥ 95
- [ ] Ảnh dùng `<Image />`, có `width`/`height`, format WebP/AVIF
- [ ] Focus bàn phím nhìn thấy được, tôn trọng `prefers-reduced-motion`
- [ ] Meta title/description, Open Graph, favicon đầy đủ
- [ ] Không có JS nào tải mà không cần thiết
- [ ] `grep -rn "MOCK:" src/` trả về rỗng

## Khi không chắc

Dừng lại và hỏi, thay vì đoán: cần thêm dependency, nội dung thật chưa có, có
vẻ cần tương tác phức tạp, yêu cầu ngoài phạm vi đã thống nhất.
```

- [ ] **Step 3: Final verification — no real client data leaked into the kit**

Run:
```bash
grep -rn "The Future\|0813445466\|0397747489\|Bà Rịa\|Phước Hải\|thefutureenglishcentre\|Mr. Nhân\|Ms. Thắm" src/ README.md CLAUDE.md
```
Expected: no matches (exit code 1 / empty output). This confirms none of client #1's real identifying data (name, phones, addresses, staff names) leaked into the shared kit through copy-paste.

- [ ] **Step 4: Final full build check**

Run: `npm run build`
Expected: same as Tasks 9–10 — 0 errors, `dist/index.html` produced.

- [ ] **Step 5: Commit**

```bash
git add README.md CLAUDE.md
git commit -m "docs: add kit README and CLAUDE.md"
```

- [ ] **Step 6: Confirm working tree is clean**

Run: `git status`
Expected: `nothing to commit, working tree clean` (aside from the untracked, gitignored `node_modules/`, `dist/`, `.astro/`).
