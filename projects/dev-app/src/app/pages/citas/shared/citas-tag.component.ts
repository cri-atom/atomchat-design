import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'citas-tag',
  standalone: true,
  template: `<span class="citas-tag">{{ label() }}</span>`,
  styles: `
    .citas-tag {
      display: inline-block;
      max-width: 200px;
      padding: 2px 8px;
      border-radius: 9999px;
      background: var(--atom-tag-neutral-bg);
      color: var(--atom-tag-neutral-fg);
      font: 500 10px/16px Inter, sans-serif;
      letter-spacing: var(--atom-letter-badge);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CitasTagComponent {
  readonly label = input.required<string>();
}
