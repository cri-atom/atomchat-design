import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import {
  AtomCardComponent,
  AtomStepperComponent,
  type AtomStepperStep,
} from '../../../../../../my-lib/public-api';
import { AtomSectionHeadingComponent } from '../../../shell/atom-section-heading.component';

const STEPS: AtomStepperStep[] = [
  { id: 'identificacion', label: 'Identificación de evento' },
  { id: 'disponibilidad', label: 'Disponibilidad' },
  { id: 'limites', label: 'Límites' },
  { id: 'whatsapp', label: 'WhatsApp Flow' },
];

@Component({
  selector: 'app-crear-evento-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    AtomSectionHeadingComponent,
    AtomStepperComponent,
    AtomCardComponent,
  ],
  templateUrl: './crear-evento-page.component.html',
  styleUrl: './crear-evento-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrearEventoPageComponent {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly steps = STEPS;

  readonly form = this.fb.group({
    nombre: [''],
    descripcion: [''],
    canal: [''],
    grupos: [''],
    duracion: ['0'],
    unidad: ['minutos (m)'],
  });

  readonly canales = ['WhatsApp Business', 'Canal web'];
  readonly gruposOptions = ['BDR', 'Administración', 'Atención'];
  readonly unidades = ['minutos (m)', 'horas (h)', 'días (d)'];

  goBack(): void {
    void this.router.navigate(['/citas/tipos-evento']);
  }
}
