import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import {
  PLAYGROUND_REVIEW_CHAT,
  PLAYGROUND_RUN_BOT_REPLY,
} from './monitor-mock.data';
import { MonitorCompareDialogComponent } from './monitor-compare-dialog.component';
import { MonitorMockStateService } from './monitor-mock-state.service';

@Component({
  selector: 'app-monitor-playground',
  standalone: true,
  imports: [FormsModule, MatSliderModule, MatDialogModule],
  templateUrl: './monitor-playground.component.html',
  styleUrl: './monitor-playground.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitorPlaygroundComponent implements OnInit {
  readonly layout = input<'page' | 'workspace'>('page');
  private readonly dialog = inject(MatDialog);
  readonly mockState = inject(MonitorMockStateService);

  promptText = '';
  readonly variables = ['{{user_name}}', '{{company_name}}'];
  readonly chatMessages = signal<{ role: 'user' | 'bot'; text: string; fresh?: boolean }[]>([]);
  userInput = '';
  model = 'claude-3.5-sonnet';
  temperature = 0.7;
  maxTokens = 1024;
  isRunning = signal(false);

  ngOnInit(): void {
    this.syncFromState();
  }

  private syncFromState(): void {
    this.promptText = this.mockState.activePrompt();

    if (this.mockState.playgroundFromReview()) {
      this.chatMessages.set(
        PLAYGROUND_REVIEW_CHAT.map((m) => ({ ...m, fresh: false })),
      );
      this.userInput = 'Mi número de pedido es #48291';
      return;
    }

    this.chatMessages.set([
      { role: 'user', text: 'Hola, necesito ayuda con mi pedido.', fresh: false },
      {
        role: 'bot',
        text: 'Hola Dev User, con gusto te ayudo. ¿Cuál es tu número de pedido?',
        fresh: false,
      },
    ]);
  }

  dismissReviewBanner(): void {
    this.mockState.clearPlaygroundReviewBanner();
  }

  run(): void {
    const text = this.userInput.trim();
    if (!text || this.isRunning()) return;

    this.isRunning.set(true);
    this.chatMessages.update((msgs) => [...msgs, { role: 'user', text, fresh: true }]);
    this.userInput = '';

    setTimeout(() => {
      this.chatMessages.update((msgs) => [
        ...msgs,
        { role: 'bot', text: PLAYGROUND_RUN_BOT_REPLY, fresh: true },
      ]);
      this.mockState.recordRun({ latencyMs: 1240, tokens: 342, cost: '$0.003' });
      this.isRunning.set(false);
    }, 600);
  }

  openCompare(): void {
    const ref = this.dialog.open(MonitorCompareDialogComponent, {
      width: '880px',
      maxWidth: '95vw',
    });
    ref.afterClosed().subscribe((result) => {
      if (result === 'use-draft') {
        this.promptText = this.mockState.activePrompt();
      }
    });
  }

  promote(): void {
    this.mockState.promoteToProduction();
    this.promptText = this.mockState.activePrompt();
  }
}
