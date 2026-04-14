import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';
import { FlowAgentData, AgentNodeType } from '../../core/model/agent-flow.model';
import { AppConfigService } from '../../core/services/app-config.service';
import { FlowAgentStateService } from '../../core/services/flow-agent-state.service';

@Injectable()
export class AgentBuilderFlowAgentStateServiceImpl extends FlowAgentStateService {
  private readonly http = inject(HttpClient);

  private readonly appConfig = inject(AppConfigService);

  override loadFlow(id: string): Observable<FlowAgentData> {
    return this.http
      .get<FlowAgentData>(`${this.getFlowBaseUrl()}/${id}`)
      .pipe(timeout(this.appConfig.configData.requestTimeoutMs));
  }

  override saveFlow(data: FlowAgentData): Observable<void> {
    return this.http
      .put<void>(`${this.getFlowBaseUrl()}/${data.id}`, data)
      .pipe(timeout(this.appConfig.configData.requestTimeoutMs));
  }

  override listFlows(): Observable<FlowAgentData[]> {
    return this.http
      .get<FlowAgentData[]>(this.getFlowBaseUrl())
      .pipe(timeout(this.appConfig.configData.requestTimeoutMs));
  }

  override deleteFlow(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.getFlowBaseUrl()}/${id}`)
      .pipe(timeout(this.appConfig.configData.requestTimeoutMs));
  }

  override createFlow(name: string): Observable<{ id: string }> {
    const payload: Partial<FlowAgentData> = {
      name,
      nodes: [
        {
          id: 'start-node',
          type: AgentNodeType.Start,
          position: { x: 400, y: 100 },
          data: { label: 'Start' },
        },
      ],
      edges: [],
      baseSystemPrompt: '',
    };

    return this.http
      .post<{ id: string }>(this.getFlowBaseUrl(), payload)
      .pipe(timeout(this.appConfig.configData.requestTimeoutMs));
  }

  private getFlowBaseUrl(): string {
    const config = this.appConfig.configData;
    return `${config.apiBaseUrl}${config.backendPaths.flows}`;
  }
}
