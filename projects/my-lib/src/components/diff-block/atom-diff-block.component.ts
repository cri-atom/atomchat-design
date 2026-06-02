import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'atom-diff-block',
  standalone: true,
  template: `
    <div class="atom-diff-block">
      <p class="atom-diff-block__label">{{ label() }}</p>
      <pre class="atom-diff-block__content"><ng-content /></pre>
    </div>
  `,
  styles: `
    .atom-diff-block {
      flex: 1;
      min-width: 0;
      border: 1px solid var(--ab-border, #e4e4e7);
      border-radius: var(--ab-radius-sm, 8px);
      overflow: hidden;
    }

    .atom-diff-block__label {
      margin: 0;
      padding: var(--ab-space-sm, 8px) var(--ab-space-md, 12px);
      background: var(--ab-surface-muted, #f4f4f5);
      font: var(--ab-font-label, 500 12px/16px Inter, sans-serif);
      color: var(--ab-text-muted, #52525c);
      border-bottom: 1px solid var(--ab-border, #e4e4e7);
    }

    .atom-diff-block__content {
      margin: 0;
      padding: var(--ab-space-md, 12px);
      font: 400 12px/18px var(--font-mono, monospace);
      white-space: pre-wrap;
      color: var(--ab-text, #18181b);
    }

    :host(.atom-diff-block--old) .atom-diff-block__content { background: #fff5f5; }
    :host(.atom-diff-block--new) .atom-diff-block__content { background: #f0fdf4; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomDiffBlockComponent {
  readonly label = input.required<string>();
}
