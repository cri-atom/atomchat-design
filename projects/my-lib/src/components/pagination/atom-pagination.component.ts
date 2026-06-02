import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AbIconComponent } from '../../presentation/shared/ab-icon';

export type AtomPaginationMode = 'pages' | 'range';

@Component({
  selector: 'atom-pagination',
  standalone: true,
  imports: [AbIconComponent],
  template: `
    <footer class="atom-pagination" [class.atom-pagination--range]="mode() === 'range'">
      <div class="atom-pagination__left">
        <span class="atom-pagination__label">Registros por página</span>
        <select class="atom-pagination__select" [value]="pageSize()" disabled>
          <option [value]="pageSize()">{{ pageSize() }}</option>
        </select>
      </div>

      @if (mode() === 'pages') {
        <span class="atom-pagination__center">Página {{ page() }} de {{ totalPages() }}</span>
      } @else {
        <span class="atom-pagination__center">{{ rangeLabel() }}</span>
      }

      <div class="atom-pagination__nav">
        <button type="button" class="atom-pagination__btn" [disabled]="!canFirst()" aria-label="Primera página" (click)="first.emit()">
          <ab-icon name="angles-left" variant="regular" size="sm" />
        </button>
        <button type="button" class="atom-pagination__btn" [disabled]="!canPrev()" aria-label="Página anterior" (click)="prev.emit()">
          <ab-icon [name]="mode() === 'pages' ? 'arrow-left' : 'chevron-left'" variant="regular" size="sm" />
        </button>
        <button type="button" class="atom-pagination__btn" [disabled]="!canNext()" aria-label="Página siguiente" (click)="next.emit()">
          <ab-icon [name]="mode() === 'pages' ? 'arrow-right' : 'chevron-right'" variant="regular" size="sm" />
        </button>
        <button type="button" class="atom-pagination__btn" [disabled]="!canLast()" aria-label="Última página" (click)="last.emit()">
          <ab-icon name="angles-right" variant="regular" size="sm" />
        </button>
      </div>
    </footer>
  `,
  styles: `
    .atom-pagination {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: var(--atom-paginator-height, 48px);
      padding: 8px 16px;
      border-top: 0.5px solid var(--atom-border-divider);
      background: #fff;
      flex-shrink: 0;
    }

    .atom-pagination--range {
      justify-content: flex-end;
      gap: 32px;

      .atom-pagination__left { margin-right: auto; }
    }

    .atom-pagination__left {
      display: flex;
      align-items: center;
      gap: var(--atom-space-lg, 16px);
    }

    .atom-pagination__label {
      font: var(--atom-font-nav-sublabel);
      color: var(--atom-fg-primary);
      white-space: nowrap;
    }

    .atom-pagination__select {
      height: 32px;
      min-width: 66px;
      padding: 8px;
      border: 1px solid var(--atom-border-divider);
      border-radius: var(--atom-radius-sm, 8px);
      font: var(--atom-font-nav-sublabel);
      color: var(--atom-fg-tertiary, #52525c);
      background: #fff;
    }

    .atom-pagination__center {
      font: var(--atom-font-nav-sublabel);
      color: var(--atom-fg-primary);
      white-space: nowrap;
    }

    .atom-pagination__nav {
      display: flex;
      align-items: center;
      gap: var(--atom-space-sm, 8px);
    }

    .atom-pagination__btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 8px;
      border: 1px solid transparent;
      border-radius: var(--atom-radius-sm, 8px);
      background: var(--atom-surface-data, #f4f4f5);
      color: var(--atom-fg-quaternary, #9f9fa9);
      cursor: pointer;

      &:not(:disabled) {
        background: #fff;
        border-color: var(--atom-border-divider);
        color: var(--atom-fg-primary);
      }

      &:disabled { cursor: default; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomPaginationComponent {
  readonly mode       = input<AtomPaginationMode>('pages');
  readonly pageSize   = input(10);
  readonly page       = input(1);
  readonly totalPages = input(1);
  readonly rangeLabel = input('');
  readonly canFirst   = input(false);
  readonly canPrev    = input(false);
  readonly canNext    = input(false);
  readonly canLast    = input(false);

  readonly first = output<void>();
  readonly prev  = output<void>();
  readonly next  = output<void>();
  readonly last  = output<void>();
}
