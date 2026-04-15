/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { GeneralTabComponent } from './general-tab.component';
import { FlowAgentInternalStateService } from '../../../../application/state/flow-agent-internal-state.service';
import { AgentNodeType, FlowAgentNode } from '../../../../core/model/agent-flow.model';

describe('GeneralTabComponent', () => {
  let fixture: ComponentFixture<GeneralTabComponent>;
  let component: GeneralTabComponent;
  const stateMock = {
    nodes$: new BehaviorSubject([]),
    updateNodeData: jasmine.createSpy('updateNodeData'),
  };

  const node: FlowAgentNode = {
    id: 'agent-1',
    type: AgentNodeType.Agent,
    position: { x: 10, y: 20 },
    data: {
      label: 'Agent 1',
      description: '',
      conversationGoal: 'Hola @hel',
      aiAgentModel: null,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralTabComponent],
      providers: [{ provide: FlowAgentInternalStateService, useValue: stateMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(GeneralTabComponent);
    fixture.componentRef.setInput('node', node);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('updates selected model in node data', () => {
    component.onModelChange('gemini-3.1-flash');
    expect(stateMock.updateNodeData).toHaveBeenCalledWith('agent-1', {
      aiAgentModel: { id: 'gemini-3.1-flash', name: 'gemini-3.1-flash', provider: 'google' },
    });
  });

  it('opens mention list when @ trigger is typed', () => {
    const textarea = {
      value: 'Hola @hel',
      selectionStart: 'Hola @hel'.length,
    } as HTMLTextAreaElement;

    component.onInput({ target: textarea } as unknown as Event);

    expect(component.showMentions()).toBeTrue();
    expect(component.filteredItems().some(item => item.name === 'helloWorld')).toBeTrue();
  });

  it('inserts mention and persists updated text', () => {
    const textarea = {
      value: 'Hola @hel',
      selectionStart: 'Hola @hel'.length,
    } as HTMLTextAreaElement;
    component.onInput({ target: textarea } as unknown as Event);

    const mouseEvent = { preventDefault: jasmine.createSpy('preventDefault') } as unknown as MouseEvent;
    component.insertMention('helloWorld', mouseEvent);

    expect(stateMock.updateNodeData).toHaveBeenCalledWith('agent-1', {
      conversationGoal: 'Hola @[helloWorld]',
      description: 'Hola @[helloWorld]',
    });
    expect(component.showMentions()).toBeFalse();
  });
});
