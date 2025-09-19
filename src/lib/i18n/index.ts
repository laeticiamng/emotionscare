/**
 * i18n Configuration for EmotionsCare
 * Complete FR/EN localization support
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import { logger } from '@/lib/logger';

// FR Translations
import { navigation } from './locales/fr/navigation';
import { common } from './locales/fr/common';
import { dashboard } from './locales/fr/dashboard';
import { settings } from './locales/fr/settings';
import { modules } from './locales/fr/modules';
import { auth } from './locales/fr/auth';
import { errors } from './locales/fr/errors';
import { legal } from './locales/fr/legal';
import { journal } from './locales/fr/journal';
import { coach } from './locales/fr/coach';

// EN Translations
import { navigation as navigationEN } from './locales/en/navigation';
import { common as commonEN } from './locales/en/common';
import { dashboard as dashboardEN } from './locales/en/dashboard';
import { settings as settingsEN } from './locales/en/settings';
import { modules as modulesEN } from './locales/en/modules';
import { auth as authEN } from './locales/en/auth';
import { errors as errorsEN } from './locales/en/errors';
import { legal as legalEN } from './locales/en/legal';
import { journal as journalEN } from './locales/en/journal';
import { coach as coachEN } from './locales/en/coach';

const isProduction = import.meta.env.PROD;
const namespaces = [
  'common',
  'navigation',
  'dashboard',
  'settings',
  'modules',
  'auth',
  'errors',
  'legal',
  'journal',
  'coach',
] as const;

const resources = {
  fr: {
    navigation,
    common,
    dashboard,
    settings,
    modules,
    auth,
    errors,
    legal,
    journal,
    coach,
  },
  en: {
    navigation: navigationEN,
    common: commonEN,
    dashboard: dashboardEN,
    settings: settingsEN,
    modules: modulesEN,
    auth: authEN,
    errors: errorsEN,
    legal: legalEN,
    journal: journalEN,
    coach: coachEN,
  },
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    ns: namespaces,
    defaultNS: 'common',
    fallbackNS: ['common'],
    fallbackLng: 'fr',
    lng: 'fr', // Default to French
    debug: import.meta.env.DEV,

    returnEmptyString: false,
    saveMissing: isProduction,
    missingKeyHandler: (languages, namespace, key) => {
      const payload = { languages, namespace, key };
      if (isProduction) {
        logger.error('Missing translation key detected', payload, 'i18n');
      } else {
        logger.warn('Missing translation key detected', payload, 'i18n');
      }
    },

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    
    react: {
      useSuspense: false,
    },
  });

const i18nWithMarker = i18n as typeof i18n & {
  __missingKeyListenerRegistered?: boolean;
};

if (!i18nWithMarker.__missingKeyListenerRegistered) {
  i18nWithMarker.__missingKeyListenerRegistered = true;

  const handleMissingKey = (languages: readonly string[], namespace: string, key: string) => {
    const payload = { languages, namespace, key };
    if (isProduction) {
      logger.error('Missing translation runtime event', payload, 'i18n');
    } else {
      logger.warn('Missing translation runtime event', payload, 'i18n');
    }
  };

  i18n.on('missingKey', handleMissingKey);
}

// Expose globally for profile settings
if (typeof window !== 'undefined') {
  (window as any).i18n = i18n;
}

export default i18n;