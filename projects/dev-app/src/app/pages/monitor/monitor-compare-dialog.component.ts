import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MonitorMockStateService } from './monitor-mock-state.service';

@Component({
  selector: 'app-monitor-compare-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Comparar versiones</h2>
    <mat-dialog-content>
      <p class="compare-intro">Diff entre la versión en producción y el borrador del Playground.</p>
      <div class="compare-grid">
        <article class="compare-col">
          <h3>Producción ({{ productionLabel }})</h3>
          <pre>{{ state.activePrompt() }}</pre>
        </article>
        <article class="compare-col compare-col--draft">
          <h3>Borrador (Playground)</h3>
          <pre>{{ state.draftPrompt() }}</pre>
        </article>
      </div>
      <ul class="compare-metrics">
        <li><strong>Score simulado:</strong> 0.78 → 0.91 (+13%)</li>
        <li><strong>Latencia P50:</strong> 1.6s → 1.3s</li>
        <li><strong>Tasa resolución:</strong> 72% → 84%</li>
      </ul>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="close()">Cerrar</button>
      <button mat-flat-button class="compare-cta" type="button" (click)="useDraft()">Usar borrador en Playground</button>
    </mat-dialog-actions>
  `,
  styles: `
    .compare-intro {
      margin: 0 0 var(--ab-space-md);
      font: var(--ab-font-label);
      color: var(--ab-text-muted);
    }
    .compare-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--ab-space-md);
      margin-bottom: var(--ab-space-md);
    }
    .compare-col {
      border: 1px solid var(--ab-border);
      border-radius: var(--ab-radius-sm);
      overflow: hidden;
      h3 {
        margin: 0;
        padding: var(--ab-space-sm) var(--ab-space-md);
        background: var(--ab-surface-muted);
        font: 600 12px/16px Inter, sans-serif;
      }
      pre {
        margin: 0;
        padding: var(--ab-space-md);
        font: 400 12px/18px var(--font-mono, monospace);
        white-space: pre-wrap;
        background: #fff5f5;
      }
      &--draft pre {
        background: #f0fdf4;
      }
    }
    .compare-metrics {
      margin: 0;
      padding: var(--ab-space-md);
      background: var(--ab-surface-muted);
      border-radius: var(--ab-radius-sm);
      font: var(--ab-font-label);
      color: var(--ab-text);
      li {
        margin-bottom: var(--ab-space-xs);
      }
    }
    .compare-cta {
      background: var(--ab-brand-cta) !important;
      color: #fff !important;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitorCompareDialogComponent {
  readonly state = inject(MonitorMockStateService);
  private readonly dialogRef = inject(MatDialogRef<MonitorCompareDialogComponent>);
  readonly productionLabel = 'v2.4.0';

  close(): void {
    this.dialogRef.close();
  }

  useDraft(): void {
    this.state.activePrompt.set(this.state.draftPrompt());
    this.dialogRef.close('use-draft');
  }
}
