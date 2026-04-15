import { AgentBuilderAppConfigServiceImpl } from './app-config.service.impl';
import { environment } from '../../environments/environment';

describe('AgentBuilderAppConfigServiceImpl', () => {
  const originalEnvironment = JSON.parse(JSON.stringify(environment));

  afterEach(() => {
    for (const key of Object.keys(environment)) {
      delete (environment as Record<string, unknown>)[key];
    }
    Object.assign(environment, JSON.parse(JSON.stringify(originalEnvironment)));
  });

  it('appends /agentbuilder when aiConfig.baseUrl does not include it', () => {
    environment.agentBuilderConfig = {
      apiBaseUrl: '/api/agentbuilder',
      environment: 'dev',
      requestTimeoutMs: 15000,
      backendPaths: {
        flows: '/flows',
        chat: '/chat',
        composio: '/composio',
        auth: '/auth/me',
      },
      auth: {
        mode: 'static',
      },
    };
    environment.aiConfig = {
      baseUrl: 'http://localhost:3000/api',
      environment: 'qa',
    };
    environment.openaiEnv = undefined;

    const service = new AgentBuilderAppConfigServiceImpl();

    expect(service.configData.apiBaseUrl).toBe('http://localhost:3000/api/agentbuilder');
    expect(service.configData.environment).toBe('qa');
    expect(service.loaded.value).toBeTrue();
  });

  it('preserves /agentbuilder when already present', () => {
    environment.agentBuilderConfig = {
      apiBaseUrl: '/api/agentbuilder',
      environment: 'dev',
      requestTimeoutMs: 15000,
      backendPaths: {
        flows: '/flows',
        chat: '/chat',
        composio: '/composio',
        auth: '/auth/me',
      },
      auth: {
        mode: 'static',
      },
    };
    environment.aiConfig = {
      baseUrl: 'http://localhost:3000/api/agentbuilder',
      environment: 'prod',
    };
    environment.openaiEnv = 'stage';

    const service = new AgentBuilderAppConfigServiceImpl();

    expect(service.configData.apiBaseUrl).toBe('http://localhost:3000/api/agentbuilder');
    expect(service.configData.environment).toBe('stage');
  });
});
