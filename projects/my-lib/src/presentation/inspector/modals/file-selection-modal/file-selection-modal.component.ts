import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AbIconComponent } from '../../../shared/ab-icon/ab-icon.component';
import { KnowledgeBase } from '../../../../core/model/agent-flow.model';

interface MockFile {
  id: string;
  name: string;
  size: string;
  type: string;
  updatedAt: string;
}

const MOCK_FILES: MockFile[] = [
  { id: 'f1', name: 'FAQ COMPLETA.docx', size: '336.71 KB', type: 'DOCX', updatedAt: 'Mar 31 3:40 PM' },
  { id: 'f2', name: 'CATALOGO DIV DESIGN.pdf', size: '8.25 MB', type: 'PDF', updatedAt: 'Mar 31 3:15 PM' },
  { id: 'f3', name: 'DivDesign_Productos_e_servicios.docx', size: '192.78 KB', type: 'DOCX', updatedAt: 'Mar 31 3:20 PM' },
  { id: 'f4', name: 'Guia_Estrategico_Preguntas_Respuestas.docx', size: '17.47 KB', type: 'DOCX', updatedAt: 'Mar 31 2:08 PM' },
];

@Component({
  selector: 'flowagent-file-selection-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AbIconComponent, FormsModule, TranslocoModule, MatFormFieldModule, MatInputModule],
  templateUrl: './file-selection-modal.component.html',
  styleUrl: './file-selection-modal.component.scss',
})
export class FileSelectionModalComponent {
  /** Files already attached to the node; used to pre-select rows when the modal opens. */
  public readonly selectedFiles = input<KnowledgeBase[]>([]);
  /** Emits when the modal is dismissed without saving. */
  public readonly closed = output<void>();
  /** Emits the confirmed array of {@link KnowledgeBase} items when the user saves their selection. */
  public readonly saved = output<KnowledgeBase[]>();

  /** Current value of the search input used to filter the file list. */
  public readonly search = signal('');
  /** Full list of available files. Currently backed by mock data. */
  public readonly files = signal<MockFile[]>([...MOCK_FILES]);
  /** Files selected in the current modal session (not yet confirmed). */
  public readonly tempSelected = signal<MockFile[]>([]);

  /**
   * Files visible in the table after applying the current `search` filter.
   * Returns all files when the search string is empty.
   */
  public readonly filteredFiles = computed(() => {
    const q = this.search().toLowerCase();
    return q ? this.files().filter(f => f.name.toLowerCase().includes(q)) : this.files();
  });

  /**
   * Returns whether a specific file is in the current selection.
   *
   * @param file - The file row to check.
   * @returns `true` when the file is currently selected.
   */
  public isSelected(file: MockFile): boolean {
    return this.tempSelected().some(f => f.id === file.id);
  }

  /**
   * `true` when the filtered list is non-empty and every visible file is selected,
   * used to drive the "select all" checkbox state.
   *
   * @returns `true` when all filtered files are selected.
   */
  public get allSelected(): boolean {
    return this.filteredFiles().length > 0 &&
      this.filteredFiles().every(f => this.isSelected(f));
  }

  /**
   * Adds the file to `tempSelected` if not already present, or removes it if it is.
   *
   * @param file - The file row to toggle.
   */
  public toggleFile(file: MockFile): void {
    if (this.isSelected(file)) {
      this.tempSelected.update(sel => sel.filter(f => f.id !== file.id));
    } else {
      this.tempSelected.update(sel => [...sel, file]);
    }
  }

  /**
   * Selects or deselects all currently filtered files at once.
   *
   * @param checked - `true` to select all filtered files; `false` to clear the selection.
   */
  public toggleAll(checked: boolean): void {
    if (checked) {
      this.tempSelected.set([...this.filteredFiles()]);
    } else {
      this.tempSelected.set([]);
    }
  }

  /**
   * Converts the current selection to {@link KnowledgeBase} objects, emits them via `saved`,
   * and dismisses the modal via `closed`.
   */
  public confirm(): void {
    const kbs: KnowledgeBase[] = this.tempSelected().map(f => ({
      id: f.id,
      name: f.name,
      description: '',
      fileName: f.name,
      fileSize: 0,
      uploadDate: f.updatedAt,
    }));
    this.saved.emit(kbs);
    this.closed.emit();
  }
}
