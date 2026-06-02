# dev-app — Design system sandbox

See root `CLAUDE.md` for full conventions. This file covers dev-app specifics.

## Key paths

```
src/app/
├── app.routes.ts          All routes — update when adding pages
├── shell/
│   ├── nav.config.ts      PRIMARY_RAIL + SECONDARY_MODULES + CANVAS_ROUTE_PATTERN
│   ├── nav.model.ts       Types: PrimaryRailItem, SecondaryNavModule, PageRouteData
│   ├── shell-nav.service.ts  hideSecondary() signal, expanded modules
│   └── atom-app-shell.component.*  Root layout
├── pages/
│   ├── citas/             Calendarios, tipos-evento, crear-evento
│   ├── campanas/          Agentes list, workspace layout
│   ├── monitor/           Dashboard, evaluations, human-review, playground
│   ├── plataforma/        Integraciones (+ placeholder sub-pages)
│   ├── agentbuilder/      AgentBuilderPageComponent (canvas mode)
│   └── index/             Landing/hub
└── workspace/             WorkspaceModeService, WorkspaceSwitcherComponent

src/styles/
└── _atom-layout-tokens.scss   All --atom-* CSS custom properties
```

## Importing from my-lib

Always use the relative path from the consumer file up to `projects/`:
```typescript
// From projects/dev-app/src/app/pages/citas/calendarios/calendarios-page.component.ts
// That's 6 levels up to projects/, then my-lib/public-api
import { AtomSearchInputComponent } from '../../../../../../my-lib/public-api';
```

Count: pages → citas → calendarios = 3 levels → app → src → dev-app → projects = 3 more = 6 total `../`.

## Shell — canvas mode

The agentbuilder canvas (`/campanas/agentes/:id/editor`) hides shell chrome.
`CANVAS_ROUTE_PATTERN` in `nav.config.ts` controls this. `shell-nav.service.ts` exposes `hideSecondary()`.
Do not add `[hideChrome]` inputs to agentbuilder page — the shell handles it.

## Monitor workspace

`/campanas/agentes/:id/monitor` also triggers canvas mode (no sidebar/header).
`MonitorPageComponent` renders its own tab nav.
`WorkspaceModeService` handles navigation between editor ↔ monitor ↔ playground.

## Adding a route + nav entry together

Both files must be edited atomically:
1. `app.routes.ts` — add route under correct parent
2. `nav.config.ts` — add `SecondaryNavModule` or child entry matching the route path

The nav `id` must match the last path segment of the route (convention, not enforced).
