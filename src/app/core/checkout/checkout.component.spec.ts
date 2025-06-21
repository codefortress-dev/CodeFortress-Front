import { CheckoutComponent } from './checkout.component';
import { FormBuilder } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CartItem } from '../models/cart-item.model';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let cartServiceMock: jest.Mocked<CartService>;
  let routerMock: jest.Mocked<Router>;

  const mockCart: CartItem[] = [
    { productId: 1, nombre: 'Producto A', cantidad: 2, precio: 100 }
  ];

  beforeEach(() => {
    cartServiceMock = {
      getCart: jest.fn(),
      getTotal: jest.fn(),
      clearCart: jest.fn()
    } as any;

    routerMock = {
      navigate: jest.fn()
    } as any;

    cartServiceMock.getCart.mockReturnValue(of(mockCart));
    cartServiceMock.getTotal.mockReturnValue(200);

    const fb = new FormBuilder();
    component = new CheckoutComponent(fb, cartServiceMock, routerMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize form and cart on ngOnInit', () => {
    component.ngOnInit();

    expect(component.form).toBeDefined();
    expect(component.form.controls['email']).toBeDefined();
    expect(component.cart).toEqual(mockCart);
    expect(component.total).toBe(200);
  });

  it('should not confirm if form is invalid', () => {
    component.ngOnInit();
    component.form.controls['email'].setValue('');
    component.form.controls['proyecto'].setValue('Proyecto X');

    component.confirmar();

    expect(cartServiceMock.clearCart).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should not confirm if cart is empty', () => {
    cartServiceMock.getCart.mockReturnValue(of([]));
    cartServiceMock.getTotal.mockReturnValue(0);

    component = new CheckoutComponent(new FormBuilder(), cartServiceMock, routerMock);
    component.ngOnInit();
    component.form.setValue({ email: 'test@mail.com', proyecto: 'Algo' });

    component.confirmar();

    expect(cartServiceMock.clearCart).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should confirm and navigate when form is valid and cart is not empty', () => {
    jest.useFakeTimers(); // simular setTimeout

    component.ngOnInit();
    component.form.setValue({ email: 'test@mail.com', proyecto: 'Algo' });

    component.confirmar();

    jest.advanceTimersByTime(1000); // simula el delay
    expect(cartServiceMock.clearCart).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(
      expect.arrayContaining(['/thank-you']),
    );

    jest.useRealTimers();
  });
});
