import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.getUser();

  if (!user?.permissions?.includes('admin-access')) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
