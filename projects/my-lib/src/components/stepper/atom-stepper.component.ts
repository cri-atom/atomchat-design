import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface AtomStepperStep {
  id: string;
  label: string;
}

@Component({
  selector: 'atom-stepper',
  standalone: true,
  template: `
    <nav class="atom-stepper" aria-label="Pasos">
      @for (step of steps(); track step.id; let i = $index) {
        <div class="atom-stepper__step" [class.atom-stepper__step--active]="i === activeIndex()">
          <div class="atom-stepper__row">
            <span class="atom-stepper__badge">{{ i + 1 }}</span>
            <span class="atom-stepper__label">{{ step.label }}</span>
          </div>
        </div>
      }
    </nav>
  `,
  styles: `
    .atom-stepper {
      display: flex;
      width: 100%;
      padding: 0 var(--atom-space-lg, 16px);
    }

    .atom-stepper__step {
      flex: 1;
      padding-bottom: var(--atom-space-lg, 16px);
      border-bottom: 4px solid var(--atom-border-divider, #e8e7e6);

      &:first-child { flex: 0 0 auto; min-width: 169px; }

      &--active {
        border-bottom-color: var(--atom-brand);

        .atom-stepper__badge { background: var(--atom-brand); color: #fff; }
        .atom-stepper__label { font-weight: 700; color: var(--atom-fg-primary); }
      }
    }

    .atom-stepper__row { display: flex; align-items: center; gap: 9px; }

    .atom-stepper__badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      border-radius: 12px;
      background: var(--atom-tag-neutral-bg);
      color: var(--atom-fg-tertiary, #52525c);
      font: 500 10px/16px Inter, ui-sans-serif, system-ui, sans-serif;
    }

    .atom-stepper__label {
      font: 500 12px/16px Inter, ui-sans-serif, system-ui, sans-serif;
      color: var(--atom-fg-tertiary, #52525c);
      white-space: nowrap;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomStepperComponent {
  readonly steps       = input.required<AtomStepperStep[]>();
  readonly activeIndex = input(0);
}
