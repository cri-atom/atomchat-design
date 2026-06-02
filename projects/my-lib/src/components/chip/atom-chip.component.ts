import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type AtomChipVariant = 'default' | 'live' | 'fictional' | 'success';

@Component({
  selector: 'atom-chip',
  standalone: true,
  template: `<span class="atom-chip" [class]="'atom-chip--' + variant()"><ng-content /></span>`,
  styles: `
    .atom-chip {
      display: inline-block;
      padding: 2px var(--ab-space-sm, 8px);
      border-radius: var(--ab-radius-full, 9999px);
      font: var(--ab-font-label, 500 12px/16px Inter, sans-serif);
      background: var(--ab-surface-muted, #f4f4f5);
      color: var(--ab-text-muted, #52525c);

      &--live       { background: #eff6ff; color: #193cb9; }
      &--fictional  { background: #f4f4f5; color: var(--ab-text-muted, #52525c); }
      &--success    { background: var(--ab-success-bg, #ecfdf5); color: var(--ab-success, #006145); }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomChipComponent {
  readonly variant = input<AtomChipVariant>('default');
}
