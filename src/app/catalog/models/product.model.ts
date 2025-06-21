export type SupportedLang = 'es' | 'en';

export type TranslatableText = {
  [lang in SupportedLang]: string;
};

export interface Producto {
   id: number;
  nombre: { es: string; en: string };
  descripcion: { es: string; en: string };
  categoriaId: number;
  precio: number;
  imagen: string;
  state : 'active' | 'inactive';
}
