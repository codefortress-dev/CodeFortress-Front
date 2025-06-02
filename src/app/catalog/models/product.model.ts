export type SupportedLang = 'es' | 'en';

export type TranslatableText = {
  [lang in SupportedLang]: string;
};

export interface Producto {
 id: number;
  nombre: TranslatableText;
  descripcion: TranslatableText;
  precio: number;
  imagen: string;
  categoria: TranslatableText;
}
