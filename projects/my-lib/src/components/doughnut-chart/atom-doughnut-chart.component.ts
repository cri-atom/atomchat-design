import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, ViewChild, input } from '@angular/core';
import { Chart } from 'chart.js';
import { ensureAtomChartsRegistered } from '../chart-utils/atom-chart.register';
import { atomChartFont } from '../chart-utils/atom-chart-theme';

export interface AtomDoughnutItem {
  label: string;
  value: number;
  color: string;
}

@Component({
  selector: 'atom-doughnut-chart',
  standalone: true,
  template: `
    <div class="atom-doughnut">
      <div class="atom-doughnut__chart" [style.height]="height()">
        <canvas #canvas role="img" [attr.aria-label]="ariaLabel()"></canvas>
      </div>
      <ul class="atom-doughnut__legend">
        @for (item of reasons(); track item.label) {
          <li>
            <span class="atom-doughnut__dot" [style.background]="item.color"></span>
            {{ item.label }} ({{ item.value }}%)
          </li>
        }
      </ul>
    </div>
  `,
  styles: `
    .atom-doughnut { display: flex; align-items: center; gap: var(--ab-space-lg, 16px); }
    .atom-doughnut__chart { position: relative; width: 100px; flex-shrink: 0; }
    canvas { display: block; width: 100% !important; height: 100% !important; }
    .atom-doughnut__legend { margin: 0; padding: 0; list-style: none; font: var(--ab-font-label, 500 12px/16px Inter, sans-serif); color: var(--ab-text-muted, #52525c); }
    .atom-doughnut__legend li { display: flex; align-items: center; gap: var(--ab-space-xs, 4px); margin-bottom: var(--ab-space-xs, 4px); }
    .atom-doughnut__dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomDoughnutChartComponent implements AfterViewInit, OnDestroy {
  readonly reasons   = input.required<AtomDoughnutItem[]>();
  readonly height    = input('100px');
  readonly ariaLabel = input('Gráfico de dona');

  @ViewChild('canvas', { static: true }) private readonly canvasRef!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart<'doughnut'>;

  ngAfterViewInit(): void {
    ensureAtomChartsRegistered();
    const data = this.reasons();
    this.chart = new Chart(this.canvasRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: data.map((d) => d.label),
        datasets: [{ data: data.map((d) => d.value), backgroundColor: data.map((d) => d.color), borderWidth: 0, hoverOffset: 4 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '62%',
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.parsed}%` } } },
      },
    });
  }

  ngOnDestroy(): void { this.chart?.destroy(); }
}
