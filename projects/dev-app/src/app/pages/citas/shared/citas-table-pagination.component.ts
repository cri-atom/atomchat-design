import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AbIconComponent } from '../../../../../../my-lib/public-api';

export type CitasPaginationMode = 'pages' | 'range';

@Component({
  selector: 'citas-table-pagination',
  standalone: true,
  imports: [AbIconComponent],
  template: `
    <footer class="citas-pagination" [class.citas-pagination--range]="mode() === 'range'">
      <div class="citas-pagination__left">
        <span class="citas-pagination__label">Registros por página</span>
        <select class="citas-pagination__select" [value]="pageSize()" disabled>
          <option [value]="pageSize()">{{ pageSize() }}</option>
        </select>
      </div>

      @if (mode() === 'pages') {
        <span class="citas-pagination__center">Página {{ page() }} de {{ totalPages() }}</span>
      } @else {
        <span class="citas-pagination__center">{{ rangeLabel() }}</span>
      }

      <div class="citas-pagination__nav">
        <button type="button" class="citas-pagination__btn" [disabled]="!canFirst()" aria-label="Primera página">
          <ab-icon name="angles-left" variant="regular" size="sm" />
        </button>
        <button type="button" class="citas-pagination__btn" [disabled]="!canPrev()" aria-label="Página anterior">
          <ab-icon [name]="mode() === 'pages' ? 'arrow-left' : 'chevron-left'" variant="regular" size="sm" />
        </button>
        <button type="button" class="citas-pagination__btn" [disabled]="!canNext()" aria-label="Página siguiente">
          <ab-icon [name]="mode() === 'pages' ? 'arrow-right' : 'chevron-right'" variant="regular" size="sm" />
        </button>
        <button type="button" class="citas-pagination__btn" [disabled]="!canLast()" aria-label="Última página">
          <ab-icon name="angles-right" variant="regular" size="sm" />
        </button>
      </div>
    </footer>
  `,
  styles: `
    .citas-pagination {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: var(--atom-paginator-height);
      padding: 8px 16px;
      border-top: 0.5px solid var(--color-border-secondary, #d4d4d8);
      background: #fff;
      flex-shrink: 0;
    }

    .citas-pagination--range {
      justify-content: flex-end;
      gap: 32px;

      .citas-pagination__left {
        margin-right: auto;
      }
    }

    .citas-pagination__left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .citas-pagination__label {
      font: var(--atom-font-nav-sublabel);
      color: var(--atom-fg-primary);
      white-space: nowrap;
    }

    .citas-pagination__select {
      height: 32px;
      min-width: 66px;
      padding: 8px;
      border: 1px solid var(--color-border-secondary, #d4d4d8);
      border-radius: 8px;
      font: var(--atom-font-nav-sublabel);
      color: var(--color-fg-tertiary, #52525c);
      background: #fff;
    }

    .citas-pagination__center {
      font: var(--atom-font-nav-sublabel);
      color: var(--atom-fg-primary);
      white-space: nowrap;
    }

    .citas-pagination__nav {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .citas-pagination__btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 8px;
      border: 1px solid transparent;
      border-radius: 8px;
      background: var(--color-bg-tertiary, #f4f4f5);
      color: var(--color-fg-disabled, #9f9fa9);
      cursor: pointer;

      &:not(:disabled) {
        background: #fff;
        border-color: var(--color-border-secondary, #d4d4d8);
        color: var(--atom-fg-primary);
      }

      &:disabled {
        cursor: default;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CitasTablePaginationComponent {
  readonly mode = input<CitasPaginationMode>('pages');
  readonly pageSize = input(10);
  readonly page = input(1);
  readonly totalPages = input(5);
  readonly rangeLabel = input('1-11 de 11 items');
  readonly canFirst = input(false);
  readonly canPrev = input(false);
  readonly canNext = input(true);
  readonly canLast = input(true);
}
