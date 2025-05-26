/* import { Routes } from '@angular/router';

export const catalogRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./catalog.component').then(m => m.CatalogComponent)
  }
];
 */
import { Routes } from '@angular/router';
import { CatalogComponent } from './catalog.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

export const catalogRoutes: Routes = [
  { path: '', component: CatalogComponent },
  { path: ':id', component: ProductDetailComponent }
];
