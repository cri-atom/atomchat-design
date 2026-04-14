import { provideTransloco, translocoConfig } from '@jsverse/transloco';
import { TranslocoHttpLoader } from './transloco-loader';

export function provideAppTransloco() {
  return provideTransloco({
    config: translocoConfig({
      availableLangs: ['en', 'es', 'pt', 'fr'],
      defaultLang: 'es',
      fallbackLang: 'en',
      reRenderOnLangChange: true,
      prodMode: false,
    }),
    loader: TranslocoHttpLoader,
  });
}
