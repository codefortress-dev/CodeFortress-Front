import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NgxPermissionsModule } from 'ngx-permissions';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideHttpClient(),
     provideRouter(routes),
    provideNativeDateAdapter(), // ✅ esto es obligatorio para datepicker
    importProvidersFrom(MatNativeDateModule,NgxPermissionsModule.forRoot()) // ✅ necesario para el adapter nativo
  
  ]
}).catch(err => console.error(err));
