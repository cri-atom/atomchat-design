import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'citas-form-card',
  standalone: true,
  template: `
    <section class="citas-form-card">
      <h2 class="citas-form-card__title">{{ title() }}</h2>
      <ng-content />
    </section>
  `,
  styles: `
    .citas-form-card {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
      border: 1px solid var(--color-border-secondary, #d4d4d8);
      border-radius: 8px;
      background: #fff;
    }

    .citas-form-card__title {
      margin: 0;
      font: 500 16px/24px Inter, sans-serif;
      color: #09090b;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CitasFormCardComponent {
  readonly title = input.required<string>();
}
