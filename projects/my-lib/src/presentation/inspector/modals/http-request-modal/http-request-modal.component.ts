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
  public readonly closed = output<void>();
  public readonly saved = output<HttpToolConfig>();

  public readonly name = signal('Petición HTTP #1');
  public readonly method = signal<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'>('GET');
  public readonly url = signal('');
  public readonly hasBody = signal(false);
  public readonly hasHeaders = signal(false);
  public readonly hasAuth = signal(false);
  public readonly saveResponse = signal(false);
  public readonly handleResponseCodes = signal(false);
  public readonly apiTimeout = signal(false);
  public readonly showAdvanced = signal(false);
  public readonly showInfo = signal(false);
  private readonly transloco = inject(TranslocoService);

  public get canSave(): boolean { return !!this.url().trim(); }

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
