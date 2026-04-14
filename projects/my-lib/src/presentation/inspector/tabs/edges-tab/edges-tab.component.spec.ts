import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { EdgesTabComponent } from './edges-tab.component';
import { FlowAgentInternalStateService } from '../../../../application/state/flow-agent-internal-state.service';
import { AgentNodeType, FlowAgentEdge, FlowAgentNode } from '../../../../core/model/agent-flow.model';

describe('EdgesTabComponent', () => {
  let fixture: ComponentFixture<EdgesTabComponent>;
  let component: EdgesTabComponent;

  const nodes: FlowAgentNode[] = [
    { id: 'a1', type: AgentNodeType.Agent, position: { x: 0, y: 0 }, data: { label: 'A', description: '', conversationGoal: '' } },
    { id: 'e1', type: AgentNodeType.End, position: { x: 100, y: 0 }, data: { label: 'End' } },
  ];

  const stateMock = {
    nodes$: new BehaviorSubject(nodes),
    updateEdgeData: jasmine.createSpy('updateEdgeData'),
  };

  const edge: FlowAgentEdge = {
    id: 'edge-1',
    source: 'a1',
    target: 'e1',
    data: { label: 'go', conditionType: null },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdgesTabComponent],
      providers: [{ provide: FlowAgentInternalStateService, useValue: stateMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(EdgesTabComponent);
    fixture.componentRef.setInput('edge', edge);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('detects when edge target is end node', () => {
    expect(component.isTargetEnd).toBeTrue();
  });

  it('updates edge data through state service', () => {
    component.update({ label: 'new label' });
    expect(stateMock.updateEdgeData).toHaveBeenCalledWith('edge-1', { label: 'new label' });
  });
});
