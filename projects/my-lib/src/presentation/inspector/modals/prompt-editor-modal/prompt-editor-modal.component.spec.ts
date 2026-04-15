import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { PromptEditorModalComponent } from './prompt-editor-modal.component';
import { FlowAgentInternalStateService } from '../../../../application/state/flow-agent-internal-state.service';
import { AgentNodeType, FlowAgentNode } from '../../../../core/model/agent-flow.model';

describe('PromptEditorModalComponent', () => {
  let fixture: ComponentFixture<PromptEditorModalComponent>;
  let component: PromptEditorModalComponent;

  const stateMock = {
    updateNodeData: jasmine.createSpy('updateNodeData'),
  };

  const node: FlowAgentNode = {
    id: 'agent-1',
    type: AgentNodeType.Agent,
    position: { x: 0, y: 0 },
    data: {
      label: 'Agent',
      description: '',
      conversationGoal: '@hel',
      tools: [{ id: 't1', name: 'helloWorld', description: 'd', toolkitSlug: 'mock', toolSlug: 'hello' }],
      infoCollection: [{ id: 'f1', label: 'email', description: '', targetField: 'email' }],
      aiAgentModel: null,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromptEditorModalComponent],
      providers: [{ provide: FlowAgentInternalStateService, useValue: stateMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(PromptEditorModalComponent);
    fixture.componentRef.setInput('node', node);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('updates label and model in node data', () => {
    component.updateLabel('Agente Comercial');
    component.onModelChange('gemini-2.5-pro');

    expect(stateMock.updateNodeData).toHaveBeenCalledWith('agent-1', { label: 'Agente Comercial' });
    expect(stateMock.updateNodeData).toHaveBeenCalledWith('agent-1', {
      aiAgentModel: { id: 'gemini-2.5-pro', name: 'gemini-2.5-pro', provider: 'google' },
    });
  });

  it('inserts mention token into textarea content', () => {
    const textarea = document.createElement('textarea');
    textarea.value = '@hel';
    textarea.setSelectionRange(4, 4);
    component.goalTextarea = new ElementRef(textarea);
    (component as any).mentionStart = 0;

    const evt = { preventDefault: jasmine.createSpy('preventDefault') } as unknown as MouseEvent;
    component.insertMention('helloWorld', evt);

    expect(stateMock.updateNodeData).toHaveBeenCalledWith('agent-1', {
      conversationGoal: '@[helloWorld]',
      description: '@[helloWorld]',
    });
    expect(component.showMentions()).toBeFalse();
  });

  it('refines prompt and persists optimized text', () => {
    jasmine.clock().install();
    try {
      component.assistantInput.set('ventas B2B');
      component.refinePrompt();
      expect(component.isOptimizing()).toBeTrue();

      jasmine.clock().tick(1500);

      expect(component.isOptimizing()).toBeFalse();
      expect(stateMock.updateNodeData).toHaveBeenCalled();
      const calls = stateMock.updateNodeData.calls.allArgs();
      const optimizedPatch = calls[calls.length - 1][1];
      expect(optimizedPatch.conversationGoal).toContain('ventas B2B');
    } finally {
      jasmine.clock().uninstall();
    }
  });
});
