import { Routes } from '@angular/router';
import { authGuard } from './core/services/auth.guard';
import { adminGuard } from './core/services/admin.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { CatalogComponent } from './catalog/pages/product-list/catalog.component';
import { CustomRequestComponent } from './custom-request/custom-request.component';
import { ProductDetailComponent } from './catalog/pages/product-detail/product-detail.component';
import { CartComponent } from './core/cart/cart.component';
import { CheckoutComponent } from './core/checkout/checkout.component';
import { ThankYouComponent } from './core/thank-you/thank-you.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { EmployeesComponent } from './pages/admin-dashboard/pages/employees/employees.component';
import { RolesComponent } from './pages/admin-dashboard/pages/roles/roles.component';
import { PermissionsComponent } from './pages/admin-dashboard/pages/permission/permissions.component';
import { CategoryAdminComponent } from './pages/admin-dashboard/pages/categories/category-admin.component';
import { ProductAdminComponent } from './pages/admin-dashboard/pages/products/product-admin.component';
import { SalesComponent } from './pages/admin-dashboard/pages/sales/sales.component';
import { CustomProjectsComponent } from './pages/admin-dashboard/pages/custom-projects/custom-projects.component';
import { loginRedirectGuard } from "./core/services/login-redirect.guard";
import { UserProfileComponent } from './pages/admin-dashboard/pages/user-profile/user-profile.component';
import { PasswordRecoveryComponent } from './pages/admin-dashboard/pages/password-recovery/password-recovery.component';
import { TrialRequestComponent } from './trial-request/trial-request.component';
import { ActionSuccessComponent } from './shared/components/success-componet/success.component';
import { ActionErrorComponent } from './shared/components/error-componet/error.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [loginRedirectGuard] },
  { path: 'recuperar-contrasenia', component: PasswordRecoveryComponent },
  { path: 'solicitar', component: CustomRequestComponent },
  { path: 'trial-license', component: TrialRequestComponent },
  { path: 'success', component: ActionSuccessComponent },
  { path: 'error', component: ActionErrorComponent },
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

  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [authGuard],
    data: {
      permissions: {
        only: ['admin-access'],
        redirectTo: '/login'
      }
    },
    children: [
      { path: 'employees', component: EmployeesComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'permissions', component: PermissionsComponent },
      { path: 'categories', component: CategoryAdminComponent },
      { path: 'products', component: ProductAdminComponent },
      { path: 'sales', component: SalesComponent },
      { path: 'custom-software', component: CustomProjectsComponent },
      { path: 'user-profile', component: UserProfileComponent }
    ]
  }
];