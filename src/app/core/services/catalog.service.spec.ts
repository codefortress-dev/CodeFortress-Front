import { CatalogService, Producto } from './catalog.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('CatalogService', () => {
  let service: CatalogService;
  let httpMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpMock = {
      get: jest.fn(),
    } as any;

    service = new CatalogService(httpMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch products from /mock-data/products.json', (done) => {
    const mockProductos: Producto[] = [
      {
        id: 1,
        nombre: 'Producto A',
        descripcion: 'Descripción A',
        precio: 100,
        imagen: 'a.png',
        categoria: 'Categoria A'
      },
      {
        id: 2,
        nombre: 'Producto B',
        descripcion: 'Descripción B',
        precio: 200,
        imagen: 'b.png',
        categoria: 'Categoria B'
      }
    ];

    httpMock.get.mockReturnValue(of(mockProductos));

    service.getProductos().subscribe(productos => {
      expect(productos).toEqual(mockProductos);
      expect(httpMock.get).toHaveBeenCalledWith('/mock-data/products.json');
      done();
    });
  });
});
