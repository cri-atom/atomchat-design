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
  type AbIconVariant,
  type FaProIconName,
} from './src/presentation/shared/ab-icon';

// Platform UI components (primitive atoms)
export { AtomTagComponent, type AtomTagVariant } from './src/platform/tag/atom-tag.component';
export { AtomStatusBadgeComponent, type AtomStatusVariant } from './src/platform/status-badge/atom-status-badge.component';
export { AtomAvatarComponent, type AtomAvatarSize } from './src/platform/avatar/atom-avatar.component';
export { AtomButtonComponent, type AtomButtonVariant, type AtomButtonSize } from './src/platform/button/atom-button.component';
export { AtomIconButtonComponent } from './src/platform/icon-button/atom-icon-button.component';

// Components — migrated from feature shared folders
export { AtomSearchInputComponent }       from './src/components/search-input/atom-search-input.component';
export { AtomFilterChipComponent }        from './src/components/filter-chip/atom-filter-chip.component';
export { AtomFilterDropdownComponent, type AtomFilterOption } from './src/components/filter-dropdown/atom-filter-dropdown.component';
export { AtomPaginationComponent, type AtomPaginationMode } from './src/components/pagination/atom-pagination.component';
export { AtomCardComponent }              from './src/components/card/atom-card.component';
export { AtomStepperComponent, type AtomStepperStep } from './src/components/stepper/atom-stepper.component';
export { AtomModalStepperComponent }      from './src/components/modal-stepper/atom-modal-stepper.component';
export { AtomStatusLabelComponent }       from './src/components/status-label/atom-status-label.component';
export { AtomUserTypeBadgeComponent, type AtomUserType } from './src/components/user-type-badge/atom-user-type-badge.component';
export { AtomAvailabilityEditorComponent } from './src/components/availability-editor/atom-availability-editor.component';
export type { AtomDisponibilidad, AtomDiaSemana, AtomDisponibilidadDia, AtomDisponibilidadExcepcion } from './src/components/availability-editor/atom-availability.model';
export { createDefaultAtomDisponibilidad, ATOM_DIAS_SEMANA, ATOM_ZONAS_HORARIAS } from './src/components/availability-editor/atom-availability.model';
export { AtomChipComponent, type AtomChipVariant }        from './src/components/chip/atom-chip.component';
export { AtomChatBubbleComponent }        from './src/components/chat-bubble/atom-chat-bubble.component';
export { AtomDiffBlockComponent }         from './src/components/diff-block/atom-diff-block.component';
export { AtomSegmentedControlComponent, type AtomSegmentOption } from './src/components/segmented-control/atom-segmented-control.component';
export { AtomKpiCardComponent, type AtomKpiData } from './src/components/kpi-card/atom-kpi-card.component';
export { AtomSparklineComponent }         from './src/components/sparkline/atom-sparkline.component';
export { AtomLineChartComponent }         from './src/components/line-chart/atom-line-chart.component';
export { AtomBarChartComponent }          from './src/components/bar-chart/atom-bar-chart.component';
export { AtomDoughnutChartComponent, type AtomDoughnutItem } from './src/components/doughnut-chart/atom-doughnut-chart.component';
export { ATOM_CHART_COLORS, atomChartFont } from './src/components/chart-utils/atom-chart-theme';
export { ensureAtomChartsRegistered }     from './src/components/chart-utils/atom-chart.register';

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
