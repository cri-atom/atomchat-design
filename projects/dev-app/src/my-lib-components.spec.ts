/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideTransloco, translocoConfig, TranslocoLoader } from '@jsverse/transloco';
import { Observable, of } from 'rxjs';

class InlineTranslocoLoader implements TranslocoLoader {
	getTranslation(): Observable<Record<string, string>> {
		return of({});
	}
}

beforeEach(() => {
	TestBed.configureTestingModule({
		providers: [
			provideNoopAnimations(),
			provideTransloco({
				config: translocoConfig({
					availableLangs: ['es'],
					defaultLang: 'es',
					fallbackLang: 'es',
					reRenderOnLangChange: true,
					missingHandler: {
						allowEmpty: true,
						useFallbackTranslation: false,
						logMissingKey: false,
					},
					prodMode: false,
				}),
				loader: InlineTranslocoLoader,
			}),
		],
	});
});

import '../../my-lib/src/presentation/lib/atom-agentbuilder.component.spec';
import '../../my-lib/src/presentation/canvas/editor/editor.component.spec';

import '../../my-lib/src/presentation/inspector/container/inspector.component.spec';

import '../../my-lib/src/presentation/inspector/views/start-node-view/start-node-view.component.spec';
import '../../my-lib/src/presentation/inspector/views/end-node-view/end-node-view.component.spec';
import '../../my-lib/src/presentation/inspector/views/global-settings-view/global-settings-view.component.spec';

import '../../my-lib/src/presentation/inspector/tabs/general-tab/general-tab.component.spec';
import '../../my-lib/src/presentation/inspector/tabs/tools-tab/tools-tab.component.spec';
import '../../my-lib/src/presentation/inspector/tabs/knowledge-base-tab/knowledge-base-tab.component.spec';
import '../../my-lib/src/presentation/inspector/tabs/edges-tab/edges-tab.component.spec';
import '../../my-lib/src/presentation/inspector/tabs/return-transition-tab/return-transition-tab.component.spec';

import '../../my-lib/src/presentation/inspector/modals/tool-selection-modal/tool-selection-modal.component.spec';
import '../../my-lib/src/presentation/inspector/modals/field-creation-modal/field-creation-modal.component.spec';
import '../../my-lib/src/presentation/inspector/modals/file-selection-modal/file-selection-modal.component.spec';
import '../../my-lib/src/presentation/inspector/modals/http-request-modal/http-request-modal.component.spec';
import '../../my-lib/src/presentation/inspector/modals/prompt-editor-modal/prompt-editor-modal.component.spec';

import '../../my-lib/src/application/state/flow-agent-actions.service.spec';
import '../../my-lib/src/application/state/flow-agent-validation.service.spec';
import '../../my-lib/src/core/config/services.config.spec';
import '../../my-lib/src/infrastructure/services/flow-agent-state.service.impl.spec';
import '../../my-lib/src/infrastructure/services/app-config.service.impl.spec';
