import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { NgxPermissionsService } from 'ngx-permissions';

describe('AuthService', () => {
  let authService: AuthService;
  let httpMock: jest.Mocked<HttpClient>;
  let permissionsMock: jest.Mocked<NgxPermissionsService>;

  beforeEach(() => {
    httpMock = {
      get: jest.fn(),
    } as any;

    permissionsMock = {
      loadPermissions: jest.fn(),
      flushPermissions: jest.fn(),
    } as any;

    authService = new AuthService(httpMock, permissionsMock);

    // Limpia el localStorage simulado..
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login with valid credentials and set user data', (done) => {
      const mockUser = { email: 'test@mail.com', password: '123', permissions: ['admin'] };
      httpMock.get.mockReturnValue(of([mockUser]));

      authService.login('test@mail.com', '123').subscribe(user => {
        expect(user).toEqual(mockUser);
        expect(localStorage.getItem('auth_token')).toBe('mock-token');
        expect(localStorage.getItem('user')).toContain('test@mail.com');
        expect(localStorage.getItem('last_activity')).not.toBeNull();
        expect(permissionsMock.loadPermissions).toHaveBeenCalledWith(['admin']);
        done();
      });
    });

    it('should throw error on invalid credentials', (done) => {
      const mockUser = { email: 'test@mail.com', password: '123' };
      httpMock.get.mockReturnValue(of([mockUser]));

      authService.login('wrong@mail.com', 'wrong').subscribe({
        error: (err) => {
          expect(err.message).toBe('Credenciales inválidas');
          expect(localStorage.getItem('auth_token')).toBeNull();
          done();
        }
      });
    });
  });

  describe('logout', () => {
    it('should clear user data and permissions', () => {
      localStorage.setItem('auth_token', 'token');
      localStorage.setItem('user', 'data');
      localStorage.setItem('last_activity', '123');
      authService.logout();
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(localStorage.getItem('last_activity')).toBeNull();
      expect(localStorage.getItem('manual_logout')).toBe('true');
      expect(permissionsMock.flushPermissions).toHaveBeenCalled();
    });
  });

  describe('isAuthenticated', () => {
    const now = Date.now();

    it('should return true if token, user and last_activity are present and recent', () => {
      localStorage.setItem('auth_token', 'token');
      localStorage.setItem('user', JSON.stringify({}));
      localStorage.setItem('last_activity', now.toString());

      const result = authService.isAuthenticated();
      expect(result).toBe(true);
    });

    it('should logout and return false if last_activity is too old', () => {
      const oldTimestamp = now - (10 * 60 * 1000 + 1000);
      localStorage.setItem('auth_token', 'token');
      localStorage.setItem('user', JSON.stringify({}));
      localStorage.setItem('last_activity', oldTimestamp.toString());

      const spy = jest.spyOn(authService, 'logout');
      const result = authService.isAuthenticated();

      expect(result).toBe(false);
      expect(spy).toHaveBeenCalled();
    });

    it('should logout and return false if data is missing', () => {
      const spy = jest.spyOn(authService, 'logout');
      const result = authService.isAuthenticated();
      expect(result).toBe(false);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('updateActivity', () => {
    it('should update last_activity with current timestamp', () => {
      authService.updateActivity();
      const timestamp = localStorage.getItem('last_activity');
      expect(timestamp).not.toBeNull();
      expect(Number(timestamp)).toBeGreaterThan(0);
    });
  });

  describe('getUser', () => {
    it('should return null if no user is stored', () => {
      const result = authService.getUser();
      expect(result).toBeNull();
    });

    it('should return stored user from localStorage', () => {
      const user = { name: 'Test' };
      localStorage.setItem('user', JSON.stringify(user));
      const result = authService.getUser();
      expect(result).toEqual(user);
    });
  });

  describe('restorePermissions', () => {
    it('should call loadPermissions with given array', () => {
      const perms = ['view-dashboard', 'edit-users'];
      authService.restorePermissions(perms);
      expect(permissionsMock.loadPermissions).toHaveBeenCalledWith(perms);
    });
  });
});
