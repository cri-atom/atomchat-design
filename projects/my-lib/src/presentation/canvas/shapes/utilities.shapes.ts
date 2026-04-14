export const AgentShapeTypesEnum = {
  BASE: 'agentApp.Base',
  LINK: 'agentApp.Link',
  START_NODE: 'agentApp.StartNode',
  AGENT_NODE: 'agentApp.AgentNode',
  TOOL_NODE: 'agentApp.ToolNode',
  SELECT_AGENT_NODE: 'agentApp.SelectAgentNode',
  END_NODE: 'agentApp.EndNode',
} as const;
export type AgentShapeType = typeof AgentShapeTypesEnum[keyof typeof AgentShapeTypesEnum];
