import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type AtomTagVariant = 'neutral' | 'brand' | 'success' | 'error' | 'pending';

@Component({
  selector: 'atom-tag',
  standalone: true,
  template: `<span class="atom-tag" [class]="'atom-tag--' + variant()">{{ label() }}</span>`,
  styles: `
    .atom-tag {
      display: inline-block;
      max-width: 200px;
      padding: 2px var(--atom-space-sm, 8px);
      border-radius: var(--atom-radius-pill, 9999px);
      font: 500 10px/16px Inter, ui-sans-serif, system-ui, sans-serif;
      letter-spacing: var(--atom-letter-badge, 0.1px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &--neutral {
        background: var(--atom-tag-neutral-bg, #e4e4e7);
        color: var(--atom-tag-neutral-fg, #3f3f46);
      }
      &--brand {
        background: var(--atom-brand-10, #ffe8d9);
        color: var(--atom-brand, #ff6600);
      }
      &--success {
        background: var(--atom-status-activo-bg, #e6faec);
        color: var(--atom-status-activo-fg, #00631e);
      }
      &--error {
        background: var(--atom-status-error-bg, #fff0f0);
        color: var(--atom-status-error-fg, #dc2626);
      }
      &--pending {
        background: var(--atom-status-pending-bg, #fef3c7);
        color: var(--atom-status-pending-fg, #92400e);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomTagComponent {
  readonly label = input.required<string>();
  readonly variant = input<AtomTagVariant>('neutral');
}
