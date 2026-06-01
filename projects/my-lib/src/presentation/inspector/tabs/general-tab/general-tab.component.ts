import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, inject, input, signal, computed, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FlowAgentInternalStateService } from '../../../../application/state/flow-agent-internal-state.service';
import { FlowAgentNode, AgentNodeData, InfoCollectionItem } from '../../../../core/model/agent-flow.model';
import { FieldCreationModalComponent } from '../../modals/field-creation-modal/field-creation-modal.component';
import { AbIconComponent } from '../../../shared/ab-icon/ab-icon.component';

const PREDEFINED_FIELDS = ['Nombre', 'Apellido', 'Email', 'Teléfono', 'Empresa', 'Dirección', 'Ciudad', 'País'];

@Component({
  selector: 'flowagent-general-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AbIconComponent, FormsModule, TranslocoModule, MatFormFieldModule, MatInputModule, MatSelectModule, FieldCreationModalComponent],
  templateUrl: './general-tab.component.html',
  styleUrl: './general-tab.component.scss',
})
export class GeneralTabComponent implements OnDestroy {
  /** The agent node whose general configuration (goal, fields, model) is edited in this tab. */
  public readonly node = input.required<FlowAgentNode>();

  @ViewChild('goalTextarea') goalTextarea!: ElementRef<HTMLTextAreaElement>;

  private readonly state = inject(FlowAgentInternalStateService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly transloco = inject(TranslocoService);

  /** Controls visibility of the "Info fields" collapsible section. */
  public readonly showInfoSection = signal(true);
  /** Controls visibility of the "Advanced configuration" collapsible section. */
  public readonly showAdvancedSection = signal(false);
  /** Controls visibility of the field-creation modal overlay. */
  public readonly showFieldModal = signal(false);

  private mentionStart = -1;
  private fieldStart = -1;
  private dropdownEl: HTMLElement | null = null;

  private readonly SYSTEM_FIELDS = [
    { name: 'first_name' }, { name: 'last_name' }, { name: 'email' },
    { name: 'phone' }, { name: 'company' },
  ];

  /**
   * `true` when every info-collection field on this node is marked as `'required'`
   * and the list is non-empty. Used to drive the "select all" checkbox state.
   */
  public readonly isAllRequired = computed(() => {
    const fields = (this.node().data as AgentNodeData).infoCollection || [];
    return fields.length > 0 && fields.every(f => f.type !== 'optional');
  });

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
   * Returns selectable labels for a specific info-field row.
   * Excludes predefined labels already selected by other rows while preserving
   * the current row value (including custom labels).
   *
   * @param fieldId - The ID of the info-field row requesting options.
   * @returns An array of label strings available for this row.
   */
  public infoFieldOptions(fieldId: string): string[] {
    const current = this.infoCollection.find(field => field.id === fieldId)?.label;
    const selectedByOthers = new Set(
      this.infoCollection
        .filter(field => field.id !== fieldId)
        .map(field => field.label)
        .filter(label => PREDEFINED_FIELDS.includes(label))
    );
    const options = PREDEFINED_FIELDS.filter(option => !selectedByOthers.has(option));
    return current && !options.includes(current) ? [current, ...options] : options;
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

  public onGoalInput(event: Event): void {
    const ta = event.target as HTMLTextAreaElement;
    const pos = ta.selectionStart ?? ta.value.length;
    const text = ta.value.substring(0, pos);
    const atIdx = text.lastIndexOf('@');
    const slashIdx = text.lastIndexOf('/');
    const activeAt = atIdx >= 0 && !text.substring(atIdx + 1).includes(' ');
    const activeSlash = slashIdx >= 0 && !text.substring(slashIdx + 1).includes(' ');

    if (activeAt && (!activeSlash || atIdx > slashIdx)) {
      this.mentionStart = atIdx;
      const search = text.substring(atIdx + 1).toLowerCase();
      const tools = (this.agentData.tools || [])
        .filter(t => t.name.toLowerCase().includes(search))
        .map(t => ({ name: t.name }));
      this.showDropdown('tools', tools, ta, atIdx);
    } else if (activeSlash && (!activeAt || slashIdx > atIdx)) {
      this.fieldStart = slashIdx;
      const search = text.substring(slashIdx + 1).toLowerCase();
      const custom = (this.agentData.infoCollection || []).map(f => ({ name: f.label }));
      const filtered = [...this.SYSTEM_FIELDS, ...custom].filter(f => f.name.toLowerCase().includes(search));
      this.showDropdown('fields', filtered, ta, slashIdx);
    } else {
      this.destroyDropdown();
    }

    this.update({ conversationGoal: ta.value, description: ta.value });
    this.cdr.markForCheck();
  }

  public closeDropdowns(): void {
    this.destroyDropdown();
  }

  public ngOnDestroy(): void {
    this.destroyDropdown();
  }

  private getCaretViewportPos(ta: HTMLTextAreaElement, cursorPos: number): { x: number; y: number } {
    const cs = window.getComputedStyle(ta);
    const mirror = document.createElement('div');
    const s = mirror.style;
    s.position = 'absolute'; s.visibility = 'hidden'; s.top = '-9999px'; s.left = '-9999px';
    s.overflow = 'auto'; s.width = cs.width; s.fontSize = cs.fontSize;
    s.fontFamily = cs.fontFamily; s.fontWeight = cs.fontWeight;
    s.lineHeight = cs.lineHeight; s.paddingTop = cs.paddingTop;
    s.paddingRight = cs.paddingRight; s.paddingBottom = cs.paddingBottom;
    s.paddingLeft = cs.paddingLeft; s.borderTopWidth = cs.borderTopWidth;
    s.borderRightWidth = cs.borderRightWidth; s.borderBottomWidth = cs.borderBottomWidth;
    s.borderLeftWidth = cs.borderLeftWidth;
    s.borderStyle = 'solid'; s.whiteSpace = 'pre-wrap'; s.wordWrap = 'break-word';
    s.boxSizing = cs.boxSizing;
    mirror.appendChild(document.createTextNode(ta.value.substring(0, cursorPos)));
    const marker = document.createElement('span');
    marker.textContent = '\u200b';
    mirror.appendChild(marker);
    document.body.appendChild(mirror);
    mirror.scrollTop = ta.scrollTop;
    const mRect = marker.getBoundingClientRect();
    const dRect = mirror.getBoundingClientRect();
    document.body.removeChild(mirror);
    const taRect = ta.getBoundingClientRect();
    const lh = cs.lineHeight === 'normal' ? parseFloat(cs.fontSize) * 1.2 : parseFloat(cs.lineHeight);
    return {
      x: taRect.left + (mRect.left - dRect.left),
      y: taRect.top  + (mRect.top  - dRect.top) + lh,
    };
  }

  private showDropdown(type: 'tools' | 'fields', items: { name: string }[], ta: HTMLTextAreaElement, triggerPos: number): void {
    this.destroyDropdown();
    const caret = this.getCaretViewportPos(ta, triggerPos);
    const dH = 220;
    let top = caret.y + 4;
    if (top + dH > window.innerHeight) top = caret.y - 4 - dH;
    top = Math.max(8, top);
    let left = caret.x;
    const width = 220;
    if (left + width > window.innerWidth - 8) left = window.innerWidth - width - 8;

    const el = document.createElement('div');
    Object.assign(el.style, {
      position: 'fixed', top: `${top}px`, left: `${left}px`, width: `${width}px`,
      background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px',
      boxShadow: '0 16px 32px rgba(9,9,11,.12)', zIndex: '99999',
      maxHeight: '200px', overflowY: 'auto', fontFamily: 'inherit',
    });

    const hdr = document.createElement('div');
    Object.assign(hdr.style, {
      display: 'flex', alignItems: 'center', gap: '6px',
      padding: '6px 12px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb',
      fontSize: '11px', fontWeight: '700', color: '#6b7280',
      letterSpacing: '.05em', textTransform: 'uppercase',
    });
    hdr.textContent = this.transloco.translate(
      type === 'tools' ? 'modals.prompt_editor.insert_tool' : 'modals.prompt_editor.insert_field'
    );
    el.appendChild(hdr);

    const renderItems = (list: { name: string }[]) => {
      if (list.length === 0) {
        const empty = document.createElement('p');
        Object.assign(empty.style, { padding: '7px 12px', fontSize: '13px', color: '#9ca3af', fontStyle: 'italic', margin: '0' });
        empty.textContent = this.transloco.translate('modals.prompt_editor.no_results');
        el.appendChild(empty);
        return;
      }
      list.forEach(item => {
        const btn = document.createElement('button');
        Object.assign(btn.style, {
          display: 'flex', alignItems: 'center', width: '100%',
          padding: '7px 12px', background: 'none', border: 'none',
          textAlign: 'left', fontSize: '13px', color: '#111', cursor: 'pointer', fontFamily: 'inherit',
        });
        btn.textContent = item.name;
        btn.addEventListener('mouseover', () => btn.style.background = '#f4f4f5');
        btn.addEventListener('mouseout',  () => btn.style.background = 'none');
        btn.addEventListener('mousedown', (e) => {
          e.preventDefault();
          type === 'tools' ? this.insertMention(item.name, e as MouseEvent) : this.insertField(item.name, e as MouseEvent);
        });
        el.appendChild(btn);
      });
    };

    renderItems(items);
    document.body.appendChild(el);
    this.dropdownEl = el;
  }

  private destroyDropdown(): void {
    this.dropdownEl?.parentNode?.removeChild(this.dropdownEl);
    this.dropdownEl = null;
  }

  public insertMention(name: string, event: MouseEvent): void {
    event.preventDefault();
    const ta = this.goalTextarea.nativeElement;
    const before = ta.value.substring(0, this.mentionStart);
    const after = ta.value.substring(this.mentionStart).replace(/^@\S*/, '');
    const inserted = `@[${name}]`;
    const newValue = before + inserted + after;
    ta.value = newValue;
    ta.setSelectionRange(before.length + inserted.length, before.length + inserted.length);
    ta.focus();
    this.destroyDropdown();
    this.update({ conversationGoal: newValue, description: newValue });
  }

  public insertField(name: string, event: MouseEvent): void {
    event.preventDefault();
    const ta = this.goalTextarea.nativeElement;
    const before = ta.value.substring(0, this.fieldStart);
    const after = ta.value.substring(this.fieldStart).replace(/^\/\S*/, '');
    const inserted = `/{${name}}`;
    const newValue = before + inserted + after;
    ta.value = newValue;
    ta.setSelectionRange(before.length + inserted.length, before.length + inserted.length);
    ta.focus();
    this.destroyDropdown();
    this.update({ conversationGoal: newValue, description: newValue });
  }
}
