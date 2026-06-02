import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AbIconComponent } from '../../../../my-lib/public-api';

@Component({
  selector: 'atom-section-heading',
  standalone: true,
  imports: [AbIconComponent],
  template: `
    <header class="atom-section-heading" [class.atom-section-heading--with-back]="showBack()">
      @if (showBack()) {
        <button type="button" class="atom-section-heading__back" (click)="back.emit()" aria-label="Volver">
          <ab-icon name="arrow-left" variant="regular" size="md" />
        </button>
      }
      <div class="atom-section-heading__text">
        <h1 class="atom-section-heading__title">{{ title() }}</h1>
        @if (description()) {
          <p class="atom-section-heading__desc">{{ description() }}</p>
        }
      </div>
    </header>
  `,
  styles: `
    .atom-section-heading {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 16px 16px 8px;
      flex-shrink: 0;
    }

    .atom-section-heading__back {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 2px;
      padding: 0;
      border: none;
      background: transparent;
      color: var(--atom-fg-primary);
      cursor: pointer;
    }

    .atom-section-heading__text { min-width: 0; }

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
  readonly title       = input.required<string>();
  readonly description = input<string | undefined>(undefined);
  readonly showBack    = input(false);
  readonly back        = output<void>();
}
