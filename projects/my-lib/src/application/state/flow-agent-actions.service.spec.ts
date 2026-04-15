import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { FlowAgentStateService } from '../../core/services/flow-agent-state.service';
import { FlowAgentInternalStateService } from './flow-agent-internal-state.service';
import { FlowAgentActionsService } from './flow-agent-actions.service';

describe('FlowAgentActionsService', () => {
  let service: FlowAgentActionsService;

  let stateMock: {
    nodes$: BehaviorSubject<any[]>;
    edges$: BehaviorSubject<any[]>;
    currentFlowName$: BehaviorSubject<string>;
    baseSystemPrompt$: BehaviorSubject<string>;
    isFlowLoaded$: BehaviorSubject<boolean>;
    currentFlowId$: BehaviorSubject<string | null>;
    setCurrentFlowId: jasmine.Spy;
    setFlowData: jasmine.Spy;
    resetToDefaults: jasmine.Spy;
    getFlowSnapshot: jasmine.Spy;
  };

  let flowStateMock: {
    loadFlow: jasmine.Spy;
    saveFlow: jasmine.Spy;
  };

  beforeEach(() => {
    stateMock = {
      nodes$: new BehaviorSubject<any[]>([]),
      edges$: new BehaviorSubject<any[]>([]),
      currentFlowName$: new BehaviorSubject<string>('Flow'),
      baseSystemPrompt$: new BehaviorSubject<string>('Prompt'),
      isFlowLoaded$: new BehaviorSubject<boolean>(false),
      currentFlowId$: new BehaviorSubject<string | null>(null),
      setCurrentFlowId: jasmine.createSpy('setCurrentFlowId'),
      setFlowData: jasmine.createSpy('setFlowData'),
      resetToDefaults: jasmine.createSpy('resetToDefaults'),
      getFlowSnapshot: jasmine.createSpy('getFlowSnapshot').and.returnValue({ id: 'flow-1', name: 'Flow', nodes: [], edges: [], baseSystemPrompt: '' }),
    };

    flowStateMock = {
      loadFlow: jasmine.createSpy('loadFlow').and.returnValue(of({ id: 'flow-1', name: 'Flow', nodes: [], edges: [], baseSystemPrompt: '' })),
      saveFlow: jasmine.createSpy('saveFlow').and.returnValue(of(void 0)),
    };

    TestBed.configureTestingModule({
      providers: [
        FlowAgentActionsService,
        { provide: FlowAgentInternalStateService, useValue: stateMock },
        { provide: FlowAgentStateService, useValue: flowStateMock },
        { provide: TranslocoService, useValue: { translate: (key: string) => key } },
      ],
    });

    service = TestBed.inject(FlowAgentActionsService);
  });

  it('loads flow successfully and stores data', () => {
    service.loadFlow('flow-1');

    expect(stateMock.setCurrentFlowId).toHaveBeenCalledWith('flow-1');
    expect(flowStateMock.loadFlow).toHaveBeenCalledWith('flow-1');
    expect(stateMock.setFlowData).toHaveBeenCalled();
  });

  it('skips backend load and resets defaults when flow id is invalid', () => {
    service.loadFlow('start');

    expect(stateMock.setCurrentFlowId).not.toHaveBeenCalled();
    expect(flowStateMock.loadFlow).not.toHaveBeenCalled();
    expect(stateMock.resetToDefaults).toHaveBeenCalled();
    expect(stateMock.isFlowLoaded$.value).toBeTrue();
  });

  it('resets to defaults when load fails', () => {
    flowStateMock.loadFlow.and.returnValue(throwError(() => new Error('load failed')));

    service.loadFlow('flow-2');

    expect(stateMock.resetToDefaults).toHaveBeenCalled();
    expect(stateMock.isFlowLoaded$.value).toBeTrue();
  });

  it('does not save when flow is not loaded or has no id', () => {
    stateMock.currentFlowId$.next(null);
    stateMock.isFlowLoaded$.next(false);

    service.saveFlow();

    expect(flowStateMock.saveFlow).not.toHaveBeenCalled();
  });

  it('saves flow and clears unsaved flag on success', () => {
    stateMock.currentFlowId$.next('flow-1');
    stateMock.isFlowLoaded$.next(true);
    service.unsavedChanges$.next(true);

    service.saveFlow();

    expect(flowStateMock.saveFlow).toHaveBeenCalled();
    expect(service.unsavedChanges$.value).toBeFalse();
  });

  it('marks flow as unsaved when graph changes after load', fakeAsync(() => {
    stateMock.isFlowLoaded$.next(true);

    stateMock.nodes$.next([{ id: 'node-1' }]);
    tick(1100);

    expect(service.unsavedChanges$.value).toBeTrue();
  }));
});
