import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

jest.mock('@angular/core', () => ({
  ...jest.requireActual('@angular/core'),
  inject: jest.fn(),
}));

import { inject } from '@angular/core';

describe('authGuard', () => {
  let authServiceMock: Partial<AuthService>;
  let routerMock: Partial<Router>;
  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;

  beforeEach(() => {
    authServiceMock = {
      isAuthenticated: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    (inject as jest.Mock).mockImplementation((token: any) => {
      if (token === AuthService) return authServiceMock;
      if (token === Router) return routerMock;
      return null;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should allow activation when authenticated', () => {
    (authServiceMock.isAuthenticated as jest.Mock).mockReturnValue(true);

    const result = authGuard(route, state);
    expect(result).toBe(true);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should deny activation and redirect when not authenticated', () => {
    (authServiceMock.isAuthenticated as jest.Mock).mockReturnValue(false);

    const result = authGuard(route, state);
    expect(result).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
