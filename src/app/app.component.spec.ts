import { AppComponent } from './app.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
  createEnvironmentInjector,
  EnvironmentInjector,
  runInInjectionContext,
  Injector
} from '@angular/core';

jest.useFakeTimers();

describe('AppComponent (con contextos reales sin TestBed)', () => {
  let snackBarMock: any;
  let routerMock: any;
  let authMock: any;
  let injector: EnvironmentInjector;

  beforeAll(() => {
    snackBarMock = { open: jest.fn() };
    routerMock = {
      url: '/dashboard',
      navigate: jest.fn(() => Promise.resolve(true))
    };

    const parentInjector: Injector = Injector.create({ providers: [] });

    injector = createEnvironmentInjector(
      [
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: Router, useValue: routerMock }
      ],
      parentInjector as unknown as EnvironmentInjector
    );
  });

  beforeEach(() => {
    authMock = {
      getUser: jest.fn(),
      restorePermissions: jest.fn(),
      isAuthenticated: jest.fn(),
      updateActivity: jest.fn()
    };
    Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: {
      ...window.location,
      reload: jest.fn()
    }
  });
    jest.clearAllMocks();
    jest.clearAllTimers();
    localStorage.clear();
  });

  function createComponent(): AppComponent {
    return runInInjectionContext(injector, () => new AppComponent(authMock));
  }

  it('restaura permisos si el usuario los tiene', () => {
    authMock.getUser.mockReturnValue({ permissions: ['admin'] });
    const component = createComponent();
    expect(authMock.restorePermissions).toHaveBeenCalledWith(['admin']);
  });

  it('colapsa sidebar si el ancho es menor a 768', () => {
    Object.defineProperty(window, 'innerWidth', { value: 500, configurable: true });
    const component = createComponent();
    component.ngOnInit();
    expect(component.isLeftSidebarCollapsed()).toBe(true);
  });

  it('registra eventos y llama updateActivity si está autenticado', () => {
    authMock.isAuthenticated.mockReturnValue(true);
    const component = createComponent();
    component.ngOnInit();
    window.dispatchEvent(new Event('click'));
    expect(authMock.updateActivity).toHaveBeenCalled();
  });

  it('muestra snackbar y redirige si no está autenticado ni cerró sesión manualmente', async () => {
    authMock.isAuthenticated.mockReturnValue(false);
    localStorage.setItem('manual_logout', 'false');
    const component = createComponent();
    component.ngOnInit();
    jest.advanceTimersByTime(30_000);

    expect(snackBarMock.open).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login'], { replaceUrl: true });
  });

  it('no redirige si ya está en /login', () => {
    authMock.isAuthenticated.mockReturnValue(false);
    routerMock.url = '/login';
    localStorage.setItem('manual_logout', 'false');
    const component = createComponent();
    component.ngOnInit();
    jest.advanceTimersByTime(30_000);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('actualiza el colapso de sidebar manualmente', () => {
    const component = createComponent();
    component.changeIsLeftSidebarCollapsed(true);
    expect(component.isLeftSidebarCollapsed()).toBe(true);
    component.changeIsLeftSidebarCollapsed(false);
    expect(component.isLeftSidebarCollapsed()).toBe(false);
  });
});
