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

  it('enables editing only for agent or tool nodes', () => {
    component.startEditing(nodes[0]);
    expect(component.isEditing()).toBeTrue();

    component.isEditing.set(false);
    component.startEditing(nodes[1]);
    expect(component.isEditing()).toBeFalse();
  });

  it('saves trimmed name for selected node', () => {
    component.saveName('  Qualified Agent  ');
    expect(stateMock.updateNodeData).toHaveBeenCalledWith('agent-1', { label: 'Qualified Agent' });
    expect(component.isEditing()).toBeFalse();
  });

  it('does not save blank names', () => {
    stateMock.updateNodeData.calls.reset();
    component.saveName('   ');
    expect(stateMock.updateNodeData).not.toHaveBeenCalled();
  });
});
