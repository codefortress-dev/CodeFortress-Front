import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { CatalogComponent } from './catalog/pages/product-list/catalog.component';
import { CustomRequestComponent } from './custom-request/custom-request.component';
import { ProductDetailComponent } from './catalog/pages/product-detail/product-detail.component';
import { CartComponent } from './core/cart/cart.component';
import { CheckoutComponent } from './core/checkout/checkout.component';
import { ThankYouComponent } from './core/thank-you/thank-you.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'solicitar', component: CustomRequestComponent },
  {
    path: 'productos',
    children: [
      { path: '', component: CatalogComponent },
      { path: ':id', component: ProductDetailComponent }
    ]
  },
  { path: 'carrito', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'thank-you/:orderId', component: ThankYouComponent },
];
