import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WorkspaceHeaderComponent } from '../../workspace/workspace-header.component';

@Component({
  selector: 'app-agent-workspace-layout',
  standalone: true,
  imports: [RouterOutlet, WorkspaceHeaderComponent],
  template: `
    <div class="ab-workspace">
      <div class="ab-workspace__main">
        <router-outlet />
      </div>
      <app-workspace-header class="ab-workspace__header" />
    </div>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
      min-height: 0;
    }

    .ab-workspace {
      position: relative;
      height: 100%;
      overflow: hidden;
      background: var(--ab-canvas);
    }

    .ab-workspace__main {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }

    .ab-workspace__header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1100;
      pointer-events: none;
    }

    .ab-workspace__header > * {
      pointer-events: auto;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentWorkspaceLayoutComponent {}
