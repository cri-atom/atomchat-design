import type { CitasPublishStatus } from '../shared/citas-status-label.component';

export interface TipoEventoRow {
  id: string;
  nombre: string;
  duracion: string;
  grupo: string;
  status: CitasPublishStatus;
}
