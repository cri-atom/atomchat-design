# /new-component

Creates a new primitive component in `my-lib/src/components/` and wires it into `public-api.ts`.

## Usage
```
/new-component <kebab-name> [description of inputs/outputs]
```

Example: `/new-component empty-state "icon: AbIconName, title: string, message?: string"`

## Steps

1. **Create folder and file**:
   `projects/my-lib/src/components/<kebab-name>/atom-<kebab-name>.component.ts`

   Template:
   ```typescript
   import { ChangeDetectionStrategy, Component, input } from '@angular/core';

   @Component({
     selector: 'atom-<kebab-name>',
     standalone: true,
     imports: [],
     template: `<!-- template here -->`,
     styles: [`
       :host { display: block; }
       /* BEM: .<kebab-name>__element--modifier */
       /* Use --atom-* tokens only */
     `],
     changeDetection: ChangeDetectionStrategy.OnPush,
   })
   export class Atom<PascalName>Component {
     // inputs here using input() signal API
   }
   ```

2. **Export from public-api.ts**:
   Add to `projects/my-lib/public-api.ts`:
   ```typescript
   export { Atom<PascalName>Component } from './src/components/<kebab-name>/atom-<kebab-name>.component';
   ```

3. **Rules**:
   - Selector prefix: `atom-`
   - `ChangeDetectionStrategy.OnPush` always
   - Signals API: `input()`, `output()`, `model()` — no `@Input`/`@Output`
   - Use `--atom-*` CSS tokens, never hardcoded values
   - No feature imports (citas, monitor, campanas models) in my-lib
   - If icons needed: import `AbIconComponent` from `'../../../presentation/shared/ab-icon'`

4. **Verify build**: `npx ng build dev-app --configuration development`
