export type CalendarioUsuarioTipo = 'interno' | 'externo';
export type CalendarioUsuarioEstado = 'activo' | 'desactivado';
export type DiaSemana = 'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom';

export interface DisponibilidadDia {
  enabled: boolean;
  desde: string;
  hasta: string;
}

export interface CalendarioExcepcion {
  fecha: string;
  motivo?: string;
}

export interface CalendarioDisponibilidad {
  zonaHoraria: string;
  semana: Record<DiaSemana, DisponibilidadDia>;
  excepciones: CalendarioExcepcion[];
}

export interface CalendarioUsuarioRow {
  id: string;
  tipo: CalendarioUsuarioTipo;
  nombre: string;
  telefono: string;
  correo: string;
  grupos: string[];
  tiposEvento: number;
  estado: CalendarioUsuarioEstado;
  citasFuturas?: number;
  disponibilidad?: CalendarioDisponibilidad;
}

export interface CreateUsuarioExternoPayload {
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  cargo?: string;
  grupos: string[];
  disponibilidad: CalendarioDisponibilidad;
}

export interface EditUsuarioExternoPayload {
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  grupos: string[];
}

export const DIAS_SEMANA: { key: DiaSemana; label: string }[] = [
  { key: 'lun', label: 'Lunes' },
  { key: 'mar', label: 'Martes' },
  { key: 'mie', label: 'Miércoles' },
  { key: 'jue', label: 'Jueves' },
  { key: 'vie', label: 'Viernes' },
  { key: 'sab', label: 'Sábado' },
  { key: 'dom', label: 'Domingo' },
];

export const ZONAS_HORARIAS = [
  { value: 'America/Mexico_City', label: 'America/Mexico_City (GMT-6)' },
  { value: 'America/Bogota', label: 'America/Bogota (GMT-5)' },
  { value: 'America/Santiago', label: 'America/Santiago (GMT-4)' },
];

export const GRUPOS_ATOM = [
  'Atención al Cliente',
  'Ventas Vehículos Nuevos',
  'Soporte y Consultas Médicas',
  'Ventas Ecuador',
];

export function createDefaultDisponibilidad(): CalendarioDisponibilidad {
  const weekday: DisponibilidadDia = { enabled: true, desde: '09:00 AM', hasta: '05:00 PM' };
  const weekend: DisponibilidadDia = { enabled: false, desde: '09:00 AM', hasta: '05:00 PM' };
  return {
    zonaHoraria: 'America/Mexico_City',
    semana: {
      lun: { ...weekday },
      mar: { ...weekday },
      mie: { ...weekday },
      jue: { ...weekday },
      vie: { ...weekday },
      sab: { ...weekend },
      dom: { ...weekend },
    },
    excepciones: [],
  };
}
