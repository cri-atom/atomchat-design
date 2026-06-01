import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AbIconComponent } from '../../../../../../../my-lib/public-api';
import type { CalendarioUsuarioRow } from '../calendario-usuario.model';
import { CalendariosStateService } from '../calendarios-state.service';

export interface DeactivateDialogData {
  user: CalendarioUsuarioRow;
}

@Component({
  selector: 'app-calendarios-desactivar-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    AbIconComponent,
  ],
  template: `
    <div class="citas-dialog citas-dialog--compact">
      <div class="citas-dialog__alert-body">
        <div class="citas-dialog__alert-icon">
          <ab-icon name="triangle-exclamation" variant="regular" size="md" />
        </div>
        <div class="citas-dialog__alert-content">
          <h2 class="citas-dialog__title">
            ¿Desactivar el calendario de
            <span class="citas-dialog__title-accent">{{ data.user.nombre }}</span>?
          </h2>
          <p class="citas-dialog__subtitle">
            Este usuario externo dejará de estar disponible para recibir nuevas reservas desde los
            flujos de WhatsApp.
          </p>

          @if (hasFutureAppointments()) {
            <div class="citas-dialog__future-block">
              <span class="citas-dialog__future-label">
                <span class="citas-dialog__future-dot"></span>
                El usuario tiene {{ data.user.citasFuturas }} citas futuras agendadas
              </span>
              <p class="citas-dialog__future-desc">
                Indica qué acción operativa debe tomar Atom con las citas existentes:
              </p>
              <div class="citas-dialog__radio-group">
                <label class="citas-dialog__radio">
                  <input
                    type="radio"
                    name="citasAction"
                    value="keep"
                    [ngModel]="action()"
                    (ngModelChange)="setAction($event)"
                  />
                  <span>
                    <strong>Mantener citas programadas</strong>
                    <small
                      >Las citas se conservan pero el calendario queda suspendido para nuevas
                      reservas.</small
                    >
                  </span>
                </label>
                <label class="citas-dialog__radio">
                  <input
                    type="radio"
                    name="citasAction"
                    value="cancel"
                    [ngModel]="action()"
                    (ngModelChange)="setAction($event)"
                  />
                  <span>
                    <strong>Cancelar citas futuras</strong>
                    <small
                      >Se anularán de inmediato las citas correspondientes en la plataforma
                      Cal.diy.</small
                    >
                  </span>
                </label>
              </div>
              @if (action() === 'cancel') {
                <label class="citas-dialog__checkbox">
                  <input type="checkbox" [(ngModel)]="notifyWhatsApp" />
                  <span>Enviar notificación de cancelación por WhatsApp</span>
                </label>
              }
            </div>
          }
        </div>
      </div>

      <footer class="citas-dialog__footer citas-dialog__footer--end">
        <div class="citas-dialog__footer-actions">
          <button type="button" mat-stroked-button (click)="cancel()">Cancelar</button>
          <button type="button" mat-flat-button class="citas-dialog__danger" (click)="confirm()">
            Confirmar y desactivar
          </button>
        </div>
      </footer>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendariosDesactivarDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CalendariosDesactivarDialogComponent>);
  readonly data = inject<DeactivateDialogData>(MAT_DIALOG_DATA);
  private readonly state = inject(CalendariosStateService);
  private readonly snackBar = inject(MatSnackBar);

  readonly action = signal<'keep' | 'cancel'>('keep');
  notifyWhatsApp = false;

  hasFutureAppointments(): boolean {
    return (this.data.user.citasFuturas ?? 0) > 0;
  }

  setAction(value: 'keep' | 'cancel'): void {
    this.action.set(value);
    if (value === 'keep') {
      this.notifyWhatsApp = false;
    }
  }

  confirm(): void {
    this.state.deactivateUsuario(this.data.user.id, {
      cancelFuture: this.action() === 'cancel',
      notifyWhatsApp: this.notifyWhatsApp,
    });
    this.snackBar.open(`Calendario de ${this.data.user.nombre} desactivado.`, undefined, {
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
