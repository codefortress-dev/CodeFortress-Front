import { CatalogComponent } from './catalog.component';
import { ProductService } from '../../../core/services/product.service';
import { TranslateService } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { Producto } from '../../models/product.model';

describe('CatalogComponent', () => {
  let productServiceMock: any;
  let translateMock: any;
  let langChange$: Subject<any>;
  let component: CatalogComponent;

  beforeEach(() => {
    langChange$ = new Subject();

    translateMock = {
      currentLang: 'en',
      defaultLang: 'es',
      onLangChange: langChange$.asObservable(),
      instant: jest.fn((key) => key)
    };

    productServiceMock = {
      getProductos: jest.fn(),
      getCategorias: jest.fn()
    };

    component = new CatalogComponent(productServiceMock, translateMock);
  });

  it('debe inicializar productos, categorías y filtrarlos correctamente', () => {
    const productosMock: Producto[] = [
      {
        id: 1,
        nombre: { es: 'Producto 1', en: 'Product 1' },
        descripcion: { es: 'Desc 1', en: 'Desc 1' },
        categoriaId: 10,
        precio: 100,
        imagen: 'img1.png',
        state: 'active'
      },
      {
        id: 2,
        nombre: { es: 'Producto 2', en: 'Product 2' },
        descripcion: { es: 'Desc 2', en: 'Desc 2' },
        categoriaId: 20,
        precio: 200,
        imagen: 'img2.png',
        state: 'inactive'
      }
    ];

    const categoriasMock = [
      { id: 10, nombre: { es: 'Seguridad', en: 'Security' } },
      { id: 20, nombre: { es: 'Datos', en: 'Data' } }
    ];

    productServiceMock.getProductos.mockReturnValue(of(productosMock));
    productServiceMock.getCategorias.mockReturnValue(of(categoriasMock));

    component.ngOnInit();

    expect(component.productos).toEqual(productosMock);
    expect(component.categorias).toEqual(categoriasMock);
    expect(component.productosFiltrados).toEqual(productosMock);
    expect(component.isLoading).toBe(false);
    expect(component.categoriasDisponibles.length).toBe(3); // Todos + 2
  });

  it('onCategoriaChange debe filtrar productos por categoría', () => {
    const productos: Producto[] = [
      {
        id: 1,
        nombre: { es: 'A', en: 'A' },
        descripcion: { es: 'D', en: 'D' },
        categoriaId: 1,
        precio: 10,
        imagen: 'a.jpg',
        state: 'active'
      },
      {
        id: 2,
        nombre: { es: 'B', en: 'B' },
        descripcion: { es: 'D', en: 'D' },
        categoriaId: 2,
        precio: 20,
        imagen: 'b.jpg',
        state: 'active'
      }
    ];

    component.productos = productos;
    component.categoriaSeleccionada = 1;
    component.filtrarProductos();

    expect(component.productosFiltrados).toEqual([productos[0]]);
  });

  it('onCategoriaChange debe mostrar todos los productos si la categoría es "Todos"', () => {
    const productos: Producto[] = [
      {
        id: 1,
        nombre: { es: 'A', en: 'A' },
        descripcion: { es: 'D', en: 'D' },
        categoriaId: 1,
        precio: 10,
        imagen: 'a.jpg',
        state: 'active'
      }
    ];

    component.productos = productos;
    component.onCategoriaChange('Todos');

    expect(component.categoriaSeleccionada).toBe('Todos');
    expect(component.productosFiltrados).toEqual(productos);
  });

  it('debe actualizar currentLang y volver a filtrar cuando cambia el idioma', () => {
    component.categorias = [
      { id: 10, nombre: { en: 'Security', es: 'Seguridad' } }
    ];

    component.productos = [
      {
        id: 1,
        nombre: { es: 'Prod', en: 'Prod' },
        descripcion: { es: 'Desc', en: 'Desc' },
        categoriaId: 10,
        precio: 50,
        imagen: 'p.png',
        state: 'active'
      }
    ];

    component.categoriaSeleccionada = 10;
productServiceMock.getProductos.mockReturnValue(of([...component.productos]));
productServiceMock.getCategorias.mockReturnValue(of([...component.categorias]));
    component.ngOnInit();

    langChange$.next({ lang: 'es' }); // No permitido, debe caer a 'es'
    expect(component.currentLang).toBe('es');
    expect(component.productosFiltrados.length).toBe(1);
  });

  it('debe resetear categoría si no está disponible tras cambio de idioma', () => {
    component.categorias = [
      { id: 99, nombre: { es: 'Categoría falsa', en: 'Fake' } }
    ];

    component.categoriaSeleccionada = 123;
    component.currentLang = 'es';

    component.actualizarCategorias();
    expect(component.categoriaSeleccionada).toBe('Todos');
  });
});
