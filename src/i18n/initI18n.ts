import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from '@/i18n/locales/en';
import { si } from '@/i18n/locales/si';

import {
  FALLBACK_LANGUAGE,
  SUPPORTED_LANGUAGES
} from '@/i18n/config';
import { getApplication } from '@/repositories/applicationRepository';

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

const initialLanguage = 'en';

export async function initializeI18n() {
  let appData;

  try {
    appData = await getApplication();
  } catch (error) {
    console.log('Error: Failed to read application record!');
    console.error(error);
  }

  let storedLanguage;

  if (appData) {
    storedLanguage = appData.preferences?.language ?? FALLBACK_LANGUAGE;
  }

  const language =
    storedLanguage &&
      SUPPORTED_LANGUAGES.includes(storedLanguage as any)
      ? storedLanguage
      : initialLanguage;

  await i18n
    .use(initReactI18next)
    .init({
      resources,

      lng: language,

      fallbackLng: FALLBACK_LANGUAGE,

      interpolation: {
        escapeValue: false,
      },

      saveMissing: __DEV__, // true when running in development mode.

      react: {
        useSuspense: false,
      },
    });
}

export default i18n;
