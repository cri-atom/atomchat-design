import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { ToolsTabComponent } from './tools-tab.component';
import { FlowAgentInternalStateService } from '../../../../application/state/flow-agent-internal-state.service';
import { AgentNodeType, FlowAgentNode } from '../../../../core/model/agent-flow.model';

describe('ToolsTabComponent', () => {
  let fixture: ComponentFixture<ToolsTabComponent>;
  let component: ToolsTabComponent;
  const stateMock = {
    nodes$: new BehaviorSubject([]),
    addToolToNode: jasmine.createSpy('addToolToNode'),
    removeToolFromNode: jasmine.createSpy('removeToolFromNode'),
  };

  const node: FlowAgentNode = {
    id: 'agent-2',
    type: AgentNodeType.Agent,
    position: { x: 0, y: 0 },
    data: {
      label: 'Agent',
      description: '',
      conversationGoal: '',
      tools: [],
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolsTabComponent],
      providers: [{ provide: FlowAgentInternalStateService, useValue: stateMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolsTabComponent);
    fixture.componentRef.setInput('node', node);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('adds mock tool to current node', () => {
    component.addMockTool();

    expect(stateMock.addToolToNode).toHaveBeenCalled();
    const [nodeId, payload] = stateMock.addToolToNode.calls.mostRecent().args;
    expect(nodeId).toBe('agent-2');
    expect(payload).toEqual(jasmine.objectContaining({
      name: 'Hello World',
      toolkitSlug: 'mock',
      toolSlug: 'hello_world',
    }));
  });

  it('removes tool by id', () => {
    component.remove('tool-1');
    expect(stateMock.removeToolFromNode).toHaveBeenCalledWith('agent-2', 'tool-1');
  });
});
