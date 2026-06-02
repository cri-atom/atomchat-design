# my-lib — Component library

See root `CLAUDE.md` for full conventions. This file covers my-lib internals.

## Folder map

```
src/
├── components/       Global UI primitives (atom-* selectors) — add new ones here
├── platform/         Shell-level atoms (tag, badge, avatar, button, icon-button)
├── presentation/     AgentBuilder UI — canvas, inspector, shapes (do not expand)
│   ├── lib/          AtomAgentBuilderComponent + module
│   ├── canvas/       JointJS shapes + theme.ts
│   └── shared/ab-icon/  AbIconComponent + registry
├── application/      Flow state services
├── core/             Abstract services + models
├── infrastructure/   Concrete service implementations
└── styles/           Global SCSS (ab-*, canvas tokens)
```

## public-api.ts — the only export surface

Every new component/type must be exported here. Import order: presentation → platform → components → types → services.

## Adding a component to my-lib

1. Create `src/components/<name>/atom-<name>.component.ts`
2. Export from `public-api.ts`
3. Never import from `projects/dev-app` — one-way dependency only
4. Never import feature models (citas, monitor, campanas) — define needed types locally

## AbIconComponent internal import path

Within my-lib files, import AbIconComponent from the relative path:
```typescript
import { AbIconComponent } from '../../presentation/shared/ab-icon';
// or from '../presentation/shared/ab-icon' depending on depth
```

## Canvas shapes (AgentBuilder)

Located in `src/presentation/canvas/shapes/`. Uses JointJS Plus.
- Icons use SVG `<path d="...">` with FA Pro 7 path data from `theme.ts → ICONS`
- Icons are fill-based (FA Solid), not stroke-based
- Scale transforms: ~0.02–0.03 to fit 512px viewbox into ~12px badge
- Do not use AbIconComponent inside canvas shapes — they're JointJS SVG elements, not Angular
