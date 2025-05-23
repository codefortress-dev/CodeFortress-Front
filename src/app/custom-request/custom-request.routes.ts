import { Routes } from '@angular/router';

export const requestRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./custom-request.component').then(m => m.CustomRequestComponent)
  }
];
