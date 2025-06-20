import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { User } from '../../core/models/user.model'; 
import { throwError } from 'rxjs';

describe('LoginComponent simple', () => {
  let component: LoginComponent;
  let mockAuthService: Partial<AuthService>;
  let mockRouter: Partial<Router>;

  beforeEach(() => {
    mockAuthService = {
      login: jest.fn().mockImplementation((email: string, password: string) =>
        of({
          id: 1,
          email,
          password: 'mockpass',
          firstName: 'Test',
          lastName: 'User',
          phone: '1234567890',
          role: 'admin',
          permissions: []
        } as User)
      )
    };

    mockRouter = {
      navigate: jest.fn()
    };

    component = new LoginComponent(
      mockAuthService as AuthService,
      mockRouter as Router
    );
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe llamar a login y navegar al dashboard si es exitoso', () => {
    component.email = 'test@example.com';
    component.password = '123456';

    component.login();

    expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', '123456');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin']);
    expect(component.loading).toBe(false);
    expect(component.error).toBeNull();
  });
  it('debe manejar error si login falla', () => {
  // Simula que el login lanza un error
  const loginError = new Error('Credenciales inválidas');
  mockAuthService.login = jest.fn(() => throwError(() => loginError));

  component = new LoginComponent(
    mockAuthService as AuthService,
    mockRouter as Router
  );

  component.email = 'fallo@example.com';
  component.password = 'incorrecto';

  component.login();

  expect(mockAuthService.login).toHaveBeenCalledWith('fallo@example.com', 'incorrecto');
  expect(component.loading).toBe(false);
  expect(component.error).toBe('Credenciales inválidas');
  expect(mockRouter.navigate).not.toHaveBeenCalled();
});
});
