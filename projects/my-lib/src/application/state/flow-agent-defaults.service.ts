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

@Injectable()
export class FlowAgentDefaultsService {
  private readonly transloco = inject(TranslocoService);

  generateNodeId(): string { return `node-${Date.now()}-${++nodeCounter}`; }
  generateEdgeId(): string { return `edge-${Date.now()}-${++edgeCounter}`; }

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

  createNode(type: AgentNodeType, position: { x: number; y: number }, data?: Partial<any>): FlowAgentNode {
    return {
      id: this.generateNodeId(),
      type,
      position,
      data: { ...this.createDefaultData(type), ...data },
    };
  }

  createEdge(source: string, target: string, sourceType?: AgentNodeType, targetType?: AgentNodeType): FlowAgentEdge {
    console.log(this.transloco.translate('defaults.edge.new_condition'));
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

  createInitialNodes(): FlowAgentNode[] {
    return [{ id: 'start-node', type: AgentNodeType.Start, position: { x: 410, y: 50 }, data: { label: this.transloco.translate('defaults.node.start') } }];
  }

  createInitialEdges(): FlowAgentEdge[] {
    return [];
  }

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
