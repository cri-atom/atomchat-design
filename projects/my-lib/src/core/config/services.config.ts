import { Type } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FlowAgentStateService } from '../services/flow-agent-state.service';
import { AgentChatService } from '../services/agent-chat.service';
import { ComposioToolService } from '../services/composio-tool.service';
import { AppConfigService } from '../services/app-config.service';

/**
 * Named overrides for each abstract service used by the library.
 * Every property is a concrete Angular class that extends the corresponding abstract service.
 *
 * @see {@link AtomAgentBuilderConfig}
 */
export interface AtomAgentBuilderServiceOverrides {
  authService: Type<AuthService>;
  flowAgentStateService: Type<FlowAgentStateService>;
  agentChatService: Type<AgentChatService>;
  composioToolService: Type<ComposioToolService>;
  appConfigService: Type<AppConfigService>;
}

/**
 * Configuration object accepted by {@link AtomAgentBuilderModule.forRoot}.
 * All fields are optional; omitted services fall back to the library's built-in implementations.
 *
 * @example
 * ```ts
 * AtomAgentBuilderModule.forRoot({
 *   services: {
 *     authService: MyAuthService,
 *     flowAgentStateService: MyFlowStateService,
 *   },
 * })
 * ```
 */
export interface AtomAgentBuilderConfig {
  services?: Partial<AtomAgentBuilderServiceOverrides>;
}

/**
 * @deprecated Use {@link AtomAgentBuilderConfig} with a named `services` object instead.
 * The positional array signature will be removed in a future major version.
 *
 * @remarks
 * Services must be provided in the following fixed order:
 * `[AuthService, FlowAgentStateService, AgentChatService, ComposioToolService, AppConfigService]`
 */
export interface LegacyAtomAgentBuilderConfig {
  services: [
    Type<AuthService>,
    Type<FlowAgentStateService>,
    Type<AgentChatService>,
    Type<ComposioToolService>,
    Type<AppConfigService>,
  ];
}

/**
 * Type guard that detects the deprecated positional-array config signature.
 *
 * @param config - The raw value passed to `forRoot`.
 * @returns `true` when `config.services` is an array (legacy format).
 */
export function isLegacyConfig(config: unknown): config is LegacyAtomAgentBuilderConfig {
  return Boolean(config) && Array.isArray((config as LegacyAtomAgentBuilderConfig).services);
}
