export type SupportedLang = 'es' | 'en';

export type TranslatableText = {
  [lang in SupportedLang]: string;
};

export interface Category {
  id: number;
  nombre: TranslatableText;
}