import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AtomSparklineComponent } from '../sparkline/atom-sparkline.component';

export interface AtomKpiData {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  sparkline: number[];
}

@Component({
  selector: 'atom-kpi-card',
  standalone: true,
  imports: [AtomSparklineComponent],
  template: `
    <article class="atom-kpi-card">
      <p class="atom-kpi-card__title">{{ kpi().title }}</p>
      <p class="atom-kpi-card__value">{{ kpi().value }}</p>
      <div class="atom-kpi-card__footer">
        <atom-sparkline [values]="kpi().sparkline" />
        <span class="atom-kpi-card__trend" [class.atom-kpi-card__trend--up]="kpi().trendUp" [class.atom-kpi-card__trend--down]="!kpi().trendUp">
          {{ kpi().trendUp ? '↑' : '↓' }} {{ kpi().trend }}
        </span>
      </div>
    </article>
  `,
  styles: `
    .atom-kpi-card {
      padding: var(--ab-space-lg, 16px);
      background: var(--ab-surface, #fff);
      border: 1px solid var(--ab-border, #e4e4e7);
      border-radius: var(--ab-radius-md, 12px);
    }

    .atom-kpi-card__title {
      margin: 0 0 var(--ab-space-sm, 8px);
      font: 500 11px/16px Inter, sans-serif;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--ab-text-light, #71717b);
    }

    .atom-kpi-card__value {
      margin: 0 0 var(--ab-space-md, 12px);
      font: var(--ab-font-kpi, 600 28px/32px Inter, sans-serif);
      color: var(--ab-text, #18181b);
    }

    .atom-kpi-card__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ab-space-sm, 8px);
    }

    .atom-kpi-card__trend {
      font: var(--ab-font-label, 500 12px/16px Inter, sans-serif);
      white-space: nowrap;

      &--up   { color: var(--ab-success, #006145); }
      &--down { color: var(--ab-danger, #9e0812); }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomKpiCardComponent {
  readonly kpi = input.required<AtomKpiData>();
}
