import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';
import {
  AgentChatResponse,
  AgentChatService,
} from '../../core/services/agent-chat.service';
import { AppConfigService } from '../../core/services/app-config.service';

@Injectable()
export class AgentBuilderAgentChatServiceImpl extends AgentChatService {
  private readonly http = inject(HttpClient);

  private readonly appConfig = inject(AppConfigService);

  override compileAgent(flowId: string): Observable<{ success: boolean; errors?: string[] }> {
    return this.http
      .post<{ success: boolean; errors?: string[] }>(
        `${this.getChatBaseUrl()}/compile`,
        { flowId },
      )
      .pipe(timeout(this.appConfig.configData.requestTimeoutMs));
  }

  override sendMessage(flowId: string, message: string, sessionId: string): Observable<AgentChatResponse> {
    return this.http
      .post<AgentChatResponse>(
        `${this.getChatBaseUrl()}/message`,
        {
          flowId,
          message,
          sessionId,
        },
      )
      .pipe(timeout(this.appConfig.configData.requestTimeoutMs));
  }

  private getChatBaseUrl(): string {
    const config = this.appConfig.configData;
    return `${config.apiBaseUrl}${config.backendPaths.chat}`;
  }
}
