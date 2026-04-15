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
  /** The node whose tool configuration (integrations and HTTP requests) is managed in this tab. */
  public readonly node = input.required<FlowAgentNode>();

  private readonly state = inject(FlowAgentInternalStateService);

  /** Controls visibility of the composio tool-selection modal overlay. */
  public readonly showToolModal = signal(false);
  /** Controls visibility of the HTTP-request configuration modal overlay. */
  public readonly showHttpModal = signal(false);
  /**
   * Holds the {@link HttpToolConfig} being edited when the HTTP modal opens in edit mode.
   * `null` when the modal is closed or opening for a new config.
   */
  public readonly editingHttp = signal<HttpToolConfig | null>(null);
  /** Set of HTTP tool IDs whose detail rows are currently expanded in the list. */
  public readonly expandedIds = signal<Set<string>>(new Set());

  /**
   * Toggles the expanded state of an HTTP tool's detail row.
   *
   * @param id - The ID of the {@link HttpToolConfig} to expand or collapse.
   */
  public toggleExpand(id: string): void {
    this.expandedIds.update(set => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  /**
   * Returns whether an HTTP tool's detail row is currently expanded.
   *
   * @param id - The ID of the {@link HttpToolConfig} to check.
   * @returns `true` when the row is expanded.
   */
  public isExpanded(id: string): boolean { return this.expandedIds().has(id); }

  /**
   * Typed accessor for the composio tools attached to this node.
   * Supports both Agent and Tool node data shapes.
   *
   * @returns The current array of {@link Tool} entries, or an empty array.
   */
  public get tools(): Tool[] { return (this.node().data as AgentNodeData | ToolNodeData).tools || []; }

  /**
   * Typed accessor for the HTTP tools configured on this node.
   *
   * @returns The current array of {@link HttpToolConfig} entries, or an empty array.
   */
  public get httpTools(): HttpToolConfig[] { return (this.node().data as AgentNodeData).httpTools || []; }

  /**
   * Adds each tool from the selection modal to the node.
   *
   * @param tools - The array of {@link Tool} items selected by the user.
   */
  public onToolsSaved(tools: Tool[]): void {
    tools.forEach(t => this.state.addToolToNode(this.node().id, t));
  }

  /**
   * Upserts an HTTP tool config on the node.
   * If a config with the same `id` already exists it is replaced; otherwise it is appended.
   * Clears `editingHttp` after saving.
   *
   * @param config - The {@link HttpToolConfig} returned by the HTTP-request modal.
   */
  public onHttpSaved(config: HttpToolConfig): void {
    const current = this.httpTools;
    const existing = current.find(h => h.id === config.id);
    const updated = existing
      ? current.map(h => h.id === config.id ? config : h)
      : [...current, config];
    this.state.updateNodeData(this.node().id, { httpTools: updated });
    this.editingHttp.set(null);
  }

  /**
   * Opens the HTTP-request modal in "create new" mode.
   * Clears any previously staged editing config before opening.
   */
  public openNewHttp(): void {
    this.editingHttp.set(null);
    this.showHttpModal.set(true);
  }

  /**
   * Opens the HTTP-request modal pre-loaded with an existing config for editing.
   *
   * @param config - The {@link HttpToolConfig} to edit.
   */
  public openEditHttp(config: HttpToolConfig): void {
    this.editingHttp.set(config);
    this.showHttpModal.set(true);
  }

  /**
   * Removes an HTTP tool config from the node.
   *
   * @param id - The ID of the {@link HttpToolConfig} to remove.
   */
  public removeHttp(id: string): void {
    this.state.updateNodeData(this.node().id, { httpTools: this.httpTools.filter(h => h.id !== id) });
  }

  /**
   * Removes a composio tool from the node.
   *
   * @param toolId - The ID of the {@link Tool} to remove.
   */
  public remove(toolId: string): void { this.state.removeToolFromNode(this.node().id, toolId); }
}
