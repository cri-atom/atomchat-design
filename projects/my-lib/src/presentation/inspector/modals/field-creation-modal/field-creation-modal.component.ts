import { Component, ChangeDetectionStrategy, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { InfoCollectionItem } from '../../../../core/model/agent-flow.model';

@Component({
  selector: 'flowagent-field-creation-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, TranslocoModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './field-creation-modal.component.html',
  styleUrl: './field-creation-modal.component.scss',
})
export class FieldCreationModalComponent {
  public readonly closed = output<void>();
  public readonly created = output<InfoCollectionItem>();

  public name = signal('');
  public description = signal('');
  public dataType = signal('Texto');
  public length = signal<number | null>(null);

  public get canCreate(): boolean {
    return !!this.name().trim() && !!this.description().trim();
  }

  public create(): void {
    if (!this.canCreate) return;
    this.created.emit({
      id: `field-${Date.now()}`,
      label: this.name().trim(),
      description: this.description().trim(),
      targetField: this.name().trim().toLowerCase().replace(/\s+/g, '_'),
    });
    this.closed.emit();
    this.name.set('');
    this.description.set('');
    this.dataType.set('Texto');
    this.length.set(null);
  }
}
