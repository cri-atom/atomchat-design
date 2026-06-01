import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WorkspaceModeService } from '../workspace/workspace-mode.service';

/** Keeps WorkspaceModeService in sync with agent editor / monitor routes. */
@Injectable({ providedIn: 'root' })
export class WorkspaceRouteSyncService {
  constructor() {
    const router = inject(Router);
    const workspace = inject(WorkspaceModeService);

    router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((e) => {
        const path = e.urlAfterRedirects;
        if (path.includes('/monitor')) {
          workspace.setMode('monitor');
        } else if (path.includes('/editor')) {
          workspace.setMode('editor');
        }
      });
  }
}
