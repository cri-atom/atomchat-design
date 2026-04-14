import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AgentBuilderAppConfigData,
  AppConfigService,
} from '../../core/services/app-config.service';

@Injectable()
export class AgentBuilderAppConfigServiceImpl extends AppConfigService {
  override configData: AgentBuilderAppConfigData = {
    ...environment.agentBuilderConfig,
    apiBaseUrl: this.resolveApiBaseUrl(),
    environment: this.resolveEnvironmentName(),
  };

  override loaded = new BehaviorSubject<boolean>(false);

  constructor() {
    super();
    this.loaded.next(true);
  }

  private resolveApiBaseUrl(): string {
    const configuredBase = environment.aiConfig?.baseUrl ?? environment.cloudFunctionUrl;

    if (!configuredBase) {
      return environment.agentBuilderConfig.apiBaseUrl;
    }

    const trimmedBase = configuredBase.replace(/\/+$/, '');
    return trimmedBase.endsWith('/agentbuilder')
      ? trimmedBase
      : `${trimmedBase}/agentbuilder`;
  }

  private resolveEnvironmentName(): string {
    return environment.openaiEnv
      ?? environment.aiConfig?.environment
      ?? environment.agentBuilderConfig.environment;
  }

  override load(): Promise<void> {
    this.loaded.next(true);
    return Promise.resolve();
  }
}
