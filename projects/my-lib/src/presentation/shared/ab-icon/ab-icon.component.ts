import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AbIconName, resolveFaIconClass } from './ab-icon.registry';

export type AbIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AbIconVariant = 'solid' | 'regular';

/**
 * Font Awesome icon wrapper — única API de iconos en UI (logos de marca siguen en SVG).
 */
@Component({
  selector: 'ab-icon',
  standalone: true,
  template: `
    <i
      [class]="classes()"
      [attr.aria-hidden]="ariaHidden() ? 'true' : null"
      [attr.aria-label]="ariaLabel() ?? null"
      role="img"
    ></i>
  `,
  styleUrl: './ab-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AbIconComponent {
  readonly name = input.required<AbIconName>();
  readonly variant = input<AbIconVariant>('solid');
  readonly size = input<AbIconSize>('md');
  readonly ariaHidden = input(true);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly spin = input(false);

  readonly classes = computed(() => {
    const prefix = this.variant() === 'regular' ? 'fa-regular' : 'fa-solid';
    const faName = resolveFaIconClass(this.name());
    const parts = ['ab-icon', prefix, `fa-${faName}`, `ab-icon--${this.size()}`];
    if (this.spin()) {
      parts.push('fa-spin');
    }
    return parts.join(' ');
  });
}
