import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ToolkitItem, ComposioToolItem } from '../model/agent-flow.model';

/**
 * Abstract service for interacting with the Composio integration layer.
 *
 * @remarks
 * Provide a concrete implementation via {@link AtomAgentBuilderModule.forRoot}.
 * Used by the tool-selection modal to browse, connect, and retrieve tools.
 */
@Injectable()
export abstract class ComposioToolService {
  /** Returns all available integration toolkits (e.g. Gmail, GitHub, Notion). */
  abstract listToolkits(): Observable<ToolkitItem[]>;

  /**
   * Checks whether the current user has an active connection for the given toolkit.
   *
   * @param slug - Toolkit slug identifier (e.g. `'gmail'`).
   */
  abstract checkConnection(slug: string): Observable<{ isConnected: boolean }>;

  /**
   * Initiates the OAuth authorization flow for a toolkit.
   *
   * @param slug - Toolkit slug identifier.
   * @returns An observable emitting the URL to redirect the user to for authorization.
   */
  abstract authorize(slug: string): Observable<{ redirectUrl: string }>;

  /**
   * Returns all individual tools available within a toolkit.
   *
   * @param slug - Toolkit slug identifier.
   */
  abstract listTools(slug: string): Observable<ComposioToolItem[]>;
}
