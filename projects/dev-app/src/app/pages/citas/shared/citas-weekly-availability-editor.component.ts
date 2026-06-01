import { ChangeDetectionStrategy, Component, forwardRef, inject, input } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
  type CalendarioDisponibilidad,
  createDefaultDisponibilidad,
  DIAS_SEMANA,
  ZONAS_HORARIAS,
} from '../calendarios/calendario-usuario.model';

@Component({
  selector: 'citas-weekly-availability-editor',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CitasWeeklyAvailabilityEditorComponent),
      multi: true,
    },
  ],
  template: `
    <div class="citas-availability">
      <mat-form-field appearance="outline" class="citas-availability__field">
        <mat-label>Zona Horaria del usuario</mat-label>
        <mat-select [formControl]="zonaControl">
          @for (z of zonas; track z.value) {
            <mat-option [value]="z.value">{{ z.label }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <div class="citas-availability__week">
        <label class="citas-availability__week-label">Disponibilidad semanal</label>
        <div class="citas-availability__week-box">
          @for (dia of dias; track dia.key) {
            <div
              class="citas-availability__row"
              [class.citas-availability__row--disabled]="!getDayEnabled(dia.key)"
            >
              <div class="citas-availability__day-toggle">
                <label class="citas-availability__toggle">
                  <input
                    type="checkbox"
                    [checked]="getDayEnabled(dia.key)"
                    (change)="toggleDay(dia.key, $event)"
                  />
                  <span class="citas-availability__toggle-track"></span>
                </label>
                <span class="citas-availability__day-name">{{ dia.label }}</span>
              </div>
              @if (getDayEnabled(dia.key)) {
                <div class="citas-availability__times">
                  <span class="citas-availability__time-label">Desde</span>
                  <input
                    type="text"
                    class="citas-availability__time-input"
                    [value]="getDayDesde(dia.key)"
                    (input)="setDayDesde(dia.key, $event)"
                  />
                  <span class="citas-availability__time-label">Hasta</span>
                  <input
                    type="text"
                    class="citas-availability__time-input"
                    [value]="getDayHasta(dia.key)"
                    (input)="setDayHasta(dia.key, $event)"
                  />
                </div>
              } @else {
                <span class="citas-availability__unavailable">No disponible para agendamiento</span>
              }
            </div>
          }
        </div>
      </div>

      <div class="citas-availability__exceptions">
        <div class="citas-availability__exceptions-header">
          <span class="citas-availability__week-label">Excepciones de fecha</span>
          <button type="button" class="citas-availability__add-btn" (click)="addExcepcion()">
            + Agregar excepción
          </button>
        </div>
        @if (value.excepciones.length === 0) {
          <div class="citas-availability__exceptions-empty">
            No has configurado excepciones para feriados o vacaciones.
          </div>
        } @else {
          <div class="citas-availability__exceptions-list">
            @for (exc of value.excepciones; track exc.fecha; let i = $index) {
              <div class="citas-availability__exception-row">
                <input
                  type="date"
                  class="citas-availability__exception-date"
                  [value]="exc.fecha"
                  (input)="updateExcepcionFecha(i, $event)"
                />
                <input
                  type="text"
                  class="citas-availability__exception-motivo"
                  placeholder="Motivo (opcional)"
                  [value]="exc.motivo ?? ''"
                  (input)="updateExcepcionMotivo(i, $event)"
                />
                <button
                  type="button"
                  class="citas-availability__exception-remove"
                  (click)="removeExcepcion(i)"
                  aria-label="Eliminar excepción"
                >
                  ×
                </button>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .citas-availability {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .citas-availability__field {
      width: 100%;
    }

    .citas-availability__week-label {
      display: block;
      margin-bottom: 8px;
      font: 500 12px/1.35 Inter, sans-serif;
      color: var(--atom-content-tertiary);
      letter-spacing: var(--atom-letter-nav);
    }

    .citas-availability__week-box {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      border: 1px solid var(--atom-border-divider);
      border-radius: 8px;
      background: rgba(247, 247, 247, 0.5);
    }

    .citas-availability__row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 4px 0;
      font-size: 12px;

      &--disabled {
        opacity: 0.6;
      }
    }

    .citas-availability__day-toggle {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 96px;
    }

    .citas-availability__day-name {
      font: 500 12px/1.25 Inter, sans-serif;
      color: var(--atom-fg-primary);
    }

    .citas-availability__row--disabled .citas-availability__day-name {
      color: var(--atom-fg-quaternary);
    }

    .citas-availability__toggle {
      position: relative;
      display: inline-flex;
      cursor: pointer;
    }

    .citas-availability__toggle input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    .citas-availability__toggle-track {
      display: block;
      width: 32px;
      height: 16px;
      border-radius: 999px;
      background: var(--atom-tag-neutral-bg);
      transition: background 0.2s;

      &::after {
        content: '';
        position: absolute;
        top: 2px;
        left: 2px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #fff;
        border: 1px solid var(--atom-filter-border);
        transition: transform 0.2s;
      }
    }

    .citas-availability__toggle input:checked + .citas-availability__toggle-track {
      background: var(--atom-brand);

      &::after {
        transform: translateX(16px);
        border-color: #fff;
      }
    }

    .citas-availability__times {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .citas-availability__time-label {
      color: var(--atom-fg-quaternary);
      font: 400 12px/1.25 Inter, sans-serif;
    }

    .citas-availability__time-input {
      width: 80px;
      padding: 4px 8px;
      border: 1px solid var(--atom-filter-border);
      border-radius: 4px;
      font: 400 12px/1.25 Inter, sans-serif;
      text-align: center;
      color: var(--atom-fg-primary);
      background: #fff;

      &:focus {
        outline: none;
        border-color: var(--atom-brand);
      }
    }

    .citas-availability__unavailable {
      font: 400 12px/1.25 Inter, sans-serif;
      font-style: italic;
      color: var(--atom-fg-quaternary);
    }

    .citas-availability__exceptions-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .citas-availability__add-btn {
      border: none;
      background: none;
      padding: 0;
      font: 500 11px/1.35 Inter, sans-serif;
      color: var(--atom-brand);
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }

    .citas-availability__exceptions-empty {
      padding: 12px;
      border: 1px dashed var(--atom-border-divider);
      border-radius: 8px;
      background: var(--atom-surface-data);
      font: 400 12px/1.35 Inter, sans-serif;
      font-style: italic;
      color: var(--atom-fg-quaternary);
    }

    .citas-availability__exceptions-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .citas-availability__exception-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .citas-availability__exception-date,
    .citas-availability__exception-motivo {
      padding: 6px 8px;
      border: 1px solid var(--atom-filter-border);
      border-radius: 4px;
      font: 400 12px/1.25 Inter, sans-serif;
      color: var(--atom-fg-primary);
      background: #fff;
    }

    .citas-availability__exception-date {
      width: 140px;
    }

    .citas-availability__exception-motivo {
      flex: 1;
    }

    .citas-availability__exception-remove {
      border: none;
      background: none;
      font-size: 18px;
      color: var(--atom-fg-quaternary);
      cursor: pointer;
      padding: 0 4px;

      &:hover {
        color: var(--atom-fg-primary);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CitasWeeklyAvailabilityEditorComponent implements ControlValueAccessor {
  private readonly fb = inject(FormBuilder);
  readonly compact = input(false);

  readonly dias = DIAS_SEMANA;
  readonly zonas = ZONAS_HORARIAS;

  value: CalendarioDisponibilidad = createDefaultDisponibilidad();
  readonly zonaControl = this.fb.nonNullable.control(this.value.zonaHoraria);

  private onChange: (v: CalendarioDisponibilidad) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    this.zonaControl.valueChanges.subscribe((zonaHoraria) => {
      this.patch({ zonaHoraria });
    });
  }

  writeValue(value: CalendarioDisponibilidad | null): void {
    this.value = value ?? createDefaultDisponibilidad();
    this.zonaControl.setValue(this.value.zonaHoraria, { emitEvent: false });
  }

  registerOnChange(fn: (v: CalendarioDisponibilidad) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  getDayEnabled(key: keyof CalendarioDisponibilidad['semana']): boolean {
    return this.value.semana[key].enabled;
  }

  getDayDesde(key: keyof CalendarioDisponibilidad['semana']): string {
    return this.value.semana[key].desde;
  }

  getDayHasta(key: keyof CalendarioDisponibilidad['semana']): string {
    return this.value.semana[key].hasta;
  }

  toggleDay(key: keyof CalendarioDisponibilidad['semana'], event: Event): void {
    const enabled = (event.target as HTMLInputElement).checked;
    this.patch({
      semana: {
        ...this.value.semana,
        [key]: { ...this.value.semana[key], enabled },
      },
    });
  }

  setDayDesde(key: keyof CalendarioDisponibilidad['semana'], event: Event): void {
    const desde = (event.target as HTMLInputElement).value;
    this.patch({
      semana: {
        ...this.value.semana,
        [key]: { ...this.value.semana[key], desde },
      },
    });
  }

  setDayHasta(key: keyof CalendarioDisponibilidad['semana'], event: Event): void {
    const hasta = (event.target as HTMLInputElement).value;
    this.patch({
      semana: {
        ...this.value.semana,
        [key]: { ...this.value.semana[key], hasta },
      },
    });
  }

  addExcepcion(): void {
    const today = new Date().toISOString().slice(0, 10);
    this.patch({
      excepciones: [...this.value.excepciones, { fecha: today, motivo: '' }],
    });
  }

  updateExcepcionFecha(index: number, event: Event): void {
    const fecha = (event.target as HTMLInputElement).value;
    const excepciones = this.value.excepciones.map((e, i) =>
      i === index ? { ...e, fecha } : e,
    );
    this.patch({ excepciones });
  }

  updateExcepcionMotivo(index: number, event: Event): void {
    const motivo = (event.target as HTMLInputElement).value;
    const excepciones = this.value.excepciones.map((e, i) =>
      i === index ? { ...e, motivo } : e,
    );
    this.patch({ excepciones });
  }

  removeExcepcion(index: number): void {
    this.patch({
      excepciones: this.value.excepciones.filter((_, i) => i !== index),
    });
  }

  private patch(partial: Partial<CalendarioDisponibilidad>): void {
    this.value = { ...this.value, ...partial };
    this.onChange(this.value);
    this.onTouched();
  }
}
