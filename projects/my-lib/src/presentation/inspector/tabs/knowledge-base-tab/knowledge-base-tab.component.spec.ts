/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { KnowledgeBaseTabComponent } from './knowledge-base-tab.component';
import { FlowAgentInternalStateService } from '../../../../application/state/flow-agent-internal-state.service';
import { AgentNodeType, FlowAgentNode, KnowledgeBase } from '../../../../core/model/agent-flow.model';

describe('KnowledgeBaseTabComponent', () => {
  let fixture: ComponentFixture<KnowledgeBaseTabComponent>;
  let component: KnowledgeBaseTabComponent;
  const stateMock = {
    nodes$: new BehaviorSubject([]),
    updateNodeData: jasmine.createSpy('updateNodeData'),
  };

  const node: FlowAgentNode = {
    id: 'agent-kb',
    type: AgentNodeType.Agent,
    position: { x: 0, y: 0 },
    data: {
      label: 'Agent KB',
      description: '',
      conversationGoal: '',
      knowledgeBases: [{ id: 'kb-1', name: 'Product FAQ', description: 'Frequently asked questions' }],
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KnowledgeBaseTabComponent],
      providers: [{ provide: FlowAgentInternalStateService, useValue: stateMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(KnowledgeBaseTabComponent);
    fixture.componentRef.setInput('node', node);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('adds only non-duplicated KBs to node', () => {
    const kb: KnowledgeBase = { id: 'kb-2', name: 'Billing Guide', description: 'Billing and payment info' };

    component.onFilesSaved([
      { id: 'kb-1', name: 'Product FAQ', description: 'Frequently asked questions' },
      kb,
    ]);

    expect(stateMock.updateNodeData).toHaveBeenCalledWith('agent-kb', {
      knowledgeBases: [
        { id: 'kb-1', name: 'Product FAQ', description: 'Frequently asked questions' },
        kb,
      ],
    });
  });

  it('removes KB from node', () => {
    component.removeFromNode('kb-1');
    expect(stateMock.updateNodeData).toHaveBeenCalledWith('agent-kb', { knowledgeBases: [] });
  });
});
