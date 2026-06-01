import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WorkspaceModeService, type MonitorTab } from '../../workspace/workspace-mode.service';
import { MonitorDashboardComponent } from './monitor-dashboard.component';
import { MonitorEvaluationsCreateComponent } from './monitor-evaluations-create.component';
import { MonitorEvaluationsListComponent } from './monitor-evaluations-list.component';
import { MonitorHumanReviewComponent } from './monitor-human-review.component';
import { MonitorPlaygroundComponent } from './monitor-playground.component';

@Component({
  selector: 'app-monitor-workspace-panel',
  standalone: true,
  imports: [
    MonitorDashboardComponent,
    MonitorEvaluationsListComponent,
    MonitorEvaluationsCreateComponent,
    MonitorHumanReviewComponent,
    MonitorPlaygroundComponent,
  ],
  templateUrl: './monitor-workspace-panel.component.html',
  styleUrl: './monitor-workspace-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitorWorkspacePanelComponent {
  readonly workspace = inject(WorkspaceModeService);

  readonly tabs: { id: MonitorTab; label: string; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'revision', label: 'Revisión Humana', badge: '12' },
    { id: 'playground', label: 'Playground' },
  ];

  setTab(tab: MonitorTab): void {
    this.workspace.setMonitorTab(tab);
  }
}
