# /new-page

Creates a new feature page in dev-app with routing and nav wired up.

## Usage
```
/new-page <module> <kebab-name> "<Title>" ["<Description>"]
```

Example: `/new-page plataforma notificaciones "Notificaciones" "Centro de notificaciones"`

## Steps

1. **Create the page component** at `projects/dev-app/src/app/pages/<module>/<kebab-name>/<kebab-name>-page.component.ts`

   Template:
   ```typescript
   import { ChangeDetectionStrategy, Component } from '@angular/core';
   import { AtomSectionHeadingComponent } from '../../shell/atom-section-heading.component';

   @Component({
     selector: 'app-<kebab-name>-page',
     standalone: true,
     imports: [AtomSectionHeadingComponent],
     template: `
       <atom-section-heading title="<Title>" description="<Description>" />
       <div class="page-content">
         <!-- content here -->
       </div>
     `,
     changeDetection: ChangeDetectionStrategy.OnPush,
   })
   export class <PascalName>PageComponent {}
   ```

2. **Add route** in `projects/dev-app/src/app/app.routes.ts`:
   - Import the component
   - Add `{ path: '<kebab-name>', component: <PascalName>PageComponent, ...ph('<Title>', '<Description>') }` under the correct parent

3. **Add nav entry** in `projects/dev-app/src/app/shell/nav.config.ts`:
   - Add child entry under the correct module in `SECONDARY_MODULES`
   - If new top-level module, add full `SecondaryNavModule` object

4. **Verify build**: `npx ng build dev-app --configuration development`
