import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'flowagent-start-node-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './start-node-view.component.html',
  styleUrl: './start-node-view.component.scss',
})
export class StartNodeViewComponent {}
