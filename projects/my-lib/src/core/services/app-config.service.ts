import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from './auth.service';

/**
 * URL path segments for each backend API domain.
 * Combined with {@link AgentBuilderAppConfigData.apiBaseUrl} to form full endpoint URLs.
 */
export interface AgentBuilderBackendPaths {
  /** Path to the flows REST resource (e.g. `/api/flows`). */
  flows: string;
  /** Path to the agent chat endpoint. */
  chat: string;
  /** Path to the composio integration proxy. */
  composio: string;
  /** Path to the authentication endpoint. */
  auth: string;
}

/**
 * Determines how the library resolves the authenticated user at runtime.
 * - `'static'`: uses the hardcoded {@link staticUser} object — suitable for dev/demo environments.
 * - `'http'`: fetches the user from the `auth` backend path.
 * - `'none'`: authentication is disabled; no user is injected.
 */
export interface AgentBuilderAuthRuntimeConfig {
  mode: 'static' | 'http' | 'none';
  /** Required when `mode` is `'static'`. Injected directly as the current user. */
  staticUser?: User;
}

/**
 * Runtime configuration data for the agent builder.
 * Typically loaded asynchronously during app initialization via {@link AppConfigService.load}.
 */
export interface AgentBuilderAppConfigData {
  /** Base URL for all API requests (e.g. `https://api.example.com`). */
  apiBaseUrl: string;
  /** Deployment environment name (e.g. `'production'`, `'staging'`). */
  environment: string;
  /** Maximum milliseconds to wait for an API response before timing out. */
  requestTimeoutMs: number;
  backendPaths: AgentBuilderBackendPaths;
  auth: AgentBuilderAuthRuntimeConfig;
}

/**
 * Abstract application configuration service.
 *
 * @remarks
 * Provide a concrete implementation via {@link AtomAgentBuilderModule.forRoot}.
 * The library's default implementation uses a static config object for local development.
 */
@Injectable()
export abstract class AppConfigService {
  /** The resolved configuration data. Available after `loaded` emits `true`. */
  abstract configData: AgentBuilderAppConfigData;

  /**
   * Emits `true` once the configuration has been successfully loaded.
   * HTTP services should wait for this signal before making requests.
   */
  abstract loaded: BehaviorSubject<boolean>;

  /**
   * Optional async loader called during Angular's `APP_INITIALIZER` phase.
   * Implement this when configuration must be fetched from a remote endpoint.
   */
  load?(): Promise<void>;
}
