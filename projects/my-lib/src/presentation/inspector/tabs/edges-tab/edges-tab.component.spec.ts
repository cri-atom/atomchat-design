import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EdgesTabComponent } from './edges-tab.component';
import { TranslocoService } from '@jsverse/transloco';
import { FlowAgentInternalStateService } from '../../../../application/state/flow-agent-internal-state.service';
import { FlowAgentEdge } from '../../../../core/model/agent-flow.model';

describe('EdgesTabComponent', () => {
  let fixture: ComponentFixture<EdgesTabComponent>;
  let component: EdgesTabComponent;

  const stateMock = {
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
      providers: [
        { provide: FlowAgentInternalStateService, useValue: stateMock },
        { provide: TranslocoService, useValue: { translate: (key: string) => key } },
      ],
    }).compileComponents();

    stateMock.updateEdgeData.calls.reset();

    fixture = TestBed.createComponent(EdgesTabComponent);
    fixture.componentRef.setInput('edge', edge);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('updates edge data through state service', () => {
    component.update({ label: 'new label' });
    expect(stateMock.updateEdgeData).toHaveBeenCalledWith('edge-1', { label: 'new label' });
  });

  it('updates condition expression through state service', () => {
    component.update({ conditionExpression: 'x > 1' });
    expect(stateMock.updateEdgeData).toHaveBeenCalledWith('edge-1', { conditionExpression: 'x > 1' });
  });

  it('uses one of the random condition placeholder examples', () => {
    const validPlaceholders = [
      'tabs.edges.condition_expression_placeholder_example_1',
      'tabs.edges.condition_expression_placeholder_example_2',
      'tabs.edges.condition_expression_placeholder_example_3',
    ];
    expect(validPlaceholders).toContain(component.conditionExpressionPlaceholder);
  });
});
