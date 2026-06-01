import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { WorkspaceModeService } from '../../workspace/workspace-mode.service';

@Component({
  selector: 'app-monitor-evaluations-create',
  standalone: true,
  imports: [KeyValuePipe],
  template: `
    <div class="eval-create">
      <header class="eval-create__header">
        <button type="button" class="eval-create__back" (click)="cancel()">← Volver</button>
        <h3>Nueva evaluación</h3>
      </header>

      <section class="eval-create__section">
        <p class="eval-create__label">Origen</p>
        <div class="eval-create__origin-cards">
          @for (opt of originOptions; track opt.id) {
            <button
              type="button"
              class="origin-card"
              [class.origin-card--selected]="origin() === opt.id"
              (click)="origin.set(opt.id)"
            >
              <strong>{{ opt.title }}</strong>
              <span>{{ opt.desc }}</span>
            </button>
          }
        </div>
      </section>

      @if (origin() === 'ai') {
        <section class="eval-create__section">
          <label class="eval-create__field">
            Cantidad de conversaciones
            <input type="number" class="eval-create__input" value="10" min="1" />
          </label>
          <p class="eval-create__label">Personalidades del cliente</p>
          <div class="eval-create__chips">
            @for (entry of personalities() | keyvalue; track entry.key) {
              <button
                type="button"
                class="personality-chip"
                [class.personality-chip--on]="entry.value"
                (click)="togglePersonality(entry.key)"
              >
                {{ entry.value ? '✓' : '' }} {{ entry.key }}
              </button>
            }
          </div>
          <label class="eval-create__field">
            Qué comportamiento quieres probar
            <textarea class="eval-create__textarea" rows="3"></textarea>
          </label>
        </section>
      }

      <section class="eval-create__section">
        <p class="eval-create__label">Criterios</p>
        <label class="eval-create__check"><input type="checkbox" checked /> Alucinaciones</label>
        <label class="eval-create__check"><input type="checkbox" checked /> Relevancia contextual</label>
        <label class="eval-create__check"><input type="checkbox" checked /> Tono y empatía</label>
      </section>

      <footer class="eval-create__footer">
        <span>Costo estimado: <strong>$0.12</strong></span>
        <button type="button" class="eval-create__submit" (click)="submit()">Iniciar evaluación</button>
      </footer>
    </div>
  `,
  styles: `
    .eval-create {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: var(--ab-space-md);
      overflow-y: auto;
    }
    .eval-create__header {
      margin-bottom: var(--ab-space-md);
      h3 { margin: var(--ab-space-xs) 0 0; font: 600 14px/20px Inter, sans-serif; }
    }
    .eval-create__back {
      border: none;
      background: transparent;
      font: var(--ab-font-label);
      color: var(--ab-mode-editor);
      cursor: pointer;
      padding: 0;
    }
    .eval-create__section { margin-bottom: var(--ab-space-md); }
    .eval-create__label { margin: 0 0 var(--ab-space-xs); font: var(--ab-font-label); color: var(--ab-text-muted); }
    .eval-create__field { display: block; font: var(--ab-font-label); color: var(--ab-text-muted); }
    .eval-create__input, .eval-create__textarea {
      display: block;
      width: 100%;
      margin-top: var(--ab-space-xs);
      padding: var(--ab-space-sm);
      border: 1px solid var(--ab-border);
      border-radius: var(--ab-radius-sm);
      box-sizing: border-box;
    }
    .eval-create__origin-cards { display: flex; flex-direction: column; gap: var(--ab-space-xs); }
    .origin-card {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
      padding: var(--ab-space-sm);
      border: 1px solid var(--ab-border);
      border-radius: var(--ab-radius-sm);
      background: var(--ab-surface);
      text-align: left;
      cursor: pointer;
      &--selected { border-color: var(--ab-brand-cta); background: rgba(255,102,0,0.06); }
    }
    .eval-create__chips { display: flex; flex-wrap: wrap; gap: var(--ab-space-xs); margin-bottom: var(--ab-space-sm); }
    .personality-chip {
      padding: 2px var(--ab-space-sm);
      border: 1px solid var(--ab-border);
      border-radius: var(--ab-radius-full);
      background: var(--ab-surface);
      font: var(--ab-font-label);
      cursor: pointer;
      &--on { border-color: var(--ab-mode-editor); color: var(--ab-mode-editor); }
    }
    .eval-create__check { display: flex; gap: var(--ab-space-xs); font: var(--ab-font-label); margin-bottom: 4px; }
    .eval-create__footer {
      margin-top: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ab-space-sm);
      font: var(--ab-font-label);
    }
    .eval-create__submit {
      padding: var(--ab-space-xs) var(--ab-space-md);
      border: none;
      border-radius: var(--ab-radius-sm);
      background: var(--ab-brand-cta);
      color: #fff;
      font: 600 12px/16px Inter, sans-serif;
      cursor: pointer;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitorEvaluationsCreateComponent {
  private readonly workspace = inject(WorkspaceModeService);
  readonly origin = signal<'traffic' | 'ai' | 'saved'>('ai');
  readonly personalities = signal<Record<string, boolean>>({
    Cordial: true,
    Frustrado: true,
    Técnico: false,
    Apurado: false,
  });

  readonly originOptions = [
    { id: 'traffic' as const, title: 'Tráfico Real', desc: 'Conversaciones de producción' },
    { id: 'ai' as const, title: 'Generar con IA', desc: 'Clientes virtuales' },
    { id: 'saved' as const, title: 'Casos Guardados', desc: 'Datasets reutilizables' },
  ];

  togglePersonality(key: string): void {
    this.personalities.update((p) => ({ ...p, [key]: !p[key] }));
  }

  cancel(): void {
    this.workspace.closeEvaluationsCreate();
  }

  submit(): void {
    this.workspace.closeEvaluationsCreate();
  }
}
