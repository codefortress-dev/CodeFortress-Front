import { Routes } from '@angular/router';
import { HomeComponent } from './public/home/home.component'; // (lo crearás luego)
import { LoginComponent } from './auth/login/login.component'; // (lo crearás luego)

export const routes: Routes = [
    { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'productos', loadChildren: () => import('./catalog/catalog.routes').then(m => m.catalogRoutes) },
  { path: 'solicitar', loadChildren: () => import('./custom-request/custom-request.routes').then(m => m.requestRoutes) }
];
