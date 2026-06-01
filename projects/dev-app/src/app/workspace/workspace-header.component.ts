import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AbIconComponent } from '../../../../my-lib/public-api';
import { WorkspaceSwitcherComponent } from './workspace-switcher.component';

@Component({
  selector: 'app-workspace-header',
  standalone: true,
  imports: [AbIconComponent, WorkspaceSwitcherComponent],
  templateUrl: './workspace-header.component.html',
  styleUrl: './workspace-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceHeaderComponent {
  private readonly router = inject(Router);
  readonly agentName = 'Agente de soporte';

  goBack(): void {
    void this.router.navigate(['/campanas/agentes']);
  }
}
