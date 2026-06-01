import { Component, ChangeDetectionStrategy, inject, signal, computed, effect } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@jsverse/transloco';
import { FlowAgentInternalStateService } from '../../../application/state/flow-agent-internal-state.service';
import { AgentNodeType, FlowAgentNode, FlowAgentEdge } from '../../../core/model/agent-flow.model';
import { StartNodeViewComponent } from '../views/start-node-view/start-node-view.component';
import { EndNodeViewComponent } from '../views/end-node-view/end-node-view.component';
import { EdgesTabComponent } from '../tabs/edges-tab/edges-tab.component';
import { GeneralTabComponent } from '../tabs/general-tab/general-tab.component';
import { ToolsTabComponent } from '../tabs/tools-tab/tools-tab.component';
import { KnowledgeBaseTabComponent } from '../tabs/knowledge-base-tab/knowledge-base-tab.component';
import { AbIconComponent } from '../../shared/ab-icon/ab-icon.component';

type TabId = 'general' | 'kb' | 'tools';
interface TabConfig { id: TabId; label: string; }

@Component({
  selector: 'flowagent-inspector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('240ms ease-out', style({ transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('240ms ease-in', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
  imports: [
    AbIconComponent,
    MatInputModule,
    TranslocoModule,
    StartNodeViewComponent, EndNodeViewComponent,
    EdgesTabComponent,
    GeneralTabComponent, ToolsTabComponent, KnowledgeBaseTabComponent,
  ],
  templateUrl: './inspector.component.html',
  styleUrl: './inspector.component.scss',
})
export class InspectorComponent {
  public readonly state = inject(FlowAgentInternalStateService);

  /** Currently active tab in the node inspector panel. Defaults to `'general'`. */
  public readonly activeTab = signal<TabId>('general');

  /** Tab configuration array rendered by the tab bar. Each entry maps a `TabId` to its i18n key. */
  public readonly agentTabs: TabConfig[] = [
    { id: 'general', label: 'inspector.tabs.general' },
    { id: 'kb', label: 'inspector.tabs.knowledge_base' },
    { id: 'tools', label: 'inspector.tabs.tools' },
  ];

  private readonly _selectedNodeId = toSignal(this.state.selectedNodeId$);
  private readonly _selectedEdgeId = toSignal(this.state.selectedEdgeId$);
  private readonly _nodes = toSignal(this.state.nodes$);
  private readonly _edges = toSignal(this.state.edges$);

  /**
   * The full node object for the currently selected node.
   * Derived reactively from the selection ID and the nodes array.
   * Returns `null` when no node is selected.
   */
  public readonly selectedNode = computed<FlowAgentNode | null>(() => {
    const id = this._selectedNodeId();
    return id ? this._nodes()?.find(n => n.id === id) ?? null : null;
  });

  /**
   * The full edge object for the currently selected edge.
   * Derived reactively from the selection ID and the edges array.
   * Returns `null` when no edge is selected.
   */
  public readonly selectedEdge = computed<FlowAgentEdge | null>(() => {
    const id = this._selectedEdgeId();
    return id ? this._edges()?.find(e => e.id === id) ?? null : null;
  });

  constructor() {
    // Reset to the General tab whenever the user selects a new node,
    // so the inspector never opens on a stale tab from a previous selection.
    effect(() => {
      if (this._selectedNodeId()) this.activeTab.set('general');
    });
  }

  /**
   * Returns `true` for node types that allow inline name editing in the inspector header.
   * Only Agent and Tool nodes expose a rename input; Start and End nodes do not.
   *
   * @param node - The node to evaluate.
   * @returns `true` when the node's label is user-editable.
   */
  public canEditNodeName(node: FlowAgentNode): boolean {
    return node.type === AgentNodeType.Agent || node.type === AgentNodeType.Tool;
  }

  /**
   * Persists a new display label for the currently selected node.
   * No-ops if no node is selected.
   *
   * @param value - The new label string entered by the user.
   */
  public updateName(value: string): void {
    const id = this.state.selectedNodeId$.value;
    if (id) {
      this.state.updateNodeData(id, { label: value });
    }
  }
}
