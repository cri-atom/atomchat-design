import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { Router } from '@angular/router';
import type { CalendarioUsuarioRow } from './calendario-usuario.model';

@Component({
  selector: 'app-calendarios-actions-menu',
  standalone: true,
  template: `
    @if (open()) {
      <div
        class="calendarios-actions-menu"
        [style.top.px]="position().top"
        [style.left.px]="position().left"
        (click)="$event.stopPropagation()"
      >
        @if (user()?.tipo === 'interno') {
          <button type="button" class="calendarios-actions-menu__item" (click)="goToUsers()">
            <span>Editar en Gestión usuarios</span>
            <span class="calendarios-actions-menu__external">↗</span>
          </button>
          <button
            type="button"
            class="calendarios-actions-menu__item"
            (click)="configureAvailability.emit(user()!)"
          >
            Configurar disponibilidad
          </button>
        } @else {
          <button
            type="button"
            class="calendarios-actions-menu__item"
            (click)="editUser.emit(user()!)"
          >
            Editar datos del usuario
          </button>
          <button
            type="button"
            class="calendarios-actions-menu__item"
            (click)="configureAvailability.emit(user()!)"
          >
            Configurar disponibilidad
          </button>
          @if (user()?.estado === 'activo') {
            <button
              type="button"
              class="calendarios-actions-menu__item calendarios-actions-menu__item--danger"
              (click)="deactivate.emit(user()!)"
            >
              Desactivar calendario
            </button>
          } @else {
            <button
              type="button"
              class="calendarios-actions-menu__item calendarios-actions-menu__item--success"
              (click)="reactivate.emit(user()!)"
            >
              Activar calendario
            </button>
          }
        }
      </div>
    }
  `,
  styles: `
    .calendarios-actions-menu {
      position: fixed;
      z-index: 1000;
      min-width: 208px;
      padding: 4px 0;
      border: 1px solid var(--atom-border-divider);
      border-radius: 8px;
      background: #fff;
      box-shadow: var(--atom-elevation-elevated);
    }

    .calendarios-actions-menu__item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 8px 16px;
      border: none;
      background: none;
      text-align: left;
      font: 500 12px/1.35 Inter, sans-serif;
      color: var(--atom-fg-primary);
      cursor: pointer;

      &:hover {
        background: var(--atom-surface-data);
      }

      &--danger {
        color: #dc2626;
        border-top: 1px solid var(--atom-border-divider);

        &:hover {
          color: #b91c1c;
        }
      }

      &--success {
        color: #059669;
        border-top: 1px solid var(--atom-border-divider);

        &:hover {
          color: #047857;
        }
      }
    }

    .calendarios-actions-menu__external {
      font-size: 10px;
      color: var(--atom-fg-quaternary);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendariosActionsMenuComponent {
  private readonly router = inject(Router);

  readonly user = input<CalendarioUsuarioRow | null>(null);
  readonly open = input(false);
  readonly position = input({ top: 0, left: 0 });

  readonly editUser = output<CalendarioUsuarioRow>();
  readonly configureAvailability = output<CalendarioUsuarioRow>();
  readonly deactivate = output<CalendarioUsuarioRow>();
  readonly reactivate = output<CalendarioUsuarioRow>();
  readonly closed = output<void>();

  goToUsers(): void {
    void this.router.navigate(['/usuarios']);
    this.closed.emit();
  }
}
