import { ActivityInterceptor } from './activity.interceptor';
import { AuthService } from './auth.service';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('ActivityInterceptor', () => {
  let authServiceMock: AuthService;
  let interceptor: ActivityInterceptor;

  beforeEach(() => {
    authServiceMock = {
  updateActivity: jest.fn(),
} as unknown as AuthService;

    interceptor = new ActivityInterceptor(authServiceMock);
  });

  it('should call authService.updateActivity when request succeeds', (done) => {
    const req = {} as HttpRequest<any>;
    const next: HttpHandler = {
      handle: jest.fn().mockReturnValue(of({} as HttpEvent<any>))
    };

    interceptor.intercept(req, next).subscribe(() => {
      expect(authServiceMock.updateActivity).toHaveBeenCalled();
      done();
    });
  });

  it('should not call updateActivity if request fails', (done) => {
    const req = {} as HttpRequest<any>;
    const next: HttpHandler = {
      handle: jest.fn().mockReturnValue(throwError(() => new Error('Request failed')))
    };

    interceptor.intercept(req, next).subscribe({
      error: () => {
        expect(authServiceMock.updateActivity).not.toHaveBeenCalled();
        done();
      }
    });
  });
});
