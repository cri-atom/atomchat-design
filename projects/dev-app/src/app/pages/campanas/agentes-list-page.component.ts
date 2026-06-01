import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AtomSectionHeadingComponent } from '../../shell/atom-section-heading.component';

interface AgentRow {
  id: string;
  name: string;
  status: string;
  updatedAt: string;
}

@Component({
  selector: 'app-agentes-list-page',
  standalone: true,
  imports: [AtomSectionHeadingComponent, MatButtonModule],
  template: `
    <atom-section-heading
      title="Agentes"
      description="Agentes de IA para tus campañas"
    />
    <div class="agentes-list">
      <div class="agentes-list__toolbar">
        <button mat-flat-button type="button" (click)="createAgent()">Crear agente</button>
      </div>
      <table class="agentes-list__table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Última actualización</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          @for (row of agents; track row.id) {
            <tr>
              <td>{{ row.name }}</td>
              <td>{{ row.status }}</td>
              <td>{{ row.updatedAt }}</td>
              <td>
                <button mat-button type="button" (click)="openAgent(row.id)">Editar</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      background: #fff;
    }

    .agentes-list {
      flex: 1;
      padding: 0 16px 16px;
      overflow: auto;
    }

    .agentes-list__toolbar {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 16px;
    }

    .agentes-list__table {
      width: 100%;
      border-collapse: collapse;
      font: var(--atom-font-nav-sublabel);
      color: var(--atom-fg-primary);

      th,
      td {
        padding: 12px 8px;
        text-align: left;
        border-bottom: 1px solid var(--atom-border-divider);
      }

      th {
        font: var(--atom-font-nav-label);
        color: var(--atom-content-tertiary);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentesListPageComponent {
  private readonly router = inject(Router);

  readonly agents: AgentRow[] = [
    { id: 'agent-1', name: 'Agente de soporte', status: 'Borrador', updatedAt: '28 may 2026' },
    { id: 'agent-2', name: 'Agente de ventas', status: 'Publicado', updatedAt: '25 may 2026' },
  ];

  createAgent(): void {
    void this.router.navigate(['/campanas/agentes/nuevo/editor']);
  }

  openAgent(id: string): void {
    void this.router.navigate(['/campanas/agentes', id, 'editor']);
  }
}
