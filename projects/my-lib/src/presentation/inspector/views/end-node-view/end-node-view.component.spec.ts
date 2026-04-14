/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { EndNodeViewComponent } from './end-node-view.component';
import { FlowAgentInternalStateService } from '../../../../application/state/flow-agent-internal-state.service';
import { AgentNodeType, FlowAgentNode } from '../../../../core/model/agent-flow.model';

describe('EndNodeViewComponent', () => {
  let fixture: ComponentFixture<EndNodeViewComponent>;
  let component: EndNodeViewComponent;
  const stateMock = {
    nodes$: new BehaviorSubject([]),
    updateNodeData: jasmine.createSpy('updateNodeData'),
  };

  const node: FlowAgentNode = {
    id: 'end-1',
    type: AgentNodeType.End,
    position: { x: 100, y: 200 },
    data: { label: 'End', endLabel: 'Resolved', description: 'Done' },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EndNodeViewComponent],
      providers: [{ provide: FlowAgentInternalStateService, useValue: stateMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(EndNodeViewComponent);
    fixture.componentRef.setInput('node', node);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('exposes end node data', () => {
    expect(component.endData.endLabel).toBe('Resolved');
    expect(component.endData.description).toBe('Done');
  });

  it('updates node data through state service', () => {
    component.update({ endLabel: 'Escalated' });
    expect(stateMock.updateNodeData).toHaveBeenCalledWith('end-1', { endLabel: 'Escalated' });
  });
});
