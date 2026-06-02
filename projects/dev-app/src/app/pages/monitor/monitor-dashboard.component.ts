import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  AtomBarChartComponent,
  AtomDoughnutChartComponent,
  AtomKpiCardComponent,
  AtomLineChartComponent,
  AtomSegmentedControlComponent,
} from '../../../../../my-lib/public-api';
import {
  CLOSURE_REASONS,
  COST_BY_MODEL_LABELS, COST_BY_MODEL_VALUES,
  LATENCY_CHART_LABELS, LATENCY_CHART_VALUES,
  MONITOR_KPIS,
} from './monitor-mock.data';

@Component({
  selector: 'app-monitor-dashboard',
  standalone: true,
  imports: [
    AtomKpiCardComponent,
    AtomSegmentedControlComponent,
    AtomLineChartComponent,
    AtomBarChartComponent,
    AtomDoughnutChartComponent,
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
  readonly latencyLabels = LATENCY_CHART_LABELS;
  readonly latencyValues = LATENCY_CHART_VALUES;
  readonly costLabels    = COST_BY_MODEL_LABELS;
  readonly costValues    = COST_BY_MODEL_VALUES;
  readonly closureData   = CLOSURE_REASONS;
  timeRange = '7d';
  readonly timeOptions = [
    { id: '24h', label: '24h' },
    { id: '7d', label: '7d' },
    { id: '30d', label: '30d' },
    { id: 'custom', label: 'Custom' },
  ];
}
