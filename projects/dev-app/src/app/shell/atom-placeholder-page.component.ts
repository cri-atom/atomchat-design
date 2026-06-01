import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AtomSectionHeadingComponent } from './atom-section-heading.component';
import type { PageRouteData } from './nav.model';

@Component({
  selector: 'atom-placeholder-page',
  standalone: true,
  imports: [AtomSectionHeadingComponent],
  template: `
    <atom-section-heading [title]="title" [description]="description" />
    <div class="atom-placeholder-page__slot"></div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      background: #fff;
    }

    .atom-placeholder-page__slot {
      flex: 1;
      min-height: 0;
      background: #fff;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomPlaceholderPageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly title = (this.route.snapshot.data as PageRouteData)['title'] ?? 'Módulo';
  readonly description = (this.route.snapshot.data as PageRouteData)['description'];
}
