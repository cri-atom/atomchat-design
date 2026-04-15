import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FlowAgentInternalStateService } from '../../../../application/state/flow-agent-internal-state.service';
import { FlowAgentEdge, ConditionEdgeData } from '../../../../core/model/agent-flow.model';

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
  private readonly transloco = inject(TranslocoService);

  public readonly conditionExpressionPlaceholder = this.getRandomConditionExpressionPlaceholder();

  private getRandomConditionExpressionPlaceholder(): string {
    const keys = [
      'tabs.edges.condition_expression_placeholder_example_1',
      'tabs.edges.condition_expression_placeholder_example_2',
      'tabs.edges.condition_expression_placeholder_example_3',
    ];
    const randomIndex = Math.floor(Math.random() * keys.length);
    return this.transloco.translate(keys[randomIndex] || keys[0]);
  }

  public update(data: Partial<ConditionEdgeData>): void {
    this.state.updateEdgeData(this.edge().id, data);
  }
}
