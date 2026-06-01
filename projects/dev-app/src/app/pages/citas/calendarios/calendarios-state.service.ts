import { computed, Injectable, signal } from '@angular/core';
import type {
  CalendarioDisponibilidad,
  CalendarioUsuarioEstado,
  CalendarioUsuarioRow,
  CalendarioUsuarioTipo,
  CreateUsuarioExternoPayload,
  EditUsuarioExternoPayload,
} from './calendario-usuario.model';
import { createDefaultDisponibilidad } from './calendario-usuario.model';
import { CALENDARIOS_MOCK } from './calendarios.mock';

export interface CalendariosFilters {
  search: string;
  tipo: 'todos' | CalendarioUsuarioTipo;
  estado: 'todos' | CalendarioUsuarioEstado;
}

@Injectable({ providedIn: 'root' })
export class CalendariosStateService {
  private readonly users = signal<CalendarioUsuarioRow[]>(
    CALENDARIOS_MOCK.map((u) => ({
      ...u,
      disponibilidad: u.disponibilidad ?? createDefaultDisponibilidad(),
    })),
  );

  readonly filters = signal<CalendariosFilters>({
    search: '',
    tipo: 'todos',
    estado: 'todos',
  });

  readonly allUsers = this.users.asReadonly();

  readonly filteredUsers = computed(() => {
    const { search, tipo, estado } = this.filters();
    const q = search.trim().toLowerCase();

    return this.users().filter((user) => {
      const matchesSearch =
        !q ||
        user.nombre.toLowerCase().includes(q) ||
        user.correo.toLowerCase().includes(q);
      const matchesTipo = tipo === 'todos' || user.tipo === tipo;
      const matchesEstado = estado === 'todos' || user.estado === estado;
      return matchesSearch && matchesTipo && matchesEstado;
    });
  });

  readonly visibleCount = computed(() => this.filteredUsers().length);

  setSearch(search: string): void {
    this.filters.update((f) => ({ ...f, search }));
  }

  setTipoFilter(tipo: CalendariosFilters['tipo']): void {
    this.filters.update((f) => ({ ...f, tipo }));
  }

  setEstadoFilter(estado: CalendariosFilters['estado']): void {
    this.filters.update((f) => ({ ...f, estado }));
  }

  getUserById(id: string): CalendarioUsuarioRow | undefined {
    return this.users().find((u) => u.id === id);
  }

  createUsuarioExterno(payload: CreateUsuarioExternoPayload): CalendarioUsuarioRow {
    const id = String(Date.now());
    const newUser: CalendarioUsuarioRow = {
      id,
      tipo: 'externo',
      nombre: `${payload.nombre} ${payload.apellido}`,
      telefono: payload.telefono.startsWith('+') ? payload.telefono : `+52 ${payload.telefono}`,
      correo: payload.correo,
      grupos: payload.grupos,
      tiposEvento: 1,
      estado: 'activo',
      disponibilidad: payload.disponibilidad,
    };
    this.users.update((list) => [...list, newUser]);
    return newUser;
  }

  updateUsuarioExterno(id: string, payload: EditUsuarioExternoPayload): void {
    this.users.update((list) =>
      list.map((u) =>
        u.id === id
          ? {
              ...u,
              nombre: `${payload.nombre} ${payload.apellido}`,
              telefono: payload.telefono,
              correo: payload.correo,
              grupos: payload.grupos,
            }
          : u,
      ),
    );
  }

  updateDisponibilidad(id: string, disponibilidad: CalendarioDisponibilidad): void {
    this.users.update((list) =>
      list.map((u) => (u.id === id ? { ...u, disponibilidad } : u)),
    );
  }

  deactivateUsuario(
    id: string,
    _options?: { cancelFuture?: boolean; notifyWhatsApp?: boolean },
  ): void {
    this.users.update((list) =>
      list.map((u) =>
        u.id === id ? { ...u, estado: 'desactivado' as const, citasFuturas: 0 } : u,
      ),
    );
  }

  reactivateUsuario(id: string): void {
    this.users.update((list) =>
      list.map((u) => (u.id === id ? { ...u, estado: 'activo' as const } : u)),
    );
  }
}
