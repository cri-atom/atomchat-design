import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AbIconComponent } from '../../../../my-lib/public-api';
import { SECONDARY_MODULES } from './nav.config';
import { ShellNavService } from './shell-nav.service';
import type { SecondaryNavModule } from './nav.model';

@Component({
  selector: 'atom-secondary-sidebar',
  standalone: true,
  imports: [AbIconComponent, RouterLink, RouterLinkActive],
  templateUrl: './atom-secondary-sidebar.component.html',
  styleUrl: './atom-secondary-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomSecondarySidebarComponent {
  readonly shellNav = inject(ShellNavService);
  private readonly router = inject(Router);
  readonly modules = SECONDARY_MODULES;

  isExpanded(mod: SecondaryNavModule): boolean {
    if (this.shellNav.isModuleExpanded(mod.id)) {
      return true;
    }
    const path = this.shellNav.url().split('?')[0];
    return path === mod.routePrefix || path.startsWith(`${mod.routePrefix}/`);
  }

  toggleSection(mod: SecondaryNavModule, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.shellNav.toggleModule(mod.id);
  }

  navigateModule(mod: SecondaryNavModule): void {
    if (mod.children?.length) {
      this.shellNav.expandModule(mod.id);
      const child = mod.children.find((c) => c.id === mod.defaultChild) ?? mod.children[0];
      void this.router.navigateByUrl(child.route);
      return;
    }
    void this.router.navigateByUrl(mod.routePrefix);
  }
}
