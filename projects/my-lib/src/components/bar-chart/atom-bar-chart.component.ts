import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, ViewChild, input } from '@angular/core';
import { Chart } from 'chart.js';
import { ensureAtomChartsRegistered } from '../chart-utils/atom-chart.register';
import { ATOM_CHART_COLORS, atomChartFont } from '../chart-utils/atom-chart-theme';

const BAR_PALETTE = [
  ATOM_CHART_COLORS.editor, ATOM_CHART_COLORS.violet, ATOM_CHART_COLORS.monitor,
  ATOM_CHART_COLORS.editor, ATOM_CHART_COLORS.muted,
];

@Component({
  selector: 'atom-bar-chart',
  standalone: true,
  template: `
    <div class="atom-chart" [style.height]="height()">
      <canvas #canvas role="img" [attr.aria-label]="ariaLabel()"></canvas>
    </div>
  `,
  styles: `
    .atom-chart { position: relative; width: 100%; }
    canvas { display: block; width: 100% !important; height: 100% !important; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomBarChartComponent implements AfterViewInit, OnDestroy {
  readonly labels    = input.required<string[]>();
  readonly values    = input.required<number[]>();
  readonly height    = input('120px');
  readonly ariaLabel = input('Gráfico de barras');

  @ViewChild('canvas', { static: true }) private readonly canvasRef!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart<'bar'>;

  ngAfterViewInit(): void {
    ensureAtomChartsRegistered();
    this.chart = new Chart(this.canvasRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.labels(),
        datasets: [{
          label: '',
          data: this.values(),
          backgroundColor: this.labels().map((_, i) => BAR_PALETTE[i % BAR_PALETTE.length]),
          borderRadius: 4, borderSkipped: false,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => `$${ctx.parsed.y?.toFixed(2) ?? 0}` } } },
        scales: {
          x: { grid: { display: false }, ticks: { color: ATOM_CHART_COLORS.text, font: atomChartFont }, border: { color: ATOM_CHART_COLORS.border } },
          y: { beginAtZero: true, grid: { color: ATOM_CHART_COLORS.grid }, ticks: { color: ATOM_CHART_COLORS.text, font: atomChartFont, callback: (v) => `$${v}` }, border: { display: false } },
        },
      },
    });
  }

  ngOnDestroy(): void { this.chart?.destroy(); }
}
