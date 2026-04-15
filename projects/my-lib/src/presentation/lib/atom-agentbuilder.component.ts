import {
  ChangeDetectionStrategy, Component, DestroyRef,
  inject, input, output, OnInit, OnDestroy, signal, ViewChild,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
import { FlowAgentModeData, ValidationError } from '../../core/model/agent-flow.model';
import { User } from '../../core/services/auth.service';
import { FlowAgentActionsService } from '../../application/state/flow-agent-actions.service';
import { FlowAgentInternalStateService } from '../../application/state/flow-agent-internal-state.service';
import { FlowAgentDefaultsService } from '../../application/state/flow-agent-defaults.service';
import { FlowAgentValidationService } from '../../application/state/flow-agent-validation.service';
import { ChangeDetectorRef } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { EditorComponent } from '../canvas/editor/editor.component';
import { InspectorComponent } from '../inspector/container/inspector.component';
import { GlobalSettingsViewComponent } from '../inspector/views/global-settings-view/global-settings-view.component';

/**
 * Root component of the Atom Agent Builder.
 *
 * @remarks
 * Orchestrates the canvas editor, node inspector, and global settings panel.
 * Manages flow loading, auto-save detection, live validation, and navigation.
 *
 * @example
 * ```html
 * <atom-agentbuilder
 *   [flowAgentModeData]="{ flowId: 'abc123', mode: 'edit' }"
 *   [user]="currentUser"
 *   (unsavedChanges)="onUnsavedChanges($event)"
 * />
 * ```
 */
@Component({
  selector: 'atom-agentbuilder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [
    FlowAgentDefaultsService,
    FlowAgentInternalStateService,
    FlowAgentValidationService,
    FlowAgentActionsService,
  ],
  imports: [TranslocoModule, EditorComponent, InspectorComponent, GlobalSettingsViewComponent],
  templateUrl: './atom-agentbuilder.component.html',
  styleUrl: './atom-agentbuilder.component.scss',
})
export class AtomAgentBuilderComponent implements OnInit, OnDestroy {
  /** Determines whether the builder opens in create, edit, or view mode and which flow to load. */
  public readonly flowAgentModeData = input.required<FlowAgentModeData>();
  /** Authenticated user passed down from the host application. */
  public readonly user = input.required<User>();
  /** Emits `true` when unsaved changes are detected; `false` after a successful save. */
  public readonly unsavedChanges = output<boolean>();

  public readonly state = inject(FlowAgentInternalStateService);
  /** Current list of validation errors; updated reactively as nodes/edges change. */
  public validationErrors: ValidationError[] = [];
  public showValidationMenu = false;
  public readonly isGlobalSettingsCollapsed = signal(false);
  public readonly showGlobalSettingsOpenButton = signal(false);
  public readonly flowName = toSignal(this.state.currentFlowName$, { initialValue: '' });
  public readonly editingName = signal(false);
  @ViewChild(EditorComponent) private editor?: EditorComponent;

  private readonly destroyRef = inject(DestroyRef);
  private readonly actions = inject(FlowAgentActionsService);
  private readonly validation = inject(FlowAgentValidationService);
  private readonly cdr = inject(ChangeDetectorRef);

  /** @inheritdoc */
  public ngOnInit(): void {
    const modeData = this.flowAgentModeData();
    const validFlowId = this.getValidFlowId(modeData?.flowId);
    if (modeData?.mode !== 'create' && validFlowId) {
      this.actions.loadFlow(validFlowId);
    } else {
      this.state.resetToDefaults();
      this.state.isFlowLoaded$.next(true);
    }

    this.actions.unsavedChanges$.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(v => this.unsavedChanges.emit(v));

    combineLatest([this.state.nodes$, this.state.edges$]).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(([nodes, edges]) => {
      this.validationErrors = this.validation.validate(nodes, edges);
      if (this.validationErrors.length === 0) {
        this.showValidationMenu = false;
      }
      this.cdr.markForCheck();
    });
  }

  /** Resets flow state to prevent memory leaks when the component is destroyed. */
  public ngOnDestroy(): void {
    this.state.resetToDefaults();
  }

  /**
   * Persists a new flow name if the value is non-empty, then exits edit mode.
   * @param value - The raw input string from the inline name editor.
   */
  public saveName(value: string): void {
    if (value.trim()) this.state.updateFlowName(value.trim());
    this.editingName.set(false);
  }

  /** Navigates to the previous browser history entry. */
  public goBack(): void {
    window.history.back();
  }

  /**
   * Toggles the validation error panel. Does nothing when there are no errors.
   * @param event - Click event; propagation is stopped to avoid closing the panel immediately.
   */
  public toggleValidationMenu(event: MouseEvent): void {
    event.stopPropagation();
    if (this.validationErrors.length === 0) {
      this.showValidationMenu = false;
      return;
    }
    this.showValidationMenu = !this.showValidationMenu;
    this.cdr.markForCheck();
  }

  /** Closes the validation error panel if it is open. */
  public closeValidationMenu(): void {
    if (!this.showValidationMenu) return;
    this.showValidationMenu = false;
    this.cdr.markForCheck();
  }

  /** Expands the global settings panel and hides the floating open button. */
  public openGlobalSettings(): void {
    this.showGlobalSettingsOpenButton.set(false);
    this.isGlobalSettingsCollapsed.set(false);
    this.cdr.markForCheck();
  }

  /**
   * Reacts to the global settings panel collapse state change.
   * @param isCollapsed - `true` when the panel is now collapsed.
   */
  public onGlobalSettingsCollapsedChange(isCollapsed: boolean): void {
    this.isGlobalSettingsCollapsed.set(isCollapsed);
    if (!isCollapsed) {
      this.showGlobalSettingsOpenButton.set(false);
    }
    this.cdr.markForCheck();
  }

  /**
   * Called when the collapse CSS transition finishes.
   * Shows the floating "open settings" button only after the animation completes,
   * avoiding layout flicker during the transition.
   */
  public onGlobalSettingsCollapsedTransitionDone(): void {
    if (!this.isGlobalSettingsCollapsed()) return;
    this.showGlobalSettingsOpenButton.set(true);
    this.cdr.markForCheck();
  }

  /**
   * Selects and scrolls to the node or edge identified by a validation error.
   * Closes the validation panel after navigating.
   *
   * @param id - ID of the target node or edge.
   * @param type - Whether the target is a node or an edge.
   */
  public selectErrorTarget(id: string, type: 'node' | 'edge'): void {
    if (type === 'node') {
      this.state.setSelectedNode(id);
      this.state.setSelectedEdge(null);
    } else {
      this.state.setSelectedEdge(id);
      this.state.setSelectedNode(null);
    }
    this.editor?.focusOnTarget(id, type);
    this.showValidationMenu = false;
    this.cdr.markForCheck();
  }

  private getValidFlowId(flowId?: string): string | null {
    if (!flowId) return null;
    const normalized = flowId.trim();
    if (!normalized) return null;
    const lowered = normalized.toLowerCase();
    return lowered === 'start' || lowered === 'undefined' || lowered === 'null'
      ? null
      : normalized;
  }
}
