import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * A single message response from the agent chat backend.
 */
export interface AgentChatResponse {
  /** Determines how the frontend should render the message. */
  contentType: 'text' | 'multimedia' | 'carousel';
  /** Plain-text or markdown content of the message. */
  message: string;
  /** Present when `contentType` is `'multimedia'`. */
  media?: { url: string; mimeType: string; fileName: string };
  /** Present when `contentType` is `'carousel'`. */
  carouselCards?: any[];
  /** `true` when the agent has completed its goal and the conversation can end. */
  finished?: boolean;
  /** The edge label the agent used to exit the current node, if applicable. */
  exitPort?: string | null;
  /** Key-value map of information fields collected during this response turn. */
  collectedInfo?: Record<string, any>;
}

/**
 * Abstract service for compiling and interacting with a deployed agent flow.
 *
 * @remarks
 * Provide a concrete implementation via {@link AtomAgentBuilderModule.forRoot}.
 */
@Injectable()
export abstract class AgentChatService {
  /**
   * Compiles the specified flow on the backend, making it ready for simulation.
   *
   * @param flowId - ID of the flow to compile.
   * @returns An observable that emits the compilation result with any validation errors.
   */
  abstract compileAgent(flowId: string): Observable<{ success: boolean; errors?: string[] }>;

  /**
   * Sends a user message to the agent and receives its response.
   *
   * @param flowId - ID of the compiled flow to interact with.
   * @param message - The user's message text.
   * @param sessionId - Unique identifier for the current conversation session.
   * @returns An observable that emits the agent's response.
   */
  abstract sendMessage(flowId: string, message: string, sessionId: string): Observable<AgentChatResponse>;
}
