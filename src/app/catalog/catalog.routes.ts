import { Routes } from '@angular/router';
import { CatalogComponent } from './pages/product-list/catalog.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';

export const catalogRoutes: Routes = [
  { path: '', component: CatalogComponent },
  { path: ':id', component: ProductDetailComponent }
];