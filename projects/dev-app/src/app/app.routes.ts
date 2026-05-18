import { Routes } from '@angular/router';
import { IndexPageComponent } from './pages/index/index.component';
import { AgentBuilderPageComponent } from './pages/agentbuilder/agentbuilder-page.component';

export const routes: Routes = [
  { path: '', component: IndexPageComponent },
  { path: 'agentbuilder', component: AgentBuilderPageComponent },
  { path: '**', redirectTo: '' },
];
