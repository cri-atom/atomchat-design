import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

export interface AtomSegmentOption {
  id: string;
  label: string;
}

@Component({
  selector: 'atom-segmented-control',
  standalone: true,
  template: `
    <div class="atom-seg" role="tablist">
      @for (opt of options(); track opt.id) {
        <button
          type="button"
          role="tab"
          class="atom-seg__btn"
          [class.atom-seg__btn--active]="value() === opt.id"
          [attr.aria-selected]="value() === opt.id"
          (click)="value.set(opt.id)"
        >
          {{ opt.label }}
        </button>
      }
    </div>
  `,
  styles: `
    .atom-seg {
      display: inline-flex;
      gap: 2px;
      padding: 2px;
      background: var(--ab-surface-muted, #f4f4f5);
      border-radius: var(--ab-radius-sm, 8px);
    }

    .atom-seg__btn {
      padding: var(--ab-space-xs, 4px) var(--ab-space-md, 12px);
      border: none;
      border-radius: 6px;
      background: transparent;
      font: var(--ab-font-label, 500 12px/16px Inter, sans-serif);
      color: var(--ab-text-muted, #52525c);
      cursor: pointer;

      &--active {
        background: var(--ab-surface, #fff);
        color: var(--ab-text, #18181b);
        box-shadow: 0 1px 2px rgba(9, 9, 11, 0.06);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomSegmentedControlComponent {
  readonly options = input.required<AtomSegmentOption[]>();
  readonly value   = model.required<string>();
}
