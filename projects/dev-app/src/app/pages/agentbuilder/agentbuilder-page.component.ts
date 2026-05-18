import { Component } from '@angular/core';
import { AtomAgentBuilderComponent, FlowAgentModeData } from '../../../../../my-lib/public-api';

@Component({
  selector: 'app-agentbuilder-page',
  standalone: true,
  imports: [AtomAgentBuilderComponent],
  template: `
    <atom-agentbuilder
      class="agentbuilder-page"
      [flowAgentModeData]="modeData"
      [user]="user"
      (unsavedChanges)="onUnsavedChanges($event)"
    />
  `,
  styles: `
    :host {
      display: block;
      height: 100vh;
    }

    .agentbuilder-page {
      display: block;
      height: 100%;
    }
  `,
})
export class AgentBuilderPageComponent {
  modeData: FlowAgentModeData = {
    mode: 'create',
    sourceRoute: '/',
  };

  user = { id: 'dev-user', name: 'Dev User', email: 'dev@atom.com', companyId: 'dev-company' };

  onUnsavedChanges(hasChanges: boolean): void {
    document.title = hasChanges ? '● Agent Builder (unsaved)' : 'Agent Builder';
  }
}
