// @ts-nocheck
import type { AppLocale } from '@/providers/i18n/resources';
import { resources } from '@/providers/i18n/resources';
import { ensureI18n } from '@/providers/i18n/client';
import { logger } from '@/lib/logger';

const STORAGE_KEY = 'lang';
const FALLBACK_LANGUAGE: AppLocale = 'fr';
const SUPPORTED_LANGUAGES = Object.keys(resources) as AppLocale[];

const isBrowser = typeof window !== 'undefined';

const isSupportedLanguage = (value: string | null): value is AppLocale => {
  return Boolean(value && SUPPORTED_LANGUAGES.includes(value as AppLocale));
};

const readStoredLanguage = (): AppLocale | null => {
  if (!isBrowser) {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isSupportedLanguage(stored) ? (stored as AppLocale) : null;
  } catch (error) {
    logger.warn('[i18n] Unable to read language from localStorage', error as Error, 'SYSTEM');
    return null;
  }
};

const detectBrowserLanguage = (): AppLocale | null => {
  if (!isBrowser) {
    return null;
  }

  const navigatorLanguage = window.navigator?.language ?? window.navigator?.languages?.[0];
  if (!navigatorLanguage) {
    return null;
  }

  const normalized = navigatorLanguage.toLowerCase().split('-')[0];
  return isSupportedLanguage(normalized) ? (normalized as AppLocale) : null;
};

const persistLanguage = (language: AppLocale) => {
  if (!isBrowser) {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, language);
  } catch (error) {
    logger.warn('[i18n] Unable to persist language to localStorage', error as Error, 'SYSTEM');
  }
};

const applyDocumentLanguage = (language: AppLocale) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = language;
  }
};

const resolveInitialLanguage = (): AppLocale => {
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

const initialLanguage = resolveInitialLanguage();
const i18nInstance = ensureI18n(initialLanguage);

if (!readStoredLanguage() && isBrowser) {
  persistLanguage(initialLanguage);
}

applyDocumentLanguage(initialLanguage);

let listenersAttached = false;

if (!listenersAttached) {
  i18nInstance.on('languageChanged', nextLanguage => {
    const normalized = (nextLanguage?.split?.('-')[0] ?? FALLBACK_LANGUAGE) as AppLocale;
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

        if (isSupportedLanguage(normalized) && !i18nInstance.language?.startsWith(normalized)) {
          void i18nInstance.changeLanguage(normalized);
        }
      }
    }) as typeof storage.setItem;

    storageWithMarker.__i18nLanguageSyncApplied__ = true;
  }
}

export default i18nInstance;

// Export named exports for compatibility
export const t = (key: string, options?: any) => i18nInstance.t(key, options);
export const I18nProvider = ({ children }: { children: React.ReactNode }) => children;
