import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'atom-content-frame',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="atom-content-frame">
      <router-outlet />
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex: 1;
      min-width: 0;
      min-height: 0;
      height: 100%;
    }

    .atom-content-frame {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      min-width: 0;
      background: #fff;
      border-radius: 8px;
      box-shadow: var(--atom-elevation-elevated);
      overflow: hidden;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomContentFrameComponent {}
