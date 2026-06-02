import { ChangeDetectionStrategy, Component, forwardRef, inject, input } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
  type AtomDisponibilidad,
  type AtomDiaSemana,
  ATOM_DIAS_SEMANA,
  ATOM_ZONAS_HORARIAS,
  createDefaultAtomDisponibilidad,
} from './atom-availability.model';

@Component({
  selector: 'atom-availability-editor',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AtomAvailabilityEditorComponent),
    multi: true,
  }],
  template: `
    <div class="atom-availability">
      <mat-form-field appearance="outline" class="atom-availability__field">
        <mat-label>Zona Horaria del usuario</mat-label>
        <mat-select [formControl]="zonaControl">
          @for (z of zonas; track z.value) {
            <mat-option [value]="z.value">{{ z.label }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <div class="atom-availability__week">
        <label class="atom-availability__week-label">Disponibilidad semanal</label>
        <div class="atom-availability__week-box">
          @for (dia of dias; track dia.key) {
            <div class="atom-availability__row" [class.atom-availability__row--disabled]="!getDayEnabled(dia.key)">
              <div class="atom-availability__day-toggle">
                <label class="atom-availability__toggle">
                  <input type="checkbox" [checked]="getDayEnabled(dia.key)" (change)="toggleDay(dia.key, $event)" />
                  <span class="atom-availability__toggle-track"></span>
                </label>
                <span class="atom-availability__day-name">{{ dia.label }}</span>
              </div>
              @if (getDayEnabled(dia.key)) {
                <div class="atom-availability__times">
                  <span class="atom-availability__time-label">Desde</span>
                  <input type="text" class="atom-availability__time-input" [value]="getDayDesde(dia.key)" (input)="setDayDesde(dia.key, $event)" />
                  <span class="atom-availability__time-label">Hasta</span>
                  <input type="text" class="atom-availability__time-input" [value]="getDayHasta(dia.key)" (input)="setDayHasta(dia.key, $event)" />
                </div>
              } @else {
                <span class="atom-availability__unavailable">No disponible para agendamiento</span>
              }
            </div>
          }
        </div>
      </div>

      <div class="atom-availability__exceptions">
        <div class="atom-availability__exceptions-header">
          <span class="atom-availability__week-label">Excepciones de fecha</span>
          <button type="button" class="atom-availability__add-btn" (click)="addExcepcion()">+ Agregar excepción</button>
        </div>
        @if (value.excepciones.length === 0) {
          <div class="atom-availability__exceptions-empty">No has configurado excepciones para feriados o vacaciones.</div>
        } @else {
          <div class="atom-availability__exceptions-list">
            @for (exc of value.excepciones; track exc.fecha; let i = $index) {
              <div class="atom-availability__exception-row">
                <input type="date" class="atom-availability__exception-date" [value]="exc.fecha" (input)="updateExcepcionFecha(i, $event)" />
                <input type="text" class="atom-availability__exception-motivo" placeholder="Motivo (opcional)" [value]="exc.motivo ?? ''" (input)="updateExcepcionMotivo(i, $event)" />
                <button type="button" class="atom-availability__exception-remove" (click)="removeExcepcion(i)" aria-label="Eliminar">×</button>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .atom-availability { display: flex; flex-direction: column; gap: 16px; }
    .atom-availability__field { width: 100%; }
    .atom-availability__week-label { display: block; margin-bottom: 8px; font: 500 12px/1.35 Inter, sans-serif; color: var(--atom-content-tertiary); letter-spacing: var(--atom-letter-nav); }
    .atom-availability__week-box { display: flex; flex-direction: column; gap: 8px; padding: 12px; border: 1px solid var(--atom-border-divider); border-radius: 8px; background: rgba(247,247,247,0.5); }
    .atom-availability__row { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 4px 0; font-size: 12px; &--disabled { opacity: 0.6; } }
    .atom-availability__day-toggle { display: flex; align-items: center; gap: 12px; min-width: 96px; }
    .atom-availability__day-name { font: 500 12px/1.25 Inter, sans-serif; color: var(--atom-fg-primary); }
    .atom-availability__row--disabled .atom-availability__day-name { color: var(--atom-fg-quaternary); }
    .atom-availability__toggle { position: relative; display: inline-flex; cursor: pointer; }
    .atom-availability__toggle input { position: absolute; opacity: 0; width: 0; height: 0; }
    .atom-availability__toggle-track { display: block; width: 32px; height: 16px; border-radius: 999px; background: var(--atom-tag-neutral-bg); transition: background 0.2s; &::after { content: ''; position: absolute; top: 2px; left: 2px; width: 12px; height: 12px; border-radius: 50%; background: #fff; border: 1px solid var(--atom-filter-border); transition: transform 0.2s; } }
    .atom-availability__toggle input:checked + .atom-availability__toggle-track { background: var(--atom-brand); &::after { transform: translateX(16px); border-color: #fff; } }
    .atom-availability__times { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .atom-availability__time-label { color: var(--atom-fg-quaternary); font: 400 12px/1.25 Inter, sans-serif; }
    .atom-availability__time-input { width: 80px; padding: 4px 8px; border: 1px solid var(--atom-filter-border); border-radius: 4px; font: 400 12px/1.25 Inter, sans-serif; text-align: center; color: var(--atom-fg-primary); background: #fff; &:focus { outline: none; border-color: var(--atom-brand); } }
    .atom-availability__unavailable { font: 400 12px/1.25 Inter, sans-serif; font-style: italic; color: var(--atom-fg-quaternary); }
    .atom-availability__exceptions-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
    .atom-availability__add-btn { border: none; background: none; padding: 0; font: 500 11px/1.35 Inter, sans-serif; color: var(--atom-brand); cursor: pointer; &:hover { text-decoration: underline; } }
    .atom-availability__exceptions-empty { padding: 12px; border: 1px dashed var(--atom-border-divider); border-radius: 8px; background: var(--atom-surface-data); font: 400 12px/1.35 Inter, sans-serif; font-style: italic; color: var(--atom-fg-quaternary); }
    .atom-availability__exceptions-list { display: flex; flex-direction: column; gap: 8px; }
    .atom-availability__exception-row { display: flex; align-items: center; gap: 8px; }
    .atom-availability__exception-date, .atom-availability__exception-motivo { padding: 6px 8px; border: 1px solid var(--atom-filter-border); border-radius: 4px; font: 400 12px/1.25 Inter, sans-serif; color: var(--atom-fg-primary); background: #fff; }
    .atom-availability__exception-date { width: 140px; }
    .atom-availability__exception-motivo { flex: 1; }
    .atom-availability__exception-remove { border: none; background: none; font-size: 18px; color: var(--atom-fg-quaternary); cursor: pointer; padding: 0 4px; &:hover { color: var(--atom-fg-primary); } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomAvailabilityEditorComponent implements ControlValueAccessor {
  private readonly fb = inject(FormBuilder);
  readonly compact = input(false);

  readonly dias  = ATOM_DIAS_SEMANA;
  readonly zonas = ATOM_ZONAS_HORARIAS;

  value: AtomDisponibilidad = createDefaultAtomDisponibilidad();
  readonly zonaControl = this.fb.nonNullable.control(this.value.zonaHoraria);

  private onChange: (v: AtomDisponibilidad) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    this.zonaControl.valueChanges.subscribe((zonaHoraria) => { this.patch({ zonaHoraria }); });
  }

  writeValue(value: AtomDisponibilidad | null): void {
    this.value = value ?? createDefaultAtomDisponibilidad();
    this.zonaControl.setValue(this.value.zonaHoraria, { emitEvent: false });
  }
  registerOnChange(fn: (v: AtomDisponibilidad) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  getDayEnabled(key: AtomDiaSemana): boolean  { return this.value.semana[key].enabled; }
  getDayDesde(key: AtomDiaSemana): string      { return this.value.semana[key].desde; }
  getDayHasta(key: AtomDiaSemana): string      { return this.value.semana[key].hasta; }

  toggleDay(key: AtomDiaSemana, event: Event): void {
    const enabled = (event.target as HTMLInputElement).checked;
    this.patch({ semana: { ...this.value.semana, [key]: { ...this.value.semana[key], enabled } } });
  }

  setDayDesde(key: AtomDiaSemana, event: Event): void {
    const desde = (event.target as HTMLInputElement).value;
    this.patch({ semana: { ...this.value.semana, [key]: { ...this.value.semana[key], desde } } });
  }

  setDayHasta(key: AtomDiaSemana, event: Event): void {
    const hasta = (event.target as HTMLInputElement).value;
    this.patch({ semana: { ...this.value.semana, [key]: { ...this.value.semana[key], hasta } } });
  }

  addExcepcion(): void {
    const today = new Date().toISOString().slice(0, 10);
    this.patch({ excepciones: [...this.value.excepciones, { fecha: today, motivo: '' }] });
  }

  updateExcepcionFecha(index: number, event: Event): void {
    const fecha = (event.target as HTMLInputElement).value;
    this.patch({ excepciones: this.value.excepciones.map((e, i) => i === index ? { ...e, fecha } : e) });
  }

  updateExcepcionMotivo(index: number, event: Event): void {
    const motivo = (event.target as HTMLInputElement).value;
    this.patch({ excepciones: this.value.excepciones.map((e, i) => i === index ? { ...e, motivo } : e) });
  }

  removeExcepcion(index: number): void {
    this.patch({ excepciones: this.value.excepciones.filter((_, i) => i !== index) });
  }

  private patch(partial: Partial<AtomDisponibilidad>): void {
    this.value = { ...this.value, ...partial };
    this.onChange(this.value);
    this.onTouched();
  }
}
