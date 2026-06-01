import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'atom-section-heading',
  standalone: true,
  template: `
    <header class="atom-section-heading">
      <h1 class="atom-section-heading__title">{{ title() }}</h1>
      @if (description()) {
        <p class="atom-section-heading__desc">{{ description() }}</p>
      }
    </header>
  `,
  styles: `
    .atom-section-heading {
      padding: 16px 16px 8px;
      flex-shrink: 0;
    }

    .atom-section-heading__title {
      margin: 0;
      font: var(--atom-font-page-title);
      color: var(--atom-fg-primary);
      letter-spacing: 0;
    }

    .atom-section-heading__desc {
      margin: 0;
      font: var(--atom-font-page-desc);
      color: var(--atom-fg-quaternary);
      letter-spacing: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomSectionHeadingComponent {
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
}
