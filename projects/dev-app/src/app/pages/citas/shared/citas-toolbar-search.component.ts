import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AbIconComponent } from '../../../../../../my-lib/public-api';

@Component({
  selector: 'citas-toolbar-search',
  standalone: true,
  imports: [FormsModule, AbIconComponent],
  template: `
    <label class="citas-toolbar-search">
      <input
        type="search"
        class="citas-toolbar-search__input"
        [placeholder]="placeholder()"
        [ngModel]="value()"
        (ngModelChange)="searchChange.emit($event)"
      />
      <ab-icon class="citas-toolbar-search__icon" name="magnifying-glass" variant="regular" size="sm" />
    </label>
  `,
  styles: `
    .citas-toolbar-search {
      position: relative;
      display: flex;
      align-items: center;
      width: 256px;
      height: 32px;
      flex-shrink: 0;
    }

    .citas-toolbar-search__input {
      width: 100%;
      height: 100%;
      padding: 8px 32px 8px 8px;
      border: 1px solid var(--atom-filter-border);
      border-radius: 4px;
      font: 400 12px/1.25 Inter, sans-serif;
      letter-spacing: var(--atom-letter-nav);
      color: var(--atom-fg-primary);
      background: #fff;
      box-sizing: border-box;

      &::placeholder {
        color: var(--atom-content-secondary);
      }

      &:focus {
        outline: none;
        border-color: var(--color-border-primary, #71717b);
      }
    }

    .citas-toolbar-search__icon {
      position: absolute;
      right: 8px;
      color: var(--atom-content-secondary);
      pointer-events: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CitasToolbarSearchComponent {
  readonly placeholder = input('Buscar...');
  readonly value = input('');
  readonly searchChange = output<string>();
}
