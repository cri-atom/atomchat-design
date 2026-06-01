import { Routes } from '@angular/router';
import { AgentBuilderPageComponent } from './pages/agentbuilder/agentbuilder-page.component';
import { AgentesListPageComponent } from './pages/campanas/agentes-list-page.component';
import { AgentWorkspaceLayoutComponent } from './pages/campanas/agent-workspace-layout.component';
import { MonitorDashboardComponent } from './pages/monitor/monitor-dashboard.component';
import { MonitorEvaluationsComponent } from './pages/monitor/monitor-evaluations.component';
import { MonitorHumanReviewComponent } from './pages/monitor/monitor-human-review.component';
import { MonitorPageComponent } from './pages/monitor/monitor-page.component';
import { MonitorPlaygroundComponent } from './pages/monitor/monitor-playground.component';
import { CalendariosPageComponent } from './pages/citas/calendarios/calendarios-page.component';
import { CrearEventoPageComponent } from './pages/citas/tipos-evento/crear-evento-page.component';
import { TiposEventoPageComponent } from './pages/citas/tipos-evento/tipos-evento-page.component';
import { AtomAppShellComponent } from './shell/atom-app-shell.component';
import { AtomPlaceholderPageComponent } from './shell/atom-placeholder-page.component';
import type { PageRouteData } from './shell/nav.model';

const ph = (title: string, description?: string): { data: PageRouteData } => ({
  data: { title, description },
});

export const routes: Routes = [
  {
    path: '',
    component: AtomAppShellComponent,
    children: [
      { path: '', redirectTo: 'citas/calendarios', pathMatch: 'full' },

      { path: 'inicio', component: AtomPlaceholderPageComponent, ...ph('Inicio', 'Panel principal') },
      {
        path: 'conversaciones',
        component: AtomPlaceholderPageComponent,
        ...ph('Conversaciones', 'Centro de conversaciones'),
      },
      { path: 'catalogo', component: AtomPlaceholderPageComponent, ...ph('Catálogo') },
      { path: 'soporte', component: AtomPlaceholderPageComponent, ...ph('Soporte') },
      { path: 'contactos', component: AtomPlaceholderPageComponent, ...ph('Contactos') },
      { path: 'permisos', component: AtomPlaceholderPageComponent, ...ph('Permisos') },
      { path: 'reportes-chat', component: AtomPlaceholderPageComponent, ...ph('Reportes de chat') },
      { path: 'chats', component: AtomPlaceholderPageComponent, ...ph('Chats') },
      { path: 'historial', component: AtomPlaceholderPageComponent, ...ph('Historial') },
      { path: 'ajustes', component: AtomPlaceholderPageComponent, ...ph('Ajustes') },

      { path: 'plataforma', component: AtomPlaceholderPageComponent, ...ph('Plataforma', 'Configuración general de la plataforma') },
      { path: 'llamadas', component: AtomPlaceholderPageComponent, ...ph('Llamadas', 'Gestión de llamadas') },
      { path: 'mensajeria', component: AtomPlaceholderPageComponent, ...ph('Mensajería', 'Canales de mensajería') },
      {
        path: 'conversaciones-mod',
        component: AtomPlaceholderPageComponent,
        ...ph('Conversaciones', 'Bandeja de conversaciones'),
      },
      { path: 'magia-atom', component: AtomPlaceholderPageComponent, ...ph('Magia de Atom', 'Herramientas de IA') },
      { path: 'usuarios', component: AtomPlaceholderPageComponent, ...ph('Gestión Usuarios', 'Usuarios y roles') },
      { path: 'reportes', component: AtomPlaceholderPageComponent, ...ph('Reportes', 'Reportes y analítica') },
      { path: 'empresa', component: AtomPlaceholderPageComponent, ...ph('Mi Empresa', 'Datos de la empresa') },
      { path: 'recursos', component: AtomPlaceholderPageComponent, ...ph('Gestor de recursos', 'Recursos compartidos') },

      {
        path: 'citas',
        children: [
          { path: '', redirectTo: 'calendarios', pathMatch: 'full' },
          {
            path: 'tipos-evento',
            children: [
              { path: '', component: TiposEventoPageComponent },
              { path: 'nuevo', component: CrearEventoPageComponent },
            ],
          },
          { path: 'calendarios', component: CalendariosPageComponent },
          { path: 'tipos-evento-legacy', redirectTo: 'tipos-evento', pathMatch: 'full' },
          {
            path: 'agendadas',
            component: AtomPlaceholderPageComponent,
            ...ph('Citas agendadas', 'Listado de citas agendadas'),
          },
        ],
      },

      {
        path: 'campanas',
        children: [
          { path: '', redirectTo: 'agentes', pathMatch: 'full' },
          { path: 'agentes', component: AgentesListPageComponent },
          {
            path: 'agentes/:agentId',
            component: AgentWorkspaceLayoutComponent,
            children: [
              { path: '', redirectTo: 'editor', pathMatch: 'full' },
              { path: 'editor', component: AgentBuilderPageComponent },
              {
                path: 'monitor',
                component: MonitorPageComponent,
                children: [
                  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
                  { path: 'dashboard', component: MonitorDashboardComponent },
                  { path: 'evaluaciones', component: MonitorEvaluationsComponent },
                  { path: 'revision', component: MonitorHumanReviewComponent },
                  { path: 'playground', component: MonitorPlaygroundComponent },
                ],
              },
            ],
          },
        ],
      },

      { path: 'agentbuilder', redirectTo: 'campanas/agentes/nuevo/editor', pathMatch: 'full' },
      { path: 'agentbuilder/**', redirectTo: 'campanas/agentes/nuevo/editor' },
      { path: '**', redirectTo: 'citas/calendarios' },
    ],
  },
];
