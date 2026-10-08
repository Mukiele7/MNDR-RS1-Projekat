import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const majstorGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getCurrentUser();

  if (
    authService.isAuthenticated() &&
    (user?.role === 'Majstor' || user?.uloga === 'Majstor')
  ) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
