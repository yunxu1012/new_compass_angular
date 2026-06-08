import { CanActivateFn , Router} from '@angular/router';
import { AuthService } from './../service/auth.service';
import { inject } from '@angular/core';

export const adminLoggedinGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.adminAlreadLoggedIn()) {
    return true;
  }
  router.navigate(['/customer-list']);
  return false;
};
