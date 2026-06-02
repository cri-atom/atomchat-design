# atomchat-design — Claude working guide

Angular 17+ monorepo (Nx-style, manual workspace). Two projects:
- `projects/dev-app` — the demo/design-system sandbox app
- `projects/my-lib` — the shared component library (published as `@atomchat/my-lib`)

## Build & serve

```bash
npm run serve          # dev-app on http://localhost:4200
npx ng build dev-app --configuration development   # build check (0 errors = green)
```

Always verify with a build after touching my-lib exports or creating new components.

---

## Angular conventions — enforced everywhere

- **Standalone components** only. No NgModules except `AtomAgentBuilderModule` (legacy, do not expand).
- Signals API: `input()`, `output()`, `model()`, `signal()`, `computed()`. Never `@Input`/`@Output` decorators.
- `ChangeDetectionStrategy.OnPush` on every component.
- No comments in code unless the WHY is non-obvious.
- No `async` pipe — use `signal()` + `computed()` for reactive state.
- Imports array on every component: list only what's used.

---

## Design token system

All CSS custom properties defined in:
`projects/dev-app/src/styles/_atom-layout-tokens.scss`

Key tokens (use these, never hardcode colors/sizes):

```scss
/* Surfaces */
--atom-surface-base: #fdfdfd
--atom-surface-data: #f7f7f7
--atom-border-divider: #e8e7e6

/* Foreground */
--atom-fg-primary: #18181b
--atom-fg-secondary: #2d2b29
--atom-fg-tertiary: #52525c
--atom-fg-quaternary: #71717b

/* Brand */
--atom-brand: #ff6600
--atom-brand-10: #ffe8d9

/* Status */
--atom-status-activo-bg/fg, --atom-status-desactivado-bg/fg
--atom-status-connected-fg, --atom-status-error-bg/fg, --atom-status-pending-bg/fg

/* Spacing scale */
--atom-space-xs: 4px  --atom-space-sm: 8px  --atom-space-md: 12px
--atom-space-lg: 16px --atom-space-xl: 24px

/* Border radius */
--atom-radius-xs: 4px  --atom-radius-sm: 8px  --atom-radius-md: 12px  --atom-radius-pill: 9999px

/* Shell layout */
--atom-rail-width: 64px  --atom-header-height: 64px  --atom-secondary-width: 200px
```

Agentbuilder/canvas uses separate `--ab-*` tokens (see `my-lib/src/presentation/canvas/theme.ts`).

---

## Icon system — Font Awesome Pro v7

**Never use Lucide or any other icon library.** Only `AbIconComponent`.

```typescript
import { AbIconComponent } from '../../../../../my-lib/public-api';
// or from '@atomchat/my-lib'

// In template:
<ab-icon name="robot" size="md" />
<ab-icon name="gear" size="sm" variant="secondary" />
```

**Icon names** (`AbIconName`): any key from `ab-icon.registry.ts` (`AB_ICON_ALIASES`) or any raw Font Awesome Pro suffix.
Sizes: `'xs' | 'sm' | 'md' | 'lg' | 'xl'`
Variants: `'primary' | 'secondary' | 'brand' | 'danger'` (maps to token colors)

To add a new icon alias: edit `projects/my-lib/src/presentation/shared/ab-icon/ab-icon.registry.ts`, add to `AB_ICON_ALIASES`.

---

## Component library — my-lib

**Single import point:** `projects/my-lib/public-api.ts`
In dev-app files, always import from the relative path to public-api:
```typescript
import { AtomButtonComponent } from '../../../../../my-lib/public-api';
// depth varies — count up from the consumer file to projects/
```

### Platform primitives (`my-lib/src/platform/`)
Atomic shell-level UI, no app logic:

| Export | Selector | Notes |
|---|---|---|
| `AtomTagComponent` | `atom-tag` | `label`, `variant: 'neutral'\|'brand'\|'success'\|'error'\|'pending'` |
| `AtomStatusBadgeComponent` | `atom-status-badge` | `variant: AtomStatusVariant`, `label?` |
| `AtomAvatarComponent` | `atom-avatar` | `src`, `alt`, `initials`, `size: 'sm'\|'md'\|'lg'` |
| `AtomButtonComponent` | `atom-button` | `variant: 'primary'\|'brand'\|'ghost'\|'danger'`, `size: 'sm'\|'md'` |
| `AtomIconButtonComponent` | `atom-icon-button` | `name: AbIconName`, `label` (required for a11y) |

### Global components (`my-lib/src/components/`)
Migrated from feature `shared/` folders — reusable across all features:

| Export | Selector | Notes |
|---|---|---|
| `AtomSearchInputComponent` | `atom-search-input` | `[(value)]` two-way |
| `AtomFilterChipComponent` | `atom-filter-chip` | `label`, `active` |
| `AtomFilterDropdownComponent<T>` | `atom-filter-dropdown` | `options: AtomFilterOption<T>[]`, `[(selected)]` |
| `AtomPaginationComponent` | `atom-pagination` | `page`, `total`, `pageSize`; outputs `first/prev/next/last` |
| `AtomCardComponent` | `atom-card` | Content projection wrapper |
| `AtomStepperComponent` | `atom-stepper` | `steps: AtomStepperStep[]`, `currentStep` |
| `AtomModalStepperComponent` | `atom-modal-stepper` | Multi-step modal shell |
| `AtomStatusLabelComponent` | `atom-status-label` | `variant: string` (generic) |
| `AtomUserTypeBadgeComponent` | `atom-user-type-badge` | `type: 'interno'\|'externo'` |
| `AtomAvailabilityEditorComponent` | `atom-availability-editor` | ControlValueAccessor, `AtomDisponibilidad` model |
| `AtomChipComponent` | `atom-chip` | `variant: 'default'\|'live'\|'fictional'\|'success'` |
| `AtomChatBubbleComponent` | `atom-chat-bubble` | `role: 'user'\|'bot'`, `text` |
| `AtomDiffBlockComponent` | `atom-diff-block` | `label`, ng-content |
| `AtomSegmentedControlComponent` | `atom-segmented-control` | `options: AtomSegmentOption[]`, `[(value)]` |
| `AtomKpiCardComponent` | `atom-kpi-card` | `[kpi]: AtomKpiData` |
| `AtomSparklineComponent` | `atom-sparkline` | `values: number[]` |
| `AtomLineChartComponent` | `atom-line-chart` | Required: `labels: string[]`, `values: number[]` |
| `AtomBarChartComponent` | `atom-bar-chart` | Required: `labels: string[]`, `values: number[]` |
| `AtomDoughnutChartComponent` | `atom-doughnut-chart` | Required: `reasons: AtomDoughnutItem[]` |

Chart data is owned by the consuming page component, never hardcoded in the chart component.

---

## Shell architecture

Entry: `AtomAppShellComponent` wraps all routes.

```
AtomAppShellComponent
├── atom-primary-sidebar   (primary rail — hidden in canvas mode)
├── atom-header            (top bar — hidden in canvas mode)
└── <router-outlet>        (page content)
```

Canvas/agentbuilder mode hides sidebar+header via:
```typescript
// shell-nav.service.ts
hideSecondary = computed(() => CANVAS_ROUTE_PATTERN.test(this.router.url))
// CANVAS_ROUTE_PATTERN = /^\/campanas\/agentes\/[^/]+\/(editor|monitor)/
```

Shell components: `atom-section-heading` (with `[showBack]="true"` + `(back)` output replaces any custom page heading).

---

## Routing

Two files must be updated together when adding a page:

**`projects/dev-app/src/app/app.routes.ts`** — Angular routes
**`projects/dev-app/src/app/shell/nav.config.ts`** — sidebar nav entries

Route data type: `PageRouteData { title: string; description?: string }` — use the `ph()` helper.

Placeholder pages: use `AtomPlaceholderPageComponent` for not-yet-implemented routes.

### Current feature routes
```
/citas/calendarios              CalendariosPageComponent
/citas/tipos-evento             TiposEventoPageComponent
/citas/tipos-evento/nuevo       CrearEventoPageComponent
/plataforma/integraciones       IntegracionesPageComponent
/campanas/agentes               AgentesListPageComponent
/campanas/agentes/:id/editor    AgentBuilderPageComponent     ← canvas mode
/campanas/agentes/:id/monitor/* MonitorPageComponent          ← canvas mode
```

---

## Adding a new feature page — checklist

1. Create `projects/dev-app/src/app/pages/<module>/<name>/<name>-page.component.ts`
2. Add route in `app.routes.ts` under the correct parent path
3. Add nav entry in `nav.config.ts` → `SECONDARY_MODULES` (or as child of existing module)
4. Import `AtomSectionHeadingComponent` for the page header
5. Use `AtomPlaceholderPageComponent` for sub-routes not yet designed

---

## Adding a new primitive component — checklist

1. Create folder `projects/my-lib/src/components/<name>/`
2. Create `atom-<name>.component.ts` (standalone, OnPush, selector `atom-<name>`)
3. Use `--atom-*` tokens in SCSS, BEM class names
4. Export from `projects/my-lib/public-api.ts`
5. Run build to verify 0 errors

Never import feature-specific models inside my-lib components. If a type is needed, define it in the component file or a sibling `.model.ts`.

---

## CSS conventions

- BEM naming: `block__element--modifier`
- SCSS files colocated with component (`.component.scss`)
- `--atom-*` tokens for all color/spacing/typography — no hardcoded values
- `:host { display: block }` on components that need block layout
- For canvas shapes: `--ab-*` tokens from `theme.ts`

---

## What NOT to do

- No Lucide icons — only `AbIconComponent` (FA Pro v7)
- No hardcoded hex colors in templates or SCSS
- No `@Input()` / `@Output()` decorators — use `input()` / `output()` signals
- No `NgModule` declarations
- No mock/stub data inside `my-lib` components — pass via `input()`
- No feature-specific imports (citas models, monitor types) inside `my-lib`
- No `async` pipe
- Do not expand `my-lib/src/presentation/` — that folder is agentbuilder domain; new UI primitives go to `my-lib/src/components/` or `my-lib/src/platform/`
