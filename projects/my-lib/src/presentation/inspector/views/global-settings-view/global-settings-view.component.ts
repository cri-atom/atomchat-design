import { Component, ChangeDetectionStrategy, inject, signal, computed, input, output } from '@angular/core';
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
import { AbIconComponent } from '../../../shared/ab-icon/ab-icon.component';
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
    AbIconComponent,
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

  /** Whether the settings panel is in its collapsed (narrow) state. Defaults to `false`. */
  public readonly isCollapsed = input(false);
  /** Emits the new boolean state whenever the user toggles the collapse button. */
  public readonly isCollapsedChange = output<boolean>();
  /** Emits once after the CSS `width` transition finishes on collapse or expand. */
  public readonly collapsedTransitionDone = output<void>();
  /** Controls the expanded/collapsed state of the "Fields to save" expansion panel. */
  public readonly isFieldsOpen = signal(true);

  /** Current pipeline type (`'venta'` or `'servicio'`), synced from state. */
  public readonly pipelineType = toSignal(this.state.pipelineType$, { initialValue: 'venta' as PipelineType });
  /** Sales pipeline stages, synced from state. */
  public readonly stagesVenta = toSignal(this.state.stagesVenta$, { initialValue: [] as GlobalStage[] });
  /** Service pipeline stages, synced from state. */
  public readonly stagesServicio = toSignal(this.state.stagesServicio$, { initialValue: [] as GlobalStage[] });
  /** Global save-fields list, synced from state. */
  public readonly saveFields = toSignal(this.state.saveFields$, { initialValue: [] as GlobalSaveField[] });
  /** Active IANA timezone, synced from state. */
  public readonly timezone = toSignal(this.state.timezone$, { initialValue: 'America/Argentina/Buenos_Aires' });

  /**
   * The stages array for the currently active pipeline type.
   * Switches between `stagesVenta` and `stagesServicio` reactively.
   */
  public readonly currentStages = computed(() =>
    this.pipelineType() === 'venta' ? this.stagesVenta() : this.stagesServicio()
  );

  /**
   * A sorted copy of `currentStages` ordered according to the canonical funnel sequence
   * defined in `STAGE_ORDER` (Awareness → Lead → MQL → SQL → Opportunity → -).
   */
  public readonly sortedStages = computed(() =>
    [...this.currentStages()].sort((a, b) => STAGE_ORDER.indexOf(a.type) - STAGE_ORDER.indexOf(b.type))
  );

  /**
   * Stage types from `STAGE_ORDER` that have not yet been assigned to any stage
   * in the active pipeline, and are therefore available for the next `addStage()` call.
   */
  public readonly availableTypes = computed(() =>
    STAGE_ORDER.filter(type => !this.currentStages().some(s => s.type === type))
  );

  /**
   * `true` when at least one stage type in `STAGE_ORDER` is still unassigned,
   * i.e. the user is allowed to add another stage.
   */
  public readonly canAddStage = computed(() => this.availableTypes().length > 0);

  /**
   * Translated display label for the active pipeline type (e.g. `"Ventas"` or `"Servicio"`).
   * Updates reactively when the pipeline type changes or when the active locale changes.
   */
  public readonly pipelineLabel = toSignal(
    this.state.pipelineType$.pipe(
      switchMap(type => this.transloco.selectTranslate(
        type === 'venta' ? 'global.pipeline.sales' : 'global.pipeline.service'
      ))
    ),
    { initialValue: '' }
  );

  /**
   * `true` when the number of configured save-fields is below the total number
   * of predefined field options, meaning the user can still add more.
   */
  public readonly canAddSaveField = computed(() =>
    this.saveFields().length < PREDEFINED_FIELDS.length
  );

  /** Exposes the canonical stage order so the template can reference it without importing the constant. */
  public readonly STAGE_ORDER = STAGE_ORDER;

  /** IANA timezone options available for selection in the timezone dropdown. */
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

  /** Whether the infinite-loop prevention toggle is enabled, synced from state. */
  public readonly preventInfiniteLoops = toSignal(this.state.preventInfiniteLoops$, { initialValue: false });

  /**
   * Handles the container's CSS `transitionend` event.
   * Only reacts to the `width` property transition; other transitions are ignored.
   * Emits `collapsedTransitionDone` after the collapse animation finishes.
   *
   * @param event - The native `TransitionEvent` fired by the browser.
   */
  public onContainerTransitionEnd(event: TransitionEvent): void {
    if (event.propertyName !== 'width') return;
    if (this.isCollapsed()) {
      this.collapsedTransitionDone.emit();
    }
  }

  /**
   * Toggles the panel between collapsed and expanded state by emitting `isCollapsedChange`.
   */
  public toggleCollapsed(): void { this.isCollapsedChange.emit(!this.isCollapsed()); }

  /**
   * Sets the active pipeline type and persists it to state.
   *
   * @param type - The pipeline type to activate (`'venta'` or `'servicio'`).
   */
  public setPipeline(type: PipelineType): void { this.state.pipelineType$.next(type); }

  /**
   * Appends a new stage to the active pipeline using the first available stage type.
   * No-ops if all stage types are already in use.
   */
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

  /**
   * Updates a single field on an existing stage in the active pipeline.
   * Silently no-ops if the caller attempts to assign a `type` already in use by another stage.
   *
   * @param id - The ID of the stage to update.
   * @param field - The stage property key to modify.
   * @param value - The new string value to assign to the field.
   */
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

  /**
   * Removes a stage from the active pipeline.
   *
   * @param id - The ID of the stage to delete.
   */
  public removeStage(id: string): void {
    const apply = (stages: GlobalStage[]) => stages.filter(s => s.id !== id);
    if (this.pipelineType() === 'venta') {
      this.state.stagesVenta$.next(apply(this.state.stagesVenta$.value));
    } else {
      this.state.stagesServicio$.next(apply(this.state.stagesServicio$.value));
    }
  }

  /**
   * Adds the first available predefined field (one not yet used by any existing save-field row).
   * No-ops when all predefined fields are already added.
   */
  public addSaveField(): void {
    const firstAvailable = PREDEFINED_FIELDS.find(
      label => !this.state.saveFields$.value.some(f => f.label === label)
    );
    if (!firstAvailable) return;
    const newField: GlobalSaveField = { id: Date.now().toString(), label: firstAvailable };
    this.state.saveFields$.next([...this.state.saveFields$.value, newField]);
  }

  /**
   * Removes a save-field row by its ID.
   *
   * @param id - The ID of the save-field to remove.
   */
  public removeSaveField(id: string): void {
    this.state.saveFields$.next(this.state.saveFields$.value.filter(f => f.id !== id));
  }

  /**
   * Returns the subset of predefined field labels available for a specific save-field row.
   * Labels already selected by *other* rows are excluded to prevent duplicate assignments.
   *
   * @param fieldId - The ID of the save-field row requesting the options list.
   * @returns An array of label strings the user can choose for this row.
   */
  public saveFieldOptions(fieldId: string): string[] {
    const selectedByOthers = new Set(
      this.state.saveFields$.value
        .filter(f => f.id !== fieldId)
        .map(f => f.label)
        .filter(label => PREDEFINED_FIELDS.includes(label))
    );
    return PREDEFINED_FIELDS.filter(option => !selectedByOthers.has(option));
  }

  /**
   * Updates the label of a save-field row when the user selects a new option.
   *
   * @param fieldId - The ID of the row to update.
   * @param label - The newly selected predefined field label.
   */
  public onSaveFieldChange(fieldId: string, label: string): void {
    this.state.saveFields$.next(
      this.state.saveFields$.value.map(f => f.id === fieldId ? { ...f, label } : f)
    );
  }

  /**
   * Checks whether a given stage type is already assigned to another stage in the active pipeline.
   * The special `'-'` type is always considered available.
   *
   * @param type - The stage type to check.
   * @param excludeId - The ID of the stage currently being edited, excluded from the check.
   * @returns `true` when the type is in use by a different stage.
   */
  public isTypeUsed(type: StageType, excludeId: string): boolean {
    return type !== '-' && this.currentStages().some(s => s.type === type && s.id !== excludeId);
  }

  /**
   * Persists a new timezone selection to state.
   *
   * @param tz - IANA timezone identifier (e.g. `'America/Bogota'`).
   */
  public onTimezoneChange(tz: string): void { this.state.timezone$.next(tz); }

  /**
   * Persists the infinite-loop prevention toggle value to state.
   *
   * @param val - `true` to enable loop detection; `false` to disable it.
   */
  public onPreventInfiniteLoopsChange(val: boolean): void { this.state.preventInfiniteLoops$.next(val); }
}
