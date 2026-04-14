import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { FlowAgentInternalStateService } from '../../../../application/state/flow-agent-internal-state.service';
import { FlowAgentNode, EndNodeData } from '../../../../core/model/agent-flow.model';

@Component({
  selector: 'flowagent-end-node-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, TranslocoModule],
  templateUrl: './end-node-view.component.html',
  styleUrl: './end-node-view.component.scss',
})
export class EndNodeViewComponent {
  public readonly node = input.required<FlowAgentNode>();
  private readonly state = inject(FlowAgentInternalStateService);

  public get endData(): EndNodeData { return this.node().data as EndNodeData; }

  public update(data: Partial<EndNodeData>): void {
    this.state.updateNodeData(this.node().id, data);
  }
}
