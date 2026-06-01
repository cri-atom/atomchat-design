import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MONITOR_KPIS } from './monitor-mock.data';
import { MonitorKpiCardComponent } from './shared/monitor-kpi-card.component';
import { MonitorBarChartComponent } from './shared/monitor-bar-chart.component';
import { MonitorDoughnutChartComponent } from './shared/monitor-doughnut-chart.component';
import { MonitorLineChartComponent } from './shared/monitor-line-chart.component';
import { MonitorSegmentedControlComponent } from './shared/monitor-segmented-control.component';

@Component({
  selector: 'app-monitor-dashboard',
  standalone: true,
  imports: [
    MonitorKpiCardComponent,
    MonitorSegmentedControlComponent,
    MonitorLineChartComponent,
    MonitorBarChartComponent,
    MonitorDoughnutChartComponent,
  ],
  templateUrl: './monitor-dashboard.component.html',
  styleUrl: './monitor-dashboard.component.scss',
  host: {
    '[class.dashboard--embedded]': 'embedded()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitorDashboardComponent {
  readonly embedded = input(false);
  readonly kpis = MONITOR_KPIS;
  timeRange = '7d';
  readonly timeOptions = [
    { id: '24h', label: '24h' },
    { id: '7d', label: '7d' },
    { id: '30d', label: '30d' },
    { id: 'custom', label: 'Custom' },
  ];
}
