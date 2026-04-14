import { Component } from '@angular/core';
import { AtomAgentBuilderComponent, FlowAgentModeData } from '../../../../projects/my-lib/public-api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AtomAgentBuilderComponent],
  template: `
    <div style="height: 100vh; display: flex; flex-direction: column;">
      <atom-agentbuilder
        style="flex: 1;"
        [flowAgentModeData]="modeData"
        [user]="user"
        (unsavedChanges)="onUnsavedChanges($event)"
      />
    </div>
  `,
})
export class App {
  modeData: FlowAgentModeData = {
    flowId: 'dev-flow-1',
    mode: 'edit',
    sourceRoute: '/',
  };

  user = { id: 'dev-user', name: 'Dev User', email: 'dev@atom.com', companyId: 'dev-company' };

  onUnsavedChanges(hasChanges: boolean): void {
    document.title = hasChanges ? '● Agent Builder (unsaved)' : 'Agent Builder';
  }
}
