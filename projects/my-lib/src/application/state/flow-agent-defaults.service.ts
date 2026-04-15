import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import {
  AgentNodeType, ConditionType,
  FlowAgentNode, FlowAgentEdge,
  AgentNodeData, ToolNodeData, StartNodeData,
  SelectAgentNodeData, EndNodeData, ConditionEdgeData,
} from '../../core/model/agent-flow.model';

let nodeCounter = 0;
let edgeCounter = 0;

/**
 * Factory service that generates default nodes, edges, and IDs for the agent flow canvas.
 *
 * @remarks
 * All user-facing labels are resolved through Transloco so they reflect the active locale.
 * Node IDs are generated using a combination of timestamp and monotonic counter to ensure
 * uniqueness within a session.
 */
@Injectable()
export class FlowAgentDefaultsService {
  private readonly transloco = inject(TranslocoService);

  /** Generates a unique node ID using a timestamp + monotonic counter. */
  generateNodeId(): string { return `node-${Date.now()}-${++nodeCounter}`; }
  /** Generates a unique edge ID using a timestamp + monotonic counter. */
  generateEdgeId(): string { return `edge-${Date.now()}-${++edgeCounter}`; }

  /**
   * Returns a translated default data object for the given node type.
   * @param type - The type of node to create default data for.
   */
  createDefaultData(type: AgentNodeType): any {
    const factories: Record<AgentNodeType, () => any> = {
      [AgentNodeType.Start]: (): StartNodeData => ({ label: this.transloco.translate('defaults.node.start') }),
      [AgentNodeType.Agent]: (): AgentNodeData => ({
        label: this.transloco.translate('defaults.node.agent'), description: '', conversationGoal: '',
        thinkingLevel: 'auto',
        aiAgentModel: null, tools: [], knowledgeBases: [], infoCollection: [],
        httpTools: [], stages: [], dataSources: [],
      }),
      [AgentNodeType.Tool]: (): ToolNodeData => ({ label: this.transloco.translate('defaults.node.tool_dispatch'), description: '', tools: [] }),
      [AgentNodeType.SelectAgent]: (): SelectAgentNodeData => ({ label: this.transloco.translate('defaults.node.select_agent') }),
      [AgentNodeType.End]: (): EndNodeData => ({ label: this.transloco.translate('defaults.node.end'), endLabel: '', description: '' }),
    };
    return factories[type]();
  }

  /**
   * Creates a fully initialized {@link FlowAgentNode} with a generated ID and translated defaults.
   *
   * @param type - Node type to create.
   * @param position - Canvas position in logical pixels.
   * @param data - Optional data overrides merged over the defaults.
   */
  createNode(type: AgentNodeType, position: { x: number; y: number }, data?: Partial<any>): FlowAgentNode {
    return {
      id: this.generateNodeId(),
      type,
      position,
      data: { ...this.createDefaultData(type), ...data },
    };
  }

  /**
   * Creates a {@link FlowAgentEdge} with appropriate defaults based on source and target node types.
   *
   * @remarks
   * - Edges from a Start node are unconditional (`conditionType: null`, empty label).
   * - Edges targeting an End node get the "end condition" label and `overrideEndCondition: false`.
   * - Agent-to-agent edges automatically include a disabled return transition.
   *
   * @param source - ID of the source node.
   * @param target - ID of the target node.
   * @param sourceType - Type of the source node; used to set condition defaults.
   * @param targetType - Type of the target node; used to set condition defaults.
   */
  createEdge(source: string, target: string, sourceType?: AgentNodeType, targetType?: AgentNodeType): FlowAgentEdge {
    const data: ConditionEdgeData = { label: this.transloco.translate('defaults.edge.new_condition'), conditionType: ConditionType.LLMCondition };

    if (sourceType === AgentNodeType.Start) {
      data.conditionType = null;
      data.label = '';
    }

    if (targetType === AgentNodeType.End) {
      data.label = this.transloco.translate('defaults.edge.end_condition');
      data.conditionExpression = '';
      data.overrideEndCondition = false;
    }

    if (sourceType === AgentNodeType.Agent && targetType === AgentNodeType.Agent) {
      data.returnTransition = {
        enabled: true, label: '',
        conditionExpression: '',
      };
    }

    return { id: this.generateEdgeId(), source, target, data };
  }

  /**
   * Returns the initial node array for a new empty flow — a single Start node at the top-center.
   */
  createInitialNodes(): FlowAgentNode[] {
    return [{ id: 'start-node', type: AgentNodeType.Start, position: { x: 410, y: 50 }, data: { label: this.transloco.translate('defaults.node.start') } }];
  }

  /** Returns the initial edge array for a new empty flow (always empty). */
  createInitialEdges(): FlowAgentEdge[] {
    return [];
  }

  /**
   * Calculates the canvas position for a new child node relative to its parent.
   *
   * @remarks
   * The child is placed below the parent with a 120px vertical gap.
   * If the parent already has sibling children, the new node is placed 320px to the right
   * of the rightmost sibling to avoid overlap.
   *
   * @param parent - The parent node used as the position anchor.
   * @param siblings - Existing child nodes of the same parent.
   * @param childType - Type of the child node; used to look up its canvas width for centering.
   * @returns Canvas `{ x, y }` coordinates in logical pixels.
   */
  getChildPosition(parent: FlowAgentNode, siblings: FlowAgentNode[], childType?: AgentNodeType): { x: number; y: number } {
    const widths: Record<string, number> = {
      [AgentNodeType.Agent]: 300, [AgentNodeType.Start]: 100,
      [AgentNodeType.Tool]: 200, [AgentNodeType.End]: 100,
      [AgentNodeType.SelectAgent]: 180,
    };
    const heights: Record<string, number> = {
      [AgentNodeType.Agent]: 132, [AgentNodeType.Start]: 40,
      [AgentNodeType.Tool]: 72, [AgentNodeType.End]: 40,
      [AgentNodeType.SelectAgent]: 48,
    };
    const pw = widths[parent.type] || 150;
    const ph = heights[parent.type] || 80;
    const cw = widths[childType!] || 150;
    const baseX = parent.position.x + (pw - cw) / 2;
    const rightmostSiblingX = siblings.length > 0
      ? Math.max(...siblings.map(s => s.position.x))
      : null;

    return {
      x: rightmostSiblingX === null ? baseX : rightmostSiblingX + 320,
      y: parent.position.y + ph + 120,
    };
  }
}
