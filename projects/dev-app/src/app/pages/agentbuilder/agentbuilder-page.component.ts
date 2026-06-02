import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AtomAgentBuilderComponent, FlowAgentModeData } from '../../../../../my-lib/public-api';
import { WorkspaceModeService } from '../../workspace/workspace-mode.service';
import { WorkspaceSwitcherComponent } from '../../workspace/workspace-switcher.component';

@Component({
  selector: 'app-agentbuilder-page',
  standalone: true,
  imports: [AtomAgentBuilderComponent, WorkspaceSwitcherComponent],
  template: `
    <atom-agentbuilder
      class="agentbuilder-page"
      [workspaceMode]="workspace.mode()"
      [flowAgentModeData]="modeData"
      [user]="user"
      (unsavedChanges)="onUnsavedChanges($event)"
    >
      <app-workspace-switcher />
    </atom-agentbuilder>
  `,
  styleUrl: './agentbuilder-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentBuilderPageComponent {
  readonly workspace = inject(WorkspaceModeService);

  modeData: FlowAgentModeData = {
    mode: 'create',
    sourceRoute: '/campanas/agentes',
  };

  user = { id: 'dev-user', name: 'Dev User', email: 'dev@atom.com', companyId: 'dev-company' };

  onUnsavedChanges(hasChanges: boolean): void {
    document.title = hasChanges ? '● Agent Builder (unsaved)' : 'Agent Builder';
  }
}
