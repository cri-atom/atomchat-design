import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import {
  FlowAgentNode, FlowAgentEdge, ValidationError,
  AgentNodeType, ConditionType, AgentNodeData, ToolNodeData,
} from '../../core/model/agent-flow.model';

@Injectable()
export class FlowAgentValidationService {
  private readonly transloco = inject(TranslocoService);

  validate(nodes: FlowAgentNode[], edges: FlowAgentEdge[]): ValidationError[] {
    return [
      ...this.checkAgentGoals(nodes),
      ...this.checkToolNodes(nodes),
      ...this.checkEdgeExpressions(edges),
      ...this.checkLeafNodes(nodes, edges),
      ...this.checkIsolatedNodes(nodes, edges),
    ];
  }

  isValid(nodes: FlowAgentNode[], edges: FlowAgentEdge[]): boolean {
    return this.validate(nodes, edges).length === 0;
  }

  private checkAgentGoals(nodes: FlowAgentNode[]): ValidationError[] {
    return nodes
      .filter(n => n.type === AgentNodeType.Agent && !(n.data as AgentNodeData).conversationGoal?.trim())
      .map(n => ({ id: n.id, type: 'node' as const, message: this.transloco.translate('validation.agent_missing_goal', { label: n.data.label }) }));
  }

  private checkToolNodes(nodes: FlowAgentNode[]): ValidationError[] {
    return nodes
      .filter(n => n.type === AgentNodeType.Tool && !((n.data as ToolNodeData).tools?.length))
      .map(n => ({ id: n.id, type: 'node' as const, message: this.transloco.translate('validation.tool_missing_tools', { label: n.data.label }) }));
  }

  private checkEdgeExpressions(edges: FlowAgentEdge[]): ValidationError[] {
    return edges
      .filter(e => e.data.conditionType === ConditionType.LLMCondition && !e.data.conditionExpression?.trim())
      .map(e => ({ id: e.id, type: 'edge' as const, message: this.transloco.translate('validation.condition_missing_expression', { label: e.data.label }) }));
  }

  private checkLeafNodes(nodes: FlowAgentNode[], edges: FlowAgentEdge[]): ValidationError[] {
    const nodesWithOutputs = new Set(edges.map(e => e.source));
    return nodes
      .filter(n => !nodesWithOutputs.has(n.id) && n.type !== AgentNodeType.End && n.type !== AgentNodeType.Start)
      .map(n => ({ id: n.id, type: 'node' as const, message: this.transloco.translate('validation.node_without_outputs', { label: n.data.label }) }));
  }

  private checkIsolatedNodes(nodes: FlowAgentNode[], edges: FlowAgentEdge[]): ValidationError[] {
    const nodesWithInputs = new Set(edges.map(e => e.target));
    return nodes
      .filter(n => !nodesWithInputs.has(n.id) && n.type !== AgentNodeType.Start)
      .map(n => ({ id: n.id, type: 'node' as const, message: this.transloco.translate('validation.node_without_inputs', { label: n.data.label }) }));
  }
}
