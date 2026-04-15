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
  /** Emits when the modal is dismissed without creating a field. */
  public readonly closed = output<void>();
  /** Emits the newly created {@link InfoCollectionItem} when the user confirms. */
  public readonly created = output<InfoCollectionItem>();

  /** Current value of the field-name input. */
  public name = signal('');
  /** Current value of the field-description input. */
  public description = signal('');
  /** Selected data type for the field (e.g. `'Texto'`, `'Número'`, `'Email'`, `'Fecha'`). */
  public dataType = signal('Texto');
  /** Optional maximum character length for the field. `null` when not set. */
  public length = signal<number | null>(null);

  /**
   * `true` when both `name` and `description` contain non-whitespace content,
   * meaning the form is valid and the create action can proceed.
   *
   * @returns `true` when the form is valid.
   */
  public get canCreate(): boolean {
    return !!this.name().trim() && !!this.description().trim();
  }

  /**
   * Validates the form, emits the new {@link InfoCollectionItem} via `created`,
   * dismisses the modal via `closed`, and resets all form signals to their initial values.
   * No-ops when `canCreate` is `false`.
   */
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
