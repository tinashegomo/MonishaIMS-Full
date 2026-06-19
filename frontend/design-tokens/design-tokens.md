# Design Tokens Reference

> Exported from Figma — 8 token groups — Last modified: 2026-06-01

---

## 1. Primitives — Color

### Red (Brand)

| Token | Value |
|-------|-------|
| `red-50` | `#fff5f5` |
| `red-100` | `#ffe0e0` |
| `red-200` | `#ffbbbb` |
| `red-300` | `#ff8888` |
| `red-400` | `#ff4d4d` |
| `red-500` | `#e60000` |
| `red-600` | `#cc0000` |
| `red-700` | `#a80000` |
| `red-800` | `#780000` |
| `red-900` | `#4d0000` |

### Neutral

| Token | Value |
|-------|-------|
| `neutral-0` | `#ffffff` |
| `neutral-50` | `#fafafa` |
| `neutral-100` | `#f5f5f5` |
| `neutral-200` | `#e8e8e8` |
| `neutral-300` | `#d0d0d0` |
| `neutral-400` | `#adadad` |
| `neutral-500` | `#858585` |
| `neutral-600` | `#636363` |
| `neutral-700` | `#404040` |
| `neutral-800` | `#2b2b2b` |
| `neutral-900` | `#1a1a1a` |
| `neutral-950` | `#0f0f0f` |
| `neutral-1000` | `#000000` |

### Status

| Token | Value |
|-------|-------|
| `success-400` | `#4ade80` |
| `success-500` | `#22c55e` |
| `success-600` | `#16a34a` |
| `success-900` | `#14532d` |
| `warning-400` | `#fcd34d` |
| `warning-500` | `#f59e0b` |
| `warning-600` | `#d97706` |
| `warning-900` | `#451a03` |
| `info-400` | `#60a5fa` |
| `info-500` | `#3b82f6` |
| `info-600` | `#2563eb` |
| `info-900` | `#1e3a5f` |

---

## 2. Light Theme (Semantic Aliases)

### Background

| Token | Resolves To | Hex |
|-------|-------------|-----|
| `background.default` | `neutral-0` | `#ffffff` |
| `background.subtle` | `neutral-50` | `#fafafa` |

### Surface

| Token | Resolves To | Hex |
|-------|-------------|-----|
| `surface.default` | `neutral-0` | `#ffffff` |
| `surface.elevated` | `neutral-50` | `#fafafa` |
| `surface.muted` | `neutral-100` | `#f5f5f5` |

### Text

| Token | Resolves To | Hex |
|-------|-------------|-----|
| `text.primary` | `neutral-1000` | `#000000` |
| `text.secondary` | `neutral-600` | `#636363` |
| `text.muted` | `neutral-500` | `#858585` |
| `text.disabled` | `neutral-300` | `#d0d0d0` |

### Border

| Token | Resolves To | Hex |
|-------|-------------|-----|
| `border.default` | `neutral-200` | `#e8e8e8` |
| `border.strong` | `neutral-300` | `#d0d0d0` |
| `border.focus` | `red-500` | `#e60000` |

### Brand

| Token | Resolves To | Hex |
|-------|-------------|-----|
| `brand.primary` | `red-500` | `#e60000` |
| `brand.hover` | `red-600` | `#cc0000` |
| `brand.pressed` | `red-700` | `#a80000` |
| `brand.subtle` | `red-100` | `#ffe0e0` |
| `brand.tint` | `red-50` | `#fff5f5` |

### State

| Token | Resolves To | Hex |
|-------|-------------|-----|
| `state.success.success-main` | `success-500` | `#22c55e` |
| `state.success.success-bg` | `success-400` | `#4ade80` |
| `state.success.success-hover` | `success-600` | `#16a34a` |
| `state.warning.warning-main` | `warning-500` | `#f59e0b` |
| `state.warning.warning-bg` | `warning-400` | `#fcd34d` |
| `state.warning.warning-hover` | `warning-600` | `#d97706` |
| `state.info.info-main` | `info-500` | `#3b82f6` |
| `state.info.info-bg` | `info-400` | `#60a5fa` |
| `state.info.info-hover` | `info-600` | `#2563eb` |
| `state.danger-main` | `red-500` | `#e60000` |
| `state.danger-hover` | `red-600` | `#cc0000` |
| `state.danger-pressed` | `red-700` | `#a80000` |

---

## 3. Dark Theme (Semantic Aliases)

### Background

| Token | Resolves To | Hex |
|-------|-------------|-----|
| `background.default` | `neutral-950` | `#0f0f0f` |
| `background.subtle` | `neutral-900` | `#1a1a1a` |

### Surface

| Token | Resolves To | Hex |
|-------|-------------|-----|
| `surface.default` | `neutral-900` | `#1a1a1a` |
| `surface.elevated` | `neutral-800` | `#2b2b2b` |
| `surface.muted` | `neutral-700` | `#404040` |

### Text

| Token | Resolves To | Hex |
|-------|-------------|-----|
| `text.primary` | `neutral-0` | `#ffffff` |
| `text.secondary` | `neutral-200` | `#e8e8e8` |
| `text.muted` | `neutral-400` | `#adadad` |
| `text.disabled` | `neutral-600` | `#636363` |

### Border

| Token | Resolves To | Hex |
|-------|-------------|-----|
| `border.default` | `neutral-800` | `#2b2b2b` |
| `border.strong` | `neutral-700` | `#404040` |
| `border.focus` | `red-500` | `#e60000` |

### Brand

| Token | Resolves To | Hex |
|-------|-------------|-----|
| `brand.primary` | `red-500` | `#e60000` |
| `brand.hover` | `red-600` | `#cc0000` |
| `brand.pressed` | `red-700` | `#a80000` |
| `brand.subtle` | `red-900` | `#4d0000` |
| `brand.tint` | `red-800` | `#780000` |

### State (Dark)

| Token | Resolves To | Hex |
|-------|-------------|-----|
| `state.success.success-main` | `success-400` | `#4ade80` |
| `state.success.success-bg` | `success-900` | `#14532d` |
| `state.warning.warning-main` | `warning-400` | `#fcd34d` |
| `state.warning.warning-bg` | `warning-900` | `#451a03` |
| `state.info.info-main` | `info-400` | `#60a5fa` |
| `state.info.info-bg` | `info-900` | `#1e3a5f` |
| `state.danger.danger-main` | `red-400` | `#ff4d4d` |
| `state.danger.danger-bg` | `red-900` | `#4d0000` |

---

## 4. Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `spacing-0` | `0px` | No spacing |
| `spacing-2` | `2px` | Tiny adjustment |
| `spacing-4` | `4px` | Tiny gap |
| `spacing-8` | `8px` | Small gaps |
| `spacing-12` | `12px` | Compact spacing |
| `spacing-16` | `16px` | Default spacing / padding |
| `spacing-20` | `20px` | Slightly larger gap |
| `spacing-24` | `24px` | Card padding |
| `spacing-32` | `32px` | Section padding / spacing |
| `spacing-40` | `40px` | Large gaps |
| `spacing-48` | `48px` | Major section spacing |
| `spacing-64` | `64px` | Page separation |
| `spacing-80` | `80px` | Very large spacing |
| `spacing-96` | `96px` | Hero-level spacing |

---

## 5. Typography

### Font Family

| Token | Value |
|-------|-------|
| `font-family` | `Inter` |

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `weight.regular` | `400` | Normal text |
| `weight.medium` | `500` | Slight emphasis |
| `weight.semibold` | `600` | Strong emphasis |
| `weight.bold` | `700` | Heavy emphasis |

### Headings

| Token | Size | Line Height | Weight | Letter Spacing |
|-------|------|-------------|--------|----------------|
| `H1` | `32px` | `40px` | `700` (bold) | `-1%` |
| `H2` | `24px` | `32px` | `700` (bold) | `-0.5%` |
| `H3` | `20px` | `28px` | `700` (bold) | `0%` |
| `H4` | `18px` | `26px` | `600` (semibold) | `0%` |

### Body

| Token | Size | Line Height | Weight | Letter Spacing |
|-------|------|-------------|--------|----------------|
| `body-large` | `16px` | `24px` | `400` (regular) | `0%` |
| `body-normal` | `14px` | `20px` | `700` (bold) | `0%` |
| `body-small` | `12px` | `16px` | `700` (bold) | `0%` |

> ⚠️ **Note:** `body-normal` and `body-small` reference `{text.weight.bold}` (700) — this is likely a Figma authoring error. Verify against the source file; body text is typically `400` (regular).

### UI Elements

| Token | Size | Line Height | Weight | Letter Spacing |
|-------|------|-------------|--------|----------------|
| `ui.label` | `14px` | `16px` | `600` (semibold) | `0.15px` |
| `ui.caption` | `12px` | `16px` | `400` (regular) | `0.1px` |
| `ui.badge` | `12px` | `16px` | `600` (semibold) | `0.1px` |

---

## 6. Grid

| Breakpoint | Columns | Gutter | Margin |
|------------|---------|--------|--------|
| Mobile | `4` | `16px` | `16px` |
| Tablet | `8` | `24px` | `24px` |
| Desktop / Laptop | `12` | `24px` | `32px` |

---

## 7. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-4` | `4px` | Tiny chips |
| `radius-8` | `8px` | Inputs and buttons |
| `radius-12` | `12px` | Cards |
| `radius-16` | `16px` | Larger panels |
| `radius-999` | `999px` | Pills and badges |

---

## 8. Elevation

| Token | Level | Usage |
|-------|-------|-------|
| `elevation-1` | `1` | Inputs and dropdowns |
| `elevation-2` | `2` | Cards |
| `elevation-3` | `3` | Modals |
| `elevation-4` | `4` | Floating panels |
