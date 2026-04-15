import { Component, ChangeDetectionStrategy, inject, input, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FlowAgentInternalStateService } from '../../../../application/state/flow-agent-internal-state.service';
import { FlowAgentNode, AgentNodeData, InfoCollectionItem } from '../../../../core/model/agent-flow.model';
import { FieldCreationModalComponent } from '../../modals/field-creation-modal/field-creation-modal.component';
import { PromptEditorModalComponent } from '../../modals/prompt-editor-modal/prompt-editor-modal.component';

const PREDEFINED_FIELDS = ['Nombre', 'Apellido', 'Email', 'Teléfono', 'Empresa', 'Dirección', 'Ciudad', 'País'];

@Component({
  selector: 'flowagent-general-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, TranslocoModule, MatFormFieldModule, MatSelectModule, FieldCreationModalComponent, PromptEditorModalComponent],
  templateUrl: './general-tab.component.html',
  styleUrl: './general-tab.component.scss',
})
export class GeneralTabComponent {
  /** The agent node whose general configuration (goal, fields, model) is edited in this tab. */
  public readonly node = input.required<FlowAgentNode>();

  private readonly state = inject(FlowAgentInternalStateService);

  /** Controls visibility of the "Info fields" collapsible section. */
  public readonly showInfoSection = signal(true);
  /** Controls visibility of the "Advanced configuration" collapsible section. */
  public readonly showAdvancedSection = signal(false);
  /** Controls visibility of the field-creation modal overlay. */
  public readonly showFieldModal = signal(false);
  /** Controls visibility of the prompt-editor modal overlay. */
  public readonly showPromptModal = signal(false);

  /** Whether the inline mention dropdown is currently visible. */
  public readonly showMentions = signal(false);
  /** The filtered list of items (tools or fields) shown in the active mention dropdown. */
  public readonly filteredItems = signal<{ name: string }[]>([]);
  /**
   * The character that triggered the current mention session.
   * `'@'` for tool mentions, `'/'` for field mentions.
   */
  public readonly mentionPrefix = signal('@');
  /** Character index in the textarea where the current mention trigger was detected. */
  private mentionStart = -1;

  /** ID of the info-collection field row whose label dropdown is currently open. `null` when all closed. */
  public readonly openDropdownId = signal<string | null>(null);
  /** Current search string typed inside an open field-label dropdown. */
  public readonly fieldSearch = signal('');

  /**
   * Predefined field names filtered by `fieldSearch`.
   * Used to populate the field-label dropdown in real time.
   */
  public readonly filteredPredefined = computed(() =>
    PREDEFINED_FIELDS.filter(f => f.toLowerCase().includes(this.fieldSearch().toLowerCase()))
  );

  /**
   * `true` when every info-collection field on this node is marked as `'required'`
   * and the list is non-empty. Used to drive the "select all" checkbox state.
   */
  public readonly isAllRequired = computed(() => {
    const fields = (this.node().data as AgentNodeData).infoCollection || [];
    return fields.length > 0 && fields.every(f => f.type !== 'optional');
  });

  private readonly mockTools = [{ name: 'helloWorld' }];
  private readonly mockFields = [
    { name: 'first_name' }, { name: 'last_name' }, { name: 'email' },
    { name: 'phone' }, { name: 'company' },
  ];

  /**
   * Typed accessor for the node's data payload narrowed to {@link AgentNodeData}.
   *
   * @returns The node data cast to `AgentNodeData`.
   */
  public get agentData(): AgentNodeData { return this.node().data as AgentNodeData; }

  /**
   * Shorthand accessor for the node's info-collection items.
   *
   * @returns The array of {@link InfoCollectionItem} entries, or an empty array.
   */
  public get infoCollection(): InfoCollectionItem[] { return this.agentData.infoCollection || []; }

  /**
   * Merges partial changes into the node's agent data.
   *
   * @param data - The fields to update. Only the provided keys are overwritten.
   */
  public update(data: Partial<AgentNodeData>): void {
    this.state.updateNodeData(this.node().id, data);
  }

  /**
   * Handles LLM model selection from the dropdown.
   * Constructs a minimal {@link AIAgentModel} object from the selected ID,
   * or clears the model when the empty option is chosen.
   *
   * @param modelId - The selected model identifier string, or an empty string to clear.
   */
  public onModelChange(modelId: string): void {
    const model = modelId ? { id: modelId, name: modelId, provider: 'google' } : null;
    this.update({ aiAgentModel: model });
  }

  /**
   * Adds a newly created field (from the field-creation modal) to this node's info-collection,
   * always setting its type to `'required'`.
   *
   * @param field - The {@link InfoCollectionItem} emitted by the modal.
   */
  public onFieldCreated(field: InfoCollectionItem): void {
    this.state.addInfoCollectionToNode(this.node().id, { ...field, type: 'required' });
  }

  /**
   * Removes an info-collection field from this node.
   *
   * @param fieldId - The ID of the {@link InfoCollectionItem} to remove.
   */
  public removeField(fieldId: string): void {
    this.state.removeInfoCollectionFromNode(this.node().id, fieldId);
  }

  /**
   * Appends a new blank info-collection row to the node, pre-labelled "Seleccionar campo"
   * and typed as `'required'`. The user must then pick a label from the dropdown.
   */
  public addPredefinedField(): void {
    const item: InfoCollectionItem = {
      id: Date.now().toString(),
      label: 'Seleccionar campo',
      description: '',
      targetField: '',
      type: 'required',
    };
    this.state.addInfoCollectionToNode(this.node().id, item);
  }

  /**
   * Toggles the field-label dropdown for a specific info-collection row.
   * If the dropdown for `fieldId` is already open, it is closed; otherwise it opens
   * and the search input is cleared.
   *
   * @param fieldId - The ID of the info-collection row to toggle.
   */
  public openDropdown(fieldId: string): void {
    if (this.openDropdownId() === fieldId) {
      this.openDropdownId.set(null);
    } else {
      this.openDropdownId.set(fieldId);
      this.fieldSearch.set('');
    }
  }

  /**
   * Assigns a new label to an info-collection field and auto-derives its `targetField`
   * key by lowercasing, stripping diacritics, and replacing spaces with underscores.
   * Closes and resets the dropdown after saving.
   *
   * @param fieldId - The ID of the info-collection row to update.
   * @param label - The human-readable label selected by the user.
   */
  public setFieldLabel(fieldId: string, label: string): void {
    const targetField = label.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_');
    this.state.updateInfoCollectionInNode(this.node().id, fieldId, { label, targetField });
    this.openDropdownId.set(null);
    this.fieldSearch.set('');
  }

  /**
   * Flips the `required`/`optional` type of a single info-collection field.
   *
   * @param fieldId - The ID of the {@link InfoCollectionItem} to toggle.
   */
  public toggleRequired(fieldId: string): void {
    const field = this.infoCollection.find(f => f.id === fieldId);
    if (!field) return;
    this.state.updateInfoCollectionInNode(this.node().id, fieldId, {
      type: field.type === 'optional' ? 'required' : 'optional',
    });
  }

  /**
   * Bulk-toggles all info-collection fields between `'required'` and `'optional'`.
   * If every field is already required, all are set to optional; otherwise all are set to required.
   */
  public toggleSelectAll(): void {
    const allRequired = this.isAllRequired();
    const updated = this.infoCollection.map(f => ({
      ...f,
      type: (allRequired ? 'optional' : 'required') as 'required' | 'optional',
    }));
    this.update({ infoCollection: updated });
  }

  /**
   * Handles `input` events on the conversation-goal textarea.
   * Detects `@` (tool mention) and `/` (field mention) triggers and populates
   * the inline dropdown with matching items. Hides the dropdown when no trigger is active.
   *
   * @param event - The native DOM `input` event from the textarea.
   */
  public onInput(event: Event): void {
    const ta = event.target as HTMLTextAreaElement;
    const pos = ta.selectionStart;
    const text = ta.value.substring(0, pos);
    const atIdx = text.lastIndexOf('@');
    const slashIdx = text.lastIndexOf('/');
    const triggerIdx = Math.max(atIdx, slashIdx);

    if (triggerIdx >= 0 && !text.substring(triggerIdx + 1).includes(' ')) {
      this.mentionStart = triggerIdx;
      const prefix = text[triggerIdx];
      this.mentionPrefix.set(prefix);
      const search = text.substring(triggerIdx + 1).toLowerCase();
      const source = prefix === '@' ? this.mockTools : this.mockFields;
      const items = source.filter(item => item.name.toLowerCase().includes(search));
      this.filteredItems.set(items);
      this.showMentions.set(items.length > 0);
    } else {
      this.showMentions.set(false);
    }
  }

  /**
   * Inserts a selected mention (tool or field) into the conversation-goal textarea
   * at the position of the trigger character, replacing the partial text typed after it.
   * Prevents the default mouse event to avoid blurring the textarea.
   *
   * @param name - The tool or field name to insert.
   * @param event - The `mousedown` event from the dropdown item; propagation is prevented.
   */
  public insertMention(name: string, event: MouseEvent): void {
    event.preventDefault();
    const current = this.agentData.conversationGoal || '';
    const before = current.substring(0, this.mentionStart);
    const after = current.substring(this.mentionStart).replace(/^[@/]\S*/, '');
    const newValue = `${before}${this.mentionPrefix()}[${name}]${after}`;
    this.showMentions.set(false);
    this.update({ conversationGoal: newValue, description: newValue });
  }
}
