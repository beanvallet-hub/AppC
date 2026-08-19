import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from './locales/en';
import { si } from './locales/si';

import {
  FALLBACK_LANGUAGE,
} from './config';

const resources = {
  en: {
    translation: en,
  },
  si: {
    translation: si,
  },
};

// const bestLanguage = findBestLanguageTag(
//   SUPPORTED_LANGUAGES,
// );

// const initialLanguage =
//   bestLanguage?.languageTag ?? FALLBACK_LANGUAGE;

const initialLanguage = 'si';

i18n
  .use(initReactI18next)
  .init({
    resources,

    lng: initialLanguage,

    fallbackLng: FALLBACK_LANGUAGE,

    interpolation: {
      escapeValue: false,
    },
    
    saveMissing: __DEV__, // true when running in development mode.

    react: {
      useSuspense: false,
    },
  });

export default i18n;
