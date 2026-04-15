/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { GlobalSettingsViewComponent } from './global-settings-view.component';
import { FlowAgentInternalStateService } from '../../../../application/state/flow-agent-internal-state.service';

describe('GlobalSettingsViewComponent', () => {
  let fixture: ComponentFixture<GlobalSettingsViewComponent>;
  let component: GlobalSettingsViewComponent;

  const stateMock = {
    baseSystemPrompt$: new BehaviorSubject('Initial prompt'),
    pipelineType$: new BehaviorSubject<'venta' | 'servicio'>('venta'),
    stagesVenta$: new BehaviorSubject([]),
    stagesServicio$: new BehaviorSubject([]),
    saveFields$: new BehaviorSubject([]),
    timezone$: new BehaviorSubject('America/Argentina/Buenos_Aires'),
    preventInfiniteLoops$: new BehaviorSubject(false),
    updateBaseSystemPrompt: jasmine.createSpy('updateBaseSystemPrompt'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalSettingsViewComponent],
      providers: [{ provide: FlowAgentInternalStateService, useValue: stateMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalSettingsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('emits collapsed change on toggle', () => {
    const emitSpy = spyOn(component.isCollapsedChange, 'emit');

    component.toggleCollapsed();

    expect(emitSpy).toHaveBeenCalledWith(true);
  });

  it('switches pipeline type in state', () => {
    component.setPipeline('servicio');
    expect(stateMock.pipelineType$.value).toBe('servicio');
  });

  it('adds, updates and removes stage in current pipeline', () => {
    component.setPipeline('venta');
    component.addStage();
    expect(stateMock.stagesVenta$.value.length).toBe(1);

    const stageId = stateMock.stagesVenta$.value[0].id;
    component.updateStage(stageId, 'name', 'Etapa Calificada');
    expect(stateMock.stagesVenta$.value[0].name).toBe('Etapa Calificada');

    component.removeStage(stageId);
    expect(stateMock.stagesVenta$.value.length).toBe(0);
  });

  it('adds save field and updates selected option', () => {
    component.addSaveField();
    const fieldId = stateMock.saveFields$.value[0].id;

    component.onSaveFieldChange(fieldId, 'Email');

    expect(stateMock.saveFields$.value[0].label).toBe('Email');
    expect(component.saveFieldOptions(fieldId)).toContain('Nombre');
  });

  it('changes timezone in state', () => {
    component.onTimezoneChange('UTC');
    expect(stateMock.timezone$.value).toBe('UTC');
  });
});
