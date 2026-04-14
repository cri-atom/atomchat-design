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
  public readonly node = input.required<FlowAgentNode>();
  private readonly state = inject(FlowAgentInternalStateService);

  public readonly showInfoSection = signal(false);
  public readonly showAdvancedSection = signal(false);
  public readonly showFieldModal = signal(false);
  public readonly showPromptModal = signal(false);

  public readonly showMentions = signal(false);
  public readonly filteredItems = signal<{ name: string }[]>([]);
  public readonly mentionPrefix = signal('@');
  private mentionStart = -1;

  public readonly openDropdownId = signal<string | null>(null);
  public readonly fieldSearch = signal('');

  public readonly filteredPredefined = computed(() =>
    PREDEFINED_FIELDS.filter(f => f.toLowerCase().includes(this.fieldSearch().toLowerCase()))
  );

  public readonly isAllRequired = computed(() => {
    const fields = (this.node().data as AgentNodeData).infoCollection || [];
    return fields.length > 0 && fields.every(f => f.type !== 'optional');
  });

  private readonly mockTools = [{ name: 'helloWorld' }];
  private readonly mockFields = [
    { name: 'first_name' }, { name: 'last_name' }, { name: 'email' },
    { name: 'phone' }, { name: 'company' },
  ];

  public get agentData(): AgentNodeData { return this.node().data as AgentNodeData; }
  public get infoCollection(): InfoCollectionItem[] { return this.agentData.infoCollection || []; }

  public update(data: Partial<AgentNodeData>): void {
    this.state.updateNodeData(this.node().id, data);
  }

  public onModelChange(modelId: string): void {
    const model = modelId ? { id: modelId, name: modelId, provider: 'google' } : null;
    this.update({ aiAgentModel: model });
  }

  public onFieldCreated(field: InfoCollectionItem): void {
    this.state.addInfoCollectionToNode(this.node().id, { ...field, type: 'required' });
  }

  public removeField(fieldId: string): void {
    this.state.removeInfoCollectionFromNode(this.node().id, fieldId);
  }

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

  public openDropdown(fieldId: string): void {
    if (this.openDropdownId() === fieldId) {
      this.openDropdownId.set(null);
    } else {
      this.openDropdownId.set(fieldId);
      this.fieldSearch.set('');
    }
  }

  public setFieldLabel(fieldId: string, label: string): void {
    const targetField = label.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_');
    this.state.updateInfoCollectionInNode(this.node().id, fieldId, { label, targetField });
    this.openDropdownId.set(null);
    this.fieldSearch.set('');
  }

  public toggleRequired(fieldId: string): void {
    const field = this.infoCollection.find(f => f.id === fieldId);
    if (!field) return;
    this.state.updateInfoCollectionInNode(this.node().id, fieldId, {
      type: field.type === 'optional' ? 'required' : 'optional',
    });
  }

  public toggleSelectAll(): void {
    const allRequired = this.isAllRequired();
    const updated = this.infoCollection.map(f => ({
      ...f,
      type: (allRequired ? 'optional' : 'required') as 'required' | 'optional',
    }));
    this.update({ infoCollection: updated });
  }

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
