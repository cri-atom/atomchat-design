import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AbIconComponent } from '../../presentation/shared/ab-icon';

@Component({
  selector: 'atom-search-input',
  standalone: true,
  imports: [FormsModule, AbIconComponent],
  template: `
    <label class="atom-search-input">
      <input
        type="search"
        class="atom-search-input__input"
        [placeholder]="placeholder()"
        [ngModel]="value()"
        (ngModelChange)="searchChange.emit($event)"
      />
      <ab-icon class="atom-search-input__icon" name="magnifying-glass" variant="regular" size="sm" />
    </label>
  `,
  styles: `
    .atom-search-input {
      position: relative;
      display: flex;
      align-items: center;
      width: 256px;
      height: 32px;
      flex-shrink: 0;
    }

    .atom-search-input__input {
      width: 100%;
      height: 100%;
      padding: 8px 32px 8px 8px;
      border: 1px solid var(--atom-filter-border);
      border-radius: var(--atom-radius-xs, 4px);
      font: 400 12px/1.25 Inter, ui-sans-serif, system-ui, sans-serif;
      letter-spacing: var(--atom-letter-nav);
      color: var(--atom-fg-primary);
      background: #fff;
      box-sizing: border-box;

      &::placeholder { color: var(--atom-content-secondary); }
      &:focus { outline: none; border-color: var(--atom-filter-border); }
    }

    .atom-search-input__icon {
      position: absolute;
      right: 8px;
      color: var(--atom-content-secondary);
      pointer-events: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomSearchInputComponent {
  readonly placeholder = input('Buscar...');
  readonly value       = input('');
  readonly searchChange = output<string>();
}
