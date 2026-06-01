import { DecimalPipe, KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { EVALUATION_ROWS } from './monitor-mock.data';
import { MonitorChipComponent } from './shared/monitor-chip.component';

export type EvaluationsViewMode = 'table' | 'cards';

@Component({
  selector: 'app-monitor-evaluations',
  standalone: true,
  imports: [DecimalPipe, KeyValuePipe, MatSidenavModule, MonitorChipComponent],
  templateUrl: './monitor-evaluations.component.html',
  styleUrl: './monitor-evaluations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitorEvaluationsComponent {
  readonly rows = EVALUATION_ROWS;
  readonly drawerOpen = signal(false);
  readonly viewMode = signal<EvaluationsViewMode>('table');
  readonly origin = signal<'traffic' | 'ai' | 'saved'>('ai');
  readonly personalities = signal<Record<string, boolean>>({
    Cordial: true,
    Frustrado: true,
    Técnico: false,
    Apurado: false,
  });

  setViewMode(mode: EvaluationsViewMode): void {
    this.viewMode.set(mode);
  }

  openDrawer(): void {
    this.drawerOpen.set(true);
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
  }

  selectOrigin(id: 'traffic' | 'ai' | 'saved'): void {
    this.origin.set(id);
  }

  togglePersonality(key: string): void {
    this.personalities.update((p) => ({ ...p, [key]: !p[key] }));
  }

  chipVariant(origin: string): 'live' | 'fictional' {
    return origin === 'En vivo' ? 'live' : 'fictional';
  }
}
