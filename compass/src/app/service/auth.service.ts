import { Injectable, inject, Inject } from '@angular/core';
import { CanActivateFn, Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() { }
  customerAlreadLoggedIn():boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      var token = localStorage.getItem('token');
      if (token != null && token != "") {
        return true;
      }
    }
    return false;
  }

  adminAlreadLoggedIn():boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      var token = localStorage.getItem('admin_token');
      if (token != null && token != "") {
        return true;
      }
    }
    return false;
  }
}
