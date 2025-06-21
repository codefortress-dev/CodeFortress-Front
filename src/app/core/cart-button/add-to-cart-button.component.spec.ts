import { AddToCartButtonComponent } from './add-to-cart-button.component';
import { CartService } from '../services/cart.service';
import { CartItem } from '../models/cart-item.model';

describe('AddToCartButtonComponent', () => {
  let component: AddToCartButtonComponent;
  let cartServiceMock: jest.Mocked<CartService>;

  beforeEach(() => {
    cartServiceMock = {
      addToCart: jest.fn(),
    } as any;

    component = new AddToCartButtonComponent(cartServiceMock);

    // Simular inputs
    component.productId = 1;
    component.nombre = 'Producto Test';
    component.precio = 99.99;
    component.imagen = 'producto.png';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call addToCart with correct CartItem on agregarAlCarrito()', () => {
    const expectedItem: CartItem = {
      productId: 1,
      nombre: 'Producto Test',
      precio: 99.99,
      cantidad: 1,
      imagen: 'producto.png'
    };

    component.agregarAlCarrito();

    expect(cartServiceMock.addToCart).toHaveBeenCalledWith(expectedItem);
  });
});
