import { CartService } from './cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CartItem } from '../models/cart-item.model';

describe('CartService', () => {
  let cartService: CartService;
  let snackBarMock: jest.Mocked<MatSnackBar>;
  let translateMock: jest.Mocked<TranslateService>;

  beforeEach(() => {
    localStorage.clear();

    snackBarMock = {
      open: jest.fn(),
    } as any;

    translateMock = {
      instant: jest.fn().mockImplementation((key) => key),
    } as any;

    cartService = new CartService(snackBarMock, translateMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should start with empty cart if localStorage is empty', (done) => {
    cartService.getCart().subscribe(items => {
      expect(items).toEqual([]);
      done();
    });
  });

  it('should add a new item to cart and show snackbar', (done) => {
    const item: CartItem = { productId: 1, cantidad: 2, precio: 100, nombre: "ProductoA" };

    cartService.addToCart(item);

    cartService.getCart().subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].productId).toBe(1);
      expect(snackBarMock.open).toHaveBeenCalledWith(
        'cart.addedToCart',
        'OK',
        expect.objectContaining({
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        })
      );
      done();
    });
  });

  it('should update quantity if item already exists', (done) => {
    const item: CartItem = { productId: 1, cantidad: 2, precio: 100, nombre: "ProductoA"  };
    cartService.addToCart(item);
    cartService.addToCart({ productId: 1, cantidad: 1, precio: 100,  nombre: "ProductoB"  });

    cartService.getCart().subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].cantidad).toBe(3);
      done();
    });
  });

  it('should remove item if quantity becomes zero or less', (done) => {
    const item: CartItem = { productId: 1, cantidad: 2, precio: 100, nombre: "ProductoA"  };
    cartService.addToCart(item);
    cartService.addToCart({ productId: 1, cantidad: -2, precio: 100, nombre: "ProductoB" }); // llega a 0

    cartService.getCart().subscribe(items => {
      expect(items.length).toBe(0);
      done();
    });
  });

  it('should remove item by productId', (done) => {
    const item1: CartItem = { productId: 1, cantidad: 1, precio: 100, nombre: "ProductoA"  };
    const item2: CartItem = { productId: 2, cantidad: 1, precio: 200, nombre: "ProductoB"  };
    cartService.addToCart(item1);
    cartService.addToCart(item2);

    cartService.removeFromCart(1);

    cartService.getCart().subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].productId).toBe(2);
      done();
    });
  });

  it('should clear all items from cart', (done) => {
    cartService.addToCart({ productId: 1, cantidad: 1, precio: 100,  nombre: "ProductoA" });
    cartService.clearCart();

    cartService.getCart().subscribe(items => {
      expect(items).toEqual([]);
      done();
    });
  });

  it('should calculate total price', () => {
    cartService.addToCart({ productId: 1, cantidad: 2, precio: 100, nombre: "ProductoA"  });
    cartService.addToCart({ productId: 2, cantidad: 1, precio: 50, nombre: "ProductoB"  });

    const total = cartService.getTotal();
    expect(total).toBe(250);
  });
});
