import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      "welcome": "Bienvenue",
      "loading": "Chargement...",
      "error": "Erreur"
    }
  },
  en: {
    translation: {
      "welcome": "Welcome",
      "loading": "Loading...",
      "error": "Error"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;