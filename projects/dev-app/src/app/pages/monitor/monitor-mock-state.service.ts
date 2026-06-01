import { Injectable, signal } from '@angular/core';
import { PROMPT_CURRENT, PROMPT_SUGGESTED } from './monitor-mock.data';

export interface PlaygroundRunMetrics {
  latencyMs: number;
  tokens: number;
  cost: string;
}

@Injectable({ providedIn: 'root' })
export class MonitorMockStateService {
  readonly promotedCaseId = signal<string | null>(null);
  readonly promotedVersion = signal<string | null>(null);

  readonly playgroundFromReview = signal(false);
  readonly playgroundScenarioTitle = signal<string | null>(null);

  readonly lastRun = signal<PlaygroundRunMetrics | null>(null);
  readonly showCompare = signal(false);
  readonly promotedToProduction = signal(false);

  readonly activePrompt = signal(PROMPT_CURRENT);
  readonly draftPrompt = signal(PROMPT_SUGGESTED);

  promoteReviewCase(caseId: string): void {
    this.promotedCaseId.set(caseId);
    this.promotedVersion.set('v2.4.1');
    this.activePrompt.set(PROMPT_SUGGESTED);
    this.draftPrompt.set(PROMPT_SUGGESTED);
  }

  openPlaygroundFromReview(caseId: string, scenarioTitle: string): void {
    this.playgroundFromReview.set(true);
    this.playgroundScenarioTitle.set(scenarioTitle);
    this.activePrompt.set(PROMPT_SUGGESTED);
    this.lastRun.set(null);
    this.showCompare.set(false);
    this.promotedToProduction.set(false);
  }

  clearPlaygroundReviewBanner(): void {
    this.playgroundFromReview.set(false);
    this.playgroundScenarioTitle.set(null);
  }

  recordRun(metrics: PlaygroundRunMetrics): void {
    this.lastRun.set(metrics);
  }

  toggleCompare(): void {
    this.showCompare.update((v) => !v);
  }

  promoteToProduction(): void {
    this.promotedToProduction.set(true);
    this.promotedVersion.set('v2.4.1');
    this.activePrompt.set(this.draftPrompt());
    this.draftPrompt.set(this.draftPrompt());
  }
}
