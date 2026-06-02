import { ChangeDetectionStrategy, Component, HostListener, input, output, signal } from '@angular/core';
import { AbIconComponent, type AbIconName } from '../../presentation/shared/ab-icon';

export interface AtomFilterOption<T extends string = string> {
  value: T;
  label: string;
}

@Component({
  selector: 'atom-filter-dropdown',
  standalone: true,
  imports: [AbIconComponent],
  template: `
    <div class="atom-filter-dropdown">
      <button
        type="button"
        class="atom-filter-dropdown__trigger"
        [attr.aria-expanded]="open()"
        (click)="toggle($event)"
      >
        <ab-icon [name]="icon()" variant="regular" size="sm" />
        <span class="atom-filter-dropdown__label">{{ selectedLabel() }}</span>
        <ab-icon name="chevron-down" variant="regular" size="sm" />
      </button>
      @if (open()) {
        <div class="atom-filter-dropdown__panel" role="listbox">
          @for (opt of options(); track opt.value) {
            <button
              type="button"
              class="atom-filter-dropdown__option"
              role="option"
              [class.atom-filter-dropdown__option--selected]="opt.value === value()"
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
    .atom-filter-dropdown { position: relative; }

    .atom-filter-dropdown__trigger {
      display: inline-flex;
      align-items: center;
      gap: var(--atom-space-sm, 8px);
      height: 32px;
      padding: 0 var(--atom-space-sm, 8px);
      border: 1px solid var(--atom-filter-border);
      border-radius: var(--atom-radius-xs, 4px);
      background: #fff;
      font: 400 12px/1.35 Inter, ui-sans-serif, system-ui, sans-serif;
      letter-spacing: var(--atom-letter-nav);
      color: var(--atom-content-tertiary, #4d4642);
      cursor: pointer;
      white-space: nowrap;

      &:hover { border-color: var(--atom-fg-quaternary, #71717b); }
    }

    .atom-filter-dropdown__panel {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      z-index: var(--atom-z-dropdown, 20);
      min-width: 100%;
      padding: 4px 0;
      border: 1px solid var(--atom-border-divider);
      border-radius: var(--atom-radius-sm, 8px);
      background: #fff;
      box-shadow: var(--atom-elevation-elevated);
    }

    .atom-filter-dropdown__option {
      display: block;
      width: 100%;
      padding: 8px 12px;
      border: none;
      background: none;
      text-align: left;
      font: 400 12px/1.35 Inter, ui-sans-serif, system-ui, sans-serif;
      color: var(--atom-fg-primary);
      cursor: pointer;

      &:hover { background: var(--atom-surface-data); }
      &--selected { font-weight: 500; color: var(--atom-brand); }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomFilterDropdownComponent<T extends string = string> {
  readonly icon        = input.required<AbIconName>();
  readonly options     = input.required<AtomFilterOption<T>[]>();
  readonly value       = input.required<T>();
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
