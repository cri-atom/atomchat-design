import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AbIconComponent } from '../../../../../my-lib/public-api';
import { WorkspaceModeService } from '../../workspace/workspace-mode.service';

@Component({
  selector: 'app-index-page',
  standalone: true,
  imports: [AbIconComponent, RouterLink],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
})
export class IndexPageComponent implements OnInit {
  readonly branchLabel = 'transition';
  private readonly workspace = inject(WorkspaceModeService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    if (this.router.url.includes('mode=monitor')) {
      this.workspace.setMode('monitor');
    }
  }

  openMonitor(): void {
    this.workspace.setMode('monitor');
  }
}
