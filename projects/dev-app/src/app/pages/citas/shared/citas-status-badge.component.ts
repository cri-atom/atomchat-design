import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { CalendarioUsuarioEstado } from '../calendarios/calendario-usuario.model';

@Component({
  selector: 'citas-status-badge',
  standalone: true,
  template: `
    <span
      class="citas-status-badge"
      [class.citas-status-badge--activo]="variant() === 'activo'"
      [class.citas-status-badge--desactivado]="variant() === 'desactivado'"
    >
      <span class="citas-status-badge__dot" aria-hidden="true"></span>
      {{ label() }}
    </span>
  `,
  styles: `
    .citas-status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 8px;
      border-radius: 999px;
      font: 500 12px/1.25 Inter, sans-serif;
      letter-spacing: var(--atom-letter-nav);
      white-space: nowrap;

      &--activo {
        background: var(--atom-status-activo-bg);
        color: var(--atom-status-activo-fg);

        .citas-status-badge__dot {
          background: var(--atom-status-activo-fg);
        }
      }

      &--desactivado {
        background: var(--atom-tag-neutral-bg);
        color: var(--atom-fg-quaternary);

        .citas-status-badge__dot {
          background: var(--atom-fg-quaternary);
        }
      }
    }

    .citas-status-badge__dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CitasStatusBadgeComponent {
  readonly variant = input<CalendarioUsuarioEstado>('activo');
  readonly label = computed(() =>
    this.variant() === 'activo' ? 'Activo' : 'Desactivado',
  );
}
