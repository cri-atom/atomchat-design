import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AbIconComponent } from '../../../../../../my-lib/public-api';

@Component({
  selector: 'citas-page-heading',
  standalone: true,
  imports: [AbIconComponent],
  template: `
    <header class="citas-page-heading">
      @if (showBack()) {
        <button type="button" class="citas-page-heading__back" (click)="back.emit()" aria-label="Volver">
          <ab-icon name="arrow-left" variant="regular" size="md" />
        </button>
      }
      <div class="citas-page-heading__text">
        <h1 class="citas-page-heading__title">{{ title() }}</h1>
        @if (description()) {
          <p class="citas-page-heading__desc">{{ description() }}</p>
        }
      </div>
    </header>
  `,
  styles: `
    .citas-page-heading {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 16px 16px 8px;
      flex-shrink: 0;
    }

    .citas-page-heading__back {
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

    .citas-page-heading__text {
      min-width: 0;
    }

    .citas-page-heading__title {
      margin: 0;
      font: var(--atom-font-page-title);
      color: var(--atom-fg-primary);
    }

    .citas-page-heading__desc {
      margin: 0;
      font: var(--atom-font-page-desc);
      color: var(--atom-fg-quaternary);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CitasPageHeadingComponent {
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
  readonly showBack = input(false);
  readonly back = output<void>();
}
