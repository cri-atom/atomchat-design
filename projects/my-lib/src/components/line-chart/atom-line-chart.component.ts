import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, ViewChild, input } from '@angular/core';
import { Chart } from 'chart.js';
import { ensureAtomChartsRegistered } from '../chart-utils/atom-chart.register';
import { ATOM_CHART_COLORS, atomChartFont } from '../chart-utils/atom-chart-theme';

@Component({
  selector: 'atom-line-chart',
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
export class AtomLineChartComponent implements AfterViewInit, OnDestroy {
  readonly labels    = input.required<string[]>();
  readonly values    = input.required<number[]>();
  readonly height    = input('160px');
  readonly ariaLabel = input('Gráfico de línea');

  @ViewChild('canvas', { static: true }) private readonly canvasRef!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart<'line'>;

  ngAfterViewInit(): void {
    ensureAtomChartsRegistered();
    this.chart = new Chart(this.canvasRef.nativeElement, {
      type: 'line',
      data: {
        labels: this.labels(),
        datasets: [{
          label: '',
          data: this.values(),
          borderColor: ATOM_CHART_COLORS.editor,
          backgroundColor: ATOM_CHART_COLORS.fillEditor,
          borderWidth: 2, pointRadius: 3, pointHoverRadius: 4,
          pointBackgroundColor: ATOM_CHART_COLORS.editor,
          tension: 0.35, fill: true,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => `${ctx.parsed.y?.toFixed(1) ?? 0}s` } } },
        scales: {
          x: { grid: { display: false }, ticks: { color: ATOM_CHART_COLORS.text, font: atomChartFont }, border: { color: ATOM_CHART_COLORS.border } },
          y: { beginAtZero: false, grid: { color: ATOM_CHART_COLORS.grid }, ticks: { color: ATOM_CHART_COLORS.text, font: atomChartFont, callback: (v) => `${v}s` }, border: { display: false } },
        },
      },
    });
  }

  ngOnDestroy(): void { this.chart?.destroy(); }
}
