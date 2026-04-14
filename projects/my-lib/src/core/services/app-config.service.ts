import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from './auth.service';

export interface AgentBuilderBackendPaths {
  flows: string;
  chat: string;
  composio: string;
  auth: string;
}

export interface AgentBuilderAuthRuntimeConfig {
  mode: 'static' | 'http' | 'none';
  staticUser?: User;
}

export interface AgentBuilderAppConfigData {
  apiBaseUrl: string;
  environment: string;
  requestTimeoutMs: number;
  backendPaths: AgentBuilderBackendPaths;
  auth: AgentBuilderAuthRuntimeConfig;
}

@Injectable()
export abstract class AppConfigService {
  abstract configData: AgentBuilderAppConfigData;
  abstract loaded: BehaviorSubject<boolean>;
  load?(): Promise<void>;
}
