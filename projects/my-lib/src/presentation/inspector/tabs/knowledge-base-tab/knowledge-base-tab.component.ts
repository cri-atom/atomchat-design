import { Component, ChangeDetectionStrategy, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FlowAgentInternalStateService } from '../../../../application/state/flow-agent-internal-state.service';
import { FlowAgentNode, AgentNodeData, KnowledgeBase } from '../../../../core/model/agent-flow.model';
import { FileSelectionModalComponent } from '../../modals/file-selection-modal/file-selection-modal.component';
import { AbIconComponent } from '../../../shared/ab-icon/ab-icon.component';

@Component({
  selector: 'flowagent-knowledge-base-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AbIconComponent, FormsModule, TranslocoModule, MatFormFieldModule, MatSelectModule, FileSelectionModalComponent],
  templateUrl: './knowledge-base-tab.component.html',
  styleUrl: './knowledge-base-tab.component.scss',
})
export class KnowledgeBaseTabComponent {
  /** The agent node whose knowledge-base configuration is displayed and edited in this tab. */
  public readonly node = input.required<FlowAgentNode>();

  private readonly state = inject(FlowAgentInternalStateService);

  /** IANA identifier of the dynamic table currently selected in the dropdown. Empty string when none. */
  public readonly selectedTable = signal('');
  /** Controls visibility of the file-selection modal overlay. */
  public readonly showFileModal = signal(false);

  /**
   * Typed accessor for the knowledge-base documents attached to this node.
   *
   * @returns The current array of {@link KnowledgeBase} entries, or an empty array.
   */
  public get addedKbs(): KnowledgeBase[] { return (this.node().data as AgentNodeData).knowledgeBases || []; }

  /**
   * Appends newly selected files to the node's knowledge-base list.
   * Files already present (matched by `id`) are silently skipped to prevent duplicates.
   *
   * @param files - The array of {@link KnowledgeBase} items returned by the file-selection modal.
   */
  public onFilesSaved(files: KnowledgeBase[]): void {
    const current = this.addedKbs;
    const existingIds = new Set(current.map(k => k.id));
    const toAdd = files.filter(f => !existingIds.has(f.id));
    this.state.updateNodeData(this.node().id, { knowledgeBases: [...current, ...toAdd] });
  }

  /**
   * Removes a knowledge-base document from this node.
   *
   * @param kbId - The ID of the {@link KnowledgeBase} entry to remove.
   */
  public removeFromNode(kbId: string): void {
    this.state.updateNodeData(this.node().id, { knowledgeBases: this.addedKbs.filter(k => k.id !== kbId) });
  }
}
