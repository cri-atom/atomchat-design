import { Component, ChangeDetectionStrategy, inject, input, signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { FlowAgentInternalStateService } from '../../../../application/state/flow-agent-internal-state.service';
import { FlowAgentNode, AgentNodeData, ToolNodeData, Tool, HttpToolConfig } from '../../../../core/model/agent-flow.model';
import { ToolSelectionModalComponent } from '../../modals/tool-selection-modal/tool-selection-modal.component';
import { HttpRequestModalComponent } from '../../modals/http-request-modal/http-request-modal.component';

@Component({
  selector: 'flowagent-tools-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TranslocoModule, ToolSelectionModalComponent, HttpRequestModalComponent],
  templateUrl: './tools-tab.component.html',
  styleUrl: './tools-tab.component.scss',
})
export class ToolsTabComponent {
  public readonly node = input.required<FlowAgentNode>();
  private readonly state = inject(FlowAgentInternalStateService);

  public readonly showToolModal = signal(false);
  public readonly showHttpModal = signal(false);
  public readonly editingHttp = signal<HttpToolConfig | null>(null);
  public readonly expandedIds = signal<Set<string>>(new Set());

  public toggleExpand(id: string): void {
    this.expandedIds.update(set => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  public isExpanded(id: string): boolean { return this.expandedIds().has(id); }

  public get tools(): Tool[] { return (this.node().data as AgentNodeData | ToolNodeData).tools || []; }
  public get httpTools(): HttpToolConfig[] { return (this.node().data as AgentNodeData).httpTools || []; }

  public onToolsSaved(tools: Tool[]): void {
    tools.forEach(t => this.state.addToolToNode(this.node().id, t));
  }

  public onHttpSaved(config: HttpToolConfig): void {
    const current = this.httpTools;
    const existing = current.find(h => h.id === config.id);
    const updated = existing
      ? current.map(h => h.id === config.id ? config : h)
      : [...current, config];
    this.state.updateNodeData(this.node().id, { httpTools: updated });
    this.editingHttp.set(null);
  }

  public openNewHttp(): void {
    this.editingHttp.set(null);
    this.showHttpModal.set(true);
  }

  public openEditHttp(config: HttpToolConfig): void {
    this.editingHttp.set(config);
    this.showHttpModal.set(true);
  }

  public removeHttp(id: string): void {
    this.state.updateNodeData(this.node().id, { httpTools: this.httpTools.filter(h => h.id !== id) });
  }

  public remove(toolId: string): void { this.state.removeToolFromNode(this.node().id, toolId); }
}
