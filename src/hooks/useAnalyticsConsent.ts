// @ts-nocheck
/**
 * useAnalyticsConsent - Hook de gestion du consentement analytics
 * Gestion complète du consentement RGPD avec historique et granularité
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { logger } from '@/lib/logger';

/** Types de consentement */
export type ConsentType =
  | 'analytics'
  | 'marketing'
  | 'personalization'
  | 'functional'
  | 'performance'
  | 'third_party'
  | 'crash_reports'
  | 'usage_stats';

/** Statut du consentement */
export type ConsentStatus = 'granted' | 'denied' | 'pending' | 'expired';

/** Source du consentement */
export type ConsentSource = 'user' | 'default' | 'imported' | 'banner' | 'settings';

/** Consentement individuel */
export interface ConsentItem {
  type: ConsentType;
  status: ConsentStatus;
  timestamp: number;
  source: ConsentSource;
  version?: string;
  expiresAt?: number;
}

/** État complet du consentement */
export interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
  functional: boolean;
  performance: boolean;
  thirdParty: boolean;
  crashReports: boolean;
  usageStats: boolean;
  globalConsent: boolean;
  consentVersion: string;
  lastUpdated: number;
  history: ConsentHistoryEntry[];
}

/** Entrée d'historique */
export interface ConsentHistoryEntry {
  timestamp: number;
  type: ConsentType | 'all';
  previousStatus: ConsentStatus;
  newStatus: ConsentStatus;
  source: ConsentSource;
  metadata?: Record<string, unknown>;
}

/** Configuration du consentement */
export interface ConsentConfig {
  version: string;
  expirationDays: number;
  requireExplicitConsent: boolean;
  defaultConsents: Partial<Record<ConsentType, boolean>>;
  essentialTypes: ConsentType[];
  storageKey: string;
}

/** Résultat du hook */
export interface UseAnalyticsConsentResult {
  // État simplifié (rétrocompatibilité)
  hasConsent: boolean;
  giveConsent: () => void;
  revokeConsent: () => void;

  // État complet
  state: ConsentState;
  isLoading: boolean;

  // Actions granulaires
  setConsent: (type: ConsentType, granted: boolean) => void;
  setAllConsents: (granted: boolean) => void;
  getConsent: (type: ConsentType) => boolean;
  hasConsentFor: (type: ConsentType) => boolean;

  // Actions groupées
  acceptAll: () => void;
  rejectAll: () => void;
  acceptEssentialOnly: () => void;

  // Utilitaires
  isConsentValid: () => boolean;
  needsRenewal: () => boolean;
  getConsentAge: () => number;
  exportConsent: () => string;
  importConsent: (data: string) => boolean;
  resetConsent: () => void;

  // Historique
  getHistory: () => ConsentHistoryEntry[];
  clearHistory: () => void;
}

// Configuration par défaut
const DEFAULT_CONFIG: ConsentConfig = {
  version: '1.0.0',
  expirationDays: 365,
  requireExplicitConsent: true,
  defaultConsents: {
    functional: true,
    crash_reports: false,
    analytics: false,
    marketing: false,
    personalization: false,
    performance: false,
    third_party: false,
    usage_stats: false
  },
  essentialTypes: ['functional'],
  storageKey: 'analytics-consent'
};

// État initial
const INITIAL_STATE: ConsentState = {
  analytics: false,
  marketing: false,
  personalization: false,
  functional: true,
  performance: false,
  thirdParty: false,
  crashReports: false,
  usageStats: false,
  globalConsent: false,
  consentVersion: DEFAULT_CONFIG.version,
  lastUpdated: 0,
  history: []
};

// Mapping des types vers les clés d'état
const TYPE_TO_KEY: Record<ConsentType, keyof ConsentState> = {
  analytics: 'analytics',
  marketing: 'marketing',
  personalization: 'personalization',
  functional: 'functional',
  performance: 'performance',
  third_party: 'thirdParty',
  crash_reports: 'crashReports',
  usage_stats: 'usageStats'
};

/** Hook principal */
export const useAnalyticsConsent = (
  config: Partial<ConsentConfig> = {}
): UseAnalyticsConsentResult => {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  // Storage legacy pour rétrocompatibilité
  const [legacyConsent, setLegacyConsent] = useLocalStorage<boolean>(
    mergedConfig.storageKey,
    false
  );

  // Storage complet
  const [fullState, setFullState] = useLocalStorage<ConsentState>(
    `${mergedConfig.storageKey}-full`,
    INITIAL_STATE
  );

  const [isLoading, setIsLoading] = useState(true);

  // Synchroniser l'état au chargement
  useEffect(() => {
    const syncState = () => {
      // Si legacy consent existe mais pas le full state, migrer
      if (legacyConsent && fullState.lastUpdated === 0) {
        const migratedState: ConsentState = {
          ...INITIAL_STATE,
          analytics: legacyConsent,
          crashReports: legacyConsent,
          usageStats: legacyConsent,
          performance: legacyConsent,
          globalConsent: legacyConsent,
          lastUpdated: Date.now(),
          consentVersion: mergedConfig.version,
          history: [{
            timestamp: Date.now(),
            type: 'all',
            previousStatus: 'pending',
            newStatus: legacyConsent ? 'granted' : 'denied',
            source: 'imported'
          }]
        };
        setFullState(migratedState);
      }

      setIsLoading(false);
    };

    syncState();
  }, []);

  // État actuel
  const state = useMemo(() => fullState, [fullState]);

  // Vérifier si le consentement a expiré
  const isConsentValid = useCallback((): boolean => {
    if (state.lastUpdated === 0) return false;

    const expirationMs = mergedConfig.expirationDays * 24 * 60 * 60 * 1000;
    return Date.now() - state.lastUpdated < expirationMs;
  }, [state.lastUpdated, mergedConfig.expirationDays]);

  // Vérifier si renouvellement nécessaire
  const needsRenewal = useCallback((): boolean => {
    if (state.consentVersion !== mergedConfig.version) return true;
    return !isConsentValid();
  }, [state.consentVersion, mergedConfig.version, isConsentValid]);

  // Âge du consentement en jours
  const getConsentAge = useCallback((): number => {
    if (state.lastUpdated === 0) return -1;
    return Math.floor((Date.now() - state.lastUpdated) / (24 * 60 * 60 * 1000));
  }, [state.lastUpdated]);

  // Ajouter une entrée d'historique
  const addHistoryEntry = useCallback((
    type: ConsentType | 'all',
    previousStatus: ConsentStatus,
    newStatus: ConsentStatus,
    source: ConsentSource
  ): void => {
    const entry: ConsentHistoryEntry = {
      timestamp: Date.now(),
      type,
      previousStatus,
      newStatus,
      source
    };

    setFullState(prev => ({
      ...prev,
      history: [...prev.history.slice(-99), entry] // Garder les 100 dernières
    }));
  }, [setFullState]);

  // Définir un consentement individuel
  const setConsent = useCallback((type: ConsentType, granted: boolean): void => {
    const key = TYPE_TO_KEY[type];
    if (!key) return;

    const previousValue = state[key as keyof ConsentState];
    const previousStatus: ConsentStatus = previousValue ? 'granted' : 'denied';
    const newStatus: ConsentStatus = granted ? 'granted' : 'denied';

    setFullState(prev => ({
      ...prev,
      [key]: granted,
      lastUpdated: Date.now(),
      consentVersion: mergedConfig.version
    }));

    // Mettre à jour le legacy si c'est analytics
    if (type === 'analytics') {
      setLegacyConsent(granted);
    }

    addHistoryEntry(type, previousStatus, newStatus, 'settings');

    logger.info(`Consent ${type} ${granted ? 'granted' : 'revoked'}`, {
      type,
      granted
    }, 'CONSENT');
  }, [state, setFullState, setLegacyConsent, addHistoryEntry, mergedConfig.version]);

  // Définir tous les consentements
  const setAllConsents = useCallback((granted: boolean): void => {
    const newState: ConsentState = {
      analytics: granted,
      marketing: granted,
      personalization: granted,
      functional: true, // Toujours activé
      performance: granted,
      thirdParty: granted,
      crashReports: granted,
      usageStats: granted,
      globalConsent: granted,
      consentVersion: mergedConfig.version,
      lastUpdated: Date.now(),
      history: state.history
    };

    setFullState(newState);
    setLegacyConsent(granted);

    addHistoryEntry('all', state.globalConsent ? 'granted' : 'denied', granted ? 'granted' : 'denied', 'settings');

    logger.info(`All consents ${granted ? 'granted' : 'revoked'}`, {}, 'CONSENT');
  }, [state, setFullState, setLegacyConsent, addHistoryEntry, mergedConfig.version]);

  // Obtenir le consentement pour un type
  const getConsent = useCallback((type: ConsentType): boolean => {
    const key = TYPE_TO_KEY[type];
    if (!key) return false;
    return state[key as keyof ConsentState] as boolean;
  }, [state]);

  // Vérifier si un consentement existe
  const hasConsentFor = useCallback((type: ConsentType): boolean => {
    return getConsent(type) && isConsentValid();
  }, [getConsent, isConsentValid]);

  // Accepter tous les consentements
  const acceptAll = useCallback((): void => {
    setAllConsents(true);
  }, [setAllConsents]);

  // Rejeter tous les consentements (sauf essentiels)
  const rejectAll = useCallback((): void => {
    const newState: ConsentState = {
      analytics: false,
      marketing: false,
      personalization: false,
      functional: true, // Essentiel
      performance: false,
      thirdParty: false,
      crashReports: false,
      usageStats: false,
      globalConsent: false,
      consentVersion: mergedConfig.version,
      lastUpdated: Date.now(),
      history: state.history
    };

    setFullState(newState);
    setLegacyConsent(false);

    addHistoryEntry('all', state.globalConsent ? 'granted' : 'denied', 'denied', 'banner');
  }, [state, setFullState, setLegacyConsent, addHistoryEntry, mergedConfig.version]);

  // Accepter uniquement les essentiels
  const acceptEssentialOnly = useCallback((): void => {
    const newState: ConsentState = {
      ...INITIAL_STATE,
      functional: true,
      consentVersion: mergedConfig.version,
      lastUpdated: Date.now(),
      history: state.history
    };

    setFullState(newState);
    setLegacyConsent(false);

    addHistoryEntry('all', state.globalConsent ? 'granted' : 'denied', 'denied', 'banner');
  }, [state, setFullState, setLegacyConsent, addHistoryEntry, mergedConfig.version]);

  // Exporter le consentement
  const exportConsent = useCallback((): string => {
    return JSON.stringify({
      state,
      version: mergedConfig.version,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }, [state, mergedConfig.version]);

  // Importer le consentement
  const importConsent = useCallback((data: string): boolean => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.state && typeof parsed.state === 'object') {
        setFullState({
          ...parsed.state,
          lastUpdated: Date.now(),
          history: [
            ...parsed.state.history,
            {
              timestamp: Date.now(),
              type: 'all',
              previousStatus: 'pending',
              newStatus: parsed.state.globalConsent ? 'granted' : 'denied',
              source: 'imported'
            }
          ]
        });
        setLegacyConsent(parsed.state.analytics || false);
        return true;
      }
      return false;
    } catch {
      logger.error('Failed to import consent', {}, 'CONSENT');
      return false;
    }
  }, [setFullState, setLegacyConsent]);

  // Réinitialiser le consentement
  const resetConsent = useCallback((): void => {
    setFullState({
      ...INITIAL_STATE,
      history: [{
        timestamp: Date.now(),
        type: 'all',
        previousStatus: state.globalConsent ? 'granted' : 'denied',
        newStatus: 'pending',
        source: 'user'
      }]
    });
    setLegacyConsent(false);

    logger.info('Consent reset', {}, 'CONSENT');
  }, [state, setFullState, setLegacyConsent]);

  // Obtenir l'historique
  const getHistory = useCallback((): ConsentHistoryEntry[] => {
    return [...state.history].reverse();
  }, [state.history]);

  // Effacer l'historique
  const clearHistory = useCallback((): void => {
    setFullState(prev => ({
      ...prev,
      history: []
    }));
  }, [setFullState]);

  // Actions de rétrocompatibilité
  const giveConsent = useCallback(() => setConsent('analytics', true), [setConsent]);
  const revokeConsent = useCallback(() => setConsent('analytics', false), [setConsent]);

  return {
    // Rétrocompatibilité
    hasConsent: state.analytics && isConsentValid(),
    giveConsent,
    revokeConsent,

    // État complet
    state,
    isLoading,

    // Actions granulaires
    setConsent,
    setAllConsents,
    getConsent,
    hasConsentFor,

    // Actions groupées
    acceptAll,
    rejectAll,
    acceptEssentialOnly,

    // Utilitaires
    isConsentValid,
    needsRenewal,
    getConsentAge,
    exportConsent,
    importConsent,
    resetConsent,

    // Historique
    getHistory,
    clearHistory
  };
};

/** Hook simplifié pour vérifier un type de consentement */
export function useConsentFor(type: ConsentType): boolean {
  const { hasConsentFor } = useAnalyticsConsent();
  return hasConsentFor(type);
}

/** Hook pour le consentement marketing */
export function useMarketingConsent(): [boolean, (granted: boolean) => void] {
  const { getConsent, setConsent } = useAnalyticsConsent();
  return [
    getConsent('marketing'),
    (granted: boolean) => setConsent('marketing', granted)
  ];
}

/** Hook pour le consentement performance */
export function usePerformanceConsent(): [boolean, (granted: boolean) => void] {
  const { getConsent, setConsent } = useAnalyticsConsent();
  return [
    getConsent('performance'),
    (granted: boolean) => setConsent('performance', granted)
  ];
}

/** Liste des types de consentement */
export const CONSENT_TYPES: ConsentType[] = [
  'analytics',
  'marketing',
  'personalization',
  'functional',
  'performance',
  'third_party',
  'crash_reports',
  'usage_stats'
];

/** Descriptions des types de consentement */
export const CONSENT_DESCRIPTIONS: Record<ConsentType, { title: string; description: string }> = {
  functional: {
    title: 'Cookies fonctionnels',
    description: 'Nécessaires au bon fonctionnement de l\'application'
  },
  analytics: {
    title: 'Analytics',
    description: 'Nous aident à comprendre comment vous utilisez l\'application'
  },
  marketing: {
    title: 'Marketing',
    description: 'Utilisés pour vous proposer des contenus personnalisés'
  },
  personalization: {
    title: 'Personnalisation',
    description: 'Permettent d\'adapter l\'expérience à vos préférences'
  },
  performance: {
    title: 'Performance',
    description: 'Nous aident à améliorer les performances de l\'application'
  },
  third_party: {
    title: 'Tiers',
    description: 'Services tiers intégrés à l\'application'
  },
  crash_reports: {
    title: 'Rapports de crash',
    description: 'Nous permettent de corriger les bugs plus rapidement'
  },
  usage_stats: {
    title: 'Statistiques d\'usage',
    description: 'Données anonymisées sur l\'utilisation'
  }
};

export default useAnalyticsConsent;
