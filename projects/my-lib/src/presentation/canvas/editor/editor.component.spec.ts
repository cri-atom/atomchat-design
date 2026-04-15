import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { EditorComponent } from './editor.component';
import { FlowAgentInternalStateService } from '../../../application/state/flow-agent-internal-state.service';
import { FlowAgentDefaultsService } from '../../../application/state/flow-agent-defaults.service';
import { FlowAgentValidationService } from '../../../application/state/flow-agent-validation.service';
import { AgentNodeType } from '../../../core/model/agent-flow.model';
import { TranslocoService } from '@jsverse/transloco';

describe('EditorComponent', () => {
  let fixture: ComponentFixture<EditorComponent>;
  let component: EditorComponent;

  const stateMock = {
    nodes$: new BehaviorSubject<any[]>([]),
    edges$: new BehaviorSubject<any[]>([]),
    selectedNodeId$: new BehaviorSubject<string | null>(null),
    selectedEdgeId$: new BehaviorSubject<string | null>(null),
    setSelectedNode: jasmine.createSpy('setSelectedNode'),
    setSelectedEdge: jasmine.createSpy('setSelectedEdge'),
    deleteNode: jasmine.createSpy('deleteNode'),
    deleteEdge: jasmine.createSpy('deleteEdge'),
    addChildNode: jasmine.createSpy('addChildNode'),
    addEdge: jasmine.createSpy('addEdge'),
    getFlowSnapshot: jasmine.createSpy('getFlowSnapshot').and.returnValue({ name: 'Flow', nodes: [], edges: [] }),
    setFlowData: jasmine.createSpy('setFlowData'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorComponent],
      providers: [
        { provide: FlowAgentInternalStateService, useValue: stateMock },
        { provide: FlowAgentDefaultsService, useValue: { createEdge: jasmine.createSpy('createEdge') } },
        { provide: FlowAgentValidationService, useValue: { validate: jasmine.createSpy('validate').and.returnValue([]) } },
        { provide: TranslocoService, useValue: { translate: (k: string) => k } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
  });

  it('toggles fab menu visibility', () => {
    expect(component.showFabMenu).toBeFalse();
    component.toggleFabMenu();
    expect(component.showFabMenu).toBeTrue();
  });

  it('toggles chat visibility', () => {
    expect(component.isChatOpen).toBeFalse();
    component.toggleChat();
    expect(component.isChatOpen).toBeTrue();
  });

  it('allows adding end only when parent has no end child', () => {
    stateMock.nodes$.next([
      { id: 'parent', type: AgentNodeType.Agent, position: { x: 0, y: 0 }, data: { label: 'P' } },
      { id: 'agent-2', type: AgentNodeType.Agent, position: { x: 0, y: 0 }, data: { label: 'A2' } },
      { id: 'end-1', type: AgentNodeType.End, position: { x: 0, y: 0 }, data: { label: 'E1' } },
    ]);

    component.menuParentId = 'parent';
    stateMock.edges$.next([{ id: 'e1', source: 'parent', target: 'end-1', data: { label: '', conditionType: null } }]);
    expect(component.canAddEnd()).toBeFalse();

    stateMock.edges$.next([{ id: 'e2', source: 'parent', target: 'agent-2', data: { label: '', conditionType: null } }]);
    expect(component.canAddEnd()).toBeTrue();
  });

  it('allows connecting a parent to another agent child (e.g. duplicated node)', () => {
    stateMock.nodes$.next([
      { id: 'parent', type: AgentNodeType.Agent, position: { x: 0, y: 0 }, data: { label: 'P' } },
      { id: 'agent-1', type: AgentNodeType.Agent, position: { x: 100, y: 120 }, data: { label: 'A1' } },
      { id: 'agent-2', type: AgentNodeType.Agent, position: { x: 220, y: 120 }, data: { label: 'A2' } },
      { id: 'end-1', type: AgentNodeType.End, position: { x: 340, y: 120 }, data: { label: 'E1' } },
    ]);
    stateMock.edges$.next([
      { id: 'e1', source: 'parent', target: 'agent-1', data: { label: '', conditionType: null } },
      { id: 'e2', source: 'parent', target: 'end-1', data: { label: '', conditionType: null } },
    ]);

    expect((component as any).isValidDragTarget('parent', 'agent-2')).toBeTrue();
  });

  it('prevents connecting to a second end child from the same source', () => {
    stateMock.nodes$.next([
      { id: 'parent', type: AgentNodeType.Agent, position: { x: 0, y: 0 }, data: { label: 'P' } },
      { id: 'end-1', type: AgentNodeType.End, position: { x: 120, y: 120 }, data: { label: 'E1' } },
      { id: 'end-2', type: AgentNodeType.End, position: { x: 240, y: 120 }, data: { label: 'E2' } },
    ]);
    stateMock.edges$.next([
      { id: 'e1', source: 'parent', target: 'end-1', data: { label: '', conditionType: null } },
    ]);

    expect((component as any).isValidDragTarget('parent', 'end-2')).toBeFalse();
  });
});
