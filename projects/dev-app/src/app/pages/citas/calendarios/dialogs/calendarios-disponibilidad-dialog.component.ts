import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  createDefaultDisponibilidad,
  type CalendarioDisponibilidad,
  type CalendarioUsuarioRow,
} from '../calendario-usuario.model';
import { CalendariosStateService } from '../calendarios-state.service';
import { CitasWeeklyAvailabilityEditorComponent } from '../../shared/citas-weekly-availability-editor.component';

export interface DisponibilidadDialogData {
  user: CalendarioUsuarioRow;
}

@Component({
  selector: 'app-calendarios-disponibilidad-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    CitasWeeklyAvailabilityEditorComponent,
  ],
  template: `
    <div class="citas-dialog">
      <header class="citas-dialog__header">
        <div>
          <h2 class="citas-dialog__title">Configurar disponibilidad</h2>
          <p class="citas-dialog__subtitle">
            Establece la zona horaria y disponibilidad de
            <strong>{{ data.user.nombre }}</strong>.
          </p>
        </div>
        <button type="button" class="citas-dialog__close" (click)="cancel()" aria-label="Cerrar">
          ×
        </button>
      </header>

      <div class="citas-dialog__body">
        <citas-weekly-availability-editor [formControl]="disponibilidadControl" />
      </div>

      <footer class="citas-dialog__footer citas-dialog__footer--end">
        <div class="citas-dialog__footer-actions">
          <button type="button" mat-stroked-button (click)="cancel()">Cancelar</button>
          <button type="button" mat-flat-button class="citas-dialog__primary" (click)="save()">
            Guardar disponibilidad
          </button>
        </div>
      </footer>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendariosDisponibilidadDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CalendariosDisponibilidadDialogComponent>);
  readonly data = inject<DisponibilidadDialogData>(MAT_DIALOG_DATA);
  private readonly state = inject(CalendariosStateService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  readonly disponibilidadControl = this.fb.nonNullable.control<CalendarioDisponibilidad>(
    this.data.user.disponibilidad ?? createDefaultDisponibilidad(),
  );

  save(): void {
    this.state.updateDisponibilidad(this.data.user.id, this.disponibilidadControl.value);
    this.snackBar.open('Configuración de disponibilidad guardada exitosamente.', undefined, {
      duration: 4000,
      horizontalPosition: 'left',
      verticalPosition: 'bottom',
      panelClass: 'citas-snackbar',
    });
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
