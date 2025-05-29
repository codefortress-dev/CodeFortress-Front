import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { CatalogComponent } from './catalog/pages/product-list/catalog.component';
import { CustomRequestComponent } from './custom-request/custom-request.component';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'productos', component: CatalogComponent },
  { path: 'solicitar', component: CustomRequestComponent },
];
