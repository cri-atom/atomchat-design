export const AgentNodeType = {
  Start: 'start',
  Agent: 'agent',
  Tool: 'tool',
  SelectAgent: 'selectAgent',
  End: 'end',
} as const;
export type AgentNodeType = typeof AgentNodeType[keyof typeof AgentNodeType];

export const ConditionType = {
  LLMCondition: 'llm_condition',
  ToolResult: 'tool_result',
} as const;
export type ConditionType = typeof ConditionType[keyof typeof ConditionType];

export interface AIAgentModel {
  id: string;
  name: string;
  provider: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  toolkitSlug: string;
  toolSlug: string;
}

export interface InfoCollectionItem {
  id: string;
  label: string;
  description: string;
  targetField: string;
  type?: 'required' | 'optional';
}

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  fileName?: string;
  filePath?: string;
  uploadDate?: string;
  fileSize?: number;
}

export interface HttpToolConfig {
  id: string;
  name: string;
  description: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers?: Record<string, string>;
  bodyTemplate?: string;
}

export interface AgentStageConfig {
  stageId: string;
  stageName: string;
  description: string;
}

export interface StartNodeData {
  label: string;
}

export type ThinkingLevel = 'auto' | 'low' | 'medium' | 'high';

export interface AgentNodeData {
  label: string;
  description: string;
  conversationGoal: string;
  thinkingLevel?: ThinkingLevel;
  aiAgentModel?: AIAgentModel | null;
  tools?: Tool[];
  knowledgeBases?: KnowledgeBase[];
  infoCollection?: InfoCollectionItem[];
  httpTools?: HttpToolConfig[];
  stages?: AgentStageConfig[];
  dataSources?: { id: string; name: string }[];
}

export interface ToolNodeData {
  label: string;
  description: string;
  tools?: Tool[];
}

export interface SelectAgentNodeData {
  label: string;
}

export interface FieldExtractionItem {
  id: string;
  fieldName: string;
  description: string;
  targetField: string;
}

export interface EndNodeData {
  label: string;
  endLabel?: string;
  description?: string;
  fieldExtractions?: FieldExtractionItem[];
}

export type AnyNodeData =
  | StartNodeData
  | AgentNodeData
  | ToolNodeData
  | SelectAgentNodeData
  | EndNodeData;

export interface FlowAgentNode {
  id: string;
  type: AgentNodeType;
  position: { x: number; y: number };
  data: AnyNodeData;
}

export interface ReturnTransitionConfig {
  enabled: boolean;
  label: string;
  conditionExpression: string;
}

export interface ConditionEdgeData {
  label: string;
  conditionType: ConditionType | null;
  isSuccess?: boolean;
  conditionExpression?: string;
  overrideEndCondition?: boolean;
  returnTransition?: ReturnTransitionConfig;
}

export interface FlowAgentEdge {
  id: string;
  source: string;
  target: string;
  data: ConditionEdgeData;
}

export type StageType = 'Awareness' | 'Lead' | 'MQL' | 'SQL' | 'Opportunity' | '-';

export interface GlobalStage {
  id: string;
  name: string;
  type: StageType;
  condition: string;
}

export interface GlobalSaveField {
  id: string;
  label: string;
}

export interface FlowAgentData {
  id: string;
  name: string;
  nodes: FlowAgentNode[];
  edges: FlowAgentEdge[];
  baseSystemPrompt: string;
  preventInfiniteLoops?: boolean;
  timezone?: string;
  pipelineType?: 'venta' | 'servicio';
  stagesVenta?: GlobalStage[];
  stagesServicio?: GlobalStage[];
  saveFields?: GlobalSaveField[];
}

export interface FlowAgentModeData {
  flowId: string;
  mode: 'create' | 'edit' | 'view';
  sourceRoute?: string;
}

export interface ValidationError {
  id: string;
  type: 'node' | 'edge';
  message: string;
}

export interface ToolkitItem {
  name: string;
  slug: string;
  logo: string;
  description: string;
}

export interface ComposioToolItem {
  id: string;
  name: string;
  description: string;
  toolSlug: string;
}

export interface SimulationLog {
  nodeId: string;
  nodeLabel: string;
  status: 'success' | 'error';
  timestamp: string;
  detail?: string;
  error?: string;
}
