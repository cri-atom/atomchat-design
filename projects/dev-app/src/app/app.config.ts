import { ApplicationConfig, Injector, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AtomAgentBuilderModule } from '../../../../projects/my-lib/public-api';
import { provideAppTransloco } from './transloco.providers';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    provideRouter(routes),
    provideAppTransloco(),
    { provide: 'injector', useExisting: Injector },
    {
      provide: 'environment',
      useValue: {
        cloudFunctionUrl: 'http://localhost:3000/api/',
        openaiEnv: 'development',
        aiConfig: {
          baseUrl: 'http://localhost:3000/api/',
          environment: 'development',
        },
      },
    },
    importProvidersFrom(
      AtomAgentBuilderModule.forRoot(),
    ),
  ],
};
