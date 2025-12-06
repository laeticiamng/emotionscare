// @ts-nocheck
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources, namespaces } from '@/providers/i18n/resources';
import { logger } from '@/lib/logger';

// Initialize i18n immediately and synchronously
let initialized = false;

function initializeI18n() {
  if (initialized) return i18n;
  
  const locale = typeof window !== 'undefined' 
    ? (localStorage.getItem('lang') as 'fr' | 'en' || 'fr')
    : 'fr';

  i18n
    .use(initReactI18next)
    .init({
      resources,
      ns: namespaces,
      defaultNS: 'common',
      fallbackNS: ['common'],
      lng: locale,
      fallbackLng: 'fr',
      supportedLngs: ['fr', 'en'],
      load: 'languageOnly',
      debug: false,
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
      returnNull: false,
    })
    .catch((error) => {
      logger.error('i18n initialization failed', error, 'SYSTEM');
    });

  initialized = true;
  return i18n;
}

// Initialize immediately
const i18nInstance = initializeI18n();

export default i18nInstance;
