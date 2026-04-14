import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { InspectorComponent } from './inspector.component';
import { FlowAgentInternalStateService } from '../../../application/state/flow-agent-internal-state.service';
import { AgentNodeType, FlowAgentNode } from '../../../core/model/agent-flow.model';

describe('InspectorComponent', () => {
  let fixture: ComponentFixture<InspectorComponent>;
  let component: InspectorComponent;

  const nodes: FlowAgentNode[] = [
    {
      id: 'agent-1',
      type: AgentNodeType.Agent,
      position: { x: 0, y: 0 },
      data: { label: 'Sales Agent', description: '', conversationGoal: '' },
    },
    {
      id: 'start-node',
      type: AgentNodeType.Start,
      position: { x: 0, y: 0 },
      data: { label: 'Start' },
    },
  ];

  const stateMock = {
    selectedNodeId$: new BehaviorSubject<string | null>('agent-1'),
    selectedEdgeId$: new BehaviorSubject<string | null>(null),
    nodes$: new BehaviorSubject(nodes),
    edges$: new BehaviorSubject([]),
    updateNodeData: jasmine.createSpy('updateNodeData'),
    setSelectedNode: jasmine.createSpy('setSelectedNode'),
    setSelectedEdge: jasmine.createSpy('setSelectedEdge'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InspectorComponent],
      providers: [{ provide: FlowAgentInternalStateService, useValue: stateMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(InspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('resolves currently selected node', () => {
    expect(component.selectedNode()?.id).toBe('agent-1');
  });

  it('allows editing only for agent or tool nodes', () => {
    expect(component.canEditNodeName(nodes[0])).toBeTrue();
    expect(component.canEditNodeName(nodes[1])).toBeFalse();
  });

  it('updates node name while typing', () => {
    component.updateName('Qualified Agent');
    expect(stateMock.updateNodeData).toHaveBeenCalledWith('agent-1', { label: 'Qualified Agent' });
  });

  it('allows empty node names', () => {
    stateMock.updateNodeData.calls.reset();
    component.updateName('');
    expect(stateMock.updateNodeData).toHaveBeenCalledWith('agent-1', { label: '' });
  });
});
