import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from '../locales/en.json';
import hiTranslation from '../locales/hi.json';
import knTranslation from '../locales/kn.json';
import taTranslation from '../locales/ta.json';
import teTranslation from '../locales/te.json';
import mlTranslation from '../locales/ml.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      hi: { translation: hiTranslation },
      kn: { translation: knTranslation },
      ta: { translation: taTranslation },
      te: { translation: teTranslation },
      ml: { translation: mlTranslation }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
