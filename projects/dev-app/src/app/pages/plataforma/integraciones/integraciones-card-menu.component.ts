import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-integraciones-card-menu',
  standalone: true,
  template: `
    @if (open()) {
      <div
        class="int-menu"
        [style.top.px]="position().top"
        [style.left.px]="position().left"
        (click)="$event.stopPropagation()"
      >
        <span class="int-menu__section">Estados</span>
        <button type="button" class="int-menu__item" (click)="navigate('conectar')">Conectar</button>
        <button type="button" class="int-menu__item" (click)="navigate('conectada')">Conectada</button>
        <button type="button" class="int-menu__item" (click)="navigate('configuracion-pendiente')">
          Configuración pendiente
        </button>
        <button type="button" class="int-menu__item" (click)="navigate('con-error')">Con error</button>

        <div class="int-menu__divider"></div>

        <span class="int-menu__section">Acciones</span>
        <button type="button" class="int-menu__item" (click)="navigate('oneclick')">Oneclick</button>
        <button type="button" class="int-menu__item" (click)="navigate('configurar')">Configurar</button>
        <button
          type="button"
          class="int-menu__item int-menu__item--danger"
          (click)="navigate('eliminar-conexion')"
        >
          Eliminar conexión
        </button>
      </div>
    }
  `,
  styles: `
    .int-menu {
      position: fixed;
      z-index: 1000;
      min-width: 224px;
      padding: 4px 0;
      border: 1px solid var(--atom-border-divider, #e8e7e6);
      border-radius: 8px;
      background: #fff;
      box-shadow: var(--atom-elevation-elevated, 0 6px 14px 0 rgba(46, 33, 74, 0.08));
    }

    .int-menu__section {
      display: block;
      padding: 8px 16px 4px;
      font: 500 10px/1.25 Inter, sans-serif;
      color: var(--color-fg-tertiary, #52525c);
      text-transform: uppercase;
      letter-spacing: 0.6px;
      pointer-events: none;
    }

    .int-menu__divider {
      height: 1px;
      margin: 4px 0;
      background: var(--atom-border-divider, #e8e7e6);
    }

    .int-menu__item {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 8px 16px;
      border: none;
      background: none;
      text-align: left;
      font: 500 12px/1.35 Inter, sans-serif;
      color: var(--atom-fg-primary, #2d2b29);
      cursor: pointer;

      &:hover {
        background: var(--atom-surface-data, #f7f7f7);
      }

      &--danger {
        color: #dc2626;

        &:hover {
          background: var(--atom-surface-data, #f7f7f7);
          color: #b91c1c;
        }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntegracionesCardMenuComponent {
  private readonly router = inject(Router);

  readonly open = input(false);
  readonly position = input({ top: 0, left: 0 });
  readonly integrationId = input('');
  readonly closed = output<void>();

  navigate(action: string): void {
    void this.router.navigate(['/plataforma/integraciones', this.integrationId(), action]);
    this.closed.emit();
  }
}
