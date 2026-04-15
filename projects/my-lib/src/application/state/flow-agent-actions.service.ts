import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest, skip, filter, BehaviorSubject, debounceTime } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { FlowAgentInternalStateService } from './flow-agent-internal-state.service';
import { FlowAgentStateService } from '../../core/services/flow-agent-state.service';

/**
 * Orchestrates high-level user actions on the agent flow: loading, saving, and tracking unsaved changes.
 *
 * @remarks
 * Acts as a bridge between {@link FlowAgentInternalStateService} (in-memory state)
 * and {@link FlowAgentStateService} (persistence layer). Provided at the
 * {@link AtomAgentBuilderComponent} level — one instance per builder instance.
 */
@Injectable()
export class FlowAgentActionsService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly state = inject(FlowAgentInternalStateService);
  private readonly flowStateService = inject(FlowAgentStateService);
  private readonly transloco = inject(TranslocoService);

  /**
   * Emits `true` when the in-memory state has diverged from the last saved state.
   * Resets to `false` after a successful save.
   */
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

  /**
   * Loads a flow by ID into the internal state.
   * If `id` is blank, `'start'`, `'undefined'`, or `'null'`, the state is reset to defaults
   * instead of making a network request.
   *
   * @param id - The raw flow ID as received from the router or host application.
   */
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

  /**
   * Persists the current in-memory flow snapshot to the backend.
   * No-ops if there is no active flow ID or the flow has not finished loading.
   */
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
