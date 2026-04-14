import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FlowAgentInternalStateService } from '../../../../application/state/flow-agent-internal-state.service';
import { FlowAgentEdge, ConditionEdgeData, AgentNodeType } from '../../../../core/model/agent-flow.model';

@Component({
  selector: 'flowagent-edges-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, TranslocoModule, MatFormFieldModule, MatInputModule],
  templateUrl: './edges-tab.component.html',
  styleUrl: './edges-tab.component.scss',
})
export class EdgesTabComponent {
  public readonly edge = input.required<FlowAgentEdge>();
  private readonly state = inject(FlowAgentInternalStateService);

  public get isTargetEnd(): boolean {
    return this.state.nodes$.value.find(n => n.id === this.edge().target)?.type === AgentNodeType.End;
  }

  public update(data: Partial<ConditionEdgeData>): void {
    this.state.updateEdgeData(this.edge().id, data);
  }
}
