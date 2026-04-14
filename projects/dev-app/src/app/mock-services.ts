import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject, BehaviorSubject, delay } from 'rxjs';
import {
  AuthService, User,
  FlowAgentStateService, FlowAgentData, AgentNodeType,
  AgentChatService, AgentChatResponse,
  ComposioToolService, ToolkitItem, ComposioToolItem,
  AppConfigService,
} from '../../../../projects/my-lib/public-api';

@Injectable({ providedIn: 'root' })
export class MockAuthService extends AuthService {
  userdoc = new ReplaySubject<User>(1);
  constructor() {
    super();
    this.userdoc.next({ id: 'dev-user', name: 'Dev User', email: 'dev@atom.com', companyId: 'dev-company' });
  }
  isSuperAdmin() { return of(true); }
}

@Injectable({ providedIn: 'root' })
export class MockFlowAgentStateService extends FlowAgentStateService {
  private flows: Map<string, FlowAgentData> = new Map();

  loadFlow(id: string): Observable<FlowAgentData> {
    const flow = this.flows.get(id);
    if (flow) return of(flow);
    const newFlow: FlowAgentData = {
      id, name: 'New Agent',
      nodes: [{ id: 'start-node', type: AgentNodeType.Start as any, position: { x: 400, y: 100 }, data: { label: 'Start' } }],
      edges: [],
      baseSystemPrompt: '',
    };
    this.flows.set(id, newFlow);
    return of(newFlow);
  }

  saveFlow(data: FlowAgentData): Observable<void> {
    this.flows.set(data.id, data);
    console.log('[MockFlowState] Saved:', data.id, data.name);
    return of(undefined);
  }

  listFlows(): Observable<FlowAgentData[]> {
    return of(Array.from(this.flows.values()));
  }

  deleteFlow(id: string): Observable<void> {
    this.flows.delete(id);
    return of(undefined);
  }

  createFlow(name: string): Observable<{ id: string }> {
    const id = `flow-${Date.now()}`;
    this.flows.set(id, { id, name, nodes: [], edges: [], baseSystemPrompt: '' });
    return of({ id });
  }
}

@Injectable({ providedIn: 'root' })
export class MockAgentChatService extends AgentChatService {
  compileAgent(flowId: string): Observable<{ success: boolean; errors?: string[] }> {
    console.log('[MockChat] Compiling:', flowId);
    return of({ success: true }).pipe(delay(500));
  }

  sendMessage(flowId: string, message: string, sessionId: string): Observable<AgentChatResponse> {
    console.log('[MockChat] Message:', message);
    return of({
      contentType: 'text' as const,
      message: `[Mock Agent] You said: "${message}". This is a simulated response.`,
    }).pipe(delay(1000));
  }
}

@Injectable({ providedIn: 'root' })
export class MockComposioToolService extends ComposioToolService {
  listToolkits(): Observable<ToolkitItem[]> {
    return of([
      { name: 'Gmail', slug: 'gmail', logo: '', description: 'Send and read emails' },
      { name: 'Slack', slug: 'slack', logo: '', description: 'Post messages to Slack' },
      { name: 'GitHub', slug: 'github', logo: '', description: 'Manage repos and issues' },
    ]);
  }
  checkConnection(slug: string): Observable<{ isConnected: boolean }> { return of({ isConnected: true }); }
  authorize(slug: string): Observable<{ redirectUrl: string }> { return of({ redirectUrl: 'https://example.com/auth' }); }
  listTools(slug: string): Observable<ComposioToolItem[]> {
    return of([
      { id: `${slug}_1`, name: `${slug} Action 1`, description: 'Mock tool', toolSlug: `${slug}_action_1` },
      { id: `${slug}_2`, name: `${slug} Action 2`, description: 'Mock tool', toolSlug: `${slug}_action_2` },
    ]);
  }
}

@Injectable({ providedIn: 'root' })
export class MockAppConfigService extends AppConfigService {
  override configData = {
    apiBaseUrl: 'http://localhost:3000/api/agentbuilder',
    environment: 'development',
    requestTimeoutMs: 15000,
    backendPaths: {
      flows: '/flows',
      chat: '/chat',
      composio: '/composio',
      auth: '/auth/me',
    },
    auth: {
      mode: 'static' as const,
      staticUser: {
        id: 'dev-user',
        name: 'Dev User',
        email: 'dev@atom.com',
        companyId: 'dev-company',
      },
    },
  };
  override loaded = new BehaviorSubject<boolean>(true);
}
