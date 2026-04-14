import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { BehaviorSubject, take } from 'rxjs';
import {
  FlowAgentNode, FlowAgentEdge, FlowAgentData,
  AgentNodeType, ConditionEdgeData, Tool, InfoCollectionItem, KnowledgeBase,
  GlobalStage, GlobalSaveField,
} from '../../core/model/agent-flow.model';
import { FlowAgentDefaultsService } from './flow-agent-defaults.service';

@Injectable()
export class FlowAgentInternalStateService {
  private readonly defaults = inject(FlowAgentDefaultsService);
  private readonly transloco = inject(TranslocoService);

  private setDefaultFlowNameFromTranslations(force = false): void {
    this.transloco.selectTranslate('state.default_flow_name').pipe(take(1)).subscribe(text => {
      if (force || !this.isFlowLoaded$.value) this.currentFlowName$.next(text);
    });
  }

  private setDefaultPromptFromTranslations(force = false): void {
    this.transloco.selectTranslate('state.default_prompt').pipe(take(1)).subscribe(text => {
      if (force || !this.isFlowLoaded$.value) this.baseSystemPrompt$.next(text);
    });
  }

  readonly nodes$ = new BehaviorSubject<FlowAgentNode[]>(this.defaults.createInitialNodes());
  readonly edges$ = new BehaviorSubject<FlowAgentEdge[]>([]);
  readonly selectedNodeId$ = new BehaviorSubject<string | null>(null);
  readonly selectedEdgeId$ = new BehaviorSubject<string | null>(null);
  readonly currentFlowId$ = new BehaviorSubject<string | null>(null);
  readonly currentFlowName$ = new BehaviorSubject<string>('');
  readonly baseSystemPrompt$ = new BehaviorSubject<string>('');
  readonly isFlowLoaded$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.setDefaultFlowNameFromTranslations();
    this.setDefaultPromptFromTranslations();
  }

  readonly pipelineType$ = new BehaviorSubject<'venta' | 'servicio'>('venta');
  readonly stagesVenta$ = new BehaviorSubject<GlobalStage[]>([]);
  readonly stagesServicio$ = new BehaviorSubject<GlobalStage[]>([]);
  readonly saveFields$ = new BehaviorSubject<GlobalSaveField[]>([]);
  readonly timezone$ = new BehaviorSubject<string>('America/Argentina/Buenos_Aires');
  readonly preventInfiniteLoops$ = new BehaviorSubject<boolean>(false);

  setSelectedNode(id: string | null): void {
    this.selectedNodeId$.next(id);
    this.selectedEdgeId$.next(null);
  }

  setSelectedEdge(id: string | null): void {
    this.selectedEdgeId$.next(id);
    this.selectedNodeId$.next(null);
  }

  addNode(node: FlowAgentNode): void {
    this.nodes$.next([...this.nodes$.value, node]);
  }

  addChildNode(parentId: string, childType: AgentNodeType): void {
    const nodes = this.nodes$.value;
    const edges = this.edges$.value;
    const parent = nodes.find(n => n.id === parentId);
    if (!parent) return;

    const siblingCount = edges.filter(e => e.source === parentId).length;
    const position = this.defaults.getChildPosition(parent, siblingCount, childType);
    const newNode = this.defaults.createNode(childType, position);
    const newEdge = this.defaults.createEdge(parentId, newNode.id, parent.type as AgentNodeType, childType);

    this.nodes$.next([...nodes, newNode]);
    this.edges$.next([...edges, newEdge]);
  }

  updateNodeData(nodeId: string, data: Partial<any>): void {
    this.nodes$.next(
      this.nodes$.value.map(n => n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n)
    );
  }

  deleteNode(nodeId: string): void {
    if (nodeId === 'start-node') return;
    this.nodes$.next(this.nodes$.value.filter(n => n.id !== nodeId));
    this.edges$.next(this.edges$.value.filter(e => e.source !== nodeId && e.target !== nodeId));
    if (this.selectedNodeId$.value === nodeId) this.selectedNodeId$.next(null);
  }

  duplicateNode(nodeId: string): void {
    const node = this.nodes$.value.find(n => n.id === nodeId);
    if (!node) return;
    const clone: FlowAgentNode = {
      ...node,
      id: this.defaults.generateNodeId(),
      position: { x: node.position.x + 50, y: node.position.y + 50 },
      data: { ...node.data },
    };
    this.addNode(clone);
  }

  addEdge(edge: FlowAgentEdge): void {
    this.edges$.next([...this.edges$.value, edge]);
  }

  updateEdgeData(edgeId: string, data: Partial<ConditionEdgeData>): void {
    this.edges$.next(
      this.edges$.value.map(e => e.id === edgeId ? { ...e, data: { ...e.data, ...data } } : e)
    );
  }

  deleteEdge(edgeId: string): void {
    this.edges$.next(this.edges$.value.filter(e => e.id !== edgeId));
    if (this.selectedEdgeId$.value === edgeId) this.selectedEdgeId$.next(null);
  }

  private updateArrayField(nodeId: string, field: string, updater: (arr: any[]) => any[]): void {
    this.updateNodeData(nodeId, { [field]: updater((this.getNodeData(nodeId) as any)?.[field] || []) });
  }

  private getNodeData(nodeId: string): any {
    return this.nodes$.value.find(n => n.id === nodeId)?.data;
  }

  addToolToNode(nodeId: string, tool: Tool): void { this.updateArrayField(nodeId, 'tools', arr => [...arr, tool]); }
  removeToolFromNode(nodeId: string, toolId: string): void { this.updateArrayField(nodeId, 'tools', arr => arr.filter(t => t.id !== toolId)); }
  updateToolInNode(nodeId: string, toolId: string, updates: Partial<Tool>): void { this.updateArrayField(nodeId, 'tools', arr => arr.map(t => t.id === toolId ? { ...t, ...updates } : t)); }

  addInfoCollectionToNode(nodeId: string, item: InfoCollectionItem): void { this.updateArrayField(nodeId, 'infoCollection', arr => [...arr, item]); }
  removeInfoCollectionFromNode(nodeId: string, itemId: string): void { this.updateArrayField(nodeId, 'infoCollection', arr => arr.filter(i => i.id !== itemId)); }
  updateInfoCollectionInNode(nodeId: string, itemId: string, updates: Partial<InfoCollectionItem>): void { this.updateArrayField(nodeId, 'infoCollection', arr => arr.map(i => i.id === itemId ? { ...i, ...updates } : i)); }

  addKnowledgeBaseToNode(nodeId: string, kb: KnowledgeBase): void { this.updateArrayField(nodeId, 'knowledgeBases', arr => [...arr, kb]); }
  removeKnowledgeBaseFromNode(nodeId: string, kbId: string): void { this.updateArrayField(nodeId, 'knowledgeBases', arr => arr.filter(k => k.id !== kbId)); }

  setCurrentFlowId(id: string): void { this.currentFlowId$.next(id); }
  updateFlowName(name: string): void { this.currentFlowName$.next(name); }
  updateBaseSystemPrompt(prompt: string): void { this.baseSystemPrompt$.next(prompt); }

  setFlowData(data: FlowAgentData): void {
    this.nodes$.next(data.nodes);
    this.edges$.next(data.edges);
    const flowName = data.name?.trim();
    if (!flowName || flowName === 'state.default_flow_name') {
      this.setDefaultFlowNameFromTranslations(true);
    } else {
      this.currentFlowName$.next(flowName);
    }

    const basePrompt = data.baseSystemPrompt?.trim();
    if (!basePrompt || basePrompt === 'state.default_prompt') {
      this.setDefaultPromptFromTranslations(true);
    } else {
      this.baseSystemPrompt$.next(basePrompt);
    }

    this.currentFlowId$.next(data.id);
    this.isFlowLoaded$.next(true);
    this.pipelineType$.next(data.pipelineType ?? 'venta');
    this.stagesVenta$.next(data.stagesVenta ?? []);
    this.stagesServicio$.next(data.stagesServicio ?? []);
    this.saveFields$.next(data.saveFields ?? []);
    this.timezone$.next(data.timezone ?? 'America/Argentina/Buenos_Aires');
    this.preventInfiniteLoops$.next(data.preventInfiniteLoops ?? false);
  }

  resetToDefaults(): void {
    this.nodes$.next(this.defaults.createInitialNodes());
    this.edges$.next([]);
    this.isFlowLoaded$.next(false);
    this.setDefaultFlowNameFromTranslations(true);
    this.setDefaultPromptFromTranslations(true);
    this.selectedNodeId$.next(null);
    this.selectedEdgeId$.next(null);
    this.pipelineType$.next('venta');
    this.stagesVenta$.next([]);
    this.stagesServicio$.next([]);
    this.saveFields$.next([]);
    this.timezone$.next('America/Argentina/Buenos_Aires');
    this.preventInfiniteLoops$.next(false);
  }

  getFlowSnapshot(): FlowAgentData {
    return {
      id: this.currentFlowId$.value!,
      name: this.currentFlowName$.value,
      nodes: this.nodes$.value,
      edges: this.edges$.value,
      baseSystemPrompt: this.baseSystemPrompt$.value,
      timezone: this.timezone$.value,
      pipelineType: this.pipelineType$.value,
      stagesVenta: this.stagesVenta$.value,
      stagesServicio: this.stagesServicio$.value,
      saveFields: this.saveFields$.value,
      preventInfiniteLoops: this.preventInfiniteLoops$.value,
    };
  }
}
