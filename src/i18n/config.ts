import i18next, { type i18n as I18nInstance } from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';

import fr from './locales/fr';
import type { LocaleResources } from './types';

export const SUPPORTED_LOCALES = ['fr', 'en'] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: AppLocale = 'fr';
export const DEFAULT_NAMESPACE = 'common';

const namespaces = Object.keys(fr);
const loadedLocales = new Set<AppLocale>();

const localeLoaders: Record<AppLocale, () => Promise<LocaleResources>> = {
  fr: async () => fr,
  en: () => import('./locales/en').then((module) => module.default),
};

let initPromise: Promise<I18nInstance> | null = null;

function markLocaleAsLoaded(locale: AppLocale) {
  if (!loadedLocales.has(locale)) {
    loadedLocales.add(locale);
  }
}

async function ensureResources(locale: AppLocale) {
  if (loadedLocales.has(locale)) {
    return;
  }

  const resources = await localeLoaders[locale]();
  Object.entries(resources).forEach(([namespace, dictionary]) => {
    i18next.addResourceBundle(locale, namespace, dictionary, true, true);
  });

  markLocaleAsLoaded(locale);
}

export async function initI18n(initialLocale: AppLocale = DEFAULT_LOCALE) {
  if (!initPromise) {
    initPromise = i18next
      .use(initReactI18next)
      .init({
        lng: initialLocale,
        fallbackLng: DEFAULT_LOCALE,
        supportedLngs: SUPPORTED_LOCALES,
        defaultNS: DEFAULT_NAMESPACE,
        ns: namespaces,
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
        resources: {
          fr,
        },
      })
      .then((instance) => {
        markLocaleAsLoaded('fr');
        return instance;
      });
  }

  const instance = await initPromise;

  if (instance.language !== initialLocale) {
    await changeLanguage(initialLocale);
  }

  return instance;
}

export function resolveLocale(locale?: string | null): AppLocale {
  if (!locale) {
    return DEFAULT_LOCALE;
  }

  const normalized = locale.toLowerCase();
  const match = SUPPORTED_LOCALES.find(
    (code) => normalized === code || normalized.startsWith(`${code}-`),
  );

  return match ?? DEFAULT_LOCALE;
}

export async function changeLanguage(locale: AppLocale) {
  await initI18n();
  await ensureResources(locale);
  await i18next.changeLanguage(locale);
  return i18next;
}

export async function preloadLocale(locale: AppLocale) {
  if (locale === DEFAULT_LOCALE) {
    return;
  }

  await ensureResources(locale);
}

export function getCurrentLocale(): AppLocale {
  return resolveLocale(i18next.language);
}

export { useTranslation };

