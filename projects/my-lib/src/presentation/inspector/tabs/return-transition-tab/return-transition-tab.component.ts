import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FlowAgentInternalStateService } from '../../../../application/state/flow-agent-internal-state.service';
import { FlowAgentEdge, ReturnTransitionConfig } from '../../../../core/model/agent-flow.model';

@Component({
  selector: 'flowagent-return-transition-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, TranslocoModule, MatFormFieldModule, MatInputModule],
  templateUrl: './return-transition-tab.component.html',
  styleUrl: './return-transition-tab.component.scss',
})
export class ReturnTransitionTabComponent {
  public readonly edge = input.required<FlowAgentEdge>();
  private readonly state = inject(FlowAgentInternalStateService);

  public get rt(): ReturnTransitionConfig {
    return this.edge().data.returnTransition || { enabled: false, label: '', conditionExpression: '' };
  }

  public updateRT(partial: Partial<ReturnTransitionConfig>): void {
    this.state.updateEdgeData(this.edge().id, { returnTransition: { ...this.rt, ...partial } });
  }
}
