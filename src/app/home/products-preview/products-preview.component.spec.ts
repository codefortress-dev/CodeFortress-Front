import { ProductsPreviewComponent } from './products-preview.component';
import {
  createEnvironmentInjector,
  runInInjectionContext,
  Injector
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProductService } from '../../core/services/product.service';
import { of, Subject } from 'rxjs';

describe('ProductsPreviewComponent (sin TestBed)', () => {
  let translateMock: any;
  let productServiceMock: any;
  let injector: any;
  let langChange$: Subject<any>;

  beforeAll(() => {
    langChange$ = new Subject();

    translateMock = {
      currentLang: 'en',
      defaultLang: 'es',
      onLangChange: langChange$.asObservable()
    };

    productServiceMock = {
      getProductos: jest.fn()
    };

    const parentInjector = Injector.create({ providers: [] });

    injector = createEnvironmentInjector(
      [
        { provide: TranslateService, useValue: translateMock },
        { provide: ProductService, useValue: productServiceMock }
      ],
      parentInjector as unknown as any
    );
  });

  function createComponent(): ProductsPreviewComponent {
    return runInInjectionContext(injector, () => new ProductsPreviewComponent());
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe usar currentLang como idioma inicial si está definido', () => {
    const component = createComponent();
    productServiceMock.getProductos.mockReturnValue(of([]));
    component.ngOnInit();
    expect(component.currentLang).toBe('en');
  });

  it('debe usar defaultLang si no hay currentLang', () => {
    translateMock.currentLang = null;
    translateMock.defaultLang = 'es';
    const component = createComponent();
    productServiceMock.getProductos.mockReturnValue(of([]));
    component.ngOnInit();
    expect(component.currentLang).toBe('es');
  });

  it('debe actualizar el idioma si cambia el lenguaje', () => {
    const component = createComponent();
    productServiceMock.getProductos.mockReturnValue(of([]));
    component.ngOnInit();
    langChange$.next({ lang: 'fr' });
    expect(component.currentLang).toBe('fr');
  });

  it('debe obtener solo los primeros 6 productos', () => {
    const productosMock = Array.from({ length: 10 }, (_, i) => ({ id: i + 1 }));
    productServiceMock.getProductos.mockReturnValue(of(productosMock));

    const component = createComponent();
    component.ngOnInit();

    expect(productServiceMock.getProductos).toHaveBeenCalled();
    expect(component.products.length).toBe(6);
    expect(component.products.map(p => p.id)).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
