import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type AtomAvatarSize = 'sm' | 'md' | 'lg';

const SIZE_PX: Record<AtomAvatarSize, number> = { sm: 24, md: 40, lg: 48 };

@Component({
  selector: 'atom-avatar',
  standalone: true,
  template: `
    <div
      class="atom-avatar"
      [class]="'atom-avatar--' + size()"
      [style.background-color]="bgColor() ?? null"
    >
      @if (src()) {
        <img
          class="atom-avatar__img"
          [class.atom-avatar__img--contain]="contain()"
          [src]="src()"
          [alt]="alt()"
        />
      } @else if (initials()) {
        <span class="atom-avatar__initials" aria-hidden="true">{{ initials() }}</span>
      }
    </div>
  `,
  styles: `
    .atom-avatar {
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--atom-tag-neutral-bg, #e4e4e7);

      &--sm { width: 24px; height: 24px; }
      &--md { width: 40px; height: 40px; }
      &--lg { width: 48px; height: 48px; }
    }

    .atom-avatar__img {
      width: 100%;
      height: 100%;
      object-fit: cover;

      &--contain {
        width: 60%;
        height: 60%;
        object-fit: contain;
      }
    }

    .atom-avatar__initials {
      font: 600 11px/1 Inter, ui-sans-serif, system-ui, sans-serif;
      color: var(--atom-fg-tertiary, #52525c);
      text-transform: uppercase;
      user-select: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomAvatarComponent {
  readonly src      = input<string | null>(null);
  readonly alt      = input<string>('');
  readonly initials = input<string | null>(null);
  readonly bgColor  = input<string | null>(null);
  readonly contain  = input<boolean>(false);
  readonly size     = input<AtomAvatarSize>('md');
}
