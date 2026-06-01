import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbIconComponent } from '../../../../my-lib/public-api';
import { WorkspaceModeService } from './workspace-mode.service';

@Component({
  selector: 'app-workspace-switcher',
  standalone: true,
  imports: [AbIconComponent],
  template: `
    <nav class="ws-switcher" aria-label="Modo de workspace">
      <button
        type="button"
        class="ws-switcher__tab"
        [class.ws-switcher__tab--active-editor]="workspace.mode() === 'editor'"
        (click)="goEditor()"
      >
        <ab-icon class="ws-switcher__icon" name="pen" size="sm" />
        <span>Editor</span>
      </button>
      <button
        type="button"
        class="ws-switcher__tab"
        [class.ws-switcher__tab--active-monitor]="workspace.mode() === 'monitor'"
        (click)="goMonitor()"
      >
        <ab-icon class="ws-switcher__icon" name="chart-line" size="sm" />
        <span>Monitor</span>
      </button>
    </nav>
  `,
  styleUrl: './workspace-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceSwitcherComponent {
  readonly workspace = inject(WorkspaceModeService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  goEditor(): void {
    this.workspace.setMode('editor');
    void this.router.navigate(['/campanas/agentes', this.agentId(), 'editor']);
  }

  goMonitor(): void {
    this.workspace.setMode('monitor');
    void this.router.navigate(['/campanas/agentes', this.agentId(), 'monitor', 'dashboard']);
  }

  private agentId(): string {
    let r: ActivatedRoute | null = this.route;
    while (r) {
      const id = r.snapshot.paramMap.get('agentId');
      if (id) {
        return id;
      }
      r = r.parent;
    }
    return 'nuevo';
  }
}
