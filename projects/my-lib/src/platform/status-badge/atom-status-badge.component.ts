import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AbIconComponent, type AbIconName } from '../../presentation/shared/ab-icon';

export type AtomStatusVariant = 'activo' | 'desactivado' | 'conectado' | 'error' | 'pendiente';

const AUTO_LABELS: Record<AtomStatusVariant, string> = {
  activo:       'Activo',
  desactivado:  'Desactivado',
  conectado:    'Conectado',
  error:        'Con error',
  pendiente:    'Config. pendiente',
};

const ICONS: Partial<Record<AtomStatusVariant, AbIconName>> = {
  conectado: 'circle-check',
  error:     'circle-xmark',
};

@Component({
  selector: 'atom-status-badge',
  standalone: true,
  imports: [AbIconComponent],
  template: `
    <span class="atom-status" [class]="'atom-status--' + variant()">
      @if (iconName(); as icon) {
        <ab-icon [name]="icon" variant="regular" size="sm" [ariaHidden]="true" />
      } @else {
        <span class="atom-status__dot" aria-hidden="true"></span>
      }
      {{ displayLabel() }}
    </span>
  `,
  styles: `
    .atom-status {
      display: inline-flex;
      align-items: center;
      gap: var(--atom-space-xs, 4px);
      padding: 4px var(--atom-space-sm, 8px);
      border-radius: var(--atom-radius-pill, 9999px);
      font: 500 12px/1.25 Inter, ui-sans-serif, system-ui, sans-serif;
      letter-spacing: var(--atom-letter-nav, 0.12px);
      white-space: nowrap;

      &--activo {
        background: var(--atom-status-activo-bg, #e6faec);
        color: var(--atom-status-activo-fg, #00631e);
        .atom-status__dot { background: var(--atom-status-activo-fg, #00631e); }
      }
      &--desactivado {
        background: var(--atom-status-desactivado-bg, #f4f4f5);
        color: var(--atom-fg-quaternary, #71717b);
        .atom-status__dot { background: var(--atom-fg-quaternary, #71717b); }
      }
      &--conectado {
        background: transparent;
        color: var(--atom-status-connected-fg, #008428);
      }
      &--error {
        background: var(--atom-status-error-bg, #fff0f0);
        color: var(--atom-status-error-fg, #dc2626);
      }
      &--pendiente {
        background: var(--atom-status-pending-bg, #fef3c7);
        color: var(--atom-status-pending-fg, #92400e);
      }
    }

    .atom-status__dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomStatusBadgeComponent {
  readonly variant = input.required<AtomStatusVariant>();
  readonly label   = input<string | null>(null);

  readonly displayLabel = computed(() => this.label() ?? AUTO_LABELS[this.variant()]);
  readonly iconName     = computed((): AbIconName | null => ICONS[this.variant()] ?? null);
}
