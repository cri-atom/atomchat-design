import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'atom-card',
  standalone: true,
  template: `
    <section class="atom-card">
      <h2 class="atom-card__title">{{ title() }}</h2>
      <ng-content />
    </section>
  `,
  styles: `
    .atom-card {
      display: flex;
      flex-direction: column;
      gap: var(--atom-space-lg, 16px);
      padding: var(--atom-space-lg, 16px);
      border: 1px solid var(--atom-border-divider, #e8e7e6);
      border-radius: var(--atom-radius-sm, 8px);
      background: #fff;
    }

    .atom-card__title {
      margin: 0;
      font: 500 16px/24px Inter, ui-sans-serif, system-ui, sans-serif;
      color: var(--atom-fg-primary, #18181b);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomCardComponent {
  readonly title = input.required<string>();
}
