import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type AtomUserType = 'interno' | 'externo';

@Component({
  selector: 'atom-user-type-badge',
  standalone: true,
  template: `
    <span
      class="atom-user-type-badge"
      [class.atom-user-type-badge--interno]="tipo() === 'interno'"
      [class.atom-user-type-badge--externo]="tipo() === 'externo'"
      [attr.title]="tipo() === 'interno' ? 'Usuario Interno' : 'Usuario Externo'"
    >
      {{ tipo() === 'interno' ? 'A' : 'E' }}
    </span>
  `,
  styles: `
    .atom-user-type-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      font: 600 12px/1 Inter, ui-sans-serif, system-ui, sans-serif;
      letter-spacing: var(--atom-letter-badge);

      &--interno {
        background: var(--atom-usuario-interno-bg, #eef2ff);
        color: var(--atom-usuario-interno-fg, #4f46e5);
      }

      &--externo {
        background: var(--atom-brand-10, #ffe8d9);
        color: var(--atom-brand, #ff6600);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomUserTypeBadgeComponent {
  readonly tipo = input.required<AtomUserType>();
}
