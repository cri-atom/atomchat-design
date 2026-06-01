import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AbIconComponent } from '../../../../my-lib/public-api';
import { PRIMARY_RAIL } from './nav.config';
import { ShellNavService } from './shell-nav.service';

@Component({
  selector: 'atom-primary-sidebar',
  standalone: true,
  imports: [AbIconComponent, RouterLink, RouterLinkActive],
  templateUrl: './atom-primary-sidebar.component.html',
  styleUrl: './atom-primary-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomPrimarySidebarComponent {
  readonly shellNav = inject(ShellNavService);
  readonly items = PRIMARY_RAIL.filter((i) => i.id !== 'ayuda');

  onItemClick(item: (typeof PRIMARY_RAIL)[number], event: Event): void {
    if (item.action === 'toggle') {
      event.preventDefault();
      this.shellNav.toggleRail();
    }
  }
}
