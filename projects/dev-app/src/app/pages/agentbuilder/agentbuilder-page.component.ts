import { Component, inject } from '@angular/core';
import { AtomAgentBuilderComponent, FlowAgentModeData } from '../../../../../my-lib/public-api';
import { WorkspaceModeService } from '../../workspace/workspace-mode.service';

@Component({
  selector: 'app-agentbuilder-page',
  standalone: true,
  imports: [AtomAgentBuilderComponent],
  template: `
    <atom-agentbuilder
      class="agentbuilder-page"
      [hideChrome]="true"
      [workspaceMode]="workspace.mode()"
      [flowAgentModeData]="modeData"
      [user]="user"
      (unsavedChanges)="onUnsavedChanges($event)"
    />
  `,
  styleUrl: './agentbuilder-page.component.scss',
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
