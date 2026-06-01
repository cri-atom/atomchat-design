import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

export interface SegmentOption {
  id: string;
  label: string;
}

@Component({
  selector: 'app-monitor-segmented-control',
  standalone: true,
  template: `
    <div class="seg" role="tablist">
      @for (opt of options(); track opt.id) {
        <button
          type="button"
          role="tab"
          class="seg__btn"
          [class.seg__btn--active]="value() === opt.id"
          [attr.aria-selected]="value() === opt.id"
          (click)="value.set(opt.id)"
        >
          {{ opt.label }}
        </button>
      }
    </div>
  `,
  styles: `
    .seg {
      display: inline-flex;
      gap: 2px;
      padding: 2px;
      background: var(--ab-surface-muted);
      border-radius: var(--ab-radius-sm);
    }

    .seg__btn {
      padding: var(--ab-space-xs) var(--ab-space-md);
      border: none;
      border-radius: 6px;
      background: transparent;
      font: var(--ab-font-label);
      color: var(--ab-text-muted);
      cursor: pointer;

      &--active {
        background: var(--ab-surface);
        color: var(--ab-text);
        box-shadow: 0 1px 2px rgba(9, 9, 11, 0.06);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitorSegmentedControlComponent {
  readonly options = input.required<SegmentOption[]>();
  readonly value = model.required<string>();
}
