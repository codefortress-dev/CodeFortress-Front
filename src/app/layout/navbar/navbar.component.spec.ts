import { NavbarComponent } from './navbar.component';
import { of } from 'rxjs';

describe('NavbarComponent (sin TestBed)', () => {
  let translateMock: any;
  let cartServiceMock: any;
  let authMock: any;
  let routerMock: any;
  let component: NavbarComponent;

  beforeEach(() => {
    translateMock = {
      use: jest.fn()
    };

    cartServiceMock = {
      getCart: jest.fn()
    };

    authMock = {
      isAuthenticated: jest.fn(),
      logout: jest.fn()
    };

    routerMock = {
      navigate: jest.fn()
    };

    component = new NavbarComponent(translateMock, cartServiceMock, authMock, routerMock);
  });

  it('debe calcular el total de items del carrito en ngOnInit', () => {
    const mockCart = [
      { id: 1, cantidad: 2 },
      { id: 2, cantidad: 3 }
    ];

    cartServiceMock.getCart.mockReturnValue(of(mockCart));

    component.ngOnInit();

    expect(cartServiceMock.getCart).toHaveBeenCalled();
    expect(component.totalItems).toBe(5);
  });

  it('debe retornar true si el usuario está autenticado', () => {
    authMock.isAuthenticated.mockReturnValue(true);
    expect(component.isLoggedIn()).toBe(true);
  });

  it('debe retornar false si el usuario NO está autenticado', () => {
    authMock.isAuthenticated.mockReturnValue(false);
    expect(component.isLoggedIn()).toBe(false);
  });

  it('debe cerrar sesión y redirigir al home en logout()', () => {
    component.logout();
    expect(authMock.logout).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('debe cambiar el idioma y guardarlo en localStorage', () => {
    const lang = 'en';
    jest.spyOn(localStorage['__proto__'], 'setItem');
    component.changeLang(lang);
    expect(translateMock.use).toHaveBeenCalledWith(lang);
    expect(localStorage.setItem).toHaveBeenCalledWith('lang', lang);
  });
});
