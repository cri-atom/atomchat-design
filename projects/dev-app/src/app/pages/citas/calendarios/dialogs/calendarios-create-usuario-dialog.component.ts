import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CalendariosStateService } from '../calendarios-state.service';
import {
  createDefaultDisponibilidad,
  GRUPOS_ATOM,
  type CalendarioDisponibilidad,
} from '../calendario-usuario.model';
import { CitasModalStepperComponent } from '../../shared/citas-modal-stepper.component';
import { CitasWeeklyAvailabilityEditorComponent } from '../../shared/citas-weekly-availability-editor.component';

@Component({
  selector: 'app-calendarios-create-usuario-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    CitasModalStepperComponent,
    CitasWeeklyAvailabilityEditorComponent,
  ],
  template: `
    <div class="citas-dialog">
      <header class="citas-dialog__header">
        <div>
          <h2 class="citas-dialog__title">Crear usuario externo</h2>
          <p class="citas-dialog__subtitle">
            Colaboradores sin inicio de sesión en Atom que solo reciben citas externas.
          </p>
        </div>
        <button type="button" class="citas-dialog__close" (click)="cancel()" aria-label="Cerrar">
          ×
        </button>
      </header>

      <citas-modal-stepper
        [activeStep]="step"
        [totalSteps]="2"
        [stepLabel]="step === 1 ? 'Paso 1 de 2: Información básica' : 'Paso 2 de 2: Disponibilidad semanal'"
      />

      <div class="citas-dialog__body">
        @if (step === 1) {
          <form class="citas-dialog__form" [formGroup]="basicForm">
            <div class="citas-dialog__grid">
              <mat-form-field appearance="outline" class="citas-dialog__field">
                <mat-label>Nombre *</mat-label>
                <input matInput formControlName="nombre" placeholder="Ej. Carlos" />
                @if (basicForm.controls.nombre.touched && basicForm.controls.nombre.invalid) {
                  <mat-error>El nombre es requerido</mat-error>
                }
              </mat-form-field>
              <mat-form-field appearance="outline" class="citas-dialog__field">
                <mat-label>Apellido *</mat-label>
                <input matInput formControlName="apellido" placeholder="Ej. Torres" />
                @if (basicForm.controls.apellido.touched && basicForm.controls.apellido.invalid) {
                  <mat-error>El apellido es requerido</mat-error>
                }
              </mat-form-field>
            </div>
            <div class="citas-dialog__grid">
              <div class="citas-dialog__phone-field">
                <label class="citas-dialog__phone-label">Teléfono (WhatsApp) *</label>
                <div class="citas-dialog__phone-row">
                  <span class="citas-dialog__phone-prefix">MX +52</span>
                  <mat-form-field appearance="outline" class="citas-dialog__field citas-dialog__field--phone">
                    <input matInput formControlName="telefono" placeholder="5512345678" />
                  </mat-form-field>
                </div>
                @if (basicForm.controls.telefono.touched && basicForm.controls.telefono.invalid) {
                  <span class="citas-dialog__hint citas-dialog__hint--error">El teléfono es requerido</span>
                } @else {
                  <span class="citas-dialog__hint">Requerido para el envío de flujos conversacionales.</span>
                }
              </div>
              <div>
                <mat-form-field appearance="outline" class="citas-dialog__field">
                  <mat-label>Correo electrónico *</mat-label>
                  <input matInput type="email" formControlName="correo" placeholder="correo@ejemplo.com" />
                  @if (basicForm.controls.correo.touched && basicForm.controls.correo.invalid) {
                    <mat-error>Correo válido requerido</mat-error>
                  }
                </mat-form-field>
                <span class="citas-dialog__hint">Obligatorio para la sincronización con Cal.diy.</span>
              </div>
            </div>
            <mat-form-field appearance="outline" class="citas-dialog__field">
              <mat-label>Cargo en la empresa (Opcional)</mat-label>
              <input matInput formControlName="cargo" placeholder="Ej. Médico General, Asesor Comercial" />
            </mat-form-field>
            <mat-form-field appearance="outline" class="citas-dialog__field">
              <mat-label>Grupos de Atom *</mat-label>
              <mat-select formControlName="grupos" placeholder="Selecciona un grupo asignado...">
                @for (g of gruposOptions; track g) {
                  <mat-option [value]="g">{{ g }}</mat-option>
                }
              </mat-select>
              @if (basicForm.controls.grupos.touched && basicForm.controls.grupos.invalid) {
                <mat-error>Selecciona un grupo</mat-error>
              }
            </mat-form-field>
          </form>
        } @else {
          <citas-weekly-availability-editor [formControl]="disponibilidadControl" />
        }
      </div>

      <footer class="citas-dialog__footer">
        @if (step === 2) {
          <button type="button" mat-stroked-button (click)="prevStep()">Volver</button>
        } @else {
          <span></span>
        }
        <div class="citas-dialog__footer-actions">
          <button type="button" mat-stroked-button (click)="cancel()">Cancelar</button>
          @if (step === 1) {
            <button type="button" mat-flat-button class="citas-dialog__primary" (click)="nextStep()">
              Continuar a disponibilidad
            </button>
          } @else {
            <button type="button" mat-flat-button class="citas-dialog__primary" (click)="submit()">
              Crear y activar calendario
            </button>
          }
        </div>
      </footer>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendariosCreateUsuarioDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CalendariosCreateUsuarioDialogComponent>);
  private readonly state = inject(CalendariosStateService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  step = 1;
  readonly gruposOptions = GRUPOS_ATOM;

  readonly basicForm = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    telefono: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    cargo: [''],
    grupos: ['', Validators.required],
  });

  readonly disponibilidadControl = this.fb.nonNullable.control<CalendarioDisponibilidad>(
    createDefaultDisponibilidad(),
  );

  nextStep(): void {
    this.basicForm.markAllAsTouched();
    if (this.basicForm.invalid) return;
    this.step = 2;
  }

  prevStep(): void {
    this.step = 1;
  }

  submit(): void {
    const basic = this.basicForm.getRawValue();
    const user = this.state.createUsuarioExterno({
      ...basic,
      grupos: [basic.grupos],
      disponibilidad: this.disponibilidadControl.value,
    });
    this.snackBar.open(`Calendario creado con éxito para ${user.nombre}.`, undefined, {
      duration: 4000,
      horizontalPosition: 'left',
      verticalPosition: 'bottom',
      panelClass: 'citas-snackbar',
    });
    this.dialogRef.close(user);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
