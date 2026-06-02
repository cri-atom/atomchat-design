import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AbIconComponent, type AbIconName } from '../../presentation/shared/ab-icon';

@Component({
  selector: 'atom-filter-chip',
  standalone: true,
  imports: [AbIconComponent],
  template: `
    <button type="button" class="atom-filter-chip">
      <ab-icon [name]="icon()" variant="regular" size="sm" />
      <span class="atom-filter-chip__label">{{ label() }}</span>
      <ab-icon name="chevron-down" variant="regular" size="sm" />
    </button>
  `,
  styles: `
    .atom-filter-chip {
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

    .atom-filter-chip__label { flex-shrink: 0; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomFilterChipComponent {
  readonly icon  = input.required<AbIconName>();
  readonly label = input.required<string>();
}
