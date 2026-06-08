import { CanActivateFn , Router} from '@angular/router';
import { AuthService } from './../service/auth.service';
import { inject } from '@angular/core';

export const loggedinGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.customerAlreadLoggedIn()) {
    return true;
  }
  router.navigate(['/profile']);
  return false;


};
