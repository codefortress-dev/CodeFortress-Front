import { CartComponent } from './cart.component';
import { CartService } from '../services/cart.service';
import { CartItem } from '../models/cart-item.model';
import { of } from 'rxjs';

describe('CartComponent', () => {
  let component: CartComponent;
  let cartServiceMock: jest.Mocked<CartService>;

  const mockCart: CartItem[] = [
    { productId: 1, nombre: 'Producto A', cantidad: 2, precio: 100 },
    { productId: 2, nombre: 'Producto B', cantidad: 1, precio: 200 }
  ];

  beforeEach(() => {
    cartServiceMock = {
      getCart: jest.fn(),
      getTotal: jest.fn(),
      removeFromCart: jest.fn(),
      clearCart: jest.fn(),
      addToCart: jest.fn(),
    } as any;

    component = new CartComponent(cartServiceMock);
  });

  it('should initialize cart and total on ngOnInit', () => {
    cartServiceMock.getCart.mockReturnValue(of(mockCart));
    cartServiceMock.getTotal.mockReturnValue(400);

    component.ngOnInit();

    expect(cartServiceMock.getCart).toHaveBeenCalled();
    expect(cartServiceMock.getTotal).toHaveBeenCalled();
  });

  it('should remove an item from the cart', () => {
    component.removeItem(1);
    expect(cartServiceMock.removeFromCart).toHaveBeenCalledWith(1);
  });

  it('should clear the cart', () => {
    component.clearCart();
    expect(cartServiceMock.clearCart).toHaveBeenCalled();
  });

  it('should increase item quantity and update total', () => {
    const item: CartItem = { productId: 1, nombre: 'Producto A', cantidad: 2, precio: 100 };
    cartServiceMock.getTotal.mockReturnValue(500);

    component.increase(item);

    expect(cartServiceMock.addToCart).toHaveBeenCalledWith({
      ...item,
      cantidad: 1
    });
    expect(component.total).toBe(500);
  });

  it('should decrease item quantity and update total', () => {
    const item: CartItem = { productId: 1, nombre: 'Producto A', cantidad: 3, precio: 100 };
    cartServiceMock.getTotal.mockReturnValue(300);

    component.decrease(item);

    expect(cartServiceMock.addToCart).toHaveBeenCalledWith({
      ...item,
      cantidad: -1
    });
    expect(component.total).toBe(300);
  });

  it('should remove item if quantity is 1 when decreasing', () => {
    const item: CartItem = { productId: 2, nombre: 'Producto B', cantidad: 1, precio: 200 };
    cartServiceMock.getTotal.mockReturnValue(100);

    component.decrease(item);

    expect(cartServiceMock.removeFromCart).toHaveBeenCalledWith(2);
    expect(component.total).toBe(100);
  });
});
