import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import {
  AbIconComponent,
  AtomPaginationComponent,
  AtomStatusLabelComponent,
  AtomTagComponent,
} from '../../../../../../my-lib/public-api';
import { AtomSectionHeadingComponent } from '../../../shell/atom-section-heading.component';
import { TIPOS_EVENTO_MOCK } from './tipos-evento.mock';

@Component({
  selector: 'app-tipos-evento-page',
  standalone: true,
  imports: [
    AtomSectionHeadingComponent,
    AbIconComponent,
    MatButtonModule,
    AtomTagComponent,
    AtomStatusLabelComponent,
    AtomPaginationComponent,
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
