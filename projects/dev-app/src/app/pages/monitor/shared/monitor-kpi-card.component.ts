import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { MonitorKpi } from '../monitor-mock.data';
import { MonitorSparklineComponent } from './monitor-sparkline.component';

@Component({
  selector: 'app-monitor-kpi-card',
  standalone: true,
  imports: [MonitorSparklineComponent],
  template: `
    <article class="kpi-card">
      <p class="kpi-card__title">{{ kpi().title }}</p>
      <p class="kpi-card__value">{{ kpi().value }}</p>
      <div class="kpi-card__footer">
        <app-monitor-sparkline [values]="kpi().sparkline" />
        <span class="kpi-card__trend" [class.kpi-card__trend--up]="kpi().trendUp" [class.kpi-card__trend--down]="!kpi().trendUp">
          {{ kpi().trendUp ? '↑' : '↓' }} {{ kpi().trend }}
        </span>
      </div>
    </article>
  `,
  styles: `
    .kpi-card {
      padding: var(--ab-space-lg);
      background: var(--ab-surface);
      border: 1px solid var(--ab-border);
      border-radius: var(--ab-radius-md);
    }

    .kpi-card__title {
      margin: 0 0 var(--ab-space-sm);
      font: 500 11px/16px Inter, sans-serif;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--ab-text-light);
    }

    .kpi-card__value {
      margin: 0 0 var(--ab-space-md);
      font: var(--ab-font-kpi);
      color: var(--ab-text);
    }

    .kpi-card__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ab-space-sm);
    }

    .kpi-card__trend {
      font: var(--ab-font-label);
      white-space: nowrap;

      &--up {
        color: var(--ab-success);
      }

      &--down {
        color: var(--ab-danger);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitorKpiCardComponent {
  readonly kpi = input.required<MonitorKpi>();
}
