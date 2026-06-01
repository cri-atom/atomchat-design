import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-monitor-chat-bubble',
  standalone: true,
  template: `
    <div class="bubble" [class.bubble--user]="role() === 'user'" [class.bubble--bot]="role() === 'bot'">
      {{ text() }}
    </div>
  `,
  styles: `
    .bubble {
      max-width: 85%;
      padding: var(--ab-space-sm) var(--ab-space-md);
      border-radius: var(--ab-radius-md);
      font: 400 13px/18px Inter, sans-serif;
      margin-bottom: var(--ab-space-sm);

      &--user {
        margin-right: auto;
        background: var(--ab-surface-muted);
        color: var(--ab-text);
      }

      &--bot {
        margin-left: auto;
        background: rgba(0, 166, 245, 0.12);
        color: var(--ab-text);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitorChatBubbleComponent {
  readonly role = input.required<'user' | 'bot'>();
  readonly text = input.required<string>();
}
