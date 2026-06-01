import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Shell mínimo: solo enruta al editor; el header vive en AgentBuilderPage. */
@Component({
  selector: 'app-workspace-shell',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  styles: `:host { display: block; height: 100vh; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceShellComponent {}
