import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-monitor-diff-block',
  standalone: true,
  template: `
    <div class="diff-block">
      <p class="diff-block__label">{{ label() }}</p>
      <pre class="diff-block__content"><ng-content /></pre>
    </div>
  `,
  styles: `
    .diff-block {
      flex: 1;
      min-width: 0;
      border: 1px solid var(--ab-border);
      border-radius: var(--ab-radius-sm);
      overflow: hidden;
    }
    .diff-block__label {
      margin: 0;
      padding: var(--ab-space-sm) var(--ab-space-md);
      background: var(--ab-surface-muted);
      font: var(--ab-font-label);
      color: var(--ab-text-muted);
      border-bottom: 1px solid var(--ab-border);
    }
    .diff-block__content {
      margin: 0;
      padding: var(--ab-space-md);
      font: 400 12px/18px var(--font-mono, monospace);
      white-space: pre-wrap;
      color: var(--ab-text);
    }
    :host(.diff-block--old) .diff-block__content {
      background: #fff5f5;
    }
    :host(.diff-block--new) .diff-block__content {
      background: #f0fdf4;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitorDiffBlockComponent {
  readonly label = input.required<string>();
}
