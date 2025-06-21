import { LeftSidebarComponent } from './left-sidebar.component';
import {
  createEnvironmentInjector,
  runInInjectionContext,
  Injector,
  signal
} from '@angular/core';
import { ElementRef } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

describe('LeftSidebarComponent (sin TestBed)', () => {
  let injector: any;
  let authMock: any;
  let routerMock: any;
  let elementRefMock: any;

  beforeAll(() => {
    authMock = {
      isAuthenticated: jest.fn(),
      logout: jest.fn()
    };

    routerMock = {
      navigate: jest.fn()
    };

    elementRefMock = {
      nativeElement: {
        contains: jest.fn()
      }
    };

    const parentInjector = Injector.create({ providers: [] });

    injector = createEnvironmentInjector(
      [
        { provide: AuthService, useValue: authMock },
        { provide: Router, useValue: routerMock },
        { provide: ElementRef, useValue: elementRefMock }
      ],
      parentInjector as any
    );
  });

  function createComponentWithSignals(initialCollapsed: boolean): LeftSidebarComponent {
    return runInInjectionContext(injector, () => {
      const cmp = new LeftSidebarComponent();
      (cmp as any).isLeftSidebarCollapsed = signal(initialCollapsed);
      (cmp as any).changeIsLeftSidebarCollapsed = {
        emit: jest.fn()
      };
      return cmp;
    });
  }

  it('debe emitir true en closeSidenav()', () => {
    const component = createComponentWithSignals(false);
    component.closeSidenav();
    expect(component.changeIsLeftSidebarCollapsed.emit).toHaveBeenCalledWith(true);
  });

  it('toggleCollapse() debe emitir el valor opuesto al actual', () => {
    const component = createComponentWithSignals(false);
    component.toggleCollapse();
    expect(component.changeIsLeftSidebarCollapsed.emit).toHaveBeenCalledWith(true);
  });

  it('logout() debe llamar a logout, navegar y cerrar sidebar', () => {
    const component = createComponentWithSignals(false);
    component.logout();

    expect(authMock.logout).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    expect(component.changeIsLeftSidebarCollapsed.emit).toHaveBeenCalledWith(true);
  });

  it('isLoggedIn() debe retornar true si auth lo indica', () => {
    authMock.isAuthenticated.mockReturnValue(true);
    const component = createComponentWithSignals(false);
    expect(component.isLoggedIn()).toBe(true);
  });

  it('onDocumentClick() debe cerrar el sidebar si se hace clic fuera', () => {
    const component = createComponentWithSignals(false);

    elementRefMock.nativeElement.contains.mockReturnValue(false); // clic fuera
    const fakeEvent = { target: {} } as MouseEvent;

    component.onDocumentClick(fakeEvent);

    expect(component.changeIsLeftSidebarCollapsed.emit).toHaveBeenCalledWith(true);
  });

  it('onDocumentClick() NO debe cerrar si se hace clic dentro', () => {
    const component = createComponentWithSignals(false);

    elementRefMock.nativeElement.contains.mockReturnValue(true); // clic dentro
    const fakeEvent = { target: {} } as MouseEvent;

    component.onDocumentClick(fakeEvent);

    expect(component.changeIsLeftSidebarCollapsed.emit).not.toHaveBeenCalled();
  });

  it('onDocumentClick() NO debe cerrar si ya está colapsado', () => {
    const component = createComponentWithSignals(true); // ya está cerrado

    elementRefMock.nativeElement.contains.mockReturnValue(false); // clic fuera
    const fakeEvent = { target: {} } as MouseEvent;

    component.onDocumentClick(fakeEvent);

    expect(component.changeIsLeftSidebarCollapsed.emit).not.toHaveBeenCalled();
  });
});
