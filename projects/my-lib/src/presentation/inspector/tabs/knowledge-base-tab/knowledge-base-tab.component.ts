import { Component, ChangeDetectionStrategy, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FlowAgentInternalStateService } from '../../../../application/state/flow-agent-internal-state.service';
import { FlowAgentNode, AgentNodeData, KnowledgeBase } from '../../../../core/model/agent-flow.model';
import { FileSelectionModalComponent } from '../../modals/file-selection-modal/file-selection-modal.component';

@Component({
  selector: 'flowagent-knowledge-base-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, TranslocoModule, MatFormFieldModule, MatSelectModule, FileSelectionModalComponent],
  templateUrl: './knowledge-base-tab.component.html',
  styleUrl: './knowledge-base-tab.component.scss',
})
export class KnowledgeBaseTabComponent {
  public readonly node = input.required<FlowAgentNode>();
  private readonly state = inject(FlowAgentInternalStateService);
  public readonly selectedTable = signal('');
  public readonly showFileModal = signal(false);

  public get addedKbs(): KnowledgeBase[] { return (this.node().data as AgentNodeData).knowledgeBases || []; }

  public onFilesSaved(files: KnowledgeBase[]): void {
    const current = this.addedKbs;
    const existingIds = new Set(current.map(k => k.id));
    const toAdd = files.filter(f => !existingIds.has(f.id));
    this.state.updateNodeData(this.node().id, { knowledgeBases: [...current, ...toAdd] });
  }

  public removeFromNode(kbId: string): void {
    this.state.updateNodeData(this.node().id, { knowledgeBases: this.addedKbs.filter(k => k.id !== kbId) });
  }
}
