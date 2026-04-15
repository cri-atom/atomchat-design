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
  /** The End node whose details are displayed and edited in this view. */
  public readonly node = input.required<FlowAgentNode>();

  private readonly state = inject(FlowAgentInternalStateService);

  /**
   * Typed convenience accessor for the node's data payload cast to {@link EndNodeData}.
   * Use instead of casting `node().data` directly in the template.
   *
   * @returns The node data narrowed to `EndNodeData`.
   */
  public get endData(): EndNodeData { return this.node().data as EndNodeData; }

  /**
   * Merges partial changes into the End node's persisted data.
   *
   * @param data - The fields to update. Only the provided keys are overwritten.
   */
  public update(data: Partial<EndNodeData>): void {
    this.state.updateNodeData(this.node().id, data);
  }
}
