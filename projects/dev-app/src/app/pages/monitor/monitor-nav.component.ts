import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-monitor-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="monitor-nav" aria-label="Secciones de Monitor">
      <a [routerLink]="base() + '/dashboard'" routerLinkActive="monitor-nav__tab--active" class="monitor-nav__tab">
        Dashboard
      </a>
      <a [routerLink]="base() + '/evaluaciones'" routerLinkActive="monitor-nav__tab--active" class="monitor-nav__tab">
        Evaluaciones
      </a>
      <a [routerLink]="base() + '/revision'" routerLinkActive="monitor-nav__tab--active" class="monitor-nav__tab">
        Revisión Humana
        <span class="monitor-nav__badge">12</span>
      </a>
      <a [routerLink]="base() + '/playground'" routerLinkActive="monitor-nav__tab--active" class="monitor-nav__tab">
        Playground
      </a>
    </nav>
  `,
  styleUrl: './monitor-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitorNavComponent {
  private readonly route = inject(ActivatedRoute);

  readonly base = computed(() => {
    let r: ActivatedRoute | null = this.route;
    while (r) {
      const agentId = r.snapshot.paramMap.get('agentId');
      if (agentId) {
        return `/campanas/agentes/${agentId}/monitor`;
      }
      r = r.parent;
    }
    return '/campanas/agentes/nuevo/monitor';
  });
}
