import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ToolkitItem, ComposioToolItem } from '../model/agent-flow.model';

@Injectable()
export abstract class ComposioToolService {
  abstract listToolkits(): Observable<ToolkitItem[]>;
  abstract checkConnection(slug: string): Observable<{ isConnected: boolean }>;
  abstract authorize(slug: string): Observable<{ redirectUrl: string }>;
  abstract listTools(slug: string): Observable<ComposioToolItem[]>;
}
