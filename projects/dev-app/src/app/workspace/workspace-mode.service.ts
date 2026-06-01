import { Injectable, signal } from '@angular/core';

export type WorkspaceMode = 'editor' | 'monitor';
export type MonitorTab = 'dashboard' | 'revision' | 'playground';
export type EvaluationsColumnView = 'list' | 'create';

@Injectable({ providedIn: 'root' })
export class WorkspaceModeService {
  readonly mode = signal<WorkspaceMode>('editor');
  readonly monitorTab = signal<MonitorTab>('dashboard');
  readonly evaluationsView = signal<EvaluationsColumnView>('list');

  setMode(mode: WorkspaceMode): void {
    this.mode.set(mode);
    if (mode === 'editor') {
      this.evaluationsView.set('list');
    }
  }

  setMonitorTab(tab: MonitorTab): void {
    this.monitorTab.set(tab);
    if (tab !== 'dashboard') {
      this.evaluationsView.set('list');
    }
  }

  openEvaluationsCreate(): void {
    this.monitorTab.set('dashboard');
    this.evaluationsView.set('create');
  }

  closeEvaluationsCreate(): void {
    this.evaluationsView.set('list');
  }

  goToPlaygroundFromReview(): void {
    this.monitorTab.set('playground');
  }
}
