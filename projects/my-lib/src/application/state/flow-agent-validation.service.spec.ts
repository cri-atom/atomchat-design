import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import {
  AgentNodeType,
  ConditionType,
  FlowAgentEdge,
  FlowAgentNode,
} from '../../core/model/agent-flow.model';
import { FlowAgentValidationService } from './flow-agent-validation.service';

describe('FlowAgentValidationService', () => {
  let service: FlowAgentValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FlowAgentValidationService,
        {
          provide: TranslocoService,
          useValue: {
            translate: (key: string) => key,
          },
        },
      ],
    });

    service = TestBed.inject(FlowAgentValidationService);
  });

  it('returns expected node and edge validation errors', () => {
    const nodes: FlowAgentNode[] = [
      {
        id: 'start-node',
        type: AgentNodeType.Start,
        position: { x: 0, y: 0 },
        data: { label: 'Start' },
      },
      {
        id: 'agent-1',
        type: AgentNodeType.Agent,
        position: { x: 100, y: 100 },
        data: { label: 'Agent 1', description: '', conversationGoal: '' },
      },
      {
        id: 'tool-1',
        type: AgentNodeType.Tool,
        position: { x: 200, y: 200 },
        data: { label: 'Tool 1', description: '', tools: [] },
      },
      {
        id: 'end-1',
        type: AgentNodeType.End,
        position: { x: 300, y: 300 },
        data: { label: 'End', description: '' },
      },
    ];

    const edges: FlowAgentEdge[] = [
      {
        id: 'edge-start-agent',
        source: 'start-node',
        target: 'agent-1',
        data: { label: '', conditionType: null },
      },
      {
        id: 'edge-agent-end',
        source: 'agent-1',
        target: 'end-1',
        data: {
          label: 'cond',
          conditionType: ConditionType.LLMCondition,
          conditionExpression: '',
        },
      },
    ];

    const errors = service.validate(nodes, edges);

    expect(errors.length).toBe(5);
    expect(errors.some(e => e.id === 'agent-1' && e.type === 'node')).toBeTrue();
    expect(errors.some(e => e.id === 'tool-1' && e.type === 'node')).toBeTrue();
    expect(errors.some(e => e.id === 'edge-agent-end' && e.type === 'edge')).toBeTrue();
  });

  it('is valid when there are no violations', () => {
    const nodes: FlowAgentNode[] = [
      {
        id: 'start-node',
        type: AgentNodeType.Start,
        position: { x: 0, y: 0 },
        data: { label: 'Start' },
      },
      {
        id: 'agent-1',
        type: AgentNodeType.Agent,
        position: { x: 100, y: 100 },
        data: { label: 'Agent 1', description: '', conversationGoal: 'Collect intent' },
      },
      {
        id: 'tool-1',
        type: AgentNodeType.Tool,
        position: { x: 200, y: 200 },
        data: { label: 'Tool 1', description: '', tools: [{ id: 't1', name: 'tool', description: '', toolkitSlug: 'x', toolSlug: 'x' }] },
      },
      {
        id: 'end-1',
        type: AgentNodeType.End,
        position: { x: 300, y: 300 },
        data: { label: 'End', description: '' },
      },
    ];

    const edges: FlowAgentEdge[] = [
      {
        id: 'edge-start-agent',
        source: 'start-node',
        target: 'agent-1',
        data: { label: '', conditionType: null },
      },
      {
        id: 'edge-agent-tool',
        source: 'agent-1',
        target: 'tool-1',
        data: {
          label: 'go-tool',
          conditionType: ConditionType.ToolResult,
        },
      },
      {
        id: 'edge-tool-end',
        source: 'tool-1',
        target: 'end-1',
        data: {
          label: 'done',
          conditionType: ConditionType.ToolResult,
        },
      },
    ];

    expect(service.isValid(nodes, edges)).toBeTrue();
  });
});
