import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';
import { AppConfigService } from '../../core/services/app-config.service';
import { AgentBuilderFlowAgentStateServiceImpl } from './flow-agent-state.service.impl';

describe('AgentBuilderFlowAgentStateServiceImpl', () => {
  let service: AgentBuilderFlowAgentStateServiceImpl;
  let httpMock: HttpTestingController;

  const appConfigMock = {
    configData: {
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
      },
    },
    loaded: new BehaviorSubject<boolean>(true),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AgentBuilderFlowAgentStateServiceImpl,
        { provide: AppConfigService, useValue: appConfigMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(AgentBuilderFlowAgentStateServiceImpl);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads a flow by id using GET', () => {
    const response = { id: 'flow-1', name: 'Flow', nodes: [], edges: [], baseSystemPrompt: '' };

    service.loadFlow('flow-1').subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/agentbuilder/flows/flow-1');
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });

  it('saves a flow using PUT', () => {
    const payload = { id: 'flow-1', name: 'Flow', nodes: [], edges: [], baseSystemPrompt: '' };

    service.saveFlow(payload as any).subscribe();

    const req = httpMock.expectOne('http://localhost:3000/api/agentbuilder/flows/flow-1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush({});
  });

  it('creates a flow with a start node using POST', () => {
    service.createFlow('New Flow').subscribe((res) => {
      expect(res).toEqual({ id: 'new-id' });
    });

    const req = httpMock.expectOne('http://localhost:3000/api/agentbuilder/flows');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.name).toBe('New Flow');
    expect(req.request.body.nodes[0].id).toBe('start-node');
    expect(req.request.body.nodes[0].type).toBe('start');
    req.flush({ id: 'new-id' });
  });
});
