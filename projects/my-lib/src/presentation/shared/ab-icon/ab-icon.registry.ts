import type { FaProIconName } from './ab-icon-names.generated';

/**
 * Semantic aliases → Font Awesome class suffix (without `fa-` prefix).
 * Use when the app name differs from the FA icon name (e.g. sparkles → wand-magic-sparkles).
 */
export const AB_ICON_ALIASES = {
  'address-card': 'address-card',
  'angles-left': 'angles-left',
  'angles-right': 'angles-right',
  'arrow-left': 'arrow-left',
  'bars': 'bars',
  'building': 'building',
  'bullhorn': 'bullhorn',
  'calendar-days': 'calendar-days',
  'chart-bar': 'chart-bar',
  'chart-column': 'chart-column',
  'comment': 'comment',
  'comment-dots': 'comment-dots',
  'comments': 'comments',
  'circle-question': 'circle-question',
  'arrow-right': 'arrow-right',
  'arrow-up-right-from-square': 'arrow-up-right-from-square',
  'book': 'book',
  'bookmark': 'bookmark',
  'chart-line': 'chart-line',
  'check': 'check',
  'chevron-down': 'chevron-down',
  'chevron-left': 'chevron-left',
  'chevron-right': 'chevron-right',
  'chevron-up': 'chevron-up',
  'circle-check': 'circle-check',
  'circle-info': 'circle-info',
  'circle-stop': 'circle-stop',
  'circle-xmark': 'circle-xmark',
  'clock': 'clock',
  'code': 'code',
  'copy': 'copy',
  'database': 'database',
  'ellipsis-vertical': 'ellipsis-vertical',
  'envelope': 'envelope',
  'headset': 'headset',
  'house': 'house',
  'id-card': 'id-card',
  'phone': 'phone',
  'users': 'users',
  'download': 'download',
  'expand': 'expand',
  'file': 'file',
  'file-lines': 'file-lines',
  'flag-checkered': 'flag-checkered',
  'folder-open': 'folder-open',
  'gear': 'gear',
  'grip-vertical': 'grip-vertical',
  'link': 'link',
  'list-check': 'list-check',
  'magnifying-glass': 'magnifying-glass',
  'magnifying-glass-minus': 'magnifying-glass-minus',
  'magnifying-glass-plus': 'magnifying-glass-plus',
  'mobile-screen': 'mobile-screen-button',
  'paper-plane': 'paper-plane',
  'pen': 'pen',
  'play': 'play',
  'plus': 'plus',
  'robot': 'robot',
  'rotate': 'rotate',
  'shapes': 'shapes',
  'sparkles': 'wand-magic-sparkles',
  'trash': 'trash',
  'triangle-exclamation': 'triangle-exclamation',
  'upload': 'upload',
  'wrench': 'wrench',
  'xmark': 'xmark',
  'floppy-disk': 'floppy-disk',
} as const;

/** @deprecated Use AB_ICON_ALIASES */
export const AB_ICON_FA_CLASS = AB_ICON_ALIASES;

export type AbIconAlias = keyof typeof AB_ICON_ALIASES;

/** Any Font Awesome Pro icon suffix, plus app-level aliases. */
export type AbIconName = FaProIconName | AbIconAlias;

export function resolveFaIconClass(name: AbIconName): string {
  const alias = AB_ICON_ALIASES[name as AbIconAlias];
  return alias ?? name;
}
