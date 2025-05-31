import { APP_INITIALIZER } from '@angular/core';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/i18n/', '.json'); // ← PUBLIC
}

export function initTranslate(translate: TranslateService) {
   return () => {
    const savedLang = localStorage.getItem('lang');
    const browserLang = navigator.language.split('-')[0];
    const lang = savedLang || (['es', 'en'].includes(browserLang) ? browserLang : 'es');

    translate.setDefaultLang('es');
    return translate.use(lang).toPromise();
  };
}

export const i18nProviders = [
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient]
    },
    defaultLanguage: 'es'
  }).providers!,
  {
    provide: APP_INITIALIZER,
    useFactory: initTranslate,
    deps: [TranslateService],
    multi: true
  }
];

