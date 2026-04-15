import { Component, ChangeDetectionStrategy, ChangeDetectorRef, inject, input, output, signal, NgZone, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FlowAgentInternalStateService } from '../../../../application/state/flow-agent-internal-state.service';
import { FlowAgentNode, AgentNodeData } from '../../../../core/model/agent-flow.model';

@Component({
  selector: 'flowagent-prompt-editor-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, TranslocoModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  templateUrl: './prompt-editor-modal.component.html',
  styleUrl: './prompt-editor-modal.component.scss',
})
export class PromptEditorModalComponent {
  /** The agent node whose conversation goal (prompt) is edited in this modal. */
  public readonly node = input.required<FlowAgentNode>();
  /** Emits when the modal is dismissed. */
  public readonly closed = output<void>();

  /** Reference to the main textarea element, used to imperatively set cursor position after insertions. */
  @ViewChild('goalTextarea') goalTextarea!: ElementRef<HTMLTextAreaElement>;

  private readonly state = inject(FlowAgentInternalStateService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly zone = inject(NgZone);

  /** Current text in the AI assistant refinement input. */
  public readonly assistantInput = signal('');
  /** `true` while the mock AI optimization timeout is running. */
  public readonly isOptimizing = signal(false);
  /** Whether the `@`-triggered tool-mention dropdown is visible. */
  public readonly showMentions = signal(false);
  /** Whether the `/`-triggered field-mention dropdown is visible. */
  public readonly showFields = signal(false);
  /** Tools matching the current `@` search prefix, shown in the mention dropdown. */
  public readonly filteredTools = signal<{ name: string }[]>([]);
  /** Fields matching the current `/` search prefix, shown in the field dropdown. */
  public readonly filteredFields = signal<{ name: string }[]>([]);
  /**
   * Pixel coordinates `{ x, y }` for positioning the mention/field dropdown
   * relative to the textarea's top-left content corner.
   */
  public readonly dropdownPos = signal<{ x: number; y: number }>({ x: 0, y: 0 });

  /** Character index in the textarea where the current `@` trigger was detected. */
  private mentionStart = -1;
  /** Character index in the textarea where the current `/` trigger was detected. */
  private fieldStart = -1;

  /** Built-in system fields always available for `/` insertion regardless of node config. */
  private readonly SYSTEM_FIELDS = [
    { name: 'first_name' },
    { name: 'last_name' },
    { name: 'email' },
    { name: 'phone' },
    { name: 'company' },
  ];

  /**
   * Typed accessor for the node's data payload narrowed to {@link AgentNodeData}.
   *
   * @returns The node data cast to `AgentNodeData`.
   */
  public get data(): AgentNodeData { return this.node().data as AgentNodeData; }

  private update(patch: Partial<AgentNodeData>): void {
    this.state.updateNodeData(this.node().id, patch);
  }

  /**
   * Returns the pixel coordinates {x, y} of the caret at `cursorPos` inside
   * `textarea`, relative to the textarea element's top-left content corner.
   * Uses the mirror-div technique to measure inline text layout.
   */
  private getCaretCoords(textarea: HTMLTextAreaElement, cursorPos: number): { x: number; y: number } {
    const computed = window.getComputedStyle(textarea);

    // Build a hidden mirror div that matches the textarea's text layout exactly.
    const mirror = document.createElement('div');
    const mirrorStyle = mirror.style;

    mirrorStyle.position   = 'absolute';
    mirrorStyle.visibility = 'hidden';
    mirrorStyle.top        = '-9999px';
    mirrorStyle.left       = '-9999px';
    mirrorStyle.overflow   = 'auto';

    // Copy every property that affects text layout.
    mirrorStyle.width       = computed.width;
    mirrorStyle.fontSize    = computed.fontSize;
    mirrorStyle.fontFamily  = computed.fontFamily;
    mirrorStyle.fontWeight  = computed.fontWeight;
    mirrorStyle.lineHeight  = computed.lineHeight;
    mirrorStyle.paddingTop    = computed.paddingTop;
    mirrorStyle.paddingRight  = computed.paddingRight;
    mirrorStyle.paddingBottom = computed.paddingBottom;
    mirrorStyle.paddingLeft   = computed.paddingLeft;
    mirrorStyle.borderTopWidth    = computed.borderTopWidth;
    mirrorStyle.borderRightWidth  = computed.borderRightWidth;
    mirrorStyle.borderBottomWidth = computed.borderBottomWidth;
    mirrorStyle.borderLeftWidth   = computed.borderLeftWidth;
    mirrorStyle.borderTopStyle    = 'solid';
    mirrorStyle.borderRightStyle  = 'solid';
    mirrorStyle.borderBottomStyle = 'solid';
    mirrorStyle.borderLeftStyle   = 'solid';
    mirrorStyle.whiteSpace = 'pre-wrap';
    mirrorStyle.wordWrap   = 'break-word';
    mirrorStyle.boxSizing  = computed.boxSizing;

    // Text before the cursor — escaped as a text node to avoid HTML injection.
    const textBefore = textarea.value.substring(0, cursorPos);
    mirror.appendChild(document.createTextNode(textBefore));

    // A zero-width marker span at the caret position.
    const marker = document.createElement('span');
    marker.textContent = '\u200b'; // zero-width space
    mirror.appendChild(marker);

    document.body.appendChild(mirror);

    // Sync scroll so the measured position accounts for how far the user has
    // scrolled inside the textarea.
    mirror.scrollTop  = textarea.scrollTop;
    mirror.scrollLeft = textarea.scrollLeft;

    const markerRect  = marker.getBoundingClientRect();
    const mirrorRect  = mirror.getBoundingClientRect();

    // Coords relative to the mirror's top-left (which mirrors the textarea's
    // top-left, including padding and border).
    let x = markerRect.left - mirrorRect.left;
    let y = markerRect.top  - mirrorRect.top;

    document.body.removeChild(mirror);

    // --- Clamping so the dropdown stays inside the textarea bounds ---
    // Estimated dropdown height: header (~30px) + up to 8 items × 28px + small buffer.
    const dropdownHeight = 254;
    const dropdownWidth  = 220;

    // The textarea's rendered size (excluding scroll overhang).
    const taHeight = textarea.clientHeight;
    const taWidth  = textarea.clientWidth;

    // Parse line-height to nudge the dropdown just below the current line.
    const lhRaw    = computed.lineHeight;
    const lineHeight = lhRaw === 'normal' ? parseFloat(computed.fontSize) * 1.2 : parseFloat(lhRaw);

    // Move y to just below the caret line.
    y += lineHeight;

    // Clamp: if the dropdown would overflow the bottom of the textarea, show it
    // above the caret line instead.
    if (y + dropdownHeight > taHeight) {
      y = y - lineHeight - dropdownHeight;
    }

    // Clamp y to stay within [0, taHeight - dropdownHeight].
    y = Math.max(0, Math.min(y, taHeight - dropdownHeight));

    // Clamp x so the dropdown doesn't overflow the right edge.
    x = Math.max(0, Math.min(x, taWidth - dropdownWidth));

    return { x, y };
  }

  /**
   * Handles `input` events on the conversation-goal textarea.
   * Detects `@` (tool mention) and `/` (field mention) triggers, filters the relevant lists,
   * calculates the dropdown position via `getCaretCoords`, and shows the appropriate dropdown.
   * Hides both dropdowns and persists the updated value when no trigger is active.
   *
   * @param event - The native DOM `input` event from the goal textarea.
   */
  public onGoalInput(event: Event): void {
    const ta = event.target as HTMLTextAreaElement;
    const pos = ta.selectionStart ?? ta.value.length;
    const textBeforeCursor = ta.value.substring(0, pos);

    const atIdx = textBeforeCursor.lastIndexOf('@');
    const slashIdx = textBeforeCursor.lastIndexOf('/');

    const activeAt = atIdx >= 0 && !textBeforeCursor.substring(atIdx + 1).includes(' ');
    const activeSlash = slashIdx >= 0 && !textBeforeCursor.substring(slashIdx + 1).includes(' ');

    if (activeAt && (!activeSlash || atIdx > slashIdx)) {
      this.mentionStart = atIdx;
      const search = textBeforeCursor.substring(atIdx + 1).toLowerCase();
      const tools = (this.data.tools || [])
        .filter(t => t.name.toLowerCase().includes(search))
        .map(t => ({ name: t.name }));
      this.filteredTools.set(tools);
      this.dropdownPos.set(this.getCaretCoords(ta, atIdx));
      this.showMentions.set(true);
      this.showFields.set(false);
    } else if (activeSlash && (!activeAt || slashIdx > atIdx)) {
      this.fieldStart = slashIdx;
      const search = textBeforeCursor.substring(slashIdx + 1).toLowerCase();
      const custom = (this.data.infoCollection || []).map(f => ({ name: f.label }));
      const all = [...this.SYSTEM_FIELDS, ...custom];
      const filtered = all.filter(f => f.name.toLowerCase().includes(search));
      this.filteredFields.set(filtered);
      this.dropdownPos.set(this.getCaretCoords(ta, slashIdx));
      this.showFields.set(true);
      this.showMentions.set(false);
    } else {
      this.showMentions.set(false);
      this.showFields.set(false);
    }

    this.update({ conversationGoal: ta.value, description: ta.value });
    this.cdr.markForCheck();
  }

  /** Hides both the tool-mention and field-mention dropdowns. */
  public closeDropdowns(): void {
    this.showMentions.set(false);
    this.showFields.set(false);
  }

  /**
   * Inserts a tool mention into the goal textarea at the `@` trigger position,
   * replacing any partial text typed after the trigger with `@[name]`.
   * Restores the cursor position after the inserted token and persists the new value.
   * Prevents the default mouse event to avoid blurring the textarea.
   *
   * @param name - The tool name to insert.
   * @param event - The `mousedown` event from the dropdown item.
   */
  public insertMention(name: string, event: MouseEvent): void {
    event.preventDefault();
    const ta = this.goalTextarea.nativeElement;
    const before = ta.value.substring(0, this.mentionStart);
    const after = ta.value.substring(this.mentionStart).replace(/^@\S*/, '');
    const inserted = `@[${name}]`;
    const newValue = before + inserted + after;
    ta.value = newValue;
    const cursor = before.length + inserted.length;
    ta.setSelectionRange(cursor, cursor);
    ta.focus();
    this.showMentions.set(false);
    this.update({ conversationGoal: newValue, description: newValue });
  }

  /**
   * Inserts a field reference into the goal textarea at the `/` trigger position,
   * replacing any partial text typed after the trigger with `/{name}`.
   * Restores the cursor position after the inserted token and persists the new value.
   * Prevents the default mouse event to avoid blurring the textarea.
   *
   * @param name - The field name to insert.
   * @param event - The `mousedown` event from the dropdown item.
   */
  public insertField(name: string, event: MouseEvent): void {
    event.preventDefault();
    const ta = this.goalTextarea.nativeElement;
    const before = ta.value.substring(0, this.fieldStart);
    const after = ta.value.substring(this.fieldStart).replace(/^\/\S*/, '');
    const inserted = `/{${name}}`;
    const newValue = before + inserted + after;
    ta.value = newValue;
    const cursor = before.length + inserted.length;
    ta.setSelectionRange(cursor, cursor);
    ta.focus();
    this.showFields.set(false);
    this.update({ conversationGoal: newValue, description: newValue });
  }

  /**
   * Persists a new display label for the agent node.
   *
   * @param value - The new label string entered in the name field.
   */
  public updateLabel(value: string): void {
    this.update({ label: value });
  }

  /**
   * Handles LLM model selection from the dropdown.
   * Constructs a minimal {@link AIAgentModel} from the selected ID,
   * or clears the model when the empty option is chosen.
   *
   * @param modelId - The selected model identifier string, or an empty string to clear.
   */
  public onModelChange(modelId: string): void {
    const model = modelId ? { id: modelId, name: modelId, provider: 'google' } : null;
    this.update({ aiAgentModel: model });
  }

  /**
   * Triggers the mock AI prompt-refinement flow.
   * Runs outside Angular's zone to avoid triggering unnecessary change detection during the delay.
   * Generates a structured prompt template from `assistantInput`, updates the goal, and resets
   * the assistant input after the simulated 1.5-second processing delay.
   * No-ops when `assistantInput` is empty.
   */
  public refinePrompt(): void {
    const input = this.assistantInput().trim();
    if (!input) return;
    this.isOptimizing.set(true);

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        const optimized =
          `### Rol\nEres un agente especializado en: ${input}\n\n` +
          `### Personalidad\nEres profesional, útil y conciso. Siempre mantienes un tono positivo y de apoyo.\n\n` +
          `### Objetivos\n1. Entender claramente las necesidades del usuario.\n2. Proporcionar información precisa y relevante.\n3. Guiar al usuario hacia los siguientes pasos del flujo.`;

        this.zone.run(() => {
          this.update({ conversationGoal: optimized, description: optimized });
          this.isOptimizing.set(false);
          this.assistantInput.set('');
          this.cdr.markForCheck();
        });
      }, 1500);
    });
  }
}
