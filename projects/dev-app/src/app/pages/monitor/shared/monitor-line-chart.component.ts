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
import { LATENCY_CHART_LABELS, LATENCY_CHART_VALUES } from '../monitor-mock.data';
import { MONITOR_CHART_COLORS, monitorChartFont } from './monitor-chart-theme';
import { ensureMonitorChartsRegistered } from './monitor-chart.register';

@Component({
  selector: 'app-monitor-line-chart',
  standalone: true,
  template: `
    <div class="monitor-chart" [style.height]="height()">
      <canvas #canvas role="img" aria-label="Gráfico de latencia"></canvas>
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
export class MonitorLineChartComponent implements AfterViewInit, OnDestroy {
  readonly height = input('160px');
  readonly labels = input(LATENCY_CHART_LABELS);
  readonly values = input(LATENCY_CHART_VALUES);

  @ViewChild('canvas', { static: true }) private readonly canvasRef!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart<'line'>;

  ngAfterViewInit(): void {
    ensureMonitorChartsRegistered();
    this.chart = new Chart(this.canvasRef.nativeElement, {
      type: 'line',
      data: {
        labels: this.labels(),
        datasets: [
          {
            label: 'Latencia (s)',
            data: this.values(),
            borderColor: MONITOR_CHART_COLORS.editor,
            backgroundColor: MONITOR_CHART_COLORS.fillEditor,
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 4,
            pointBackgroundColor: MONITOR_CHART_COLORS.editor,
            tension: 0.35,
            fill: true,
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
              label: (ctx) => `${ctx.parsed.y?.toFixed(1) ?? 0}s`,
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
            beginAtZero: false,
            grid: { color: MONITOR_CHART_COLORS.grid },
            ticks: {
              color: MONITOR_CHART_COLORS.text,
              font: monitorChartFont,
              callback: (v) => `${v}s`,
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
