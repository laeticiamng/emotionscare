"use client";

import React from 'react';
import { I18nextProvider } from 'react-i18next';
import type { TOptions } from 'i18next';

import i18n from '@/lib/i18n';
import { useSettingsStore } from '@/store/settings.store';
import { logger } from '@/lib/logger';

export type Lang = 'fr' | 'en';

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const STORAGE_KEY = 'lang';
const DEFAULT_LANG: Lang = 'fr';

const I18nCtx = React.createContext<I18nContextValue>({
  lang: DEFAULT_LANG,
  setLang: () => {},
});

const resolveNavigatorLanguage = (fallback: Lang = DEFAULT_LANG): Lang => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const navigatorLang = window.navigator?.language ?? window.navigator?.languages?.[0];
  if (!navigatorLang) {
    return fallback;
  }

  const normalized = navigatorLang.slice(0, 2).toLowerCase();
  return normalized === 'en' ? 'en' : 'fr';
};

const updateDocumentLanguage = (lang: Lang) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
  }
};

export function I18nProvider({ children, defaultLang = DEFAULT_LANG }: { children: React.ReactNode; defaultLang?: Lang }) {
  const profileLanguage = useSettingsStore((state) => state.profile.language);
  const setProfileLanguage = useSettingsStore((state) => state.setLanguage);

  const [lang, setLangState] = React.useState<Lang>(() => {
    const current = (i18n.language?.slice(0, 2) as Lang | undefined) ?? defaultLang;
    return current === 'en' ? 'en' : 'fr';
  });
  const [hydrated, setHydrated] = React.useState(false);

  const applyLanguage = React.useCallback(
    async (nextLang: Lang, persistToProfile: boolean) => {
      const normalized = nextLang === 'en' ? 'en' : 'fr';

      try {
        if (!i18n.language?.startsWith(normalized)) {
          await i18n.changeLanguage(normalized);
        }

        setLangState(normalized);

        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, normalized);
        }
        updateDocumentLanguage(normalized);

        if (persistToProfile && profileLanguage !== normalized) {
          setProfileLanguage(normalized);
        }
      } catch (error) {
        logger.error('Unable to switch application language', error, 'i18n');
      }
    },
    [profileLanguage, setProfileLanguage]
  );

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    const profileSetting = profileLanguage === 'auto' ? undefined : (profileLanguage as Lang | undefined);
    const initial = stored ?? profileSetting ?? resolveNavigatorLanguage(defaultLang);

    applyLanguage(initial, false).finally(() => {
      setHydrated(true);
    });
  }, [applyLanguage, defaultLang, profileLanguage]);

  React.useEffect(() => {
    if (!hydrated) {
      return;
    }

    const effectiveProfileLang = profileLanguage === 'auto'
      ? resolveNavigatorLanguage(defaultLang)
      : (profileLanguage as Lang | undefined);

    if (effectiveProfileLang && effectiveProfileLang !== lang) {
      void applyLanguage(effectiveProfileLang, false);
    }
  }, [applyLanguage, defaultLang, hydrated, lang, profileLanguage]);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let cancelled = false;

    const syncLanguageFromProfile = async () => {
      try {
        const response = await fetch('/api/me/profile', { credentials: 'include' });
        if (!response.ok) {
          return;
        }

        const data = await response.json();
        const remoteLanguage = data?.language as 'fr' | 'en' | 'auto' | undefined;

        if (!cancelled && remoteLanguage && remoteLanguage !== profileLanguage) {
          setProfileLanguage(remoteLanguage);
        }
      } catch (error) {
        logger.warn('Failed to synchronise profile language from Supabase', error, 'i18n');
      }
    };

    syncLanguageFromProfile();

    return () => {
      cancelled = true;
    };
  }, [profileLanguage, setProfileLanguage]);

  const contextValue = React.useMemo<I18nContextValue>(
    () => ({
      lang,
      setLang: (next) => {
        void applyLanguage(next, true);
      },
    }),
    [applyLanguage, lang]
  );

  return (
    <I18nextProvider i18n={i18n}>
      <I18nCtx.Provider value={contextValue}>{children}</I18nCtx.Provider>
    </I18nextProvider>
  );
}

export function useI18n() {
  return React.useContext(I18nCtx);
}

export function t(
  key: string,
  namespace: 'common' | 'navigation' | 'dashboard' | 'settings' | 'modules' | 'auth' | 'errors' | 'legal' | 'journal' | 'coach' = 'common',
  options?: TOptions
) {
  const currentLanguage = (i18n.language?.split('-')[0] as Lang | undefined) ?? DEFAULT_LANG;
  let targetLanguage: Lang = currentLanguage;

  if (typeof window !== 'undefined') {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;

      if (stored && stored !== targetLanguage) {
        targetLanguage = stored;
        if (!i18n.language?.startsWith(stored)) {
          void i18n.changeLanguage(stored);
        }
      }
    } catch (error) {
      logger.warn('Unable to read stored language for translation', error, 'i18n');
    }
  }

  return i18n.getFixedT(targetLanguage, namespace)(key, options);
}
