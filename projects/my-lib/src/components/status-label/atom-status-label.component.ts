import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const LABELS: Record<string, string> = {
  publicado:   'Publicado',
  borrador:    'Borrador',
  activo:      'Activo',
  desactivado: 'Desactivado',
  draft:       'Borrador',
};

@Component({
  selector: 'atom-status-label',
  standalone: true,
  template: `<span [class]="className()">{{ displayLabel() }}</span>`,
  styles: `
    :host { display: inline-block; }

    .atom-status-label {
      font: 500 10px/16px Inter, ui-sans-serif, system-ui, sans-serif;
      letter-spacing: var(--atom-letter-badge);
      white-space: nowrap;
    }

    .atom-status-label--publicado,
    .atom-status-label--activo    { color: var(--atom-status-success-fg, #007a56); }

    .atom-status-label--borrador,
    .atom-status-label--draft,
    .atom-status-label--desactivado { color: var(--atom-tag-neutral-fg, #3f3f46); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomStatusLabelComponent {
  readonly variant = input.required<string>();
  readonly label   = input<string | null>(null);

  readonly displayLabel = computed(() => this.label() ?? LABELS[this.variant()] ?? this.variant());
  readonly className    = computed(() => `atom-status-label atom-status-label--${this.variant()}`);
}
