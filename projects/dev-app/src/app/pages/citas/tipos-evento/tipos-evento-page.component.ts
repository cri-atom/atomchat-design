import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AbIconComponent } from '../../../../../../my-lib/public-api';
import { AtomSectionHeadingComponent } from '../../../shell/atom-section-heading.component';
import { CitasStatusLabelComponent } from '../shared/citas-status-label.component';
import { CitasTablePaginationComponent } from '../shared/citas-table-pagination.component';
import { CitasTagComponent } from '../shared/citas-tag.component';
import { TIPOS_EVENTO_MOCK } from './tipos-evento.mock';

@Component({
  selector: 'app-tipos-evento-page',
  standalone: true,
  imports: [
    AtomSectionHeadingComponent,
    AbIconComponent,
    MatButtonModule,
    CitasTagComponent,
    CitasStatusLabelComponent,
    CitasTablePaginationComponent,
  ],
  templateUrl: './tipos-evento-page.component.html',
  styleUrl: './tipos-evento-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TiposEventoPageComponent {
  private readonly router = inject(Router);
  readonly rows = TIPOS_EVENTO_MOCK;

  createEvent(): void {
    void this.router.navigate(['/citas/tipos-evento/nuevo']);
  }
}
