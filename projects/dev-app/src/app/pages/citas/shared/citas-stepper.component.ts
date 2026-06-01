import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface CitasStepperStep {
  id: string;
  label: string;
}

@Component({
  selector: 'citas-stepper',
  standalone: true,
  template: `
    <nav class="citas-stepper" aria-label="Pasos">
      @for (step of steps(); track step.id; let i = $index) {
        <div
          class="citas-stepper__step"
          [class.citas-stepper__step--active]="i === activeIndex()"
        >
          <div class="citas-stepper__row">
            <span class="citas-stepper__badge">{{ i + 1 }}</span>
            <span class="citas-stepper__label">{{ step.label }}</span>
          </div>
        </div>
      }
    </nav>
  `,
  styles: `
    .citas-stepper {
      display: flex;
      width: 100%;
      padding: 0 16px;
      gap: 0;
    }

    .citas-stepper__step {
      flex: 1;
      padding-bottom: 16px;
      border-bottom: 4px solid var(--atom-border-divider, #e4e4e7);

      &:first-child {
        flex: 0 0 auto;
        min-width: 169px;
      }

      &--active {
        border-bottom-color: var(--atom-brand);

        .citas-stepper__badge {
          background: var(--atom-brand);
          color: #fff;
        }

        .citas-stepper__label {
          font-weight: 700;
          color: var(--atom-fg-primary);
        }
      }
    }

    .citas-stepper__row {
      display: flex;
      align-items: center;
      gap: 9px;
    }

    .citas-stepper__badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      border-radius: 12px;
      background: var(--atom-tag-neutral-bg);
      color: var(--color-fg-secondary, #27272a);
      font: 500 10px/16px Inter, sans-serif;
    }

    .citas-stepper__label {
      font: 500 12px/16px Inter, sans-serif;
      color: var(--color-fg-tertiary, #52525c);
      white-space: nowrap;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CitasStepperComponent {
  readonly steps = input.required<CitasStepperStep[]>();
  readonly activeIndex = input(0);
}
