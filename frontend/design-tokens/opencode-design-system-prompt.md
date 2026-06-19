# OpenCode Prompt — Tailwind v4 Design System (Update Existing CSS)

---

## Context

This project uses **Tailwind CSS v4** via `@tailwindcss/vite`. There is **no `tailwind.config.js`** — all configuration is done in CSS using `@theme`, `@theme inline`, and standard CSS custom properties.

The existing `src/index.css` already has the following in place — **do not remove or modify these**:

- `@import` for Inter font from Google Fonts
- `@import "tailwindcss"`
- `@theme` block with primitive color tokens: `--color-primary-*`, `--color-neutral-*`, `--color-success-*`, `--color-warning-*`, `--color-info-*`
- `@layer base` rules for `body`, headings, `input`, `button`, and basic dark mode overrides
- Custom scrollbar styles

Your job is to **append** the missing token groups to this file. Do not rewrite what already exists.

---

## What to add

### 1. Spacing scale — inside `@theme`

Add a complete spacing scale. In Tailwind v4, `--spacing-*` variables in `@theme` generate `p-*`, `m-*`, `gap-*`, `w-*`, `h-*` utilities automatically.

```css
@theme {
  --spacing-0:  0px;
  --spacing-2:  2px;
  --spacing-4:  4px;
  --spacing-8:  8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
}
```

---

### 2. Typography — inside `@theme`

In Tailwind v4, font size utilities are generated from `--text-*`. You can pair each size with a default line height using `--text-*--line-height`. Font weight utilities come from `--font-weight-*`.

```css
@theme {
  /* Font weights */
  --font-weight-regular:  400;
  --font-weight-medium:   500;
  --font-weight-semibold: 600;
  --font-weight-bold:     700;

  /* Heading sizes */
  --text-h1: 2rem;          /* 32px */
  --text-h1--line-height: 2.5rem;   /* 40px */

  --text-h2: 1.5rem;        /* 24px */
  --text-h2--line-height: 2rem;     /* 32px */

  --text-h3: 1.25rem;       /* 20px */
  --text-h3--line-height: 1.75rem;  /* 28px */

  --text-h4: 1.125rem;      /* 18px */
  --text-h4--line-height: 1.625rem; /* 26px */

  /* Body sizes */
  --text-body-large: 1rem;       /* 16px */
  --text-body-large--line-height: 1.5rem;  /* 24px */

  --text-body-normal: 0.875rem;  /* 14px */
  --text-body-normal--line-height: 1.25rem; /* 20px */

  --text-body-small: 0.75rem;    /* 12px */
  --text-body-small--line-height: 1rem;     /* 16px */

  /* UI element sizes */
  --text-ui-label: 0.875rem;   /* 14px */
  --text-ui-label--line-height: 1rem;  /* 16px */

  --text-ui-caption: 0.75rem;  /* 12px */
  --text-ui-caption--line-height: 1rem; /* 16px */

  --text-ui-badge: 0.75rem;    /* 12px */
  --text-ui-badge--line-height: 1rem;   /* 16px */

  /* Letter spacing */
  --tracking-h1:      -0.01em;
  --tracking-h2:      -0.005em;
  --tracking-h3:      0em;
  --tracking-h4:      0em;
  --tracking-label:   0.15px;
  --tracking-caption: 0.1px;
  --tracking-badge:   0.1px;
}
```

---

### 3. Border radius — inside `@theme`

In Tailwind v4, `--radius-*` variables generate `rounded-*` utilities.

```css
@theme {
  --radius-chip:  4px;    /* tiny chips */
  --radius-input: 8px;    /* inputs and buttons */
  --radius-card:  12px;   /* cards */
  --radius-panel: 16px;   /* larger panels */
  --radius-pill:  9999px; /* pills and badges */
}
```

---

### 4. Elevation (box shadows) — inside `@theme`

In Tailwind v4, `--shadow-*` variables generate `shadow-*` utilities.

```css
@theme {
  --shadow-elevation-1: 0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06);
  --shadow-elevation-2: 0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.05);
  --shadow-elevation-3: 0 10px 15px -3px rgb(0 0 0 / 0.10), 0 4px 6px -4px rgb(0 0 0 / 0.06);
  --shadow-elevation-4: 0 20px 25px -5px rgb(0 0 0 / 0.12), 0 8px 10px -6px rgb(0 0 0 / 0.06);
}
```

Usage reference:
- `elevation-1` → inputs, dropdowns
- `elevation-2` → cards
- `elevation-3` → modals
- `elevation-4` → floating panels / popovers

---

### 5. Semantic color aliases — light + dark mode

This is the most important section. Semantic tokens are **not** defined in `@theme` directly — they are defined as regular CSS custom properties on `:root` and `.dark`, then exposed to Tailwind via `@theme inline`.

This pattern ensures that adding `.dark` to `<html>` automatically switches all semantic colors without needing `dark:` variants on every element.

#### Step 1 — Define semantic variables on `:root` (light) and `.dark`

```css
:root {
  /* Background */
  --bg-default: var(--color-neutral-0);
  --bg-subtle:  var(--color-neutral-50);

  /* Surface */
  --surface-default:  var(--color-neutral-0);
  --surface-elevated: var(--color-neutral-50);
  --surface-muted:    var(--color-neutral-100);

  /* Text */
  --text-primary:   var(--color-neutral-1000);
  --text-secondary: var(--color-neutral-600);
  --text-muted:     var(--color-neutral-500);
  --text-disabled:  var(--color-neutral-300);

  /* Border */
  --border-default: var(--color-neutral-200);
  --border-strong:  var(--color-neutral-300);
  --border-focus:   var(--color-primary-500);

  /* Brand */
  --brand-primary: var(--color-primary-500);
  --brand-hover:   var(--color-primary-600);
  --brand-pressed: var(--color-primary-700);
  --brand-subtle:  var(--color-primary-100);
  --brand-tint:    var(--color-primary-50);

  /* State — Success */
  --state-success-main:  var(--color-success-500);
  --state-success-bg:    var(--color-success-400);
  --state-success-hover: var(--color-success-600);

  /* State — Warning */
  --state-warning-main:  var(--color-warning-500);
  --state-warning-bg:    var(--color-warning-400);
  --state-warning-hover: var(--color-warning-600);

  /* State — Info */
  --state-info-main:  var(--color-info-500);
  --state-info-bg:    var(--color-info-400);
  --state-info-hover: var(--color-info-600);

  /* State — Danger */
  --state-danger-main:    var(--color-primary-500);
  --state-danger-hover:   var(--color-primary-600);
  --state-danger-pressed: var(--color-primary-700);
}

.dark {
  /* Background */
  --bg-default: var(--color-neutral-950);
  --bg-subtle:  var(--color-neutral-900);

  /* Surface */
  --surface-default:  var(--color-neutral-900);
  --surface-elevated: var(--color-neutral-800);
  --surface-muted:    var(--color-neutral-700);

  /* Text */
  --text-primary:   var(--color-neutral-0);
  --text-secondary: var(--color-neutral-200);
  --text-muted:     var(--color-neutral-400);
  --text-disabled:  var(--color-neutral-600);

  /* Border */
  --border-default: var(--color-neutral-800);
  --border-strong:  var(--color-neutral-700);
  --border-focus:   var(--color-primary-500); /* unchanged */

  /* Brand */
  --brand-primary: var(--color-primary-500); /* unchanged */
  --brand-hover:   var(--color-primary-600);
  --brand-pressed: var(--color-primary-700);
  --brand-subtle:  var(--color-primary-900);
  --brand-tint:    var(--color-primary-800);

  /* State — Success (lighter for dark bg) */
  --state-success-main: var(--color-success-400);
  --state-success-bg:   var(--color-success-900);

  /* State — Warning */
  --state-warning-main: var(--color-warning-400);
  --state-warning-bg:   var(--color-warning-900);

  /* State — Info */
  --state-info-main: var(--color-info-400);
  --state-info-bg:   var(--color-info-900);

  /* State — Danger */
  --state-danger-main: var(--color-primary-400);
  --state-danger-bg:   var(--color-primary-900);
}
```

#### Step 2 — Expose semantic tokens to Tailwind via `@theme inline`

`@theme inline` tells Tailwind v4 to generate utilities from these variables but resolve them at runtime (not build time), which is required when the variable value changes between themes.

```css
@theme inline {
  /* Background */
  --color-bg-default: var(--bg-default);
  --color-bg-subtle:  var(--bg-subtle);

  /* Surface */
  --color-surface-default:  var(--surface-default);
  --color-surface-elevated: var(--surface-elevated);
  --color-surface-muted:    var(--surface-muted);

  /* Text */
  --color-text-primary:   var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-muted:     var(--text-muted);
  --color-text-disabled:  var(--text-disabled);

  /* Border */
  --color-border-default: var(--border-default);
  --color-border-strong:  var(--border-strong);
  --color-border-focus:   var(--border-focus);

  /* Brand */
  --color-brand-primary: var(--brand-primary);
  --color-brand-hover:   var(--brand-hover);
  --color-brand-pressed: var(--brand-pressed);
  --color-brand-subtle:  var(--brand-subtle);
  --color-brand-tint:    var(--brand-tint);

  /* State */
  --color-success-main:  var(--state-success-main);
  --color-success-bg:    var(--state-success-bg);
  --color-success-hover: var(--state-success-hover);

  --color-warning-main:  var(--state-warning-main);
  --color-warning-bg:    var(--state-warning-bg);
  --color-warning-hover: var(--state-warning-hover);

  --color-info-main:  var(--state-info-main);
  --color-info-bg:    var(--state-info-bg);
  --color-info-hover: var(--state-info-hover);

  --color-danger-main:    var(--state-danger-main);
  --color-danger-hover:   var(--state-danger-hover);
  --color-danger-pressed: var(--state-danger-pressed);
}
```

---

### 6. Update `@layer base` — update existing body rule

The existing body rule uses `bg-neutral-50` and `text-neutral-900`. Update it to use the semantic tokens instead so it responds to dark mode automatically:

```css
@layer base {
  body {
    @apply bg-bg-default text-text-primary antialiased font-sans min-h-screen;
  }
}
```

Also remove the existing separate `.dark body` override in `@layer base` since semantic tokens handle that now.

---

### 7. Grid container — `@layer components`

Add a responsive container component using the grid spec:

```
Mobile  (default): 16px horizontal padding
Tablet  (md: 768px): 24px horizontal padding
Desktop (lg: 1024px): 32px horizontal padding, max-width: 1280px
```

```css
@layer components {
  .container-grid {
    @apply w-full mx-auto px-16 md:px-24 lg:px-32 max-w-[1280px];
  }
}
```

---

## Summary of generated Tailwind utility classes

After these additions, the following utility classes will be available:

**Semantic colors** (auto dark-mode aware)
- `bg-bg-default`, `bg-bg-subtle`
- `bg-surface-default`, `bg-surface-elevated`, `bg-surface-muted`
- `text-text-primary`, `text-text-secondary`, `text-text-muted`, `text-text-disabled`
- `border-border-default`, `border-border-strong`, `border-border-focus`
- `bg-brand-primary`, `text-brand-primary`, `bg-brand-subtle`, `bg-brand-tint`
- `bg-success-main`, `bg-success-bg`, `text-success-main`
- `bg-warning-main`, `bg-warning-bg`, `text-warning-main`
- `bg-info-main`, `bg-info-bg`, `text-info-main`
- `bg-danger-main`, `text-danger-main`

**Spacing** — `p-16`, `px-24`, `mt-32`, `gap-8`, `mb-48`, etc.

**Typography** — `text-h1`, `text-h2`, `text-body-normal`, `text-ui-label`, `text-ui-badge`, etc.

**Font weights** — `font-regular`, `font-medium`, `font-semibold`, `font-bold`

**Radius** — `rounded-chip`, `rounded-input`, `rounded-card`, `rounded-panel`, `rounded-pill`

**Shadows** — `shadow-elevation-1`, `shadow-elevation-2`, `shadow-elevation-3`, `shadow-elevation-4`

---

## Final requirement

After writing the CSS, produce a **usage cheatsheet** showing these components built with the new utility classes:

1. Primary button (brand color, hover, focus ring using `border-border-focus`)
2. Destructive / danger button
3. Card (`bg-surface-elevated`, `rounded-card`, `shadow-elevation-2`, `p-24`)
4. Badge — success, warning, danger variants (`rounded-pill`, `text-ui-badge`)
5. Text input with focus ring (`rounded-input`, `border-border-default`, `focus:border-border-focus`)
6. Section layout using `container-grid`
