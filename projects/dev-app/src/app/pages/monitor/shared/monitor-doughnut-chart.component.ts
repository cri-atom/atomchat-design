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
import { CLOSURE_REASONS } from '../monitor-mock.data';
import { monitorChartFont } from './monitor-chart-theme';
import { ensureMonitorChartsRegistered } from './monitor-chart.register';

@Component({
  selector: 'app-monitor-doughnut-chart',
  standalone: true,
  template: `
    <div class="monitor-doughnut">
      <div class="monitor-chart monitor-chart--donut" [style.height]="height()">
        <canvas #canvas role="img" aria-label="Gráfico de motivos de cierre"></canvas>
      </div>
      <ul class="monitor-doughnut__legend">
        @for (item of reasons(); track item.label) {
          <li>
            <span class="monitor-doughnut__dot" [style.background]="item.color"></span>
            {{ item.label }} ({{ item.value }}%)
          </li>
        }
      </ul>
    </div>
  `,
  styles: `
    .monitor-doughnut {
      display: flex;
      align-items: center;
      gap: var(--ab-space-lg);
    }
    .monitor-chart--donut {
      width: 100px;
      flex-shrink: 0;
    }
    .monitor-chart {
      position: relative;
    }
    canvas {
      display: block;
      width: 100% !important;
      height: 100% !important;
    }
    .monitor-doughnut__legend {
      margin: 0;
      padding: 0;
      list-style: none;
      font: var(--ab-font-label);
      color: var(--ab-text-muted);
    }
    .monitor-doughnut__legend li {
      display: flex;
      align-items: center;
      gap: var(--ab-space-xs);
      margin-bottom: var(--ab-space-xs);
    }
    .monitor-doughnut__dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitorDoughnutChartComponent implements AfterViewInit, OnDestroy {
  readonly height = input('100px');
  readonly reasons = input(CLOSURE_REASONS);

  @ViewChild('canvas', { static: true }) private readonly canvasRef!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart<'doughnut'>;

  ngAfterViewInit(): void {
    ensureMonitorChartsRegistered();
    const data = this.reasons();

    this.chart = new Chart(this.canvasRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: data.map((d) => d.label),
        datasets: [
          {
            data: data.map((d) => d.value),
            backgroundColor: data.map((d) => d.color),
            borderWidth: 0,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.parsed}%`,
            },
          },
        },
      },
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
