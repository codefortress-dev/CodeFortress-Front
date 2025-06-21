import { ProductDetailComponent } from './product-detail.component';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProductService } from '../../../core/services/product.service';
import { of, Subject } from 'rxjs';

describe('ProductDetailComponent (sin TestBed)', () => {
  let routeMock: any;
  let translateMock: any;
  let productServiceMock: any;
  let langChange$: Subject<any>;
  let component: ProductDetailComponent;

  beforeEach(() => {
    langChange$ = new Subject();

    routeMock = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('2') // ID del producto
        }
      }
    };

    translateMock = {
      currentLang: 'en',
      onLangChange: langChange$.asObservable()
    };

    productServiceMock = {
      getProductos: jest.fn(),
      getCategorias: jest.fn()
    };

    component = new ProductDetailComponent(routeMock, productServiceMock, translateMock);
  });

  it('debe cargar producto y categorías en ngOnInit', () => {
    const mockProductos = [
      { id: 1, nombre: 'A' },
      { id: 2, nombre: 'B' },
      { id: 3, nombre: 'C' }
    ];
    const mockCategorias = [
      { id: 5, nombre: { en: 'Security', es: 'Seguridad' } }
    ];

    productServiceMock.getProductos.mockReturnValue(of(mockProductos));
    productServiceMock.getCategorias.mockReturnValue(of(mockCategorias));

    component.ngOnInit();

    expect(component.producto).toEqual(mockProductos[1]);
    expect(component.isLoading).toBe(false);
    expect(component.categories).toEqual(mockCategorias);
    expect(component.currentLang).toBe('en');
  });

  it('debe actualizar el idioma si cambia la traducción', () => {
    productServiceMock.getProductos.mockReturnValue(of([]));
    productServiceMock.getCategorias.mockReturnValue(of([]));

    component.ngOnInit();

    langChange$.next({ lang: 'fr' });
    expect(component.currentLang).toBe('fr');
  });

  it('getCategoryName devuelve nombre traducido si existe', () => {
    component.currentLang = 'en';
    component.categories = [
      { id: 1, nombre: { en: 'Security', es: 'Seguridad' } }
    ];

    const result = component.getCategoryName(1);
    expect(result).toBe('Security');
  });

  it('getCategoryName devuelve nombre en español si no existe en idioma actual', () => {
    component.currentLang = 'es';
    component.categories = [
      { id: 1, nombre: { es: 'Seguridad' } }
    ];

    const result = component.getCategoryName(1);
    expect(result).toBe('Seguridad');
  });

  it('getCategoryName devuelve "-" si no encuentra la categoría', () => {
    component.categories = [];
    const result = component.getCategoryName(999);
    expect(result).toBe('-');
  });
});
