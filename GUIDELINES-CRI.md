---
version: alpha
name: SnowUI — Dashboard / SaaS
description: SnowUI design system for dashboard and SaaS surfaces — 8px grid, Inter type scale, semantic backgrounds, glass elevation, light/dark themes. Reference frame from Figma file SnowUI.
figma: https://www.figma.com/design/PAA0JKidFMVK44KRRWB1zL/SnowUI?node-id=387056-421922
figma-node: "387056:421922"
extends: DESIGN.md
docs: https://snowui.byewind.com/
css-reference: https://snowui.github.io/home
colors:
  background-1: "{snowui.background-1}"
  background-2: "{snowui.background-2}"
  background-3: "{snowui.background-3}"
  foreground: "{snowui.foreground}"
  black-10: "{snowui.black-10}"
  black-80: "{snowui.black-80}"
  secondary-blue: "{snowui.secondary-blue}"
  surface: "#FFFFFF"
  surface-elevated: "{colors.background-2}"
  border: "{colors.background-3}"
  text: "{colors.foreground}"
  text-muted: "{colors.black-80}"
  text-subtle: "{colors.black-10}"
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: 600
    lineHeight: 48px
    letterSpacing: 0
  heading-1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: 600
    lineHeight: 32px
    letterSpacing: 0
  heading-2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: 600
    lineHeight: 24px
    letterSpacing: 0
  heading-3:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 600
    lineHeight: 18px
    letterSpacing: 0
  body:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 16px
    letterSpacing: 0
  body-semibold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 600
    lineHeight: 16px
    letterSpacing: 0
  caption:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 18px
    letterSpacing: 0
rounded:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 80px
  full: 9999px
spacing:
  unit: 4px
  base-grid: 8px
  hairline: 1px
  0: 0px
  4: 4px
  8: 8px
  12: 12px
  16: 16px
  20: 20px
  24: 24px
  28: 28px
  32: 32px
  40: 40px
  48: 48px
  80: 80px
  sidebar-width: 280px
  sidebar-collapsed: 72px
  topbar-height: 64px
  content-max-width: 1440px
  card-padding: 24px
  section-gap: 24px
  list-row-height: 48px
icon-size:
  sm: 16px
  md: 20px
  lg: 24px
  xl: 32px
snowui-variables:
  spacing:
    - "--spacing-4"
    - "--spacing-8"
    - "--spacing-12"
    - "--spacing-16"
    - "--spacing-24"
    - "--spacing-28"
    - "--spacing-40"
    - "--spacing-48"
    - "--spacing-80"
  corner-radius:
    - "--corner-radius-4"
    - "--corner-radius-8"
    - "--corner-radius-12"
    - "--corner-radius-16"
    - "--corner-radius-80"
  typography:
    - "--font-size-14"
    - "--font-size-16"
    - "--font-size-18"
    - "--font-size-24"
    - "--font-size-32"
    - "--font-size-48"
    - "--line-height-16"
    - "--line-height-18"
    - "--line-height-24"
    - "--line-height-32"
    - "--line-height-48"
    - "--font-weight-regular"
    - "--font-weight-semibold"
  color:
    - "--background-1"
    - "--background-2"
    - "--background-3"
    - "--foreground"
    - "--black-10"
    - "--black-80"
    - "--secondary-blue"
  effects:
    - "--effect-glass-1"
components:
  app-shell:
    backgroundColor: "{colors.background-1}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
  sidebar:
    backgroundColor: "{colors.background-2}"
    textColor: "{colors.text}"
    width: "280px"
    padding: "16px"
    itemGap: "8px"
    itemHeight: "40px"
    itemRounded: "{rounded.sm}"
  sidebar-nav-item-active:
    backgroundColor: "{colors.background-3}"
    textColor: "{colors.text}"
    typography: "{typography.body-semibold}"
  topbar:
    backgroundColor: "{colors.background-1}"
    textColor: "{colors.text}"
    height: "64px"
    padding: "0 24px"
    gap: "16px"
  content-area:
    backgroundColor: "{colors.background-1}"
    padding: "24px"
    gap: "24px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "24px"
    gap: "16px"
    shadow: "{effects.glass-1}"
  card-header:
    typography: "{typography.heading-3}"
    marginBottom: "16px"
  button-primary:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.background-1}"
    typography: "{typography.body-semibold}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    height: "40px"
  button-secondary:
    backgroundColor: "{colors.background-2}"
    textColor: "{colors.text}"
    typography: "{typography.body-semibold}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    height: "40px"
  input-field:
    backgroundColor: "{colors.background-2}"
    textColor: "{colors.text}"
    placeholderColor: "{colors.text-muted}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
    height: "40px"
  table-row:
    height: "48px"
    padding: "0 16px"
    borderColor: "{colors.border}"
  badge:
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "4px 8px"
  chart-container:
    backgroundColor: "{colors.background-2}"
    rounded: "{rounded.md}"
    padding: "16px"
effects:
  glass-1: "var(--effect-glass-1)"
---

## Overview

**SnowUI** (ByeWind) is a dashboard / SaaS design system built for **Figma variables**, auto layout, component properties, and **light + dark** themes. The UI optimizes for **freedom and clarity**: flexible column layouts, reorderable sidebar, definable brand color, and lean component sets so screens compose like blocks rather than one-off mocks.

Personality is **clean, airy, and product-grade** — generous whitespace on an **8px rhythm**, Inter at **14px** for operational UI, and elevation through **glass-style shadows** rather than heavy chrome. Accent color is typically a **brand-definable primary**; the CSS kit exposes **`secondary-blue`** for links and highlights.

**Figma reference:** [SnowUI — node 387056:421922](https://www.figma.com/design/PAA0JKidFMVK44KRRWB1zL/SnowUI?node-id=387056-421922).  
**Official docs:** [snowui.byewind.com](https://snowui.byewind.com/) (spacing, colors, text styles).

> **Access note:** The Figma MCP could not read file `PAA0JKidFMVK44KRRWB1zL` with the current account (view seat on Starter + Full on Producto). This document is built from **SnowUI published tokens** and the [CSS reference](https://snowui.github.io/home). Re-run extraction on the target node after granting the authenticated user **view access** to the file, then add frame-specific overrides under **Frame audit (pending)** below.

## Colors

SnowUI organizes color through **layered backgrounds** and **opacity-based neutrals**, not a long bespoke palette per screen.

| Token (CSS) | Role |
|-------------|------|
| `--background-1` | App shell / page base — lightest layer |
| `--background-2` | Sidebar, inset panels, input fills |
| `--background-3` | Hover rows, active nav, subtle separators |
| `--foreground` | Primary text and strong filled buttons |
| `--black-80` | Secondary text, placeholders |
| `--black-10` | Tertiary / disabled copy |
| `--secondary-blue` | Links, info accents, chart highlights |

**Theme behavior:**

- **Light:** backgrounds stack white → soft gray; text stays high contrast on `foreground`.
- **Dark:** same token names invert via Figma variables — always bind components to variables, never hard-coded hex in components.
- **Brand:** primary brand is a **user-defined variable** in SnowUI files; keep accents on buttons, active nav, and chart series — not large background fills.

**90% principle (SnowUI rule):** if a color appears in less than 10% of product UI, it should not become a global token.

## Typography

**Inter** is the sole UI family. SnowUI pairs **font-size** and **line-height** tokens with **matching numeric names** where possible (e.g. 24/24, 32/32) for display styles; body UI uses **14px size / 16px line-height** (ratio ~1.14).

### Type scale

| Style | Size | Line-height | Weight | Ratio | Use |
|-------|------|-------------|--------|-------|-----|
| Display | 48px | 48px | 600 | 1.0 | Marketing hero, empty states |
| Heading 1 | 32px | 32px | 600 | 1.0 | Page title |
| Heading 2 | 24px | 24px | 600 | 1.0 | Section title, card group header |
| Heading 3 | 18px | 18px | 600 | 1.0 | Card title, widget header |
| Body | 14px | 16px | 400 | 1.14 | Tables, forms, nav, buttons |
| Body semibold | 14px | 16px | 600 | 1.14 | Active nav, button labels, KPI labels |
| Caption | 14px | 18px | 400 | 1.29 | Helper text, meta under titles |

### Typographic rhythm rules

1. **14/16 is the UI heartbeat** — pair with **40px** control height (`8px` pad × 2 + 16px line) and **48px** table rows (`12px` vertical air × 2 + 16px).
2. **Headings use tight leading** (line-height = font-size) for dashboard density; do not apply display leading to table cells.
3. **Section spacing follows type jump:** after H2 (24px), use **`spacing-24`** (24px) before content; after H1 (32px), use **`spacing-40`** or **`spacing-48`**.
4. **Semibold, not bold**, for emphasis inside dashboard UI — reserve heavier weights for marketing pages inside the kit.
5. **Tabular figures** on KPI numbers and table numeric columns.

## Layout

### Grid & spacing rhythm

SnowUI uses an **8px base grid** with steps at **multiples of 4**. Official scale: **0, 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 80** — keep fewer than **16 distinct spacing tokens** in a product.

| Token | px | Rhythm role |
|-------|-----|-------------|
| `spacing-4` | 4 | Icon–label gap, dense chip padding |
| `spacing-8` | 8 | **Default internal gap** — nav items, button groups, inline fields |
| `spacing-12` | 12 | Comfortable field groups, card inner stacks |
| `spacing-16` | 16 | Card header → body; column gutter (tight) |
| `spacing-24` | 24 | **Card padding**, page content pad, section separation |
| `spacing-28` | 28 | Subsection breathing room |
| `spacing-40` | 40 | Major section breaks |
| `spacing-48` | 48 | Page vertical rhythm, hero blocks |
| `spacing-80` | 80 | Large empty states, marketing bands |

**Padding rhythm pattern (cards & panels):**

```
Outer page pad:     24px (spacing-24)
Card pad:           24px
Card header gap:    16px below title
Row / list gap:     8px
Field row gap:      12px
Section gap:        24–48px
```

### Dashboard shell

Typical SnowUI dashboard composition (aligns with kit page cases):

```
┌──────────┬────────────────────────────────────────────┐
│ Sidebar  │  Topbar (search, actions, profile)  64px │
│ 280px    ├────────────────────────────────────────────┤
│ pad 16   │  Content pad 24px                          │
│ gap 8    │  ┌─────────────┐ ┌─────────────┐         │
│          │  │ Card  r12   │ │ Card  r12   │  gap 24 │
│          │  │ pad 24      │ │ pad 24      │         │
│          │  └─────────────┘ └─────────────┘         │
└──────────┴────────────────────────────────────────────┘
```

- **Sidebar:** ~**280px** expanded, **~72px** collapsed; nav items **40px** tall, **8px** gap, **8px** radius on active/hover.
- **Topbar:** **64px** height, **24px** horizontal padding, **16px** between action clusters.
- **Content:** **24px** padding; **24px** gap between cards; supports **1-, 2-, or 3-column** grids with equal card widths.
- **Max width:** content often caps near **1440px** centered on wide monitors.

### Icon size rhythm

Icon sizes share the spacing scale: **16, 20, 24, 32**. Match icon size to control height:

| Control height | Icon |
|----------------|------|
| 32px compact | 16px |
| 40px default | 20px |
| 48px row | 20–24px |

## Elevation & Depth

SnowUI favors **glass / soft shadow** over hard borders.

| Level | Token / treatment | Use |
|-------|-------------------|-----|
| L0 — flat | none | Rows on `background-2`, sidebar |
| L1 — glass | `--effect-glass-1` | Cards on `background-1`, dropdowns |
| L2 — emphasis | stronger blur + border hairline | Modals, command palette |
| Hairline | 1px `background-3` | Table dividers, card separators |

**Stacking:** page → sidebar/topbar → cards → popovers → modals.

Prefer **one elevation step per jump** — do not stack glass card on glass card without a background shift.

## Shapes

Corner radius uses the **same numeric scale as spacing** (multiples of 4):

| Token | px | Apply to |
|-------|-----|----------|
| `corner-radius-4` | 4 | Tags, dense list hover |
| `corner-radius-8` | 8 | Buttons, inputs, nav items |
| `corner-radius-12` | 12 | Cards, dropdown panels |
| `corner-radius-16` | 16 | Large widgets, modals |
| `corner-radius-80` | 80 | Pills, avatars, marketing chips |
| full | 9999px | Circular icon buttons, status dots |

**Radius rule:** larger containers → larger radius; **do not** use `80px` on rectangular cards — reserve for pills and avatars.

**Borders:** 1px on `background-3` when needed; default separation is **background contrast + glass shadow**.

## Motion

SnowUI kit interactions are generally **subtle and fast**:

- **120–150ms** color/background on nav items and buttons.
- **200ms** sidebar collapse width and theme switch.
- **180ms opacity** for dropdowns and tooltips.

Avoid bounce on data-dense surfaces. Support **prefers-reduced-motion** with instant theme and layout changes.

## Components

### Sidebar navigation

- Width **280px**, background `background-2`, pad **16px**.
- Items: h **40px**, pad **8px 12px**, radius **8px**, gap **8px** between icon and label.
- Active: fill `background-3`, **semibold 14/16**; inactive: regular, `black-80` icon optional.
- Section labels: **12px or 14px** muted, **spacing-16** above groups.

### Topbar

- H **64px**, pad **0 24px**, `background-1` or transparent on scroll.
- Search: h **40px**, fill `background-2`, radius **8px**, pad **8px 12px**.
- Action cluster gap **8px**; avatar **32–40px** circle.

### Cards & widgets

- Background `surface` / white (light), radius **12px**, pad **24px**, internal gap **16px**.
- Title: **18/18 semibold**; metric KPI: **32/32** or **24/24**.
- Chart area: fill `background-2`, pad **16px**, radius **12px** inside card.

### Buttons

| Variant | Background | Text | H | Pad |
|---------|------------|------|---|-----|
| Primary | `foreground` | `background-1` | 40px | 8px 16px |
| Secondary | `background-2` | `foreground` | 40px | 8px 16px |
| Ghost | transparent | `foreground` | 40px | 8px 12px |

Radius **8px** on all; gap **8px** icon–label.

### Forms

- Input h **40px**, bg `background-2`, radius **8px**, pad **8px 12px**, text **14/16**.
- Label above field: **14/16 semibold**, **spacing-8** below label, **spacing-12** between fields.
- Error text: **14/18**, semantic red (define per product; not in base CSS snippet).

### Tables & lists

- Row h **48px**, pad **0 16px**, border-bottom **1px** `background-3`.
- Header row: **14/16 semibold**, `black-80` or `foreground` depending on emphasis.
- Cell gap from icon to text: **8px**.

### Badges & status

- Pad **4px 8px**, radius **full** or **80px**, text **14/16**.
- Semantic colors sparingly — prefer neutral badge + colored dot.

## Rhythm cheat sheet

1. **8px** is the default gap; **24px** is the default card/page pad.
2. Body UI is always **14px / 16px line-height** unless you are in a heading level.
3. Control heights cluster on **40px** (compact) and **48px** (rows).
4. Radius ladder: **8 → 12 → 16** for interactive → card → modal.
5. Use **CSS variables** / Figma variables — never one-off hex on components.
6. Apply the **90% rule** before adding a new spacing or color token.

## Frame audit (pending)

After Figma access to `PAA0JKidFMVK44KRRWB1zL` / node `387056:421922` is granted, record here:

- [ ] Exact screen name and breakpoint (desktop / mobile)
- [ ] Measured sidebar width and collapsed state
- [ ] Column count and card dimensions on this frame
- [ ] Any deviations from default 14/16 body or 24px card pad
- [ ] Brand primary hex bound in variables
- [ ] Screenshots-linked component variants used

## Relationship to other docs

| Topic | DESIGN.md | GUIDELINES-NEW.md | This doc (SnowUI) |
|-------|-----------|-------------------|-------------------|
| Context | Agent Builder inspector + graph | Atom canvas builder | Dashboard / SaaS kit |
| Grid | 4px base | 4px base | **8px base** (4px sub-steps) |
| Body type | 12px | 12px | **14px** |
| Accent | Orange + ink | Blue + violet + ink | Brand variable + `secondary-blue` |
| Elevation | Editorial shadow | Float chips | **Glass (`effect-glass-1`)** |
| Density | High | High | Medium — more airy card pad |

Use **SnowUI** for admin/dashboard surfaces; use **DESIGN.md** / **GUIDELINES-NEW.md** for the agent builder product chrome unless explicitly migrating the product to SnowUI tokens.

## Do's and Don'ts

**Do** stay on the **8px spacing scale** — prefer 8, 16, 24 over odd values.

**Do** use **14/16** for all operational copy in dashboard views.

**Do** bind components to **Figma/CSS variables** for theme switching.

**Do** separate **core components** (buttons, inputs) from **business widgets** (charts, billing cards) when extending the kit.

**Don't** add spacing or radius values outside multiples of **4** without kit approval.

**Don't** use display typography (32px+) inside tables or dense forms.

**Don't** rely on borders alone — use **background steps** (`background-1` → `2` → `3`) for hierarchy.

**Don't** exceed **~16** spacing tokens in a single product fork of SnowUI.

**Don't** mix SnowUI dashboard patterns into the agent canvas (`GUIDELINES-NEW.md`) without a deliberate migration — type scale and grid differ.
