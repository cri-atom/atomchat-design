import { ChangeDetectionStrategy, Component, HostListener, signal } from '@angular/core';
import { AbIconComponent } from '../../../../../../my-lib/public-api';
import { AtomSectionHeadingComponent } from '../../../shell/atom-section-heading.component';
import { IntegracionesCardMenuComponent } from './integraciones-card-menu.component';
import { INTEGRACIONES_MOCK } from './integraciones.mock';

const MENU_WIDTH = 224;

@Component({
  selector: 'app-integraciones-page',
  standalone: true,
  imports: [AtomSectionHeadingComponent, AbIconComponent, IntegracionesCardMenuComponent],
  templateUrl: './integraciones-page.component.html',
  styleUrl: './integraciones-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntegracionesPageComponent {
  readonly integraciones = INTEGRACIONES_MOCK;

  readonly menuOpen = signal(false);
  readonly menuIntegrationId = signal('');
  readonly menuPosition = signal({ top: 0, left: 0 });

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeMenu();
  }

  openMenu(event: MouseEvent, integrationId: string): void {
    event.stopPropagation();
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.menuIntegrationId.set(integrationId);
    this.menuPosition.set({ top: rect.bottom + 4, left: rect.right - MENU_WIDTH });
    this.menuOpen.set(true);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
