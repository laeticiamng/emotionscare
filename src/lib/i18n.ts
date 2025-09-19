import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { auth as frAuth } from '@/lib/i18n/locales/fr/auth';
import { coach as frCoach } from '@/lib/i18n/locales/fr/coach';
import { common as frCommon } from '@/lib/i18n/locales/fr/common';
import { dashboard as frDashboard } from '@/lib/i18n/locales/fr/dashboard';
import { errors as frErrors } from '@/lib/i18n/locales/fr/errors';
import { journal as frJournal } from '@/lib/i18n/locales/fr/journal';
import { legal as frLegal } from '@/lib/i18n/locales/fr/legal';
import { modules as frModules } from '@/lib/i18n/locales/fr/modules';
import { navigation as frNavigation } from '@/lib/i18n/locales/fr/navigation';
import { settings as frSettings } from '@/lib/i18n/locales/fr/settings';

import { auth as enAuth } from '@/lib/i18n/locales/en/auth';
import { coach as enCoach } from '@/lib/i18n/locales/en/coach';
import { common as enCommon } from '@/lib/i18n/locales/en/common';
import { dashboard as enDashboard } from '@/lib/i18n/locales/en/dashboard';
import { errors as enErrors } from '@/lib/i18n/locales/en/errors';
import { journal as enJournal } from '@/lib/i18n/locales/en/journal';
import { legal as enLegal } from '@/lib/i18n/locales/en/legal';
import { modules as enModules } from '@/lib/i18n/locales/en/modules';
import { navigation as enNavigation } from '@/lib/i18n/locales/en/navigation';
import { settings as enSettings } from '@/lib/i18n/locales/en/settings';

const STORAGE_KEY = 'lang';
const FALLBACK_LANGUAGE = 'fr' as const;
const SUPPORTED_LANGUAGES = ['fr', 'en'] as const;
const NAMESPACES = [
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

type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const isBrowser = typeof window !== 'undefined';

const isSupportedLanguage = (value: string | null): value is SupportedLanguage => {
  return Boolean(value && SUPPORTED_LANGUAGES.includes(value as SupportedLanguage));
};

const readStoredLanguage = (): SupportedLanguage | null => {
  if (!isBrowser) {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isSupportedLanguage(stored) ? stored : null;
  } catch (error) {
    console.warn('[i18n] Unable to read language from localStorage', error);
    return null;
  }
};

const detectBrowserLanguage = (): SupportedLanguage | null => {
  if (!isBrowser) {
    return null;
  }

  const navigatorLanguage = window.navigator?.language ?? window.navigator?.languages?.[0];
  if (!navigatorLanguage) {
    return null;
  }

  const normalized = navigatorLanguage.toLowerCase().split('-')[0];
  return isSupportedLanguage(normalized) ? normalized : null;
};

const persistLanguage = (language: SupportedLanguage) => {
  if (!isBrowser) {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, language);
  } catch (error) {
    console.warn('[i18n] Unable to persist language to localStorage', error);
  }
};

const applyDocumentLanguage = (language: SupportedLanguage) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = language;
  }
};

const resolveInitialLanguage = (): SupportedLanguage => {
  const storedLanguage = readStoredLanguage();
  if (storedLanguage) {
    return storedLanguage;
  }

  const browserLanguage = detectBrowserLanguage();
  if (browserLanguage) {
    return browserLanguage;
  }

  return FALLBACK_LANGUAGE;
};

const resources = {
  fr: {
    common: frCommon,
    navigation: frNavigation,
    dashboard: frDashboard,
    settings: frSettings,
    modules: frModules,
    auth: frAuth,
    errors: frErrors,
    legal: frLegal,
    journal: frJournal,
    coach: frCoach,
  },
  en: {
    common: enCommon,
    navigation: enNavigation,
    dashboard: enDashboard,
    settings: enSettings,
    modules: enModules,
    auth: enAuth,
    errors: enErrors,
    legal: enLegal,
    journal: enJournal,
    coach: enCoach,
  },
};

const initialLanguage = resolveInitialLanguage();

if (!readStoredLanguage() && isBrowser) {
  persistLanguage(initialLanguage);
}

const initializeI18n = () =>
  i18n
    .use(initReactI18next)
    .init({
      resources,
      ns: NAMESPACES,
      defaultNS: 'common',
      fallbackNS: ['common'],
      lng: initialLanguage,
      fallbackLng: [FALLBACK_LANGUAGE, 'en'],
      supportedLngs: SUPPORTED_LANGUAGES,
      load: 'languageOnly',
      returnEmptyString: false,
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });

if (!i18n.isInitialized) {
  void initializeI18n();
} else if (i18n.language && isSupportedLanguage(i18n.language.split('-')[0])) {
  const normalized = i18n.language.split('-')[0] as SupportedLanguage;
  if (normalized !== initialLanguage) {
    void i18n.changeLanguage(normalized);
  }
}

applyDocumentLanguage(initialLanguage);

let listenersAttached = false;

if (!listenersAttached) {
  i18n.on('languageChanged', (nextLanguage) => {
    const normalized = (nextLanguage?.split?.('-')[0] ?? FALLBACK_LANGUAGE) as SupportedLanguage;
    persistLanguage(normalized);
    applyDocumentLanguage(normalized);
  });

  listenersAttached = true;
}

if (isBrowser) {
  const storage = window.localStorage;
  const storageWithMarker = storage as typeof storage & { __i18nLanguageSyncApplied__?: boolean };

  if (!storageWithMarker.__i18nLanguageSyncApplied__) {
    const originalSetItem = storage.setItem.bind(storage);

    storage.setItem = ((key: string, value: string) => {
      originalSetItem(key, value);

      if (key === STORAGE_KEY) {
        const normalized = value.split('-')[0];

        if (isSupportedLanguage(normalized) && !i18n.language?.startsWith(normalized)) {
          void i18n.changeLanguage(normalized);
        }
      }
    }) as typeof storage.setItem;

    storageWithMarker.__i18nLanguageSyncApplied__ = true;
  }
}

export default i18n;