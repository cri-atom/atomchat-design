import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
  imports: [FormsModule, TranslocoModule, MatFormFieldModule, MatInputModule],
  templateUrl: './file-selection-modal.component.html',
  styleUrl: './file-selection-modal.component.scss',
})
export class FileSelectionModalComponent {
  public readonly selectedFiles = input<KnowledgeBase[]>([]);
  public readonly closed = output<void>();
  public readonly saved = output<KnowledgeBase[]>();

  public readonly search = signal('');
  public readonly files = signal<MockFile[]>([...MOCK_FILES]);
  public readonly tempSelected = signal<MockFile[]>([]);

  public readonly filteredFiles = computed(() => {
    const q = this.search().toLowerCase();
    return q ? this.files().filter(f => f.name.toLowerCase().includes(q)) : this.files();
  });

  public isSelected(file: MockFile): boolean {
    return this.tempSelected().some(f => f.id === file.id);
  }

  public get allSelected(): boolean {
    return this.filteredFiles().length > 0 &&
      this.filteredFiles().every(f => this.isSelected(f));
  }

  public toggleFile(file: MockFile): void {
    if (this.isSelected(file)) {
      this.tempSelected.update(sel => sel.filter(f => f.id !== file.id));
    } else {
      this.tempSelected.update(sel => [...sel, file]);
    }
  }

  public toggleAll(checked: boolean): void {
    if (checked) {
      this.tempSelected.set([...this.filteredFiles()]);
    } else {
      this.tempSelected.set([]);
    }
  }

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
