import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type MonitorChipVariant = 'default' | 'live' | 'fictional' | 'success';

@Component({
  selector: 'app-monitor-chip',
  standalone: true,
  template: `<span class="chip" [class]="'chip--' + variant()"><ng-content /></span>`,
  styles: `
    .chip {
      display: inline-block;
      padding: 2px var(--ab-space-sm);
      border-radius: var(--ab-radius-full);
      font: var(--ab-font-label);
      background: var(--ab-surface-muted);
      color: var(--ab-text-muted);

      &--live {
        background: #eff6ff;
        color: #193cb9;
      }

      &--fictional {
        background: #f4f4f5;
        color: var(--ab-text-muted);
      }

      &--success {
        background: var(--ab-success-bg);
        color: var(--ab-success);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitorChipComponent {
  readonly variant = input<MonitorChipVariant>('default');
}
