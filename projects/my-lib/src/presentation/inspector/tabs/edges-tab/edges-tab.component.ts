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
  /** The condition edge whose properties are displayed and edited in this tab. */
  public readonly edge = input.required<FlowAgentEdge>();

  private readonly state = inject(FlowAgentInternalStateService);
  private readonly transloco = inject(TranslocoService);

  /**
   * A randomly selected translated example string shown as placeholder text
   * in the condition expression textarea. Chosen once at component instantiation.
   */
  public readonly conditionExpressionPlaceholder = this.getRandomConditionExpressionPlaceholder();

  /**
   * Picks a random translated example from three condition expression examples
   * to use as the textarea placeholder.
   *
   * @returns A translated placeholder string.
   */
  private getRandomConditionExpressionPlaceholder(): string {
    const keys = [
      'tabs.edges.condition_expression_placeholder_example_1',
      'tabs.edges.condition_expression_placeholder_example_2',
      'tabs.edges.condition_expression_placeholder_example_3',
    ];
    const randomIndex = Math.floor(Math.random() * keys.length);
    return this.transloco.translate(keys[randomIndex] || keys[0]);
  }

  /**
   * Merges partial changes into the edge's condition data.
   *
   * @param data - The fields to update. Only the provided keys are overwritten.
   */
  public update(data: Partial<ConditionEdgeData>): void {
    this.state.updateEdgeData(this.edge().id, data);
  }
}
