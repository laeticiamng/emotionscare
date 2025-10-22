// @ts-nocheck
import React from 'react';
import type { AppLocale } from '@/providers/i18n/resources';
import { ensureI18n } from '@/providers/i18n/client';

const FALLBACK_LANGUAGE: AppLocale = 'fr';

// Lazy initialization to avoid blocking module load
let i18nInstance: ReturnType<typeof ensureI18n> | null = null;

const getInstance = () => {
  if (!i18nInstance) {
    const isBrowser = typeof window !== 'undefined';
    let initialLang: AppLocale = FALLBACK_LANGUAGE;
    
    if (isBrowser) {
      try {
        const stored = window.localStorage.getItem('lang');
        if (stored === 'fr' || stored === 'en') {
          initialLang = stored;
        }
      } catch {
        // Silently ignore localStorage errors
      }
    }
    
    i18nInstance = ensureI18n(initialLang);
  }
  return i18nInstance;
};

// Export a proxy that lazily initializes i18n
const i18nProxy = new Proxy({} as ReturnType<typeof ensureI18n>, {
  get(_target, prop) {
    return getInstance()[prop as keyof ReturnType<typeof ensureI18n>];
  }
});

export default i18nProxy;

// Export named exports for compatibility
export const t = (key: string, options?: any) => getInstance().t(key, options);
export const I18nProvider = ({ children }: { children: React.ReactNode }) => children;
