export const SUPPORTED_LANGUAGES = ['en', 'si'] as const;

export type SupportedLanguage =
  (typeof SUPPORTED_LANGUAGES)[number];

export const FALLBACK_LANGUAGE: SupportedLanguage = 'en';
