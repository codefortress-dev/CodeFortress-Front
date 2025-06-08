import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { provideNativeDateAdapter } from '@angular/material/core';


bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideHttpClient(),
    provideNativeDateAdapter(), // ✅ esto es obligatorio para datepicker
    importProvidersFrom(MatNativeDateModule) // ✅ necesario para el adapter nativo
  ]
}).catch(err => console.error(err));
