import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';
import {
  ComposioToolItem,
  ToolkitItem,
} from '../../core/model/agent-flow.model';
import { AppConfigService } from '../../core/services/app-config.service';
import { ComposioToolService } from '../../core/services/composio-tool.service';

@Injectable()
export class AgentBuilderComposioToolServiceImpl extends ComposioToolService {
  private readonly http = inject(HttpClient);

  private readonly appConfig = inject(AppConfigService);

  override listToolkits(): Observable<ToolkitItem[]> {
    return this.http
      .get<ToolkitItem[]>(`${this.getComposioBaseUrl()}/toolkits`)
      .pipe(timeout(this.appConfig.configData.requestTimeoutMs));
  }

  override checkConnection(slug: string): Observable<{ isConnected: boolean }> {
    return this.http
      .get<{ isConnected: boolean }>(`${this.getComposioBaseUrl()}/connections/${slug}`)
      .pipe(timeout(this.appConfig.configData.requestTimeoutMs));
  }

  override authorize(slug: string): Observable<{ redirectUrl: string }> {
    return this.http
      .post<{ redirectUrl: string }>(`${this.getComposioBaseUrl()}/authorize/${slug}`, {})
      .pipe(timeout(this.appConfig.configData.requestTimeoutMs));
  }

  override listTools(slug: string): Observable<ComposioToolItem[]> {
    return this.http
      .get<ComposioToolItem[]>(`${this.getComposioBaseUrl()}/toolkits/${slug}/tools`)
      .pipe(timeout(this.appConfig.configData.requestTimeoutMs));
  }

  private getComposioBaseUrl(): string {
    const config = this.appConfig.configData;
    return `${config.apiBaseUrl}${config.backendPaths.composio}`;
  }
}
