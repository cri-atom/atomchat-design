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
  public readonly flowAgentModeData = input.required<FlowAgentModeData>();
  public readonly user = input.required<User>();
  public readonly unsavedChanges = output<boolean>();

  public readonly state = inject(FlowAgentInternalStateService);
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

  public ngOnDestroy(): void {
    this.state.resetToDefaults();
  }

  public saveName(value: string): void {
    if (value.trim()) this.state.updateFlowName(value.trim());
    this.editingName.set(false);
  }

  public goBack(): void {
    window.history.back();
  }

  public toggleValidationMenu(event: MouseEvent): void {
    event.stopPropagation();
    if (this.validationErrors.length === 0) {
      this.showValidationMenu = false;
      return;
    }
    this.showValidationMenu = !this.showValidationMenu;
    this.cdr.markForCheck();
  }

  public closeValidationMenu(): void {
    if (!this.showValidationMenu) return;
    this.showValidationMenu = false;
    this.cdr.markForCheck();
  }

  public openGlobalSettings(): void {
    this.showGlobalSettingsOpenButton.set(false);
    this.isGlobalSettingsCollapsed.set(false);
    this.cdr.markForCheck();
  }

  public onGlobalSettingsCollapsedChange(isCollapsed: boolean): void {
    this.isGlobalSettingsCollapsed.set(isCollapsed);
    if (!isCollapsed) {
      this.showGlobalSettingsOpenButton.set(false);
    }
    this.cdr.markForCheck();
  }

  public onGlobalSettingsCollapsedTransitionDone(): void {
    if (!this.isGlobalSettingsCollapsed()) return;
    this.showGlobalSettingsOpenButton.set(true);
    this.cdr.markForCheck();
  }

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
