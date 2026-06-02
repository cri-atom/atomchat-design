import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AbIconComponent, type AbIconName, type AbIconSize, type AbIconVariant } from '../../presentation/shared/ab-icon';

@Component({
  selector: 'atom-icon-button',
  standalone: true,
  imports: [AbIconComponent],
  template: `
    <button
      class="atom-icon-btn"
      type="button"
      [attr.aria-label]="label()"
      [disabled]="disabled()"
    >
      <ab-icon [name]="name()" [variant]="variant()" [size]="size()" [ariaHidden]="true" />
    </button>
  `,
  styles: `
    :host {
      display: inline-block;
      flex-shrink: 0;
    }

    .atom-icon-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      border-radius: var(--atom-radius-sm, 8px);
      background: transparent;
      color: var(--atom-fg-tertiary, #52525c);
      cursor: pointer;
      transition: background 0.15s, color 0.15s;

      &:hover:not(:disabled) {
        background: var(--atom-surface-data, #f7f7f7);
        color: var(--atom-fg-secondary, #2d2b29);
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
        pointer-events: none;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomIconButtonComponent {
  readonly name     = input.required<AbIconName>();
  readonly label    = input.required<string>();
  readonly variant  = input<AbIconVariant>('regular');
  readonly size     = input<AbIconSize>('sm');
  readonly disabled = input<boolean>(false);
}
