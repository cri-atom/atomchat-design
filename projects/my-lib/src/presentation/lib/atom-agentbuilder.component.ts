import {
  ChangeDetectionStrategy, Component, DestroyRef,
  inject, input, output, OnInit, OnDestroy, signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FlowAgentModeData } from '../../core/model/agent-flow.model';
import { User } from '../../core/services/auth.service';
import { FlowAgentActionsService } from '../../application/state/flow-agent-actions.service';
import { FlowAgentInternalStateService } from '../../application/state/flow-agent-internal-state.service';
import { FlowAgentDefaultsService } from '../../application/state/flow-agent-defaults.service';
import { FlowAgentValidationService } from '../../application/state/flow-agent-validation.service';
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
  public readonly flowName = toSignal(this.state.currentFlowName$, { initialValue: '' });
  public readonly editingName = signal(false);

  private readonly destroyRef = inject(DestroyRef);
  private readonly actions = inject(FlowAgentActionsService);

  public ngOnInit(): void {
    const modeData = this.flowAgentModeData();
    if (modeData?.flowId) {
      this.actions.loadFlow(modeData.flowId);
    } else {
      this.state.resetToDefaults();
      this.state.isFlowLoaded$.next(true);
    }

    this.actions.unsavedChanges$.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(v => this.unsavedChanges.emit(v));
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
}
