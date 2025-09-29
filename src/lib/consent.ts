import { isBrowser } from '@/lib/utils';

type ConsentCategory = 'functional' | 'analytics';

type ConsentPreferences = {
  version: number;
  categories: Record<ConsentCategory, boolean>;
  updatedAt: string;
};

type ConsentListener = (preferences: ConsentPreferences) => void;

const CONSENT_STORAGE_KEY = 'emotionscare.consent.preferences';
const CONSENT_VERSION = 1;

const DEFAULT_CONSENT: ConsentPreferences = {
  version: CONSENT_VERSION,
  categories: {
    functional: true,
    analytics: false,
  },
  updatedAt: '1970-01-01T00:00:00.000Z',
};

let cachedPreferences: ConsentPreferences = clonePreferences(DEFAULT_CONSENT);
let preferencesLoaded = false;
let storedPreferencesAvailable = false;
const listeners = new Set<ConsentListener>();

function clonePreferences(preferences: ConsentPreferences): ConsentPreferences {
  return {
    version: preferences.version,
    categories: { ...preferences.categories },
    updatedAt: preferences.updatedAt,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseStoredPreferences(value: unknown): ConsentPreferences | null {
  if (!isRecord(value)) {
    return null;
  }

  const { version, categories, updatedAt } = value;

  if (typeof version !== 'number' || version !== CONSENT_VERSION) {
    return null;
  }

  if (!isRecord(categories)) {
    return null;
  }

  const analytics = Boolean(categories.analytics);

  if (typeof updatedAt !== 'string') {
    return null;
  }

  return {
    version,
    categories: {
      functional: true,
      analytics,
    },
    updatedAt,
  };
}

function readFromStorage(): ConsentPreferences | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as unknown;
    return parseStoredPreferences(parsed);
  } catch (error) {
    console.warn('[Consent] Impossible de lire les préférences', error);
    return null;
  }
}

function persistPreferences(preferences: ConsentPreferences): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.warn('[Consent] Impossible d\'enregistrer les préférences', error);
  }
}

function applyDocumentAttributes(preferences: ConsentPreferences): void {
  if (typeof document === 'undefined') {
    return;
  }

  const status = preferences.categories.analytics ? 'granted' : 'denied';
  document.documentElement.setAttribute('data-analytics-consent', status);
}

function ensurePreferencesLoaded(): ConsentPreferences {
  if (preferencesLoaded) {
    return cachedPreferences;
  }

  const stored = readFromStorage();
  if (stored) {
    cachedPreferences = clonePreferences(stored);
    storedPreferencesAvailable = true;
  } else {
    cachedPreferences = clonePreferences(DEFAULT_CONSENT);
    storedPreferencesAvailable = false;
  }

  preferencesLoaded = true;
  applyDocumentAttributes(cachedPreferences);
  return cachedPreferences;
}

function notify(preferences: ConsentPreferences): void {
  listeners.forEach(listener => {
    try {
      listener(clonePreferences(preferences));
    } catch (error) {
      console.error('[Consent] Listener error', error);
    }
  });
}

export function getConsentPreferences(): ConsentPreferences {
  return clonePreferences(ensurePreferencesLoaded());
}

export function hasStoredConsentPreferences(): boolean {
  ensurePreferencesLoaded();
  return storedPreferencesAvailable;
}

export function hasConsent(category: ConsentCategory): boolean {
  const preferences = ensurePreferencesLoaded();
  return Boolean(preferences.categories[category]);
}

export function setConsentPreferences(update: Partial<Record<ConsentCategory, boolean>>): ConsentPreferences {
  const current = ensurePreferencesLoaded();
  const categories: Record<ConsentCategory, boolean> = {
    functional: true,
    analytics: current.categories.analytics,
  };

  if (typeof update.analytics === 'boolean') {
    categories.analytics = update.analytics;
  }

  const next: ConsentPreferences = {
    version: CONSENT_VERSION,
    categories,
    updatedAt: new Date().toISOString(),
  };

  cachedPreferences = clonePreferences(next);
  preferencesLoaded = true;
  storedPreferencesAvailable = true;
  persistPreferences(next);
  applyDocumentAttributes(next);
  notify(next);

  return clonePreferences(next);
}

export function onConsentChange(listener: ConsentListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function resetStoredConsent(): void {
  cachedPreferences = clonePreferences(DEFAULT_CONSENT);
  preferencesLoaded = false;
  storedPreferencesAvailable = false;
  if (isBrowser()) {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  }
}

export type { ConsentCategory, ConsentPreferences };
