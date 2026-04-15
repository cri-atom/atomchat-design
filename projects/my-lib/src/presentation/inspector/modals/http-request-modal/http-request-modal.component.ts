import { Component, ChangeDetectionStrategy, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HttpToolConfig } from '../../../../core/model/agent-flow.model';

@Component({
  selector: 'flowagent-http-request-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, TranslocoModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './http-request-modal.component.html',
  styleUrl: './http-request-modal.component.scss',
})
export class HttpRequestModalComponent {
  /** Emits when the modal is dismissed without saving. */
  public readonly closed = output<void>();
  /** Emits the configured {@link HttpToolConfig} when the user saves. */
  public readonly saved = output<HttpToolConfig>();

  /** User-defined display name for this HTTP tool. */
  public readonly name = signal('Petición HTTP #1');
  /** HTTP method selected for the request. */
  public readonly method = signal<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'>('GET');
  /** Target URL for the request. Must be non-empty for the form to be valid. */
  public readonly url = signal('');
  /** Whether the request body section is enabled and will be included in the config. */
  public readonly hasBody = signal(false);
  /** Whether the custom headers section is enabled and will be included in the config. */
  public readonly hasHeaders = signal(false);
  /** Whether the authorization section is expanded (UI state only). */
  public readonly hasAuth = signal(false);
  /** Whether the "save response" section is expanded (UI state only). */
  public readonly saveResponse = signal(false);
  /** Whether the "handle response codes" section is expanded (UI state only). */
  public readonly handleResponseCodes = signal(false);
  /** Whether the API timeout section is expanded (UI state only). */
  public readonly apiTimeout = signal(false);
  /** Whether the advanced settings accordion is open. */
  public readonly showAdvanced = signal(false);
  /** Whether the informational "learn more" panel is visible. */
  public readonly showInfo = signal(false);

  private readonly transloco = inject(TranslocoService);

  /**
   * `true` when `url` contains non-whitespace content, meaning the form is valid
   * and the save action can proceed.
   *
   * @returns `true` when the form is valid.
   */
  public get canSave(): boolean { return !!this.url().trim(); }

  /**
   * Builds an {@link HttpToolConfig} from the current form state, emits it via `saved`,
   * and dismisses the modal via `closed`.
   * Headers and body template are only included when their respective toggles are enabled.
   * No-ops when `canSave` is `false`.
   */
  public save(): void {
    if (!this.canSave) return;
    this.saved.emit({
      id: `http-${Date.now()}`,
      name: this.name(),
      description: `${this.transloco.translate('modals.http_request.request_label')} ${this.method()} ${this.transloco.translate('modals.http_request.to')} ${this.url()}`,
      method: this.method(),
      url: this.url(),
      headers: this.hasHeaders() ? {} : undefined,
      bodyTemplate: this.hasBody() ? '' : undefined,
    });
    this.closed.emit();
  }
}
