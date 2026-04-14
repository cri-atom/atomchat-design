import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Tool } from '../../../../core/model/agent-flow.model';

interface Toolkit { id: string; name: string; icon: string; descriptionKey: string; connected: boolean; }
interface ToolItem { id: string; name: string; descriptionKey: string; toolkitId: string; }

type ModalStep = 'SELECT_TOOLKIT' | 'CONNECT_TOOLKIT' | 'SELECT_TOOLS';

const MOCK_TOOLKITS: Toolkit[] = [
  { id: 'gmail', name: 'Gmail', icon: 'gmail', descriptionKey: 'modals.tool_selection.toolkits.gmail', connected: true },
  { id: 'github', name: 'GitHub', icon: 'github', descriptionKey: 'modals.tool_selection.toolkits.github', connected: false },
  { id: 'googlecalendar', name: 'Google Calendar', icon: 'calendar', descriptionKey: 'modals.tool_selection.toolkits.google_calendar', connected: false },
  { id: 'notion', name: 'Notion', icon: 'notion', descriptionKey: 'modals.tool_selection.toolkits.notion', connected: false },
  { id: 'googlesheets', name: 'Google Sheets', icon: 'sheets', descriptionKey: 'modals.tool_selection.toolkits.google_sheets', connected: false },
];

const MOCK_TOOLS: ToolItem[] = [
  { id: 'gmail-1', name: 'Modify email labels', descriptionKey: 'modals.tool_selection.tools.gmail_1', toolkitId: 'gmail' },
  { id: 'gmail-2', name: 'Batch delete Gmail messages', descriptionKey: 'modals.tool_selection.tools.gmail_2', toolkitId: 'gmail' },
  { id: 'gmail-3', name: 'Create email draft', descriptionKey: 'modals.tool_selection.tools.gmail_3', toolkitId: 'gmail' },
  { id: 'gmail-4', name: 'Send email', descriptionKey: 'modals.tool_selection.tools.gmail_4', toolkitId: 'gmail' },
];

@Component({
  selector: 'flowagent-tool-selection-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, TranslocoModule, MatFormFieldModule, MatInputModule],
  templateUrl: './tool-selection-modal.component.html',
  styleUrl: './tool-selection-modal.component.scss',
})
export class ToolSelectionModalComponent {
  public readonly selectedTools = input<Tool[]>([]);
  public readonly closed = output<void>();
  public readonly saved = output<Tool[]>();

  public readonly step = signal<ModalStep>('SELECT_TOOLKIT');
  public readonly selectedToolkit = signal<Toolkit | null>(null);
  public readonly search = signal('');
  public readonly tempSelected = signal<ToolItem[]>([]);

  public readonly toolkits = MOCK_TOOLKITS;

  public readonly filteredToolkits = computed(() => {
    const q = this.search().toLowerCase();
    return q ? this.toolkits.filter(t => t.name.toLowerCase().includes(q)) : this.toolkits;
  });

  public readonly filteredTools = computed(() => {
    const toolkit = this.selectedToolkit();
    if (!toolkit) return [];
    const q = this.search().toLowerCase();
    const tools = MOCK_TOOLS.filter(t => t.toolkitId === toolkit.id);
    return q ? tools.filter(t => t.name.toLowerCase().includes(q)) : tools;
  });

  public selectToolkit(toolkit: Toolkit): void {
    this.selectedToolkit.set(toolkit);
    this.search.set('');
    this.step.set(toolkit.connected ? 'SELECT_TOOLS' : 'CONNECT_TOOLKIT');
  }

  public goBack(): void {
    this.step.set('SELECT_TOOLKIT');
    this.selectedToolkit.set(null);
    this.search.set('');
  }

  public isToolSelected(tool: ToolItem): boolean {
    return this.tempSelected().some(t => t.id === tool.id);
  }

  public toggleTool(tool: ToolItem): void {
    if (this.isToolSelected(tool)) {
      this.tempSelected.update(sel => sel.filter(t => t.id !== tool.id));
    } else {
      this.tempSelected.update(sel => [...sel, tool]);
    }
  }

  public confirm(): void {
    if (this.step() === 'SELECT_TOOLS') {
      const tools: Tool[] = this.tempSelected().map(t => ({
        id: t.id,
        name: t.name,
        description: t.descriptionKey,
        toolkitSlug: this.selectedToolkit()?.id ?? '',
        toolSlug: t.id,
      }));
      this.saved.emit(tools);
    }
    this.closed.emit();
  }

  public getToolkitInitial(icon: string): string {
    return icon[0]?.toUpperCase() ?? '?';
  }
}
