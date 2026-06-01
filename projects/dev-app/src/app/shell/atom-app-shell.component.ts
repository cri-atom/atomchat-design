import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AtomContentFrameComponent } from './atom-content-frame.component';
import { AtomHeaderComponent } from './atom-header.component';
import { AtomPrimarySidebarComponent } from './atom-primary-sidebar.component';
import { AtomSecondarySidebarComponent } from './atom-secondary-sidebar.component';
import { ShellNavService } from './shell-nav.service';

@Component({
  selector: 'atom-app-shell',
  standalone: true,
  imports: [
    AtomPrimarySidebarComponent,
    AtomHeaderComponent,
    AtomSecondarySidebarComponent,
    AtomContentFrameComponent,
    RouterOutlet,
  ],
  templateUrl: './atom-app-shell.component.html',
  styleUrl: './atom-app-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomAppShellComponent {
  readonly shellNav = inject(ShellNavService);
}
