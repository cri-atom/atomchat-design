import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'atom-header',
  standalone: true,
  templateUrl: './atom-header.component.html',
  styleUrl: './atom-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomHeaderComponent {
  readonly userName = 'Tom Chatt';
  readonly userInitials = 'TC';
}
