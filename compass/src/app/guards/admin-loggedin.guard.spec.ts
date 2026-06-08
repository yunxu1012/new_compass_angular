import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminLoggedinGuard } from './admin-loggedin.guard';

describe('adminLoggedinGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminLoggedinGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
