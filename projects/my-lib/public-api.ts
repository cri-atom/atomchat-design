// Module + Component
export { AtomAgentBuilderModule } from './src/presentation/lib/atom-agentbuilder.module';
export { AtomAgentBuilderComponent } from './src/presentation/lib/atom-agentbuilder.component';

// Icons (Font Awesome Pro)
export {
  AbIconComponent,
  AB_ICON_ALIASES,
  AB_ICON_FA_CLASS,
  resolveFaIconClass,
  type AbIconAlias,
  type AbIconName,
  type AbIconSize,
  type FaProIconName,
} from './src/presentation/shared/ab-icon';

// Types
export * from './src/core/model/agent-flow.model';

// Abstract Services
export { AuthService, User } from './src/core/services/auth.service';
export { FlowAgentStateService } from './src/core/services/flow-agent-state.service';
export { AgentChatService, AgentChatResponse } from './src/core/services/agent-chat.service';
export { ComposioToolService } from './src/core/services/composio-tool.service';
export {
	AppConfigService,
	AgentBuilderAppConfigData,
	AgentBuilderBackendPaths,
	AgentBuilderAuthRuntimeConfig,
} from './src/core/services/app-config.service';

// Default concrete services
export { AgentBuilderAppConfigServiceImpl } from './src/infrastructure/services/app-config.service.impl';
export { AgentBuilderAuthServiceImpl } from './src/infrastructure/services/auth.service.impl';
export { AgentBuilderFlowAgentStateServiceImpl } from './src/infrastructure/services/flow-agent-state.service.impl';
export { AgentBuilderAgentChatServiceImpl } from './src/infrastructure/services/agent-chat.service.impl';
export { AgentBuilderComposioToolServiceImpl } from './src/infrastructure/services/composio-tool.service.impl';

// Module config
export {
	AtomAgentBuilderConfig,
	AtomAgentBuilderServiceOverrides,
} from './src/core/config/services.config';

// State services
export { FlowAgentActionsService } from './src/application/state/flow-agent-actions.service';
export { FlowAgentInternalStateService } from './src/application/state/flow-agent-internal-state.service';
export { FlowAgentValidationService } from './src/application/state/flow-agent-validation.service';
export { FlowAgentDefaultsService } from './src/application/state/flow-agent-defaults.service';

// Canvas
export * from './src/presentation/canvas/theme';
export { AgentShapeTypesEnum } from './src/presentation/canvas/shapes/utilities.shapes';
