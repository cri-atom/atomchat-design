import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { FlowAgentInternalStateService } from '../../../../application/state/flow-agent-internal-state.service';
import { GlobalStage, GlobalSaveField, StageType } from '../../../../core/model/agent-flow.model';

type PipelineType = 'venta' | 'servicio';

const STAGE_ORDER: readonly StageType[] = ['Awareness', 'Lead', 'MQL', 'SQL', 'Opportunity', '-'];
const PREDEFINED_FIELDS: readonly string[] = ['Nombre', 'Apellido', 'Email', 'Teléfono', 'Empresa', 'Dirección', 'Ciudad', 'País'];

@Component({
  selector: 'flowagent-global-settings-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule, TranslocoModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatSlideToggleModule, MatExpansionModule, MatButtonModule,
  ],
  templateUrl: './global-settings-view.component.html',
  styleUrl: './global-settings-view.component.scss',
})
export class GlobalSettingsViewComponent {
  public readonly state = inject(FlowAgentInternalStateService);
  private readonly transloco = inject(TranslocoService);

  public readonly isCollapsed = signal(false);
  public readonly isFieldsOpen = signal(true);

  public readonly pipelineType = toSignal(this.state.pipelineType$, { initialValue: 'venta' as PipelineType });
  public readonly stagesVenta = toSignal(this.state.stagesVenta$, { initialValue: [] as GlobalStage[] });
  public readonly stagesServicio = toSignal(this.state.stagesServicio$, { initialValue: [] as GlobalStage[] });
  public readonly saveFields = toSignal(this.state.saveFields$, { initialValue: [] as GlobalSaveField[] });
  public readonly timezone = toSignal(this.state.timezone$, { initialValue: 'America/Argentina/Buenos_Aires' });

  public readonly currentStages = computed(() =>
    this.pipelineType() === 'venta' ? this.stagesVenta() : this.stagesServicio()
  );

  public readonly sortedStages = computed(() =>
    [...this.currentStages()].sort((a, b) => STAGE_ORDER.indexOf(a.type) - STAGE_ORDER.indexOf(b.type))
  );

  public readonly availableTypes = computed(() =>
    STAGE_ORDER.filter(type => !this.currentStages().some(s => s.type === type))
  );

  public readonly canAddStage = computed(() => this.availableTypes().length > 0);

  public readonly pipelineLabel = toSignal(
    this.state.pipelineType$.pipe(
      switchMap(type => this.transloco.selectTranslate(
        type === 'venta' ? 'global.pipeline.sales' : 'global.pipeline.service'
      ))
    ),
    { initialValue: '' }
  );

  public readonly canAddSaveField = computed(() =>
    this.saveFields().length < PREDEFINED_FIELDS.length
  );

  public readonly STAGE_ORDER = STAGE_ORDER;

  public readonly timezones: ReadonlyArray<{ value: string; label: string }> = [
    { value: 'America/Argentina/Buenos_Aires', label: 'Argentina - Buenos Aires' },
    { value: 'America/Bogota', label: 'Colombia - Bogotá' },
    { value: 'America/Lima', label: 'Perú - Lima' },
    { value: 'America/Santiago', label: 'Chile - Santiago' },
    { value: 'America/Mexico_City', label: 'México - Ciudad de México' },
    { value: 'America/Sao_Paulo', label: 'Brasil - São Paulo' },
    { value: 'America/New_York', label: 'EE.UU. - Nueva York' },
    { value: 'Europe/Madrid', label: 'España - Madrid' },
    { value: 'UTC', label: 'UTC' },
  ];

  public toggleCollapsed(): void { this.isCollapsed.update(v => !v); }
  public setPipeline(type: PipelineType): void { this.state.pipelineType$.next(type); }

  public addStage(): void {
    const available = this.availableTypes();
    if (available.length === 0) return;

    const newStage: GlobalStage = {
      id: Date.now().toString(),
      name: available[0],
      type: available[0],
      condition: '',
    };
    if (this.pipelineType() === 'venta') {
      this.state.stagesVenta$.next([...this.state.stagesVenta$.value, newStage]);
    } else {
      this.state.stagesServicio$.next([...this.state.stagesServicio$.value, newStage]);
    }
  }

  public updateStage(id: string, field: keyof GlobalStage, value: string): void {
    if (field === 'type' && this.isTypeUsed(value as StageType, id)) {
      return;
    }

    const apply = (stages: GlobalStage[]) => stages.map(s => s.id === id ? { ...s, [field]: value } : s);
    if (this.pipelineType() === 'venta') {
      this.state.stagesVenta$.next(apply(this.state.stagesVenta$.value));
    } else {
      this.state.stagesServicio$.next(apply(this.state.stagesServicio$.value));
    }
  }

  public removeStage(id: string): void {
    const apply = (stages: GlobalStage[]) => stages.filter(s => s.id !== id);
    if (this.pipelineType() === 'venta') {
      this.state.stagesVenta$.next(apply(this.state.stagesVenta$.value));
    } else {
      this.state.stagesServicio$.next(apply(this.state.stagesServicio$.value));
    }
  }

  public addSaveField(): void {
    const firstAvailable = PREDEFINED_FIELDS.find(
      label => !this.state.saveFields$.value.some(f => f.label === label)
    );
    if (!firstAvailable) return;
    const newField: GlobalSaveField = { id: Date.now().toString(), label: firstAvailable };
    this.state.saveFields$.next([...this.state.saveFields$.value, newField]);
  }

  public removeSaveField(id: string): void {
    this.state.saveFields$.next(this.state.saveFields$.value.filter(f => f.id !== id));
  }

  public saveFieldOptions(fieldId: string): string[] {
    const selectedByOthers = new Set(
      this.state.saveFields$.value
        .filter(f => f.id !== fieldId)
        .map(f => f.label)
        .filter(label => PREDEFINED_FIELDS.includes(label))
    );
    return PREDEFINED_FIELDS.filter(option => !selectedByOthers.has(option));
  }

  public onSaveFieldChange(fieldId: string, label: string): void {
    this.state.saveFields$.next(
      this.state.saveFields$.value.map(f => f.id === fieldId ? { ...f, label } : f)
    );
  }

  public isTypeUsed(type: StageType, excludeId: string): boolean {
    return type !== '-' && this.currentStages().some(s => s.type === type && s.id !== excludeId);
  }

  public onTimezoneChange(tz: string): void { this.state.timezone$.next(tz); }

  public readonly preventInfiniteLoops = toSignal(this.state.preventInfiniteLoops$, { initialValue: false });
  public onPreventInfiniteLoopsChange(val: boolean): void { this.state.preventInfiniteLoops$.next(val); }
}
