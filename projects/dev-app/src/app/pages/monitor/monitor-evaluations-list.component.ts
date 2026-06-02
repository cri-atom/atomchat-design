import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { EVALUATION_ROWS } from './monitor-mock.data';
import { AtomChipComponent } from '../../../../../my-lib/public-api';
import { WorkspaceModeService } from '../../workspace/workspace-mode.service';

@Component({
  selector: 'app-monitor-evaluations-list',
  standalone: true,
  imports: [DecimalPipe, AtomChipComponent],
  template: `
    <div class="eval-list">
      <header class="eval-list__header">
        <h3>Evaluaciones</h3>
        <button type="button" class="eval-list__cta" (click)="openCreate()">+ Nueva</button>
      </header>
      <p class="eval-list__hint">Examen masivo antes de publicar a producción.</p>
      <ul class="eval-list__items">
        @for (row of rows; track row.name) {
          <li class="eval-list__item">
            <div class="eval-list__item-top">
              <strong>{{ row.name }}</strong>
              <atom-chip [variant]="chipVariant(row.origin)">{{ row.origin }}</atom-chip>
            </div>
            <div class="eval-list__meta">
              <span>{{ row.cases }} casos</span>
              <span>Score {{ row.score | number: '1.0%' }}</span>
              <atom-chip variant="success">{{ row.status }}</atom-chip>
            </div>
            <span class="eval-list__date">{{ row.date }}</span>
          </li>
        }
      </ul>
    </div>
  `,
  styles: `
    .eval-list {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: var(--ab-space-md);
    }
    .eval-list__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ab-space-sm);
      h3 {
        margin: 0;
        font: 600 14px/20px Inter, sans-serif;
      }
    }
    .eval-list__cta {
      padding: var(--ab-space-xs) var(--ab-space-sm);
      border: none;
      border-radius: var(--ab-radius-sm);
      background: var(--ab-brand-cta);
      color: #fff;
      font: 600 12px/16px Inter, sans-serif;
      cursor: pointer;
    }
    .eval-list__hint {
      margin: var(--ab-space-xs) 0 var(--ab-space-md);
      font: var(--ab-font-label);
      color: var(--ab-text-light);
    }
    .eval-list__items {
      margin: 0;
      padding: 0;
      list-style: none;
      overflow-y: auto;
    }
    .eval-list__item {
      padding: var(--ab-space-sm) 0;
      border-bottom: 1px solid var(--ab-border);
    }
    .eval-list__item-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--ab-space-xs);
      margin-bottom: var(--ab-space-xs);
      strong {
        font: 600 13px/16px Inter, sans-serif;
      }
    }
    .eval-list__meta {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ab-space-xs);
      font: var(--ab-font-label);
      color: var(--ab-text-muted);
      margin-bottom: 2px;
    }
    .eval-list__date {
      font: var(--ab-font-label);
      color: var(--ab-text-light);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitorEvaluationsListComponent {
  private readonly workspace = inject(WorkspaceModeService);
  readonly rows = EVALUATION_ROWS;

  openCreate(): void {
    this.workspace.openEvaluationsCreate();
  }

  chipVariant(origin: string): 'live' | 'fictional' {
    return origin === 'En vivo' ? 'live' : 'fictional';
  }
}
