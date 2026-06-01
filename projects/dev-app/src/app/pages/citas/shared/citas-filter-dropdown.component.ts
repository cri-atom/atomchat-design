import { ChangeDetectionStrategy, Component, HostListener, input, output, signal } from '@angular/core';
import { AbIconComponent, type AbIconName } from '../../../../../../my-lib/public-api';

export interface CitasFilterOption<T extends string = string> {
  value: T;
  label: string;
}

@Component({
  selector: 'citas-filter-dropdown',
  standalone: true,
  imports: [AbIconComponent],
  template: `
    <div class="citas-filter-dropdown">
      <button
        type="button"
        class="citas-filter-dropdown__trigger"
        [attr.aria-expanded]="open()"
        (click)="toggle($event)"
      >
        <ab-icon [name]="icon()" variant="regular" size="sm" />
        <span class="citas-filter-dropdown__label">{{ selectedLabel() }}</span>
        <ab-icon name="chevron-down" variant="regular" size="sm" />
      </button>
      @if (open()) {
        <div class="citas-filter-dropdown__panel" role="listbox">
          @for (opt of options(); track opt.value) {
            <button
              type="button"
              class="citas-filter-dropdown__option"
              role="option"
              [class.citas-filter-dropdown__option--selected]="opt.value === value()"
              (click)="select(opt.value)"
            >
              {{ opt.label }}
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .citas-filter-dropdown {
      position: relative;
    }

    .citas-filter-dropdown__trigger {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 32px;
      padding: 0 8px;
      border: 1px solid var(--atom-filter-border);
      border-radius: 4px;
      background: #fff;
      font: 400 12px/1.35 Inter, sans-serif;
      letter-spacing: var(--atom-letter-nav);
      color: #4d4642;
      cursor: pointer;
      white-space: nowrap;

      &:hover {
        border-color: var(--color-border-primary, #71717b);
      }
    }

    .citas-filter-dropdown__panel {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      z-index: 20;
      min-width: 100%;
      padding: 4px 0;
      border: 1px solid var(--atom-border-divider);
      border-radius: 8px;
      background: #fff;
      box-shadow: var(--atom-elevation-elevated);
    }

    .citas-filter-dropdown__option {
      display: block;
      width: 100%;
      padding: 8px 12px;
      border: none;
      background: none;
      text-align: left;
      font: 400 12px/1.35 Inter, sans-serif;
      color: var(--atom-fg-primary);
      cursor: pointer;

      &:hover {
        background: var(--atom-surface-data);
      }

      &--selected {
        font-weight: 500;
        color: var(--atom-brand);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CitasFilterDropdownComponent<T extends string = string> {
  readonly icon = input.required<AbIconName>();
  readonly options = input.required<CitasFilterOption<T>[]>();
  readonly value = input.required<T>();
  readonly valueChange = output<T>();

  readonly open = signal(false);

  selectedLabel(): string {
    return this.options().find((o) => o.value === this.value())?.label ?? '';
  }

  toggle(event: MouseEvent): void {
    event.stopPropagation();
    this.open.update((v) => !v);
  }

  select(value: T): void {
    this.valueChange.emit(value);
    this.open.set(false);
  }

  @HostListener('document:click')
  closeOnOutsideClick(): void {
    this.open.set(false);
  }
}
