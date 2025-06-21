import { ProductService } from './product.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpMock = {
      get: jest.fn(),
    } as any;

    service = new ProductService(httpMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch productos from /mock-data/products.json', (done) => {
    const mockProductos = [
      { id: 1, nombre: 'Producto A' },
      { id: 2, nombre: 'Producto B' }
    ];

    httpMock.get.mockReturnValue(of(mockProductos));

    service.getProductos().subscribe((productos) => {
      expect(productos).toEqual(mockProductos);
      expect(httpMock.get).toHaveBeenCalledWith('/mock-data/products.json');
      done();
    });
  });

  it('should fetch categorias from /mock-data/categories.json', (done) => {
    const mockCategorias = [
      { id: 'cat1', nombre: 'Categoría 1' },
      { id: 'cat2', nombre: 'Categoría 2' }
    ];

    httpMock.get.mockReturnValue(of(mockCategorias));

    service.getCategorias().subscribe((categorias) => {
      expect(categorias).toEqual(mockCategorias);
      expect(httpMock.get).toHaveBeenCalledWith('/mock-data/categories.json');
      done();
    });
  });
});
