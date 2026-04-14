import { Type } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FlowAgentStateService } from '../services/flow-agent-state.service';
import { AgentChatService } from '../services/agent-chat.service';
import { ComposioToolService } from '../services/composio-tool.service';
import { AppConfigService } from '../services/app-config.service';

export interface AtomAgentBuilderServiceOverrides {
  authService: Type<AuthService>;
  flowAgentStateService: Type<FlowAgentStateService>;
  agentChatService: Type<AgentChatService>;
  composioToolService: Type<ComposioToolService>;
  appConfigService: Type<AppConfigService>;
}

export interface AtomAgentBuilderConfig {
  services?: Partial<AtomAgentBuilderServiceOverrides>;
}

export interface LegacyAtomAgentBuilderConfig {
  services: [
    Type<AuthService>,
    Type<FlowAgentStateService>,
    Type<AgentChatService>,
    Type<ComposioToolService>,
    Type<AppConfigService>,
  ];
}

export function isLegacyConfig(config: unknown): config is LegacyAtomAgentBuilderConfig {
  return Boolean(config) && Array.isArray((config as LegacyAtomAgentBuilderConfig).services);
}
