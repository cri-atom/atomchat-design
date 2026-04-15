import { AgentBuilderAppConfigData } from '../core/services/app-config.service';

export const environment: {
  testingMode?: boolean;
  cloudFunctionUrl?: string;
  openaiEnv?: string;
  aiConfig?: {
    baseUrl?: string;
    environment?: string;
  };
  agentBuilderConfig: AgentBuilderAppConfigData;
  [key: string]: unknown;
} = {
  testingMode: false,
  agentBuilderConfig: {
    apiBaseUrl: '/api/agentbuilder',
    environment: 'development',
    requestTimeoutMs: 15000,
    backendPaths: {
      flows: '/flows',
      chat: '/chat',
      composio: '/composio',
      auth: '/auth/me',
    },
    auth: {
      mode: 'static',
      staticUser: {
        id: 'dev-user',
        name: 'Developer',
        email: 'dev@atom.com',
        companyId: 'dev-company',
      },
    },
  },
};