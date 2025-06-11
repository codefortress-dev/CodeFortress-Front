export type SupportedLang = 'es' | 'en';

export type TranslatableText = {
  [lang in SupportedLang]: string;
};