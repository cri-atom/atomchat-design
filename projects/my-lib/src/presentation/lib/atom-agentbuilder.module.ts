import { NgModule, Inject, Injector, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AtomAgentBuilderComponent } from './atom-agentbuilder.component';
import {
  AtomAgentBuilderConfig,
  isLegacyConfig,
} from '../../core/config/services.config';
import { setInjector } from '../../core/config/injector.config';
import { environment } from '../../environments/environment';

import { AuthService } from '../../core/services/auth.service';
import { FlowAgentStateService } from '../../core/services/flow-agent-state.service';
import { AgentChatService } from '../../core/services/agent-chat.service';
import { ComposioToolService } from '../../core/services/composio-tool.service';
import { AppConfigService } from '../../core/services/app-config.service';
import { AgentBuilderAuthServiceImpl } from '../../infrastructure/services/auth.service.impl';
import { AgentBuilderFlowAgentStateServiceImpl } from '../../infrastructure/services/flow-agent-state.service.impl';
import { AgentBuilderAgentChatServiceImpl } from '../../infrastructure/services/agent-chat.service.impl';
import { AgentBuilderComposioToolServiceImpl } from '../../infrastructure/services/composio-tool.service.impl';
import { AgentBuilderAppConfigServiceImpl } from '../../infrastructure/services/app-config.service.impl';

@NgModule({
  imports: [CommonModule, AtomAgentBuilderComponent],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  exports: [AtomAgentBuilderComponent],
})
export class AtomAgentBuilderModule {
  constructor(
    @Inject('environment') environmentConfig: Record<string, unknown>,
    @Inject('injector') injector: Injector,
  ) {
    Object.assign(environment, environmentConfig);
    setInjector(injector);
  }

  static forRoot(config: AtomAgentBuilderConfig = {}): ModuleWithProviders<AtomAgentBuilderModule> {
    let normalizedConfig = config;

    if (isLegacyConfig(config)) {
      const legacyServices = config.services;
      if (legacyServices.length !== 5) {
        throw new Error(`AtomAgentBuilderModule.forRoot: expected 5 legacy services, got ${legacyServices.length}`);
      }

      normalizedConfig = {
        services: {
          authService: legacyServices[0],
          flowAgentStateService: legacyServices[1],
          agentChatService: legacyServices[2],
          composioToolService: legacyServices[3],
          appConfigService: legacyServices[4],
        },
      };

      console.warn('AtomAgentBuilderModule.forRoot legacy array signature is deprecated. Use typed object config.');
    }

    const serviceOverrides = normalizedConfig.services ?? {};

    return {
      ngModule: AtomAgentBuilderModule,
      providers: [
        {
          provide: AuthService,
          useClass: serviceOverrides.authService ?? AgentBuilderAuthServiceImpl,
        },
        {
          provide: FlowAgentStateService,
          useClass: serviceOverrides.flowAgentStateService ?? AgentBuilderFlowAgentStateServiceImpl,
        },
        {
          provide: AgentChatService,
          useClass: serviceOverrides.agentChatService ?? AgentBuilderAgentChatServiceImpl,
        },
        {
          provide: ComposioToolService,
          useClass: serviceOverrides.composioToolService ?? AgentBuilderComposioToolServiceImpl,
        },
        {
          provide: AppConfigService,
          useClass: serviceOverrides.appConfigService ?? AgentBuilderAppConfigServiceImpl,
        },
      ],
    };
  }
}
