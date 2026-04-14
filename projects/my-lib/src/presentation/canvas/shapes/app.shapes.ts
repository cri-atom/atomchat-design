import { shapes } from '@joint/plus';
import { StartNodeShape } from './start-node.shape';
import { AgentNodeShape } from './agent-node.shape';
import { ToolNodeShape } from './tool-node.shape';
import { SelectAgentNodeShape } from './select-agent-node.shape';
import { EndNodeShape } from './end-node.shape';
import { ConditionEdgeLink, ConditionEdgeLinkView } from './condition-edge.link';

Object.assign(shapes, {
  agentApp: {
    StartNode: StartNodeShape,
    AgentNode: AgentNodeShape,
    ToolNode: ToolNodeShape,
    SelectAgentNode: SelectAgentNodeShape,
    EndNode: EndNodeShape,
    Link: ConditionEdgeLink,
    LinkView: ConditionEdgeLinkView,
  },
});
