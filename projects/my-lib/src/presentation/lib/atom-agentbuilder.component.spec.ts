import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { AtomAgentBuilderComponent } from './atom-agentbuilder.component';
import { FlowAgentActionsService } from '../../application/state/flow-agent-actions.service';
import { FlowAgentDefaultsService } from '../../application/state/flow-agent-defaults.service';
import { FlowAgentInternalStateService } from '../../application/state/flow-agent-internal-state.service';
import { FlowAgentValidationService } from '../../application/state/flow-agent-validation.service';
import { FlowAgentModeData } from '../../core/model/agent-flow.model';

describe('AtomAgentBuilderComponent', () => {
  let fixture: ComponentFixture<AtomAgentBuilderComponent>;
  let component: AtomAgentBuilderComponent;

  const stateMock = {
    currentFlowName$: new BehaviorSubject('Flow Demo'),
    nodes$: new BehaviorSubject([]),
    edges$: new BehaviorSubject([]),
    isFlowLoaded$: new BehaviorSubject(false),
    setSelectedNode: jasmine.createSpy('setSelectedNode'),
    setSelectedEdge: jasmine.createSpy('setSelectedEdge'),
    updateFlowName: jasmine.createSpy('updateFlowName'),
    resetToDefaults: jasmine.createSpy('resetToDefaults'),
  };

  const actionsMock = {
    unsavedChanges$: new BehaviorSubject(false),
    loadFlow: jasmine.createSpy('loadFlow'),
  };

  const validationMock = {
    validate: jasmine.createSpy('validate').and.returnValue([]),
  };

  beforeEach(async () => {
    TestBed.overrideComponent(AtomAgentBuilderComponent, {
      set: {
        template: '',
        providers: [
          { provide: FlowAgentDefaultsService, useValue: {} },
          { provide: FlowAgentInternalStateService, useValue: stateMock },
          { provide: FlowAgentValidationService, useValue: validationMock },
          { provide: FlowAgentActionsService, useValue: actionsMock },
        ],
      },
    });

    await TestBed.configureTestingModule({
      imports: [AtomAgentBuilderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AtomAgentBuilderComponent);
    component = fixture.componentInstance;

    stateMock.setSelectedNode.calls.reset();
    stateMock.setSelectedEdge.calls.reset();
    stateMock.updateFlowName.calls.reset();
    stateMock.resetToDefaults.calls.reset();
    actionsMock.loadFlow.calls.reset();
    validationMock.validate.calls.reset();
  });

  function setRequiredInputs(modeData: FlowAgentModeData): void {
    fixture.componentRef.setInput('flowAgentModeData', modeData);
    fixture.componentRef.setInput('user', {
      id: 'user-1',
      name: 'Dev User',
      email: 'dev@atom.com',
      companyId: 'company-1',
    });
  }

  it('loads an existing flow in edit mode when flow id is valid', () => {
    setRequiredInputs({ flowId: 'flow-1', mode: 'edit', sourceRoute: '/' });

    fixture.detectChanges();

    expect(actionsMock.loadFlow).toHaveBeenCalledWith('flow-1');
    expect(stateMock.resetToDefaults).not.toHaveBeenCalled();
  });

  it('starts with defaults in create mode even with sentinel flow id', () => {
    stateMock.isFlowLoaded$.next(false);
    setRequiredInputs({ flowId: 'start', mode: 'create', sourceRoute: '/' });

    fixture.detectChanges();

    expect(actionsMock.loadFlow).not.toHaveBeenCalled();
    expect(stateMock.resetToDefaults).toHaveBeenCalled();
    expect(stateMock.isFlowLoaded$.value).toBeTrue();
  });

  it('handles global settings collapse/open cycle', () => {
    component.onGlobalSettingsCollapsedChange(true);
    expect(component.isGlobalSettingsCollapsed()).toBeTrue();

    component.onGlobalSettingsCollapsedTransitionDone();
    expect(component.showGlobalSettingsOpenButton()).toBeTrue();

    component.openGlobalSettings();
    expect(component.isGlobalSettingsCollapsed()).toBeFalse();
    expect(component.showGlobalSettingsOpenButton()).toBeFalse();
  });

  it('selects node target and focuses editor', () => {
    const focusOnTarget = jasmine.createSpy('focusOnTarget');
    (component as any).editor = { focusOnTarget };
    component.showValidationMenu = true;

    component.selectErrorTarget('node-1', 'node');

    expect(stateMock.setSelectedNode).toHaveBeenCalledWith('node-1');
    expect(stateMock.setSelectedEdge).toHaveBeenCalledWith(null);
    expect(focusOnTarget).toHaveBeenCalledWith('node-1', 'node');
    expect(component.showValidationMenu).toBeFalse();
  });

  it('saves trimmed flow name only when not empty', () => {
    component.saveName('  Mi flujo  ');
    component.saveName('   ');

    expect(stateMock.updateFlowName).toHaveBeenCalledTimes(1);
    expect(stateMock.updateFlowName).toHaveBeenCalledWith('Mi flujo');
    expect(component.editingName()).toBeFalse();
  });
});
