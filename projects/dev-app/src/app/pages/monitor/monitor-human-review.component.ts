import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AbIconComponent, AtomChatBubbleComponent } from '../../../../../my-lib/public-api';
import { REVIEW_CASES, REVIEW_CHAT } from './monitor-mock.data';
import {
  MonitorSuggestionDialogComponent,
  type SuggestionDialogData,
} from './monitor-suggestion-dialog.component';
import { MonitorMockStateService } from './monitor-mock-state.service';
import { WorkspaceModeService } from '../../workspace/workspace-mode.service';

@Component({
  selector: 'app-monitor-human-review',
  standalone: true,
  imports: [AbIconComponent, MatDialogModule, AtomChatBubbleComponent],
  templateUrl: './monitor-human-review.component.html',
  styleUrl: './monitor-human-review.component.scss',
  host: {
    '[class.review-host--workspace]': 'layout() === "workspace"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitorHumanReviewComponent {
  readonly layout = input<'page' | 'workspace'>('page');
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  readonly mockState = inject(MonitorMockStateService);
  readonly workspace = inject(WorkspaceModeService);
  readonly cases = signal(REVIEW_CASES);
  readonly selectedId = signal('1');
  readonly chat = REVIEW_CHAT;

  readonly selectedCase = computed(() => this.cases().find((c) => c.id === this.selectedId()));

  readonly isSelectedPromoted = computed(
    () => this.mockState.promotedCaseId() === this.selectedId(),
  );

  selectCase(id: string): void {
    this.selectedId.set(id);
  }

  openSuggestion(): void {
    const selected = this.selectedCase();
    if (!selected) return;

    this.dialog.open(MonitorSuggestionDialogComponent, {
      panelClass: 'monitor-suggestion-dialog-panel',
      maxWidth: '95vw',
      width: '960px',
      data: {
        caseId: selected.id,
        scenarioTitle: selected.excerpt,
      } satisfies SuggestionDialogData,
    });
  }

  isCasePromoted(caseId: string): boolean {
    return this.mockState.promotedCaseId() === caseId;
  }

  promotedCaseExcerpt(): string {
    const id = this.mockState.promotedCaseId();
    return this.cases().find((c) => c.id === id)?.excerpt ?? '';
  }

  goToPlaygroundFromPromoted(): void {
    const selected = this.selectedCase();
    if (!selected) return;
    this.mockState.openPlaygroundFromReview(selected.id, selected.excerpt);
    this.workspace.goToPlaygroundFromReview();
  }

  tryPlaygroundFromDialog(): void {
    const selected = this.selectedCase();
    if (selected) {
      this.mockState.openPlaygroundFromReview(selected.id, selected.excerpt);
    }
    this.workspace.goToPlaygroundFromReview();
  }
}
