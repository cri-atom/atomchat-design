import { Component, ChangeDetectionStrategy, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoModule } from '@jsverse/transloco';
import { FlowAgentInternalStateService } from '../../../application/state/flow-agent-internal-state.service';
import { AgentNodeType, FlowAgentNode, FlowAgentEdge } from '../../../core/model/agent-flow.model';
import { StartNodeViewComponent } from '../views/start-node-view/start-node-view.component';
import { EndNodeViewComponent } from '../views/end-node-view/end-node-view.component';
import { EdgesTabComponent } from '../tabs/edges-tab/edges-tab.component';
import { ReturnTransitionTabComponent } from '../tabs/return-transition-tab/return-transition-tab.component';
import { GeneralTabComponent } from '../tabs/general-tab/general-tab.component';
import { ToolsTabComponent } from '../tabs/tools-tab/tools-tab.component';
import { KnowledgeBaseTabComponent } from '../tabs/knowledge-base-tab/knowledge-base-tab.component';

type TabId = 'general' | 'kb' | 'tools' | 'forward' | 'return';
interface TabConfig { id: TabId; label: string; }

@Component({
  selector: 'flowagent-inspector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        animate('600ms ease-out', keyframes([
          style({ transform: 'translateX(100%)', offset: 0 }),
          style({ transform: 'translateX(0)', offset: 0.55 }),
          style({ transform: 'translateX(3%)', offset: 0.72 }),
          style({ transform: 'translateX(0)', offset: 0.88 }),
          style({ transform: 'translateX(0.8%)', offset: 0.94 }),
          style({ transform: 'translateX(0)', offset: 1 }),
        ])),
      ]),
      transition(':leave', [
        animate('250ms cubic-bezier(0.4, 0, 1, 1)', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
  imports: [
    CommonModule,
    TranslocoModule,
    StartNodeViewComponent, EndNodeViewComponent,
    EdgesTabComponent, ReturnTransitionTabComponent,
    GeneralTabComponent, ToolsTabComponent, KnowledgeBaseTabComponent,
  ],
  templateUrl: './inspector.component.html',
  styleUrl: './inspector.component.scss',
})
export class InspectorComponent {
  public readonly state = inject(FlowAgentInternalStateService);
  public readonly activeTab = signal<TabId>('general');
  public readonly isEditing = signal(false);

  public readonly agentTabs: TabConfig[] = [
    { id: 'general', label: 'inspector.tabs.general' },
    { id: 'kb', label: 'inspector.tabs.knowledge_base' },
    { id: 'tools', label: 'inspector.tabs.tools' },
  ];

  private readonly _selectedNodeId = toSignal(this.state.selectedNodeId$);
  private readonly _selectedEdgeId = toSignal(this.state.selectedEdgeId$);
  private readonly _nodes = toSignal(this.state.nodes$);
  private readonly _edges = toSignal(this.state.edges$);

  public readonly selectedNode = computed<FlowAgentNode | null>(() => {
    const id = this._selectedNodeId();
    return id ? this._nodes()?.find(n => n.id === id) ?? null : null;
  });

  public readonly selectedEdge = computed<FlowAgentEdge | null>(() => {
    const id = this._selectedEdgeId();
    return id ? this._edges()?.find(e => e.id === id) ?? null : null;
  });

  constructor() {
    effect(() => {
      if (this._selectedEdgeId()) this.activeTab.set('forward');
      else if (this._selectedNodeId()) this.activeTab.set('general');
    });
  }

  public nodeIcon(node: FlowAgentNode): string {
    const icons: Record<string, string> = { start: '📩', agent: '🤖', tool: '🔧', selectAgent: '👥', end: '✂️' };
    return icons[node.type] || '📦';
  }

  public startEditing(node: FlowAgentNode): void {
    if (node.type === AgentNodeType.Agent || node.type === AgentNodeType.Tool) {
      this.isEditing.set(true);
    }
  }

  public saveName(value: string): void {
    const id = this.state.selectedNodeId$.value;
    if (id && value.trim()) {
      this.state.updateNodeData(id, { label: value.trim() });
    }
    this.isEditing.set(false);
  }
}
