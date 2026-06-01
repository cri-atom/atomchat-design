import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AbIconComponent } from '../../../shared/ab-icon/ab-icon.component';
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
  imports: [AbIconComponent, FormsModule, TranslocoModule, MatFormFieldModule, MatInputModule],
  templateUrl: './tool-selection-modal.component.html',
  styleUrl: './tool-selection-modal.component.scss',
})
export class ToolSelectionModalComponent {
  /** Tools already added to the node; reserved for future pre-selection logic. */
  public readonly selectedTools = input<Tool[]>([]);
  /** Emits when the modal is dismissed without saving. */
  public readonly closed = output<void>();
  /** Emits the confirmed array of {@link Tool} items when the user confirms the selection. */
  public readonly saved = output<Tool[]>();

  /**
   * Current step in the three-step wizard:
   * - `'SELECT_TOOLKIT'`: the user picks an integration.
   * - `'CONNECT_TOOLKIT'`: the selected toolkit is not connected; prompts authorization.
   * - `'SELECT_TOOLS'`: the user picks individual tools from the connected toolkit.
   */
  public readonly step = signal<ModalStep>('SELECT_TOOLKIT');
  /** The toolkit currently selected in the wizard. `null` on the first step. */
  public readonly selectedToolkit = signal<Toolkit | null>(null);
  /** Current value of the search input, shared across all wizard steps. */
  public readonly search = signal('');
  /** Tools selected in the current modal session (not yet confirmed). */
  public readonly tempSelected = signal<ToolItem[]>([]);

  /** Full list of available toolkits. Currently backed by mock data. */
  public readonly toolkits = MOCK_TOOLKITS;

  /**
   * Toolkits visible in the list after applying the current `search` filter.
   * Returns all toolkits when the search string is empty.
   */
  public readonly filteredToolkits = computed(() => {
    const q = this.search().toLowerCase();
    return q ? this.toolkits.filter(t => t.name.toLowerCase().includes(q)) : this.toolkits;
  });

  /**
   * Tools of the selected toolkit visible after applying the current `search` filter.
   * Returns an empty array when no toolkit is selected.
   */
  public readonly filteredTools = computed(() => {
    const toolkit = this.selectedToolkit();
    if (!toolkit) return [];
    const q = this.search().toLowerCase();
    const tools = MOCK_TOOLS.filter(t => t.toolkitId === toolkit.id);
    return q ? tools.filter(t => t.name.toLowerCase().includes(q)) : tools;
  });

  /**
   * Selects a toolkit and advances to the appropriate wizard step.
   * Connected toolkits go directly to `'SELECT_TOOLS'`; unconnected ones go to `'CONNECT_TOOLKIT'`.
   *
   * @param toolkit - The toolkit the user clicked on.
   */
  public selectToolkit(toolkit: Toolkit): void {
    this.selectedToolkit.set(toolkit);
    this.search.set('');
    this.step.set(toolkit.connected ? 'SELECT_TOOLS' : 'CONNECT_TOOLKIT');
  }

  /**
   * Returns to the `'SELECT_TOOLKIT'` step, clearing the current toolkit and search.
   */
  public goBack(): void {
    this.step.set('SELECT_TOOLKIT');
    this.selectedToolkit.set(null);
    this.search.set('');
  }

  /**
   * Returns whether a specific tool is in the current selection.
   *
   * @param tool - The tool item to check.
   * @returns `true` when the tool is currently selected.
   */
  public isToolSelected(tool: ToolItem): boolean {
    return this.tempSelected().some(t => t.id === tool.id);
  }

  /**
   * Adds the tool to `tempSelected` if not already present, or removes it if it is.
   *
   * @param tool - The tool item to toggle.
   */
  public toggleTool(tool: ToolItem): void {
    if (this.isToolSelected(tool)) {
      this.tempSelected.update(sel => sel.filter(t => t.id !== tool.id));
    } else {
      this.tempSelected.update(sel => [...sel, tool]);
    }
  }

  /**
   * Confirms the selection by converting `tempSelected` to {@link Tool} objects and emitting them
   * via `saved`. Always dismisses the modal via `closed` regardless of the current step.
   * No tools are emitted when confirming from a non-tool-selection step.
   */
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

  /**
   * Returns the uppercase first character of an icon string, used as a text fallback
   * when no icon asset is available.
   *
   * @param icon - The icon identifier string (e.g. `'gmail'`).
   * @returns A single uppercase letter, or `'?'` for empty strings.
   */
  public getToolkitInitial(icon: string): string {
    return icon[0]?.toUpperCase() ?? '?';
  }
}
