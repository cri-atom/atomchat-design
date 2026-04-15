import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FlowAgentData } from '../model/agent-flow.model';

/**
 * Abstract persistence service for agent flows.
 *
 * @remarks
 * Provide a concrete implementation via {@link AtomAgentBuilderModule.forRoot}.
 * The library ships with a default HTTP implementation that targets the configured backend paths.
 */
@Injectable()
export abstract class FlowAgentStateService {
  /**
   * Loads a flow by its ID.
   *
   * @param id - Unique flow identifier.
   * @returns An observable that emits the full flow data.
   */
  abstract loadFlow(id: string): Observable<FlowAgentData>;

  /**
   * Persists the current state of a flow.
   *
   * @param data - The complete flow snapshot to save.
   */
  abstract saveFlow(data: FlowAgentData): Observable<void>;

  /** Returns a list of all flows accessible to the current user. */
  abstract listFlows(): Observable<FlowAgentData[]>;

  /**
   * Permanently deletes a flow.
   *
   * @param id - Unique flow identifier.
   */
  abstract deleteFlow(id: string): Observable<void>;

  /**
   * Creates a new empty flow with the given name.
   *
   * @param name - Display name for the new flow.
   * @returns An observable emitting the ID assigned to the new flow.
   */
  abstract createFlow(name: string): Observable<{ id: string }>;
}
