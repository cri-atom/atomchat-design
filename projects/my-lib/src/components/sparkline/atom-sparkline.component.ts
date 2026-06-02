import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, ViewChild, input } from '@angular/core';
import { Chart } from 'chart.js';
import { ensureAtomChartsRegistered } from '../chart-utils/atom-chart.register';
import { ATOM_CHART_COLORS } from '../chart-utils/atom-chart-theme';

@Component({
  selector: 'atom-sparkline',
  standalone: true,
  template: `
    <div class="atom-sparkline">
      <canvas #canvas aria-hidden="true"></canvas>
    </div>
  `,
  styles: `
    .atom-sparkline {
      position: relative;
      flex: 1;
      height: 28px;
      max-width: 80px;
      min-width: 48px;
    }
    canvas { display: block; width: 100% !important; height: 100% !important; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomSparklineComponent implements AfterViewInit, OnDestroy {
  readonly values = input.required<number[]>();
  readonly color  = input(ATOM_CHART_COLORS.editor);

  @ViewChild('canvas', { static: true }) private readonly canvasRef!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart<'line'>;

  ngAfterViewInit(): void {
    ensureAtomChartsRegistered();
    const color = this.color();
    this.chart = new Chart(this.canvasRef.nativeElement, {
      type: 'line',
      data: {
        labels: this.values().map((_, i) => String(i)),
        datasets: [{ data: this.values(), borderColor: color, backgroundColor: 'transparent', borderWidth: 1.5, pointRadius: 0, tension: 0.35, fill: false }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, animation: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } },
      },
    });
  }

  ngOnDestroy(): void { this.chart?.destroy(); }
}
