import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { PROMPT_CURRENT, PROMPT_SUGGESTED } from './monitor-mock.data';
import { MonitorMockStateService } from './monitor-mock-state.service';
import { WorkspaceModeService } from '../../workspace/workspace-mode.service';

export interface SuggestionDialogData {
  caseId: string;
  scenarioTitle: string;
}

@Component({
  selector: 'app-monitor-suggestion-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Sugerencia de Mejora de IA</h2>
    <mat-dialog-content class="suggestion-dialog__content">
      <p class="suggestion-dialog__alert">
        Modifiqué el prompt para que el agente solicite explícitamente el número de pedido.
      </p>
      <div class="suggestion-dialog__diff">
        <div class="diff-pane diff-pane--old">
          <p class="diff-pane__label">Prompt actual</p>
          <pre>{{ promptCurrent }}</pre>
        </div>
        <div class="diff-pane diff-pane--new">
          <p class="diff-pane__label">Prompt nuevo</p>
          <pre>{{ promptSuggested }}</pre>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="suggestion-dialog__actions">
      <button mat-button type="button" (click)="close()">Descartar</button>
      <button mat-stroked-button type="button" (click)="tryPlayground()">Probar en Playground</button>
      <button mat-flat-button class="suggestion-dialog__primary" type="button" (click)="saveAndPromote()">
        Guardar y Promover
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .suggestion-dialog__content {
      min-width: min(90vw, 960px);
    }
    .suggestion-dialog__alert {
      margin: 0 0 var(--ab-space-md);
      padding: var(--ab-space-sm) var(--ab-space-md);
      background: var(--ab-surface-muted);
      border-radius: var(--ab-radius-sm);
      font: var(--ab-font-label);
      color: var(--ab-text);
    }
    .suggestion-dialog__diff {
      display: flex;
      gap: var(--ab-space-md);
    }
    .diff-pane {
      flex: 1;
      min-width: 0;
      border: 1px solid var(--ab-border);
      border-radius: var(--ab-radius-sm);
      overflow: hidden;
    }
    .diff-pane__label {
      margin: 0;
      padding: var(--ab-space-sm) var(--ab-space-md);
      background: var(--ab-surface-muted);
      font: var(--ab-font-label);
      color: var(--ab-text-muted);
    }
    .diff-pane pre {
      margin: 0;
      padding: var(--ab-space-md);
      font: 400 12px/18px var(--font-mono, monospace);
      white-space: pre-wrap;
    }
    .diff-pane--old pre {
      background: #fff5f5;
    }
    .diff-pane--new pre {
      background: #f0fdf4;
    }
    .suggestion-dialog__primary {
      background: var(--ab-brand-cta) !important;
      color: #fff !important;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitorSuggestionDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<MonitorSuggestionDialogComponent>);
  private readonly mockState = inject(MonitorMockStateService);
  private readonly workspace = inject(WorkspaceModeService);
  private readonly data = inject<SuggestionDialogData>(MAT_DIALOG_DATA);

  readonly promptCurrent = PROMPT_CURRENT;
  readonly promptSuggested = PROMPT_SUGGESTED;

  close(): void {
    this.dialogRef.close();
  }

  tryPlayground(): void {
    this.mockState.openPlaygroundFromReview(this.data.caseId, this.data.scenarioTitle);
    this.workspace.setMode('monitor');
    this.workspace.goToPlaygroundFromReview();
    this.dialogRef.close('playground');
  }

  saveAndPromote(): void {
    this.mockState.promoteReviewCase(this.data.caseId);
    this.workspace.setMode('monitor');
    this.workspace.setMonitorTab('revision');
    this.dialogRef.close('promoted');
  }
}
