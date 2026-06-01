import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type CitasPublishStatus = 'publicado' | 'borrador';

@Component({
  selector: 'citas-status-label',
  standalone: true,
  template: `<span [class]="className()">{{ label() }}</span>`,
  styles: `
    :host {
      display: inline-block;
    }

    .citas-status-label {
      font: 500 10px/16px Inter, sans-serif;
      letter-spacing: var(--atom-letter-badge);
      white-space: nowrap;
    }

    .citas-status-label--publicado {
      color: var(--atom-status-success-fg);
    }

    .citas-status-label--borrador {
      color: var(--atom-tag-neutral-fg);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CitasStatusLabelComponent {
  readonly status = input.required<CitasPublishStatus>();

  readonly label = computed(() =>
    this.status() === 'publicado' ? 'Publicado' : 'Borrador',
  );

  readonly className = computed(
    () => `citas-status-label citas-status-label--${this.status()}`,
  );
}
