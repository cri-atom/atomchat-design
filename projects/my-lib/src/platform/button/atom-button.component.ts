import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type AtomButtonVariant = 'primary' | 'brand' | 'ghost' | 'danger';
export type AtomButtonSize    = 'sm' | 'md';

@Component({
  selector: 'atom-button',
  standalone: true,
  template: `
    <button
      class="atom-btn"
      [class]="'atom-btn--' + variant() + ' atom-btn--' + size()"
      [type]="type()"
      [disabled]="disabled()"
    >
      <ng-content />
    </button>
  `,
  styles: `
    :host {
      display: inline-block;
    }

    .atom-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--atom-space-xs, 4px);
      border: none;
      border-radius: var(--atom-radius-xs, 4px);
      font: 500 12px/1.55 Inter, ui-sans-serif, system-ui, sans-serif;
      letter-spacing: var(--atom-letter-nav, 0.12px);
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.15s, color 0.15s, opacity 0.15s;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
      }

      /* Sizes */
      &--sm { height: 30px; padding: 0 var(--atom-space-sm, 8px); }
      &--md { height: 36px; padding: 0 var(--atom-space-md, 12px); }

      /* Variants */
      &--primary {
        background: var(--atom-fg-primary, #18181b);
        color: #fff;
        &:hover:not(:disabled) { background: #2d2b29; }
      }
      &--brand {
        background: var(--atom-brand, #ff6600);
        color: var(--atom-brand-cta-text, #fff7f2);
        &:hover:not(:disabled) { background: #e55a00; }
      }
      &--ghost {
        background: transparent;
        color: var(--atom-fg-secondary, #2d2b29);
        border: 1px solid var(--atom-border-divider, #e8e7e6);
        &:hover:not(:disabled) { background: var(--atom-surface-data, #f7f7f7); }
      }
      &--danger {
        background: var(--atom-status-error-fg, #dc2626);
        color: #fff;
        &:hover:not(:disabled) { background: #b91c1c; }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomButtonComponent {
  readonly variant  = input<AtomButtonVariant>('primary');
  readonly size     = input<AtomButtonSize>('md');
  readonly type     = input<'button' | 'submit'>('button');
  readonly disabled = input<boolean>(false);
}
