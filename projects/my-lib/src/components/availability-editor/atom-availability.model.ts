export type AtomDiaSemana = 'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom';

export interface AtomDisponibilidadDia {
  enabled: boolean;
  desde: string;
  hasta: string;
}

export interface AtomDisponibilidadExcepcion {
  fecha: string;
  motivo?: string;
}

export interface AtomDisponibilidad {
  zonaHoraria: string;
  semana: Record<AtomDiaSemana, AtomDisponibilidadDia>;
  excepciones: AtomDisponibilidadExcepcion[];
}

export const ATOM_DIAS_SEMANA: { key: AtomDiaSemana; label: string }[] = [
  { key: 'lun', label: 'Lunes' },
  { key: 'mar', label: 'Martes' },
  { key: 'mie', label: 'Miércoles' },
  { key: 'jue', label: 'Jueves' },
  { key: 'vie', label: 'Viernes' },
  { key: 'sab', label: 'Sábado' },
  { key: 'dom', label: 'Domingo' },
];

export const ATOM_ZONAS_HORARIAS = [
  { value: 'America/Mexico_City', label: 'America/Mexico_City (GMT-6)' },
  { value: 'America/Bogota',      label: 'America/Bogota (GMT-5)' },
  { value: 'America/Santiago',    label: 'America/Santiago (GMT-4)' },
];

export function createDefaultAtomDisponibilidad(): AtomDisponibilidad {
  const weekday: AtomDisponibilidadDia = { enabled: true,  desde: '09:00 AM', hasta: '05:00 PM' };
  const weekend: AtomDisponibilidadDia = { enabled: false, desde: '09:00 AM', hasta: '05:00 PM' };
  return {
    zonaHoraria: 'America/Mexico_City',
    semana: {
      lun: { ...weekday }, mar: { ...weekday }, mie: { ...weekday },
      jue: { ...weekday }, vie: { ...weekday },
      sab: { ...weekend }, dom: { ...weekend },
    },
    excepciones: [],
  };
}
