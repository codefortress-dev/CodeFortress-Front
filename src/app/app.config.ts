import { ApplicationConfig, APP_INITIALIZER, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// 🛠️ Loader para traducciones
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/i18n/', '.json'); // desde carpeta public
}

// 🔁 Inicializador para aplicar idioma al inicio
export function initTranslate(translate: TranslateService) {
  return () => {
    const lang = localStorage.getItem('lang') || navigator.language.split('-')[0] || 'es';
    const finalLang = ['es', 'en'].includes(lang) ? lang : 'es';
    translate.setDefaultLang('es');
    return translate.use(finalLang).toPromise();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),

    // 🧠 Traducción + Material iconos
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'es',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      }),
      MatIconModule,
      MatButtonModule 
    ),

    {
      provide: APP_INITIALIZER,
      useFactory: initTranslate,
      deps: [TranslateService],
      multi: true,
    },
  ]
};
