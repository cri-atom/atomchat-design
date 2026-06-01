import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  input,
} from '@angular/core';
import { Chart } from 'chart.js';
import { COST_BY_MODEL_LABELS, COST_BY_MODEL_VALUES } from '../monitor-mock.data';
import { MONITOR_CHART_COLORS, monitorChartFont } from './monitor-chart-theme';
import { ensureMonitorChartsRegistered } from './monitor-chart.register';

@Component({
  selector: 'app-monitor-bar-chart',
  standalone: true,
  template: `
    <div class="monitor-chart" [style.height]="height()">
      <canvas #canvas role="img" aria-label="Gráfico de costo por modelo"></canvas>
    </div>
  `,
  styles: `
    .monitor-chart {
      position: relative;
      width: 100%;
    }
    canvas {
      display: block;
      width: 100% !important;
      height: 100% !important;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitorBarChartComponent implements AfterViewInit, OnDestroy {
  readonly height = input('120px');
  readonly labels = input(COST_BY_MODEL_LABELS);
  readonly values = input(COST_BY_MODEL_VALUES);

  @ViewChild('canvas', { static: true }) private readonly canvasRef!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart<'bar'>;

  ngAfterViewInit(): void {
    ensureMonitorChartsRegistered();
    const colors = [
      MONITOR_CHART_COLORS.editor,
      MONITOR_CHART_COLORS.violet,
      MONITOR_CHART_COLORS.monitor,
      MONITOR_CHART_COLORS.editor,
      MONITOR_CHART_COLORS.muted,
    ];

    this.chart = new Chart(this.canvasRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.labels(),
        datasets: [
          {
            label: 'Costo (USD)',
            data: this.values(),
            backgroundColor: colors,
            borderRadius: 4,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `$${ctx.parsed.y?.toFixed(2) ?? 0}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: MONITOR_CHART_COLORS.text, font: monitorChartFont },
            border: { color: MONITOR_CHART_COLORS.border },
          },
          y: {
            beginAtZero: true,
            grid: { color: MONITOR_CHART_COLORS.grid },
            ticks: {
              color: MONITOR_CHART_COLORS.text,
              font: monitorChartFont,
              callback: (v) => `$${v}`,
            },
            border: { display: false },
          },
        },
      },
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
