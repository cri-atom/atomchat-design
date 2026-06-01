import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AbIconComponent, type AbIconName } from '../../../../../../my-lib/public-api';

@Component({
  selector: 'citas-filter-chip',
  standalone: true,
  imports: [AbIconComponent],
  template: `
    <button type="button" class="citas-filter-chip">
      <ab-icon [name]="icon()" variant="regular" size="sm" />
      <span class="citas-filter-chip__label">{{ label() }}</span>
      <ab-icon name="chevron-down" variant="regular" size="sm" />
    </button>
  `,
  styles: `
    .citas-filter-chip {
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

    .citas-filter-chip__label {
      flex-shrink: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CitasFilterChipComponent {
  readonly icon = input.required<AbIconName>();
  readonly label = input.required<string>();
}
