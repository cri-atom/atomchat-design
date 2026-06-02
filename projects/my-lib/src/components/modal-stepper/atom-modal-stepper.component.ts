import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'atom-modal-stepper',
  standalone: true,
  template: `
    <div class="atom-modal-stepper">
      <span class="atom-modal-stepper__label">{{ stepLabel() }}</span>
      <div class="atom-modal-stepper__bullets" aria-hidden="true">
        @for (step of steps(); track step) {
          <span
            class="atom-modal-stepper__bullet"
            [class.atom-modal-stepper__bullet--active]="step === activeStep()"
          ></span>
        }
      </div>
    </div>
  `,
  styles: `
    .atom-modal-stepper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 24px;
      background: var(--atom-surface-data, #f7f7f7);
      border-bottom: 1px solid var(--atom-border-divider);
    }

    .atom-modal-stepper__label {
      font: 500 12px/1.35 Inter, ui-sans-serif, system-ui, sans-serif;
      color: var(--atom-brand);
      letter-spacing: var(--atom-letter-nav);
    }

    .atom-modal-stepper__bullets { display: flex; gap: 4px; }

    .atom-modal-stepper__bullet {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--atom-tag-neutral-bg, #d4d4d8);

      &--active { background: var(--atom-brand); }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomModalStepperComponent {
  readonly activeStep = input.required<number>();
  readonly totalSteps = input.required<number>();
  readonly stepLabel  = input.required<string>();

  readonly steps = computed(() =>
    Array.from({ length: this.totalSteps() }, (_, i) => i + 1),
  );
}
