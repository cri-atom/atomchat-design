/**
 * Discriminated union of all possible node types in an agent flow.
 * Used to distinguish node variants throughout the canvas and inspector.
 */
export const AgentNodeType = {
  Start: 'start',
  Agent: 'agent',
  Tool: 'tool',
  SelectAgent: 'selectAgent',
  End: 'end',
} as const;
/** @see {@link AgentNodeType} */
export type AgentNodeType = typeof AgentNodeType[keyof typeof AgentNodeType];

/**
 * Determines how the LLM evaluates the condition on an edge transition.
 * - `LLMCondition`: the condition is evaluated by the language model based on a natural-language expression.
 * - `ToolResult`: the condition is resolved from the output of a tool call.
 */
export const ConditionType = {
  LLMCondition: 'llm_condition',
  ToolResult: 'tool_result',
} as const;
/** @see {@link ConditionType} */
export type ConditionType = typeof ConditionType[keyof typeof ConditionType];

/**
 * Represents an AI language model that can be assigned to an agent node.
 */
export interface AIAgentModel {
  id: string;
  /** Display name of the model (e.g. "GPT-4o", "Claude 3.5 Sonnet"). */
  name: string;
  /** Provider identifier (e.g. "openai", "anthropic"). */
  provider: string;
}

/**
 * A single composio tool that has been added to a node.
 */
export interface Tool {
  id: string;
  name: string;
  description: string;
  /** Slug of the toolkit this tool belongs to (e.g. "gmail"). */
  toolkitSlug: string;
  /** Unique slug identifying the tool within its toolkit. */
  toolSlug: string;
}

/**
 * Defines a piece of information that an agent node is configured to collect from the user.
 */
export interface InfoCollectionItem {
  id: string;
  /** Human-readable label shown in the UI. */
  label: string;
  description: string;
  /** The Atom field key where the collected value will be stored. */
  targetField: string;
  /**
   * Whether the agent must collect this field before advancing.
   * Defaults to `'optional'` if omitted.
   */
  type?: 'required' | 'optional';
}

/**
 * Represents a knowledge base document or file attached to an agent node.
 */
export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  fileName?: string;
  filePath?: string;
  uploadDate?: string;
  /** File size in bytes. */
  fileSize?: number;
}

/**
 * Configuration for a custom HTTP tool attached to an agent node.
 * The agent can invoke this endpoint during a conversation turn.
 */
export interface HttpToolConfig {
  id: string;
  name: string;
  description: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  /** Static headers sent with every request. */
  headers?: Record<string, string>;
  /** Handlebars-style template for the JSON request body. */
  bodyTemplate?: string;
}

/**
 * Maps an agent node to a CRM pipeline stage.
 */
export interface AgentStageConfig {
  stageId: string;
  stageName: string;
  description: string;
}

/** Data payload for a Start node. */
export interface StartNodeData {
  label: string;
}

/**
 * Controls how deeply the LLM reasons before responding.
 * Higher levels increase response quality at the cost of latency and tokens.
 */
export type ThinkingLevel = 'auto' | 'low' | 'medium' | 'high';

/**
 * Data payload for an Agent node.
 * Contains all configuration that drives the agent's behavior during a conversation.
 */
export interface AgentNodeData {
  label: string;
  description: string;
  /** Natural-language goal the agent must achieve during this node. Required for validation. */
  conversationGoal: string;
  thinkingLevel?: ThinkingLevel;
  /** The AI model to use. Falls back to the global default when null. */
  aiAgentModel?: AIAgentModel | null;
  tools?: Tool[];
  knowledgeBases?: KnowledgeBase[];
  infoCollection?: InfoCollectionItem[];
  httpTools?: HttpToolConfig[];
  stages?: AgentStageConfig[];
  dataSources?: { id: string; name: string }[];
}

/** Data payload for a Tool Dispatcher node. */
export interface ToolNodeData {
  label: string;
  description: string;
  tools?: Tool[];
}

/** Data payload for a Select Agent node. */
export interface SelectAgentNodeData {
  label: string;
}

/**
 * Describes a field value to extract and persist when a flow reaches an End node.
 */
export interface FieldExtractionItem {
  id: string;
  fieldName: string;
  description: string;
  /** The Atom field key where the extracted value will be saved. */
  targetField: string;
}

/** Data payload for an End node. */
export interface EndNodeData {
  label: string;
  /** Optional label shown on the canvas shape (e.g. "Resolved", "Escalated"). */
  endLabel?: string;
  description?: string;
  fieldExtractions?: FieldExtractionItem[];
}

/** Union of all node data payloads. Narrow using the parent {@link FlowAgentNode.type}. */
export type AnyNodeData =
  | StartNodeData
  | AgentNodeData
  | ToolNodeData
  | SelectAgentNodeData
  | EndNodeData;

/**
 * A single node in the agent flow graph.
 */
export interface FlowAgentNode {
  id: string;
  type: AgentNodeType;
  /** Canvas position in logical pixels. */
  position: { x: number; y: number };
  data: AnyNodeData;
}

/**
 * Configuration for the return-transition edge of an agent-to-agent connection.
 * When enabled, the conversation can loop back to the source agent under the specified condition.
 */
export interface ReturnTransitionConfig {
  enabled: boolean;
  label: string;
  conditionExpression: string;
}

/**
 * Data payload for a directed edge between two nodes.
 * A `null` conditionType indicates an unconditional edge (e.g. from Start).
 */
export interface ConditionEdgeData {
  label: string;
  /** Evaluation strategy. `null` = unconditional transition. */
  conditionType: ConditionType | null;
  /** `true` for the success branch of a tool-result edge. */
  isSuccess?: boolean;
  conditionExpression?: string;
  /** When `true`, ignores the global end condition and uses this edge's expression instead. */
  overrideEndCondition?: boolean;
  returnTransition?: ReturnTransitionConfig;
}

/**
 * A directed edge connecting two nodes in the agent flow.
 */
export interface FlowAgentEdge {
  id: string;
  source: string;
  target: string;
  data: ConditionEdgeData;
}

/** CRM pipeline stage types supported by the platform. */
export type StageType = 'Awareness' | 'Lead' | 'MQL' | 'SQL' | 'Opportunity' | '-';

/**
 * A stage in the global CRM pipeline configuration of a flow.
 */
export interface GlobalStage {
  id: string;
  name: string;
  type: StageType;
  /** LLM-evaluated condition expression that triggers advancing to this stage. */
  condition: string;
}

/**
 * A field that should be identified and persisted by the agent during any conversation turn.
 */
export interface GlobalSaveField {
  id: string;
  /** Display label matching the Atom field name. */
  label: string;
}

/**
 * Complete serialized representation of an agent flow, used for persistence and loading.
 */
export interface FlowAgentData {
  id: string;
  name: string;
  nodes: FlowAgentNode[];
  edges: FlowAgentEdge[];
  /** System-level instructions applied to all agents in the flow. */
  baseSystemPrompt: string;
  /** When `true`, the runtime halts execution if a repetitive path is detected. */
  preventInfiniteLoops?: boolean;
  /** IANA timezone identifier (e.g. "America/Argentina/Buenos_Aires"). */
  timezone?: string;
  pipelineType?: 'venta' | 'servicio';
  stagesVenta?: GlobalStage[];
  stagesServicio?: GlobalStage[];
  saveFields?: GlobalSaveField[];
}

/**
 * Input data that determines how the builder is opened.
 */
export interface FlowAgentModeData {
  /** ID of the flow to load. Omit or set to `undefined` when creating a new flow. */
  flowId?: string;
  mode: 'create' | 'edit' | 'view';
  /** Route the user came from; used by the back-navigation action. */
  sourceRoute?: string;
}

/**
 * A single validation error produced by {@link FlowAgentValidationService}.
 */
export interface ValidationError {
  /** ID of the node or edge that has the error. */
  id: string;
  type: 'node' | 'edge';
  /** Translated, human-readable error message. */
  message: string;
}

/**
 * An external integration toolkit available for selection in the tool panel.
 */
export interface ToolkitItem {
  name: string;
  /** Unique identifier used when checking connection status and authorizing. */
  slug: string;
  logo: string;
  description: string;
}

/**
 * A single tool available within a composio toolkit.
 */
export interface ComposioToolItem {
  id: string;
  name: string;
  description: string;
  toolSlug: string;
}

/**
 * An entry in the flow simulation log, capturing the result of visiting a node.
 */
export interface SimulationLog {
  nodeId: string;
  nodeLabel: string;
  status: 'success' | 'error';
  /** ISO 8601 timestamp of when this node was visited. */
  timestamp: string;
  detail?: string;
  error?: string;
}
