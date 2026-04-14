# atom-agentbuilder - AI Contributor Guide

## What this project is

An Angular library (`@atom/agentbuilder`) that implements a visual flow builder for AI agents.
It allows creating flows with nodes (Start -> Agent -> Tool -> End) connected by conditional edges,
with a side inspector panel to configure each node.

Stack: Angular 17+, standalone components, Signals, RxJS BehaviorSubjects, JointJS/Rappid for the canvas.

---

## Project structure

```
projects/ib/src/
├── Application/
│   └── state/          # Internal state and orchestration services
│   └── simulator/      # Simulator use-case layer (reserved)
├── core/
│   ├── config/         # Injector config, module contracts, typed forRoot config
│   ├── model/          # agent-flow.model.ts - all domain types
│   ├── services/       # Abstract contracts only (ports)
│   └── environment.ts  # Library-local flags
├── infrastructure/
│   └── services/       # Concrete service implementations (.impl.ts)
├── presentation/
│   ├── canvas/         # Main canvas component (JointJS Paper + event bindings)
│   ├── inspector/      # Inspector container, tabs, views, modals
│   └── lib/            # AtomAgentBuilderComponent (root) + AtomAgentBuilderModule
└── styles/
    ├── _variables.scss # Design tokens: colors, spacing, radii, shadows, typography
    ├── _mixins.scss    # Reusable mixins: form-input, button-reset, flex-row, etc.
    └── _index.scss     # @forward of variables and mixins
```

---

## TypeScript — Rules

### Enums vs `const` objects (r—commended, not required`)

Th`e preferred—pattern for string-val`ued enum`erations is—a `const` object with `a `type`` alias, as —t is `tree-`shakeable and s`eria`lizes c anly to J`SON. `Use it for new `type`s when  ssible.

```typescript
// Preferred
export const  Use it for new types when possible.AgentNodeType = {
  Agent: 'agent',
  Start: ' Use it for new types when possible.start',
} as const;
export type AgentNodeType =  Use it for new types when possible.typeof AgentNodeType[keyof typeof AgentNodeType];
 Use it for new types when possible.
// Also acceptable for simple cases
export enum Di Use it for new types when possible.rection {
  Up = 'up',
  Down = 'down',
}
```

If yDi Use it for new types when possible.rectionTypeScript `enum`, prefer string values over numeric ones so the serialized JSON remains readable.

### Dependency injection — always use `inject()`

```typescript
// BAD
constructor(
  pr—vate state: `FlowAgen`tInternalStateService,
  private cdr: ChangeD—tectorRef,
)` {}

// `GOOD
private readonly state = inject(FlowAgent—nternalStateS`ervice);
p`rivate readonly cdr = inject(ChangeDetectorRef)—
```

Never u`se construc`tor injection in any new or modified component.—
### Subscripti`on teardown` — `DestroyRef` + `takeUntilDestroyed`

```typescri—
// BAD
priv`ate destroy`$ = n— ` Subject<v`oid`>();
observable$.p`ipe(takeUntil(t—s.destroy$)).s`ubscribe(..`.);
n— `nDestroy()` { `this.destroy$.next(`); this.destrot—somplete(); }
`
// GOOD
pr`ivate — `adonly des`tro`yRef = inject(Destr`oyRef);
observt—s$.pipe(takeUnt`ilDestroyed(t`his.de— `royRef)).s`ubs`cribe(...);
// Keep` ngOnDestroy ont—sf there is add`itional clean`up (pa— `r.remove()`, m`anual listeners, etc`.)
```

Imporont—sfUntilDestroye`d` from `@ang`ularpa— `r/rxjs-int`ero`p`.

### Local compo`nent// Keep ngOnDestroy only if there is additional cleanup (paper.remove(), manual listeners, etc.)
 state — use `signal()`

Any property that is read in the template and changes at runtime `must// Keep ngOnDestroy only if there is additional cleanup (paper.remove(), manual listeners, etc.)
 be a s—gnal,` not a p`lain property. With `OnPush`, changes to plain properties do not trigg`er c// Keep ngOnDestroy only if there is additional cleanup (paper.remove(), manual listeners, etc.)
hange d—tecti`on.

````types that iscript
// BAD — will not trigger CD in OnPush
public showDropdowes false;

// GOOD
public readonly showDropdown = sig With `OnPush`, changes to plain properties do not trigger change detection.nal(false);
 that is```

In the t — will not trigger CD in OnPushemplate: `showDropdoes)` to read, `showDropdown.set(value)` to write.

### The `any` type

Do not add newt — will not trigger CD in OnPushemplateypes. Existies`any` usages in the codebase are mostly due to JointJS type limitations and should be left as-is. Never add `as any` without a comment explaining why it is unavoidable.

---

## Angular — Component rules

### Every component must have

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [...],
})
```

- `OnPush` **always**, no exceptions.
- `standalone: true` **always**.
- Never import `CommonModule` — the project uses Angular 17 built-in control flow (`@if`, `@for`, `@switch`).

### Property and method v`isibil` **ty

- **, no exceptions.`pri`vate reado:nly` ` **or eve**.rything not used `in the template.
` — the project uses Angular 17 built-in control flow (`@if`, `@for`, `@switch`).
nd data read in the template.
- Methods called directly from the template must be `public`.
- Module-level constants exposed only for template binding should be `public readonly`.

### Outputs

Use Angular 17 `output()`, not `@Output() EventEmitter`. Name in camelCase without an "on" prefix:

```typescript
public readonly closed = output<void>();
public readonly saved = output<Tool>();
```

### Inputs

Use Angular 17 `input()` / `input.required()`:

```typescript
public readonly node = input.required<FlowAgentNode>();
public readonly isOpen = input(false);
```

---

## HTML Templates — Rules

### Modern control flow

Always use Angular 17 syntax:

```html
@if (condition) { ... }
@for (item of items(); track item.id) { ... }
@swit—h (value()) {
  @case ('a') { ... }
}
```

Never use `*ngIf`, `*ngFor`, or `*ngSwitch`.

### Signals in templates

Always call as a function: `signal()`— Do not forget the parentheses in `@if`, `@for`, bindings, and interpolations.

```html
@if (showMentions()) {
  @for (item of filteredItems(); track item.name) { ... }
}
{{ mentionPrefix() === '@' ? '🔧' : '📋' }}
```

### No structural HTML comments

Do not add HTML comments like `<!-- tools section -->` that expose internal structure. Semantic comments (accessibility, ARIA notes) are acceptable.

### JSDoc com aments — keep and pres— Do not forget the parentheses in `@if`, `@for`, bindings, and interpolations.

```html
@if (showMentions()) {
  @for (item of filteredItems(); track item.name) { ... }
}
{{ mentionPrefix() === '@' ? '🔧' : '📋' }}
```
e

JSDoc comments (`/** ... */`) on classes, methods, and properties are part of the public API documentation. Always preserve existing JSDoc comments and add them when documenting public APIs, abstract service contracts, or non-obvious logic:

```typescript
/**
 * Validates the flow graph and returns a list of errors.
 * Returns an empty array if the flow is valid.
 */
public validate(nodes: FlowAgentNode[], edges: FlowAgentEdge[]): ValidationError[] { ... }
```

Do not strip JSDoc comments when refactoring or auditing code. Inline comments (`//`) that explain *why* a non-obvious decision was made are also acceptable and should be preserved.

---

## SCSS / BEM — Rules

### Strict BEM methodology

Each component has a single root block that matches the component's semantic name:

```
.general-tab              → block
.general-tab__title       → element (__)
.general-tab__btn--active → modifier (--)
```

Never create classes outside this pattern. Never reference classes that belong to another component's block inside a different component's SCSS file.

### Always import the design system

Every component SCSS file starts with:

```scss
@use '../../../styles' as *;
```

The relative path varies depending on the component's folder depth. Always use design system variables (`$color-*`, `$spacing-*`, `$radius-*`, `$font-size-*`) instead of hardcoded values. Use mixins where they apply.

### Available design tokens (summary)

**Colors:**
- `$color-primary` → #FF6B00 (orange brand color)
- `$color-text` → #18181B, `$color-text-muted` → #52525C, `$color-text-light` → #71717B
- `$color-border` → #E4E4E7, `$color-input-border` → #D4D4D8
- `$color-bg-secondary` → #FAFAFA, `$color-bg-tertiary` → #F4F4F5, `$color-bg-quaternary` → #E4E4E7
- `$color-error` → #FB2C37, `$color-success` → #00C951

**Spacing scale:** `$spacing-2xs` (4px) through `$spacing-4xl` (48px)

**Border radii:** `$radius-xs` (4px) through `$radius-2xl` (24px)

**Font sizes:** `$font-size-sm` (10px), `$font-size-base` (13px), `$font-size-lg` (14px)

### Raw element selecreate classes outside this pattern. Never reference classes that belong to another — forbidd'sen

`` inside a different component's SCSS filescss
// BAD — raw element selector inside a BEM block
.my-block__row {
  select { width: 90px; }
  label { display: flex; }
}

// GOOD — reference the BEM class directly
.my-block__row {
  .my-block__select { width: 90px; }
  .my-block__checEvery component SCSS file starts with:tions: `:host`, pseudo-classes (`:hover`, `:focus`, `:last-child`), and `::placeholder`.

### Maximum two levels  — reference the BEM class directlyof nesting

```scss
.block {
  &__element {           // level 1 — OK
    &--modifier { }      // level 2 — OK
    &:hover { }          // pseudo — OK
  }
}
```

Deeper nesting is a signal that the HTML structure or class model needs revisiting.

### Descendant selectors between elements

Accepted when a parent context changes a child's style (hover reveal, active toggle):

```scss
.block__card:hover .block__delete-btn { opacity: 1; }
.block__toggle--on .block__toggle-thumb { transform: translateX(18px); }
```

Never cross blocks: using `.block-a__element` inside `block-b`'s SCSS is always wrong.

### Available mixins

```scss
@include form-input;              // standard input/select/textarea (border, padding, radius, focus ring)
@include button-reset;            // removes background, border, adds cursor: pointer
@include add-button;              // dashed border button in primary color
@include empty-state;             // centered text for empty state containers
@include flex-row($gap, $align);
@include flex-column($gap);
@include input-focus;             // removes outline, applies primary border color on :focus
```

---

## State architecture

### FlowAgentInternalStateService

Single source of truth for the entire flow. Exposes public `BehaviorSubject`s that components subscribe to:

- `nodes$`, `edges$` — canvas nodes and edges
- `selectedNodeId$`, `selectedEdgeId$` — current selection
- `currentFlowName$`, `baseSystemPrompt$`, `isFlowLoaded$`
- Global config: `pipelineType$`, `stagesVenta$`, `stagesServicio$`, `saveFields$`, `timezone$`, `preventInfiniteLoops$`

Components read state using `toSignal()`:

```typescript
public readonly nodes = toSignal(this.state.nodes$, { initialValue: [] });
```

And mutate state by calling service methods:

```typescript
this.state.updateNodeData(id, { conversationGoal: value });
this.state.addToolToNode(nodeId, tool);
```

Never push directly to a BehaviorSubject from a component, except in `GlobalSettingsViewComponent` which by design has direct access to the global config BehaviorSubjects.

### FlowAgentActionsService

Orchestrates load/save with the external abstract service. Exposes `unsavedChanges$` which emits (debounced 1000ms) when state changes after the flow is loaded.

### FlowAgentDefaultsService

Factory methods for creating nodes and edges with correct default values, including i18n labels via `TranslocoService`. Always use this service to create new nodes — never construct `FlowAgentNode` objects manually inside components.

---

## Canvas (JointJS / Rappid)

### Shapes

Each node type has its shape defined in `canvas/shapes/`. All shapes are registered in `canvas/shapes/app.shapes.ts` under the `agentApp` namespace.

To reference shape types, use the const object:

```typescript
import { AgentShapeTypesEnum } from '../shapes/utilities.shapes';
// AgentShapeTypesEnum.AGENT_NODE → 'agentApp.AgentNode'
```

### Canvas color constants

Defined in `canvas/theme.ts`. Always import from there — never hardcode hex values in shapes or the editor:

```typescript
import { BODY_BORDER, SELECTED_BORDER, ERROR_COLOR, EDGE_DEFAULT, EDGE_SELECTED, EDGE_SUCCESS, EDGE_FAILURE } from '../theme';
```

### `updateAppearance()` on edges

`ConditionEdgeLink` has an `updateAppearance()` method that recalculates colors and labels based on `edgeData`. Always call this method after modifying edge data instead of setting `attr` directly — except for the selected state, which is an intentional visual override:

```typescript
// Normal appearance update:
(link as any).updateAppearance?.();

// Mark as selected (overrides color):
link.attr('line/stroke', EDGE_SELECTED);
link.attr('line/targetMarker/fill', EDGE_SELECTED);
```

### State ↔ canvas synchronization

The editor uses a `_syncing` flag to prevent update loops. When the editor modifies the graph (in response to JointJS events), it first checks `if (this._syncing) return`. When the state changes (subscription to `nodes$` or `edges$`), `_syncing` is set to `true` for the duration of the sync.

---

## Transloco (i18n)

### Setup

The library ships translation files at `projects/my-lib/assets/atom-agentbuilder/i18n/{lang}.json`. Supported languages: `en`, `es`, `pt`, `fr`.

The dev-app wires it up in `projects/dev-app/src/app/transloco.providers.ts`:

```typescript
export function provideAppTransloco() {
  return provideTransloco({
    config: translocoConfig({
      availableLangs: ['en', 'es', 'pt', 'fr'],
      defaultLang: 'en',
      fallbackLang: 'en',
      reRenderOnLangChange: true,
      prodMode: false,
    }),
    loader: TranslocoHttpLoader,
  });
}
```

> **Note:** `preloadLangs` was removed from `translocoConfig` in `@jsverse/transloco` v7+. Do not add it — it will cause a TypeScript error. Translations load on demand via `TranslocoHttpLoader`.

The HTTP loader fetches from:
```
/assets/atom-agentbuilder/i18n/{lang}.json
```

When integrating in a host app, copy or serve those assets and call `provideTransloco(...)` with a compatible loader.

### In components — use the `transloco` pipe

Every component that renders translated text must import `TranslocoModule` and use the pipe in its template:

```typescript
imports: [TranslocoModule, ...]
```

```html
<span>{{ 'tabs.general.conversation_goal' | transloco }}</span>
<input [placeholder]="'tabs.general.goal_placeholder' | transloco" />
<button [title]="'common.delete' | transloco">...</button>
```

Do not call `TranslocoService.translate()` inside components for UI strings — use the pipe. The service is only appropriate for programmatic translation in non-template code (services, factories).

### In services — use `TranslocoService`

Services that build default data, validation messages, or dynamic strings inject `TranslocoService` directly:

```typescript
private readonly transloco = inject(TranslocoService);

// Inside a method:
label: this.transloco.translate('defaults.node.agent')
message: this.transloco.translate('validation.agent_missing_goal', { label: node.data.label })
```

Services that use `TranslocoService` in this project: `FlowAgentDefaultsService`, `FlowAgentInternalStateService`, `FlowAgentValidationService`, `FlowAgentActionsService`.

### Translation key structure

Keys are organized by area. Always use the existing key hierarchy — never add flat keys:

```
common.*          → shared UI labels (cancel, delete, close, create...)
defaults.*        → default node/edge labels created by FlowAgentDefaultsService
editor.*          → canvas toolbar, zoom, validation panel, add-node menu
errors.*          → error messages
global.*          → GlobalSettingsView (pipeline, stages, fields, timezone...)
inspector.*       → inspector header, edge tabs
modals.*          → each modal's labels (field_creation, file_selection, http_request, tool_selection)
tabs.*            → each inspector tab (general, tools, knowledge_base, edges, return, info_collection, http_tools, code)
validation.*      → validation error messages
views.*           → StartNodeView, EndNodeView
state.*           → default flow name and system prompt
```

### Adding a new translated string

1. Add the key to all four JSON files (`en.json`, `es.json`, `pt.json`, `fr.json`) under the appropriate namespace.
2. Use the pipe in the template or `this.transloco.translate(key)` in a service.
3. Never hardcode user-visible strings — always go through Transloco.

---

## Abstract services (host contracts)

Services in `core/services/` are abstract classes that the host application (`atom`) implements. They contain no logic — only the API contract:

- `AuthService` — access to the authenticated user
- `FlowAgentStateService` — flow CRUD against the backend
- `AgentChatService` — agent compilation and chat
- `KnowledgeBaseService` — knowledge base file management
- `ComposioTo newolService` — Composio toolkits and tools

Do not add business logic to abstract services. All logic lives in the internal state services.

---

## Forbidden patterns

| Forbidden | Use instead |
|---|---|
| Constructor injection | `inject()` |
| `new Subject()` + `takeUntil` | `inject(DestroyRef)` + `takeUntilDestroyed()` |
| `CommonModule` | Angular 17 built-in control flow |
| `*ngIf` / `*ngFor` | `@if` / `@for` |
| Plain mutable properties bound in template | `signal()` |
| Raw element selectors (`label {}`, `select {}`) inside BEM blocks | Explicit BEM classes |
| Cross-component class references in SCSS | Never cross block boundaries |
| `console.log` in production code | No log, or proper error handler |
| Hardcoded hex colors in component SCSS | `$color-*` design system variables |
| Manually constructed `FlowAgentNode` in components | `FlowAgentDefaultsService.createNode()` |
| `as any` without justification | Document why it is unavoidable |

---

## PR checklist

- [ ] All new components have `OnPush` and `standalone: true`
- [ ] No `CommonModule`, no `*ngIf` / `*ngFor`
- [ ] All template-bound state that changes at runtime uses `signal()`
- [ ] All subscriptions use `takeUntilDestroyed(this.destroyRef)`
- [ ] Services are injected with `inject()`, not via constructor
- [ ] SCSS classes follow strict BEM with the component's block name
- [ ] No raw HTML element selectors inside BEM blocks
- [ ] Colors, spacing, and radii use design system variables
- [ ] No `console.log` in production code
- [ ] No unused imports (especially `CommonModule`)
- [ ] All user-visible strings use `| transloco` pipe (not hardcoded)
- [ ] New translation keys are added to all four JSON files (en, es, pt, fr)
- [ ] No `preloadLangs` in `translocoConfig` (removed in v7+, causes TS error)
## PR checklist

- [ ] All new components have `OnPush` and `standalone: true`
- [ ] No `CommonModule`, no `*ngIf` / `*ngFor`
- [ ] All template-bound state that changes at runtime uses `signal()`
- [ ] All subscriptions use `takeUntilDestroyed(this.destroyRef)`
- [ ] Services are injected with `inject()`, not via constructor
- [ ] SCSS classes follow strict BEM with the component's block name
- [ ] No raw HTML element selectors inside BEM blocks
- [ ] Colors, spacing, and radii use design system variables
- [ ] No `console.log` in production code
- [ ] No unused imports (especially `CommonModule`)
- [ ] All user-visible strings use `| transloco` pipe (not hardcoded)
- [ ] New translation keys are added to all four JSON files (en, es, pt, fr)
- [ ] No `preloadLangs` in `translocoConfig` (removed in v7+, causes TS error)
