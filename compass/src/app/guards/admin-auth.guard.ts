import { CanActivateFn , Router} from '@angular/router';
import { AuthService } from './../service/auth.service';
import { inject } from '@angular/core';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.adminAlreadLoggedIn()) {
    return true;
  }
  router.navigate(['/admin_login']);
  return false;
};
