import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AgentChatResponse {
  contentType: 'text' | 'multimedia' | 'carousel';
  message: string;
  media?: { url: string; mimeType: string; fileName: string };
  carouselCards?: any[];
  finished?: boolean;
  exitPort?: string | null;
  collectedInfo?: Record<string, any>;
}

@Injectable()
export abstract class AgentChatService {
  abstract compileAgent(flowId: string): Observable<{ success: boolean; errors?: string[] }>;
  abstract sendMessage(flowId: string, message: string, sessionId: string): Observable<AgentChatResponse>;
}
