import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { ReturnTransitionTabComponent } from './return-transition-tab.component';
import { FlowAgentInternalStateService } from '../../../../application/state/flow-agent-internal-state.service';
import { FlowAgentEdge } from '../../../../core/model/agent-flow.model';

describe('ReturnTransitionTabComponent', () => {
  let fixture: ComponentFixture<ReturnTransitionTabComponent>;
  let component: ReturnTransitionTabComponent;
  const stateMock = {
    nodes$: new BehaviorSubject([]),
    updateEdgeData: jasmine.createSpy('updateEdgeData'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnTransitionTabComponent],
      providers: [{ provide: FlowAgentInternalStateService, useValue: stateMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ReturnTransitionTabComponent);
  });

  it('returns default config when edge has no returnTransition', () => {
    const edge: FlowAgentEdge = {
      id: 'edge-rt-1',
      source: 'a',
      target: 'b',
      data: { label: '', conditionType: null },
    };
    fixture.componentRef.setInput('edge', edge);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.rt).toEqual({ enabled: false, label: '', conditionExpression: '' });
  });

  it('merges and saves return transition partial', () => {
    const edge: FlowAgentEdge = {
      id: 'edge-rt-2',
      source: 'a',
      target: 'b',
      data: {
        label: '',
        conditionType: null,
        returnTransition: { enabled: true, label: 'Back', conditionExpression: 'x > 1' },
      },
    };
    fixture.componentRef.setInput('edge', edge);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.updateRT({ enabled: false });
    expect(stateMock.updateEdgeData).toHaveBeenCalledWith('edge-rt-2', {
      returnTransition: { enabled: false, label: 'Back', conditionExpression: 'x > 1' },
    });
  });
});
