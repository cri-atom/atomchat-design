import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MonitorNavComponent } from './monitor-nav.component';

@Component({
  selector: 'app-monitor-page',
  standalone: true,
  imports: [RouterOutlet, MonitorNavComponent],
  template: `
    <div class="monitor-page">
      <app-monitor-nav />
      <div class="monitor-page__content">
        <router-outlet />
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }

    .monitor-page {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding-top: 56px;
      box-sizing: border-box;
      background: var(--ab-canvas);
    }

    .monitor-page__content {
      flex: 1;
      min-height: 0;
      overflow: auto;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitorPageComponent {}
