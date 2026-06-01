---
version: alpha
name: Agent Builder
description: Light, precision-tool interface for visual agent authoring — graph canvas, floating inspector, and neutral chrome with a warm orange accent.
colors:
  primary: "#FF6600"
  white: "#FFFFFF"
  black: "#000000"
  canvas: "#FAFAFA"
  surface: "#FFFFFF"
  surface-muted: "#F4F4F5"
  surface-subtle: "#FAFAFA"
  surface-elevated: "#E4E4E7"
  border: "#E4E4E7"
  border-strong: "#D4D4D8"
  border-focus: "#A1A1AA"
  text: "#18181B"
  text-secondary: "#27272A"
  text-muted: "#52525C"
  text-light: "#71717B"
  text-disabled: "#9F9FA9"
  brand-dark: "#DB5700"
  brand-container: "#FFF4ED"
  inverse: "#18181B"
  inverse-deep: "#09090B"
  inverse-alt: "#0F1115"
  inverse-alt-hover: "#1A1D24"
  on-inverse: "#FAFAFA"
  link: "#193CB9"
  link-container: "#EFF6FF"
  error: "#FB2C37"
  error-dark: "#E01E28"
  error-container: "#FFF0F0"
  error-on-container: "#9E0812"
  success: "#00C951"
  success-container: "#F1FDF4"
  success-on-container: "#006145"
  success-http: "#00C951"
  warning: "#F1B100"
  warning-text: "#A76000"
  disabled-bg: "#C4C4C8"
  disabled-text: "#3A3A3A"
  edge-default: "#D4D4D8"
  edge-selected: "#A1A1AA"
  edge-success: "#00C951"
  edge-failure: "#FB2C37"
  selection-tint: "#FFA2A3"
  port: "#71717B"
  port-stroke: "#F5F5F5"
typography:
  display:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0
  title:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0
  body:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-strong:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: 0
  label:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  micro:
    fontFamily: Inter
    fontSize: 8px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0
  chrome-input:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0
  material-button:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0
  material-body:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  code:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
rounded:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  xxl: 24px
  xxxl: 28px
  xxxxl: 32px
  full: 9999px
spacing:
  unit: 4px
  hairline: 1px
  2xs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  2xl: 24px
  3xl: 32px
  4xl: 48px
  navbar-height: 52px
  chrome-bar-height: 40px
  icon-touch: 32px
  fab-size: 48px
  inspector-width: 376px
components:
  app-shell:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
  chrome-cluster:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.sm}"
    padding: "0 8px"
    height: "40px"
  chrome-primary-action:
    backgroundColor: "{colors.text}"
    textColor: "{colors.white}"
    typography: "{typography.chrome-input}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "32px"
  chrome-primary-action-hover:
    backgroundColor: "{colors.text-secondary}"
    textColor: "{colors.white}"
  inspector-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: "0"
    width: "376px"
    height: "100%"
  inspector-title:
    typography: "{typography.title}"
    textColor: "{colors.text}"
  inspector-tab-active:
    textColor: "{colors.text}"
    typography: "{typography.label}"
  inspector-tab-inactive:
    textColor: "{colors.text-light}"
    typography: "{typography.label}"
  form-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "8px"
  form-field-focus:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
  dashed-add-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "8px"
  canvas-zoom-bar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "40px"
  fab-neutral:
    backgroundColor: "{colors.border-strong}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.full}"
    size: "48px"
  fab-danger:
    backgroundColor: "{colors.error}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    size: "48px"
  global-settings-launcher:
    backgroundColor: "{colors.inverse-alt}"
    textColor: "{colors.white}"
    rounded: "{rounded.sm}"
    size: "32px"
  material-filled-button:
    backgroundColor: "{colors.inverse}"
    textColor: "{colors.white}"
    typography: "{typography.material-button}"
    rounded: "{rounded.sm}"
    height: "36px"
    padding: "0 16px"
  material-filled-button-hover:
    backgroundColor: "{colors.inverse-deep}"
    textColor: "{colors.white}"
  material-filled-button-disabled:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.text-disabled}"
  material-outlined-button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    typography: "{typography.material-button}"
    rounded: "{rounded.sm}"
    height: "36px"
    padding: "0 16px"
  material-text-button:
    backgroundColor: "transparent"
    textColor: "{colors.text-muted}"
    typography: "{typography.material-button}"
    rounded: "{rounded.sm}"
    height: "36px"
    padding: "0 16px"
  validation-badge:
    backgroundColor: "{colors.error}"
    textColor: "{colors.white}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "0 4px"
    height: "16px"
  add-action-uppercase:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.label}"
    rounded: "0"
    padding: "0"
---

## Overview

The experience reads as a **calm, high-density builder**: a wide neutral canvas for thinking in graphs, with crisp white “instrument” clusters along the top and a tall **floating inspector** that feels like paper on glass. Personality is **professional and technical**, not playful — typography is small and efficient, contrast is confident, and color is used sparingly so structure and relationships stay legible.

Emotionally the UI should feel **focused and trustworthy**: plenty of light gray air, hairline borders instead of heavy frames, and shadows that lift panels just enough to separate layers. The **warm orange** is the signature accent: it signals “add,” selection, and affordances tied to construction, while **near-black** carries the weight of primary commit-style actions so the interface never drifts into candy-bright territory.

## Colors

Neutrals follow a **zinc-like ramp** from an off-white canvas through muted fills to deep ink text. Surfaces stack as white cards on a **very light warm gray** field so the graph never competes with chrome for brightness.

- **Canvas and quiet fills:** Use the lightest grays for infinite workspace and hover washes; keep large areas calm.
- **Ink hierarchy:** Primary copy is near-black; secondary and muted steps handle metadata, placeholders, and icon strokes without washing out.
- **Brand orange:** Reserved for emphasis — links to “add,” dashed placeholders, focus rings on controls, and highlights on the diagram. Pair with a **soft peach container** when you need a tinted field behind orange text or badges.
- **Inverse blocks:** Deep charcoal and blue-black variants anchor floating controls that sit over the canvas (for example a compact launcher), with white iconography on top.
- **Semantics:** Red for errors and destructive affordances on the graph; green for success paths and positive edge states; amber for cautions. Keep semantic fills **light tinted backgrounds** with darker text on top for form-style messaging, and **saturated strokes** on the canvas where state must read at a glance.

## Typography

**Inter** is the default voice: neutral, geometric, and legible at **12px** body sizes. Titles in the side panel use **16px bold**; the top chrome name field uses **14px medium**. **All-caps micro labels** (with slight positive tracking) tag secondary actions and tab badges so they scan as controls, not prose.

**JetBrains Mono** (or an equivalent humanist monospace) is appropriate for JSON, prompts, and any literal code — slightly larger than the tiniest UI copy, with relaxed line height for readability in multiline editors.

Numeric zoom percentage and similar counters should use **tabular figures** so labels do not jitter when values change.

## Layout

Rhythm is built on a **4px base** with **8px and 12px** as the most common gaps inside panels; **16px to 24px** pads section edges and modal interiors. The main layout is **full-viewport**: a fixed top bar (~52px) over a **beneath canvas** that fills the window, with the inspector docked as a **tall card inset from the right** (~12px margin) at a fixed width near **376px** so form density stays predictable.

Floating controls on the canvas — zoom, circular primary actions — sit **inset from corners** with comfortable margin (on the order of **24px**) so they remain reachable without obscuring node work. Popovers and context menus align to triggers with **8px** vertical offset from anchors.

## Elevation & Depth

Depth is **soft and editorial**, not dramatic. Default floating surfaces use a **low, wide shadow** in a cool near-black at low opacity so cards feel slightly above the canvas. **Modals and the inspector** use a **deeper, larger-radius shadow** to establish the top layer; dropdowns sit between those two levels.

**Backdrop overlays** for modal states use **semi-transparent black** plus a **light blur** when you need to push attention to a single dialog. Debug or diagnostic overlays can use a stronger dim.

Representative shadow recipes (CSS-ready):

- **Raised chrome chip:** `0px 6px 14px rgba(9, 9, 11, 0.08)`
- **Dropdown / menu:** `0px 6px 14px rgba(9, 9, 11, 0.08)` with a **1px** neutral border.
- **Large panel / inspector:** `0px 25px 50px -12px rgba(9, 9, 11, 0.25)`
- **Modal emphasis:** `0px 32px 64px rgba(0, 0, 0, 0.18)`
- **Subtle field / card:** `0px 2px 4px rgba(9, 9, 11, 0.08)`

Stacking intent: canvas decorations and zoom chrome sit low; **node menus and edge tools** above the paper; **inspector and global overlays** highest. Primary buttons inside Material-style dialogs may mirror **elevation-card** level while the scrim carries the dim.

## Shapes

Corners are **rounded but disciplined**: **8px** on compact top-chrome controls and Material-style buttons, **12px** on form fields and medium menus, **16px** on the inspector shell and dialog surfaces, and **full pills** for circular FABs and zoom-sized round controls. **Small square node action chips** use a **tight 4px** radius so they read as tools, not pills.

Dashed outlines signal **“insert here”** rows (add another item) and stay **1px** with neutral stroke color and orange label text.

## Motion

Interaction motion is **short and linear-feeling** — about **150ms** for hover background and color on rows, buttons, and tabs. **Slightly longer ease (~160ms)** suits combined transforms and shadow on floating launchers. **Positioning** of anchored palettes can use **~60ms ease-out** so palettes track nodes without slosh, paired with **~180ms opacity** for show and hide.

Modal entry can use a **brief overlay fade (~200ms ease-out)** and a **panel scale or slide with an overshoot curve** (for example `cubic-bezier(0.34, 1.56, 0.64, 1)` over ~320ms) so dialogs feel responsive, not sluggish. FABs may **scale to ~108%** on hover for a tactile affordance.

Respect **reduced motion**: prefer instant state changes or opacity-only transitions when the user requests less animation.

## Components

### Top chrome

Two **white rounded clusters** float in the bar: navigation and identity on the left (back control, divider, mark, editable title), actions on the right (secondary text buttons, primary filled commit). Icon buttons are **32px** touch targets with **muted default** color washing to **ink** on hover. Validation entry uses a **soft red wash** when issues exist and a **numeric pill** for error count.

### Inspector

A **white column** with **header row** (bold title or input, close), **underline-style tabs** with a **2px** active indicator aligned to ink text, and **scrollable body**. Tab badges are **uppercase microcaps** on a **muted gray capsule**. Divider lines are **1px** hairlines; section rhythm matches form spacing tokens.

### Canvas

Background is **off-white** with a **subtle dot grid** (light neutral dots on a **16px** square repeat) so free positioning feels guided. **Floating zoom** is a compact **pill bar** with icon buttons and a centered percentage. **Circular FABs** stack at bottom-right: neutral gray for additive or utility actions, **signal red** for destructive graph operations with a **darker red** hover.

**Context menus** are white, bordered, **large-radius** lists with **icon + title + description** rows; section labels sit between rules in **uppercase muted** type. **Node hover chips** are small bordered squares with **12px** icons; copy hovers pick up **orange** border and icon, delete hovers pick up **error** colors.

### Forms and Material layer

Outlined fields use **neutral outlines** that **lift to orange** on focus for caret and stroke. Filled primary actions in dialogs are **ink, not orange**, with **pressed near-black**; danger remains **saturated red**. Checkboxes and toggles align orange **selected** states with the brand accent. Select panels match **menu** elevation and border treatment.

## Do's and Don'ts

**Do** keep the canvas visually quieter than panels — let the graph lines and nodes carry structure, not the background.

**Do** use orange for **construction and focus**, and ink for **commitment and submission**, so users learn a consistent hierarchy.

**Do** maintain **small type** and **tight vertical rhythm** in the inspector; this product optimizes for information density.

**Don't** sprinkle orange on large filled backgrounds except in narrow badges or chips; it quickly overwhelms the neutral system.

**Don't** flatten elevation — bordered white on white still needs a **hint of shadow** so draggable panels and menus read as separate surfaces.

**Don't** use heavy borders on every row; prefer **hover wash** and **single hairline separators** to stay lightweight.
