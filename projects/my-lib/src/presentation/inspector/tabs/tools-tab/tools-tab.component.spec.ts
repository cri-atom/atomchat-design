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
    updateNodeData: jasmine.createSpy('updateNodeData'),
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

  it('adds tools to current node on modal save', () => {
    component.onToolsSaved([
      { id: 'tool-1', name: 'Send email', description: 'desc', toolkitSlug: 'gmail', toolSlug: 'gmail-1' },
      { id: 'tool-2', name: 'Create draft', description: 'desc', toolkitSlug: 'gmail', toolSlug: 'gmail-2' },
    ]);

    expect(stateMock.addToolToNode).toHaveBeenCalledTimes(2);
    expect(stateMock.addToolToNode).toHaveBeenCalledWith('agent-2', jasmine.objectContaining({ id: 'tool-1' }));
    expect(stateMock.addToolToNode).toHaveBeenCalledWith('agent-2', jasmine.objectContaining({ id: 'tool-2' }));
  });

  it('removes tool by id', () => {
    component.remove('tool-1');
    expect(stateMock.removeToolFromNode).toHaveBeenCalledWith('agent-2', 'tool-1');
  });

  it('adds or updates http config', () => {
    component.onHttpSaved({ id: 'http-1', name: 'Req', description: 'd', method: 'GET', url: 'https://a.com' });

    expect(stateMock.updateNodeData).toHaveBeenCalledWith('agent-2', {
      httpTools: [{ id: 'http-1', name: 'Req', description: 'd', method: 'GET', url: 'https://a.com' }],
    });
  });
});
