import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AbIconComponent, AtomStatusBadgeComponent } from '../../../../../../my-lib/public-api';
import { AtomSectionHeadingComponent } from '../../../shell/atom-section-heading.component';
import {
  CitasFilterDropdownComponent,
  type CitasFilterOption,
} from '../shared/citas-filter-dropdown.component';
import { CitasTablePaginationComponent } from '../shared/citas-table-pagination.component';
import { CitasToolbarSearchComponent } from '../shared/citas-toolbar-search.component';
import { CitasUsuarioTipoBadgeComponent } from '../shared/citas-usuario-tipo-badge.component';
import { CalendariosActionsMenuComponent } from './calendarios-actions-menu.component';
import type {
  CalendarioUsuarioEstado,
  CalendarioUsuarioRow,
  CalendarioUsuarioTipo,
} from './calendario-usuario.model';
import { CalendariosStateService } from './calendarios-state.service';
import { CalendariosCreateUsuarioDialogComponent } from './dialogs/calendarios-create-usuario-dialog.component';
import { CalendariosDesactivarDialogComponent } from './dialogs/calendarios-desactivar-dialog.component';
import { CalendariosDisponibilidadDialogComponent } from './dialogs/calendarios-disponibilidad-dialog.component';
import { CalendariosEditUsuarioDialogComponent } from './dialogs/calendarios-edit-usuario-dialog.component';

const TIPO_OPTIONS: CitasFilterOption<'todos' | CalendarioUsuarioTipo>[] = [
  { value: 'todos', label: 'Todos los tipos' },
  { value: 'interno', label: 'Usuarios Internos (A)' },
  { value: 'externo', label: 'Usuarios Externos (E)' },
];

const ESTADO_OPTIONS: CitasFilterOption<'todos' | CalendarioUsuarioEstado>[] = [
  { value: 'todos', label: 'Todos los estados' },
  { value: 'activo', label: 'Activo' },
  { value: 'desactivado', label: 'Desactivado' },
];

@Component({
  selector: 'app-calendarios-page',
  standalone: true,
  imports: [
    AtomSectionHeadingComponent,
    CitasToolbarSearchComponent,
    CitasFilterDropdownComponent,
    AbIconComponent,
    CitasUsuarioTipoBadgeComponent,
    AtomStatusBadgeComponent,
    CitasTablePaginationComponent,
    CalendariosActionsMenuComponent,
    MatTooltipModule,
  ],
  templateUrl: './calendarios-page.component.html',
  styleUrl: './calendarios-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendariosPageComponent {
  private readonly state = inject(CalendariosStateService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly tipoOptions = TIPO_OPTIONS;
  readonly estadoOptions = ESTADO_OPTIONS;

  readonly rows = this.state.filteredUsers;
  readonly visibleCount = this.state.visibleCount;
  readonly filters = this.state.filters;

  readonly menuOpen = signal(false);
  readonly menuUser = signal<CalendarioUsuarioRow | null>(null);
  readonly menuPosition = signal({ top: 0, left: 0 });

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeMenu();
  }

  onSearchChange(value: string): void {
    this.state.setSearch(value);
  }

  onTipoChange(value: 'todos' | CalendarioUsuarioTipo): void {
    this.state.setTipoFilter(value);
  }

  onEstadoChange(value: 'todos' | CalendarioUsuarioEstado): void {
    this.state.setEstadoFilter(value);
  }

  formatGrupos(grupos: string[]): string {
    return grupos.length > 1 ? `${grupos.length} grupos` : (grupos[0] ?? '—');
  }

  gruposTooltip(grupos: string[]): string {
    return grupos.map((g) => `• ${g}`).join('\n');
  }

  openCreateDialog(): void {
    this.dialog.open(CalendariosCreateUsuarioDialogComponent, {
      panelClass: 'citas-dialog-panel',
      width: '640px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      autoFocus: 'first-titled-element',
    });
  }

  openActionsMenu(event: MouseEvent, user: CalendarioUsuarioRow): void {
    event.stopPropagation();
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    this.menuUser.set(user);
    this.menuPosition.set({
      top: rect.bottom + 4,
      left: rect.right - 208,
    });
    this.menuOpen.set(true);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
    this.menuUser.set(null);
  }

  onEditUser(user: CalendarioUsuarioRow): void {
    this.closeMenu();
    this.dialog.open(CalendariosEditUsuarioDialogComponent, {
      panelClass: 'citas-dialog-panel',
      width: '540px',
      maxWidth: '95vw',
      data: { user },
    });
  }

  onConfigureAvailability(user: CalendarioUsuarioRow): void {
    this.closeMenu();
    this.dialog.open(CalendariosDisponibilidadDialogComponent, {
      panelClass: 'citas-dialog-panel',
      width: '600px',
      maxWidth: '95vw',
      maxHeight: '85vh',
      data: { user },
    });
  }

  onDeactivate(user: CalendarioUsuarioRow): void {
    this.closeMenu();
    this.dialog.open(CalendariosDesactivarDialogComponent, {
      panelClass: 'citas-dialog-panel',
      width: '480px',
      maxWidth: '95vw',
      data: { user },
    });
  }

  onReactivate(user: CalendarioUsuarioRow): void {
    this.closeMenu();
    this.state.reactivateUsuario(user.id);
    this.snackBar.open(`Calendario de ${user.nombre} activado.`, undefined, {
      duration: 4000,
      horizontalPosition: 'left',
      verticalPosition: 'bottom',
      panelClass: 'citas-snackbar',
    });
  }

  rangeLabel(): string {
    const count = this.visibleCount();
    return count === 0 ? '0 items' : `1-${count} de ${count} items`;
  }
}
