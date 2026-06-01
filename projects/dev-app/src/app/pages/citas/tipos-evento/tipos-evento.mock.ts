import type { TipoEventoRow } from './tipos-evento.model';

export const TIPOS_EVENTO_MOCK: TipoEventoRow[] = [
  {
    id: '1',
    nombre: 'Demo 45 min: Cómo recibir reservas en tu negocio',
    duracion: '45 m',
    grupo: 'BDR',
    status: 'publicado',
  },
  {
    id: '2',
    nombre: 'Cita Médica',
    duracion: '30 m',
    grupo: 'Administración',
    status: 'publicado',
  },
  {
    id: '3',
    nombre: 'Visita Terreno',
    duracion: '1 h',
    grupo: 'Atención',
    status: 'publicado',
  },
  {
    id: '4',
    nombre: 'Prueba',
    duracion: '1 d',
    grupo: 'Administración',
    status: 'borrador',
  },
];
