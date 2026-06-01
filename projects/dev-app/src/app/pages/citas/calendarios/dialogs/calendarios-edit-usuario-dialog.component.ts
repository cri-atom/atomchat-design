import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { GRUPOS_ATOM, type CalendarioUsuarioRow } from '../calendario-usuario.model';
import { CalendariosStateService } from '../calendarios-state.service';

export interface EditUsuarioDialogData {
  user: CalendarioUsuarioRow;
}

@Component({
  selector: 'app-calendarios-edit-usuario-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="citas-dialog">
      <header class="citas-dialog__header">
        <div>
          <h2 class="citas-dialog__title">Editar datos del usuario</h2>
          <p class="citas-dialog__subtitle">
            Modifica los datos personales y asignaciones del usuario externo.
          </p>
        </div>
        <button type="button" class="citas-dialog__close" (click)="cancel()" aria-label="Cerrar">
          ×
        </button>
      </header>

      <div class="citas-dialog__body">
        <form class="citas-dialog__form" [formGroup]="form">
          <div class="citas-dialog__grid">
            <mat-form-field appearance="outline" class="citas-dialog__field">
              <mat-label>Nombre *</mat-label>
              <input matInput formControlName="nombre" />
            </mat-form-field>
            <mat-form-field appearance="outline" class="citas-dialog__field">
              <mat-label>Apellido *</mat-label>
              <input matInput formControlName="apellido" />
            </mat-form-field>
          </div>
          <div class="citas-dialog__grid">
            <mat-form-field appearance="outline" class="citas-dialog__field">
              <mat-label>Teléfono (WhatsApp) *</mat-label>
              <input matInput formControlName="telefono" />
            </mat-form-field>
            <mat-form-field appearance="outline" class="citas-dialog__field">
              <mat-label>Correo electrónico *</mat-label>
              <input matInput type="email" formControlName="correo" />
            </mat-form-field>
          </div>
          <mat-form-field appearance="outline" class="citas-dialog__field">
            <mat-label>Grupos de Atom *</mat-label>
            <mat-select formControlName="grupos">
              @for (g of gruposOptions; track g) {
                <mat-option [value]="g">{{ g }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </form>
      </div>

      <footer class="citas-dialog__footer citas-dialog__footer--end">
        <div class="citas-dialog__footer-actions">
          <button type="button" mat-stroked-button (click)="cancel()">Cancelar</button>
          <button type="button" mat-flat-button class="citas-dialog__primary" (click)="save()">
            Guardar cambios
          </button>
        </div>
      </footer>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendariosEditUsuarioDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CalendariosEditUsuarioDialogComponent>);
  private readonly data = inject<EditUsuarioDialogData>(MAT_DIALOG_DATA);
  private readonly state = inject(CalendariosStateService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  readonly gruposOptions = GRUPOS_ATOM;

  readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    telefono: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    grupos: ['', Validators.required],
  });

  constructor() {
    const { nombre, apellido } = this.splitNombre(this.data.user.nombre);
    this.form.patchValue({
      nombre,
      apellido,
      telefono: this.data.user.telefono,
      correo: this.data.user.correo,
      grupos: this.data.user.grupos[0] ?? '',
    });
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const value = this.form.getRawValue();
    this.state.updateUsuarioExterno(this.data.user.id, {
      ...value,
      grupos: [value.grupos],
    });
    this.snackBar.open('Datos de usuario actualizados correctamente.', undefined, {
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

  private splitNombre(full: string): { nombre: string; apellido: string } {
    const cleaned = full.replace(/^(Dr\.|Dra\.|Ing\.)\s+/, '');
    const parts = cleaned.split(' ');
    return {
      nombre: parts[0] ?? '',
      apellido: parts.slice(1).join(' '),
    };
  }
}
