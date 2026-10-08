import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getCurrentUser();

  if (authService.isAuthenticated() && user?.role === 'Administrator') {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
