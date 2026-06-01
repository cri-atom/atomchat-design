---
version: alpha
name: Agent Builder — Canvas (new)
description: Canvas-first agent authoring UI from Atom DS — floating chrome clusters, vertical node flow, bottom config panels, and mode/AI accents. Extends DESIGN.md; Figma frame 10892:21841.
figma: https://www.figma.com/design/rBALD4N2xJBtxSBYcsjm3c/Agent-Builder?node-id=10892-21841
extends: DESIGN.md
colors:
  canvas: "#FAFAFA"
  surface: "#FFFFFF"
  surface-muted: "#F4F4F5"
  surface-elevated: "#E4E4E7"
  border: "#E4E4E7"
  border-strong: "#D4D4D8"
  border-emphasis: "#71717B"
  text: "#18181B"
  text-muted: "#52525C"
  text-light: "#71717B"
  text-disabled: "#9F9FA9"
  mode-editor: "#00A6F5"
  mode-monitor: "#71717B"
  ai-primary: "#8023FF"
  ai-secondary: "#7107E7"
  inverse-deep: "#09090B"
  on-inverse: "#FAFAFA"
  toggle-on: "#09090B"
  toggle-off: "#E4E4E7"
  toggle-knob-on: "#FAFAFA"
  toggle-knob-off: "#FFFFFF"
  node-selection-ring: "rgba(161, 161, 161, 0.7)"
  shadow: "rgba(9, 9, 11, 0.08)"
typography:
  label:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0
  label-regular:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
    letterSpacing: 0
  node-title:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 700
    lineHeight: 24px
    letterSpacing: 0
  segmented-tab:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0
rounded:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  full: 9999px
spacing:
  unit: 4px
  hairline: 1px
  2xs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  chrome-bar-height: 40px
  icon-touch: 32px
  section-header-height: 40px
  compact-field-height: 24px
  float-panel-width: 320px
  float-panel-height: 176px
  node-card-width: 300px
  node-card-height: 64px
  node-avatar-size: 40px
  popover-width: 280px
  footer-reserve: 56px
  header-outer-pad: 8px
  identity-cluster-max-width: 320px
  toggle-width: 28.8px
  toggle-height: 16px
  textarea-fixed-height: 80px
atom-ds:
  note: Figma variable names; map to product spacing/rounded tokens when implementing
  spacing:
    none: 0px
    xxs: 2px
    xs: 4px
    s: 8px
    sm: 12px
    m: 16px
  rounded:
    xs: 4px
    s: 8px
    sm: 12px
    m: 16px
components:
  app-shell:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text}"
    typography: "{typography.label-regular}"
  float-cluster:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.md}"
    padding: "0 4px"
    height: "40px"
    shadow: "0 6px 7px {colors.shadow}"
  float-cluster-identity:
    maxWidth: "320px"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "8px"
    size: "32px"
    iconSize: "16px"
  segmented-control:
    backgroundColor: "{colors.surface}"
    tabActiveBackground: "{colors.surface-muted}"
    tabActiveColor: "{colors.mode-editor}"
    tabInactiveColor: "{colors.mode-monitor}"
    rounded: "{rounded.sm}"
    tabPadding: "8px 8px 4px"
    tabMinSize: "29px"
  chrome-text-button:
    typography: "{typography.segmented-tab}"
    rounded: "{rounded.sm}"
    padding: "8px"
    height: "32px"
  chrome-primary-disabled:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.text-disabled}"
  node-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    borderColor: "{colors.border-strong}"
    rounded: "{rounded.lg}"
    width: "300px"
    height: "64px"
    headerPadding: "12px 4px 12px 16px"
    headerGap: "16px"
  node-card-selected:
    borderColor: "{colors.border-emphasis}"
    focusRing: "0 0 0 2px {colors.node-selection-ring}"
  node-avatar:
    backgroundColor: "{colors.surface-muted}"
    iconColor: "{colors.text-light}"
    size: "40px"
    rounded: "{rounded.md}"
  node-connector-button:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border-strong}"
    rounded: "{rounded.sm}"
    padding: "8px"
  float-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    width: "320px"
    height: "176px"
    shadow: "0 6px 14px {colors.shadow}"
  float-panel-header:
    height: "40px"
    padding: "8px"
    typography: "{typography.label}"
    borderBottom: "1px {colors.border}"
  float-panel-body:
    padding: "8px"
    rowGap: "8px"
  textarea-muted:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.text-muted}"
    typography: "{typography.label-regular}"
    rounded: "{rounded.sm}"
    padding: "12px"
    height: "80px"
  compact-select:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-muted}"
    typography: "{typography.label-regular}"
    rounded: "{rounded.sm}"
    padding: "4px 12px"
    height: "24px"
  compact-select-bordered:
    borderColor: "{colors.border-strong}"
    padding: "4px 8px"
  toggle-on:
    trackColor: "{colors.toggle-on}"
    knobColor: "{colors.toggle-knob-on}"
  toggle-off:
    trackColor: "{colors.toggle-off}"
    knobColor: "{colors.toggle-knob-off}"
  popover-menu:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    width: "280px"
    shadow: "0 6px 7px {colors.shadow}"
  list-item:
    height: "40px"
    padding: "8px"
    gap: "8px"
    rounded: "{rounded.xs}"
  canvas-footer-bar:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    height: "40px"
    padding: "0 8px"
    groupGap: "16px"
    shadow: "0 6px 7px {colors.shadow}"
---

## Overview

The **canvas builder** frame is a full-viewport workspace: a quiet **off-white field** (`#FAFAFA`), **three floating white clusters** along the top (identity, Editor/Monitor mode, actions), a **vertical node column** in the center, **four bottom panels** for node configuration, and a **centered footer toolbar** for undo, zoom, and fit. Personality stays **technical and dense** — the UI reads as precision instruments on glass, not a marketing surface.

Accent hierarchy differs from the legacy inspector spec in `DESIGN.md`: **sky blue** signals the active Editor mode, **violet** signals AI affordances (sparkles), and **near-black ink** carries primary commit states (toggle on, publish when enabled). Orange from the parent doc remains valid for “add” and construction patterns elsewhere; on this frame, construction is mostly neutral plus connector buttons.

**Source of truth:** [Agent-Builder — Canvas](https://www.figma.com/design/rBALD4N2xJBtxSBYcsjm3c/Agent-Builder?node-id=10892-21841&m=dev) (`10892:21841`). Built on **Atom Design System** tokens in Figma.

## Colors

Neutrals match a **zinc ramp** aligned with Atom DS semantic tokens:

- **Canvas:** `#FAFAFA` — largest area; always the quietest layer.
- **Surfaces:** `#FFFFFF` for cards, floats, nodes, popovers.
- **Muted fills:** `#F4F4F5` for textarea backgrounds, segment active tab, avatar wells, disabled primary buttons.
- **Borders / dividers:** `#E4E4E7` (tertiary hairlines); `#D4D4D8` (secondary, node borders, fields); `#71717B` (emphasis — selected node stroke).
- **Text:** `#18181B` primary; `#52525C` placeholders and field values; `#71717B` icons and inactive mode; `#9F9FA9` disabled commit labels.

**Mode & AI accents (canvas-specific):**

- **Editor active:** `#00A6F5` on icon and label in segmented control.
- **Monitor inactive:** `#71717B`.
- **AI actions:** `#8023FF` / `#7107E7` for sparkles and rich-text assist icons.

**Actions:**

- **Publish (disabled):** background `#F4F4F5`, text `#9F9FA9` — reads as “not ready,” not broken.
- **Toggle on:** track `#09090B`, knob `#FAFAFA`.
- **Toggle off:** track `#E4E4E7`, knob `#FFFFFF`.

## Typography

**Inter** only on this frame — two rhythmic compases that must not be mixed in the same row:

| Role | Size | Line-height | Weight | Ratio | Use |
|------|------|-------------|--------|-------|-----|
| UI compact | 12px | 16px | 400 / 500 | 1.33 | Panel headers, buttons, fields, lists, chrome title |
| Node entity | 16px | 24px | 700 | 1.5 | Card titles (`Agente`, `Subagente`) |

**Vertical rhythm rules:**

1. **16px line-height** is the typographic beat — it aligns with **40px** section headers (`8px` pad × 2 + 16px text + optical balance).
2. **24px** compact fields = `4px` vertical pad + 16px line (select rows, bordered function chips).
3. **64px** node cards = `12px` vertical header pad + 40px avatar row.
4. **80px** textarea blocks use 12px inner pad; rich actions sit **6px** from bottom-left inside the field.
5. **Segmented / chrome icons** at **14px**; control icons at **16px** (12.8px inner optical size in DS).

**Tracking:** `0` everywhere on this frame. Use **tabular figures** for zoom percentage in the footer bar.

**Code-like strings** (`validar_cupon`, etc.) stay in **Inter Regular 12/16** — not monospace on this screen unless a dedicated code editor appears.

## Layout

Global rhythm: **4px base grid**. Most decisions land on **8px** (internal) and **16px** (between blocks).

### Viewport shell

- Reference artboard: **1280px** wide, full height.
- **Header** outer padding: **8px**; three independent float clusters (not one full-width bar).
- **Footer reserve:** **56px** bottom band so floating panels and toolbar never collide.
- **Bottom panel row:** `left: 8px`, `bottom: 56px`, **16px** gap between panels.

### Spacing scale (product tokens)

| Token | px | Typical use |
|-------|-----|-------------|
| `2xs` | 2 | Segmented shell pad; micro button vertical pad |
| `xs` | 4 | Float cluster internal gap; card header `pr` |
| `sm` | 8 | **Default pad** — headers, bodies, buttons, list rows, column gap node→connector |
| `md` | 12 | Card header vertical; select horizontal pad; textarea inner pad; float/panel radius |
| `lg` | 16 | Gap between bottom panels; gap between node groups; card header content gap |

### Structural dimensions

| Element | Size |
|---------|------|
| Float cluster (top / footer) | h **40px**, radius **12px** |
| Identity cluster max-width | **320px** |
| Node card | **300 × 64px**, radius **16px** |
| Node avatar | **40 × 40px**, radius **12px** |
| Bottom float panel | **320 × 176px**, radius **12px** |
| Popover (integraciones) | w **280px** |
| Section header | h **40px**, p **8px** |
| List / menu row | h **40px**, p **8px** |
| Toggle | **28.8 × 16px** |

### Composition diagram

```
┌─ 8px pad ─────────────────────────────────────────────┐
│ [Identity float]   [Editor|Monitor]   [Actions float] │  40px
├───────────────────────────────────────────────────────┤
│                    · canvas #FAFAFA ·                  │
│              ┌─ node 300×64 ─┐                         │
│              │   [+] 8px    │  16px between groups    │
│              └──────────────┘                         │
│  ┌ panel ┐ ┌ panel ┐ ┌ panel ┐ ┌ panel ┐  +16px gap   │  320×176
│  └───────┘ └───────┘ └───────┘ └───────┘  bottom 56px │
│              [ undo | zoom | fit ]  footer 40px       │
└───────────────────────────────────────────────────────┘
```

## Elevation & Depth

Shadows stay **soft and cool** (`#09090B` at 8% opacity). Prefer shadow over heavy borders to separate white on white.

| Level | Recipe | Components |
|-------|--------|------------|
| L1 — chrome chip | `0 6px 7px rgba(9,9,11,0.08)` | Top floats, footer toolbar |
| L2 — panel / popover | `0 6px 14px rgba(9,9,11,0.08)` | Bottom panels, integrations menu |
| L3 — selection | `0 0 0 2px rgba(161,161,161,0.7)` | Selected node card (plus 1px border) |
| Micro — toggle knob | `0 1.6px 3.2px rgba(9,9,11,0.08)` | Toggle thumb |

**Stacking:** canvas (base) → nodes → bottom panels → popovers/menus → modals (not shown on this frame).

## Shapes

Radius scales with **container area** — do not reuse the same radius on a 32px icon target and a 320px panel.

| Radius | px | Apply to |
|--------|-----|----------|
| `xs` | 4 | List item hover corners |
| `sm` | 8 | Buttons, icon buttons, fields, footer bar, connector “+”, textarea |
| `md` | 12 | Float clusters, bottom panels, popover shell, avatars |
| `lg` | 16 | Node cards |
| `full` | pill | Toggle track and knob |

**Borders:** always **1px** (`stroke-xs`). Default `#D4D4D8`; section dividers `#E4E4E7`; selected node `#71717B`.

**Atom DS naming note:** In Figma, token `sm` = **12px** radius and `s` = **8px**. Product tokens in the YAML above use `sm: 8px`, `md: 12px` — map explicitly when syncing from Figma (`atom-ds.rounded.sm` → product `rounded.md`).

## Motion

Inherit timing from `DESIGN.md` unless a component spec overrides:

- **150ms** hover on list rows, icon buttons, segment tabs.
- **~60ms ease-out** for popover anchor tracking; **~180ms opacity** show/hide.
- Footer and float clusters: subtle shadow on hover optional; avoid bounce on dense controls.

Respect **reduced motion** — opacity-only or instant state for toggles and panel open.

## Components

### Top chrome — three floats

**Left (identity):** logo in **32px** target (24px mark), back + settings icon buttons, editable title **12/16 Regular**, max-width **320px**. Cluster radius **12px**, internal gap **4px**, shadow L1.

**Center (mode):** segmented **Editor | Monitor**. Active tab: fill `#F4F4F5`, text/icon `#00A6F5`. Inactive: transparent, `#71717B`. Tab pad `8px 8px 4px`, min **29px**, radius **8px** per tab.

**Right (actions):** AI sparkles (**violet**), history, play, **Guardar** (tertiary text button), **Publicar** (primary disabled until ready). Icon targets **32px**, **8px** pad.

### Canvas — node column

- Vertical stack, **16px** between node groups, **8px** between card and connector **+**.
- Card: white, **1px** border, **16px** radius, header `pl 16 / pr 4 / py 12`, **16px** gap avatar→title.
- Avatar well `#F4F4F5`, icon `#71717B`, **40px**, radius **12px**.
- Title: **16/24 Bold**.
- Connector: secondary button, **8px** radius, **8px** pad, **1px** `#D4D4D8` border.
- Selected: border `#71717B` + L3 focus ring.

### Bottom floating panels (×4)

Shared shell: **320×176**, radius **12px**, shadow L2, scrollable body.

| Panel | Header | Body pattern |
|-------|--------|----------------|
| Subagente | Icon + label, **40px** | Textarea **80px** on `#F4F4F5`, placeholder `#52525C`, AI + reset actions bottom-left |
| Formatos de respuesta | Title only | Rows: compact select + toggle, **8px** row gap |
| Integraciones | Title + add (**#E4E4E7** icon well) | List item: logo **20px** + **12/16 Medium** label |
| Funciones | Title + add | Bordered select rows + minus icon; function icon leading |

Section headers: **40px** h, **8px** pad, **1px** `#E4E4E7` bottom border where sections stack.

### Popover — integraciones

- Width **280px**, radius **12px**, shadow L1–L2.
- Header **40px**; content pad **8px**, **12px** gap before list.
- Search field: fill `#F4F4F5`, radius **8px**, pad `8px 4px`, search icon + placeholder **12/16**.
- Options: **40px** rows, **8px** pad/gap, **4px** row radius, brand logos ~**20–24px**.

### Footer toolbar

- Centered float, h **40px**, radius **8px**, shadow L1, pad **0 8px**.
- Groups separated by **16px**: Undo/Redo | Zoom −/+ | Fit view.
- Icon buttons match top chrome (**8px** pad, **16px** icons).

## Rhythm cheat sheet (for new screens)

Use this checklist when designing additional canvas views:

1. All spacing on the **4px grid** — prefer **8** and **16** over odd values.
2. Operational copy: **12px / 16px line-height**; entity titles: **16px / 24px**.
3. Section headers: **40px** tall with **8px** padding.
4. Radius ladder: **8 → 12 → 16** as surface area grows.
5. Canvas stays **#FAFAFA**; white floats carry the UI.
6. Blue = **mode/active editor**; violet = **AI**; ink = **commit / toggle on** — do not use orange for primary commit on this shell.

## Relationship to DESIGN.md

| Topic | DESIGN.md (legacy) | This doc (canvas new) |
|-------|-------------------|------------------------|
| Primary accent | Orange `#FF6600` | Blue editor + violet AI |
| Side UI | Inspector **376px** right | Bottom panels **320px** |
| Top bar | ~**52px** unified | **40px** float clusters + **8px** margin |
| Toggle selected | Orange accent | Ink `#09090B` |
| Focus fields | Orange stroke | Muted fills; bordered on function rows |

When implementing, treat **`DESIGN.md` as product-wide defaults** and **`GUIDELINES-NEW.md` as the canvas shell override** for layout, accents, and Atom DS token mapping.

## Do's and Don'ts

**Do** keep the canvas quieter than any white panel or float.

**Do** align labels to the **16px** vertical beat (40px headers, 24px compact fields).

**Do** use **16px** gaps between major columns and node groups; **8px** inside sections.

**Do** map Figma Atom tokens (`s`, `sm`, `m`) to product tokens explicitly — names differ.

**Don't** use 16/24 typography for form labels in panels — reserve it for node/card entity names.

**Don't** place orange as the primary commit color on this frame — ink and disabled gray carry publish/save hierarchy.

**Don't** flatten floats — white chips on off-white canvas need **L1/L2** shadow to read as draggable instruments.

**Don't** mix inspector-side patterns (uppercase micro tabs, 376px column) into the bottom-panel canvas layout without adaptation.
