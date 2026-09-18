import { useTranslation } from 'react-i18next';
import type { SupportedLanguage } from '@/i18n/config';

export function useLanguage() {
  const { t: translation, i18n } = useTranslation();

  const languageCode = i18n.language as SupportedLanguage;

  const language = translation(`settings.${languageCode}`);

  const setLanguage = async (
    language: SupportedLanguage,
  ) => {
    await i18n.changeLanguage(language);
  };

  return {
    translation,
    languageCode,
    language,
    setLanguage,
  };
}
