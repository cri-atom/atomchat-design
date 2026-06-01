import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShellNavService } from './shell/shell-nav.service';
import { WorkspaceRouteSyncService } from './shell/workspace-route-sync.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class App {
  constructor() {
    inject(ShellNavService);
    inject(WorkspaceRouteSyncService);
  }
}
