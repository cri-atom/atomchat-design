import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'citas-modal-stepper',
  standalone: true,
  template: `
    <div class="citas-modal-stepper">
      <span class="citas-modal-stepper__label">{{ stepLabel() }}</span>
      <div class="citas-modal-stepper__bullets" aria-hidden="true">
        @for (step of steps(); track step) {
          <span
            class="citas-modal-stepper__bullet"
            [class.citas-modal-stepper__bullet--active]="step === activeStep()"
          ></span>
        }
      </div>
    </div>
  `,
  styles: `
    .citas-modal-stepper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 24px;
      background: var(--atom-surface-data, #f7f7f7);
      border-bottom: 1px solid var(--atom-border-divider);
    }

    .citas-modal-stepper__label {
      font: 500 12px/1.35 Inter, sans-serif;
      color: var(--atom-brand);
      letter-spacing: var(--atom-letter-nav);
    }

    .citas-modal-stepper__bullets {
      display: flex;
      gap: 4px;
    }

    .citas-modal-stepper__bullet {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--atom-tag-neutral-bg, #d4d4d8);

      &--active {
        background: var(--atom-brand);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CitasModalStepperComponent {
  readonly activeStep = input.required<number>();
  readonly totalSteps = input.required<number>();
  readonly stepLabel = input.required<string>();

  readonly steps = computed(() =>
    Array.from({ length: this.totalSteps() }, (_, i) => i + 1),
  );
}
