import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { CalendarioUsuarioTipo } from '../calendarios/calendario-usuario.model';

@Component({
  selector: 'citas-usuario-tipo-badge',
  standalone: true,
  template: `
    <span
      class="citas-usuario-tipo-badge"
      [class.citas-usuario-tipo-badge--interno]="tipo() === 'interno'"
      [class.citas-usuario-tipo-badge--externo]="tipo() === 'externo'"
      [attr.title]="tipo() === 'interno' ? 'Usuario Interno' : 'Usuario Externo'"
    >
      {{ tipo() === 'interno' ? 'A' : 'E' }}
    </span>
  `,
  styles: `
    .citas-usuario-tipo-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      font: 600 12px/1 Inter, sans-serif;
      letter-spacing: var(--atom-letter-badge);

      &--interno {
        background: var(--atom-usuario-interno-bg, #eef2ff);
        color: var(--atom-usuario-interno-fg, #4f46e5);
      }

      &--externo {
        background: var(--atom-brand-10);
        color: var(--atom-brand);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CitasUsuarioTipoBadgeComponent {
  readonly tipo = input.required<CalendarioUsuarioTipo>();
}
