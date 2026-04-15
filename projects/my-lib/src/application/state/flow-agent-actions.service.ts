import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest, skip, filter, BehaviorSubject, debounceTime } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { FlowAgentInternalStateService } from './flow-agent-internal-state.service';
import { FlowAgentStateService } from '../../core/services/flow-agent-state.service';

@Injectable()
export class FlowAgentActionsService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly state = inject(FlowAgentInternalStateService);
  private readonly flowStateService = inject(FlowAgentStateService);
  private readonly transloco = inject(TranslocoService);

  readonly unsavedChanges$ = new BehaviorSubject<boolean>(false);

  constructor() {
    combineLatest([this.state.nodes$, this.state.edges$, this.state.currentFlowName$, this.state.baseSystemPrompt$]).pipe(
      skip(1),
      filter(() => this.state.isFlowLoaded$.value),
      debounceTime(1000),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => {
      this.unsavedChanges$.next(true);
    });
  }

  loadFlow(id: string): void {
    const flowId = this.getValidFlowId(id);
    if (!flowId) {
      this.state.resetToDefaults();
      this.state.isFlowLoaded$.next(true);
      return;
    }

    this.state.setCurrentFlowId(flowId);
    this.flowStateService.loadFlow(flowId).subscribe({
      next: (data) => this.state.setFlowData(data),
      error: () => {
        this.state.resetToDefaults();
        this.state.isFlowLoaded$.next(true);
      },
    });
  }

  saveFlow(): void {
    if (!this.state.currentFlowId$.value || !this.state.isFlowLoaded$.value) return;
    this.flowStateService.saveFlow(this.state.getFlowSnapshot()).subscribe({
      next: () => this.unsavedChanges$.next(false),
      error: (err) => console.error(this.transloco.translate('errors.save_failed'), err),
    });
  }

  private getValidFlowId(flowId: string): string | null {
    const normalized = flowId?.trim();
    if (!normalized) return null;
    const lowered = normalized.toLowerCase();
    return lowered === 'start' || lowered === 'undefined' || lowered === 'null'
      ? null
      : normalized;
  }

}
