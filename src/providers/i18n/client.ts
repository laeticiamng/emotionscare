import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { logger } from '@/lib/logger';

import { resources, namespaces, type AppLocale } from './resources';

let initialized = false;
const supportedLngs = Object.keys(resources) as AppLocale[];

export function ensureI18n(locale: AppLocale = 'fr') {
  if (!initialized) {
    const isProduction = import.meta.env.PROD;

    void i18n
      .use(initReactI18next)
      .init({
        resources,
        ns: namespaces,
        defaultNS: 'common',
        fallbackNS: ['common'],
        lng: locale,
        fallbackLng: 'fr',
        supportedLngs,
        load: 'languageOnly',
        debug: import.meta.env.DEV,
        saveMissing: isProduction,
        missingKeyHandler: (languages, namespace, key) => {
          const payload = { languages, namespace, key };
          if (isProduction) {
            logger.error('Missing translation key detected', payload, 'SYSTEM');
          } else {
            logger.warn('Missing translation key detected', payload, 'SYSTEM');
          }
        },
        interpolation: { escapeValue: false },
        react: { useSuspense: false },
        returnNull: false,
      })
      .then(() => {
        // Ensure i18n is marked as initialized
        if (!i18n.isInitialized) {
          (i18n as any).isInitialized = true;
        }
      })
      .catch((error) => {
        console.error('Failed to initialize i18n:', error);
        // Fallback: mark as initialized anyway to prevent infinite loading
        (i18n as any).isInitialized = true;
      });

    const i18nWithMarker = i18n as typeof i18n & { __missingKeyListenerRegistered?: boolean };

    if (!i18nWithMarker.__missingKeyListenerRegistered) {
      i18nWithMarker.__missingKeyListenerRegistered = true;

      const handleMissingKey = (languages: readonly string[], namespace: string, key: string) => {
        const payload = { languages, namespace, key };
        if (isProduction) {
          logger.error('Missing translation runtime event', payload, 'SYSTEM');
        } else {
          logger.warn('Missing translation runtime event', payload, 'SYSTEM');
        }
      };

      i18n.on('missingKey', handleMissingKey);
    }

    if (typeof window !== 'undefined') {
      (window as Record<string, unknown>).i18n = i18n;
    }

    initialized = true;
  } else if (locale && i18n.language !== locale) {
    void i18n.changeLanguage(locale);
  }

  return i18n;
}

export type { AppLocale };
