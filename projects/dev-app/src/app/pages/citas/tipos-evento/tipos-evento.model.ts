export interface TipoEventoRow {
  id: string;
  nombre: string;
  duracion: string;
  grupo: string;
  status: 'publicado' | 'borrador';
}
