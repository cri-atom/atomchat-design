import type { AbIconName } from '../../../../my-lib/public-api';

export type PrimaryRailId =
  | 'toggle'
  | 'inicio'
  | 'conversaciones'
  | 'catalogo'
  | 'soporte'
  | 'contactos'
  | 'permisos'
  | 'campanas'
  | 'reportes-chat'
  | 'chats'
  | 'historial'
  | 'ajustes'
  | 'ayuda';

export interface PrimaryRailItem {
  id: PrimaryRailId;
  icon: AbIconName;
  route?: string;
  title: string;
  action?: 'toggle' | 'help';
}

export interface SecondaryNavChild {
  id: string;
  label: string;
  route: string;
  title?: string;
  description?: string;
}

export interface SecondaryNavModule {
  id: string;
  label: string;
  icon: AbIconName;
  routePrefix: string;
  badge?: string;
  defaultChild?: string;
  children?: SecondaryNavChild[];
  title?: string;
  description?: string;
}

export interface PageRouteData {
  title: string;
  description?: string;
  moduleId?: string;
}
