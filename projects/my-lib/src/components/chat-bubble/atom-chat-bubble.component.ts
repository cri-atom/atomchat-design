import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'atom-chat-bubble',
  standalone: true,
  template: `
    <div class="atom-bubble" [class.atom-bubble--user]="role() === 'user'" [class.atom-bubble--bot]="role() === 'bot'">
      {{ text() }}
    </div>
  `,
  styles: `
    .atom-bubble {
      max-width: 85%;
      padding: var(--ab-space-sm, 8px) var(--ab-space-md, 12px);
      border-radius: var(--ab-radius-md, 12px);
      font: 400 13px/18px Inter, ui-sans-serif, system-ui, sans-serif;
      margin-bottom: var(--ab-space-sm, 8px);

      &--user { margin-right: auto; background: var(--ab-surface-muted, #f4f4f5); color: var(--ab-text, #18181b); }
      &--bot  { margin-left: auto;  background: rgba(0, 166, 245, 0.12);          color: var(--ab-text, #18181b); }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtomChatBubbleComponent {
  readonly role = input.required<'user' | 'bot'>();
  readonly text = input.required<string>();
}
