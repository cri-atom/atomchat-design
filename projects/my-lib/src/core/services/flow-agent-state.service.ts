import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FlowAgentData } from '../model/agent-flow.model';

@Injectable()
export abstract class FlowAgentStateService {
  abstract loadFlow(id: string): Observable<FlowAgentData>;
  abstract saveFlow(data: FlowAgentData): Observable<void>;
  abstract listFlows(): Observable<FlowAgentData[]>;
  abstract deleteFlow(id: string): Observable<void>;
  abstract createFlow(name: string): Observable<{ id: string }>;
}
