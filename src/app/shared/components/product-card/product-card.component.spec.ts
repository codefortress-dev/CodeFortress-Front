import { ProductCardComponent } from './product-card.component';
import { TranslateService } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';

describe('ProductCardComponent (sin TestBed)', () => {
  let translateMock: any;
  let component: ProductCardComponent;
  let langChange$: Subject<any>;

  beforeEach(() => {
    langChange$ = new Subject();

    translateMock = {
      currentLang: 'en',
      defaultLang: 'es',
      onLangChange: langChange$.asObservable()
    };

    component = new ProductCardComponent(translateMock);
  });

  it('debe usar currentLang como idioma inicial si está definido', () => {
    component.ngOnInit();
    expect(component.lang).toBe('en');
  });

  it('debe usar defaultLang si no hay currentLang', () => {
    translateMock.currentLang = null;
    translateMock.defaultLang = 'es';
    component = new ProductCardComponent(translateMock);
    component.ngOnInit();
    expect(component.lang).toBe('es');
  });

  it('debe usar "es" como fallback si no hay currentLang ni defaultLang', () => {
    translateMock.currentLang = null;
    translateMock.defaultLang = null;
    component = new ProductCardComponent(translateMock);
    component.ngOnInit();
    expect(component.lang).toBe('es');
  });

  it('debe actualizar el idioma si se emite un cambio en onLangChange', () => {
    component.ngOnInit();
    langChange$.next({ lang: 'fr' });
    expect(component.lang).toBe('fr');
  });

  it('getCategoryName debe devolver nombre traducido si existe', () => {
    component.lang = 'en';
    component.categories = [
      { id: 1, nombre: { en: 'Security', es: 'Seguridad' } }
    ];
    const result = component.getCategoryName(1);
    expect(result).toBe('Security');
  });

  it('getCategoryName debe devolver nombre en español si no hay traducción en el idioma actual', () => {
    component.lang = 'fr';
    component.categories = [
      { id: 1, nombre: { es: 'Seguridad' } }
    ];
    const result = component.getCategoryName(1);
    expect(result).toBe('Seguridad');
  });

  it('getCategoryName debe devolver "-" si no encuentra la categoría', () => {
    component.lang = 'en';
    component.categories = [];
    const result = component.getCategoryName(5);
    expect(result).toBe('-');
  });
});
