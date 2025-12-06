import { QueryClient } from '@tanstack/react-query';

/**
 * Configuration optimisée React Query pour EmotionsCare
 * Phase 4 - Optimisations avancées du cache et des requêtes
 */

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache les données pendant 5 minutes par défaut
      staleTime: 5 * 60 * 1000,
      
      // Garde les données en cache pendant 10 minutes même si non utilisées
      gcTime: 10 * 60 * 1000, // anciennement cacheTime
      
      // Réessayer automatiquement 1 fois en cas d'échec
      retry: 1,
      
      // Délai exponentiel entre les retries (1s, 2s, 4s...)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Ne pas refetch automatiquement au focus de la fenêtre (économie de bande passante)
      refetchOnWindowFocus: false,
      
      // Refetch au reconnect réseau
      refetchOnReconnect: true,
      
      // Ne pas refetch automatiquement au mount si les données sont fresh
      refetchOnMount: true,
    },
    mutations: {
      // Réessayer 1 fois en cas d'échec de mutation
      retry: 1,
      
      // Délai de 1s avant retry
      retryDelay: 1000,
    },
  },
});

/**
 * Query keys standardisés pour consistance
 */
export const queryKeys = {
  // Journal
  journalVoice: (userId: string) => ['journal', 'voice', userId] as const,
  journalText: (userId: string) => ['journal', 'text', userId] as const,
  
  // VR
  vrNebula: (userId: string) => ['vr', 'nebula', userId] as const,
  vrDome: (userId: string) => ['vr', 'dome', userId] as const,
  
  // Breath
  breathWeekly: (userId: string) => ['breath', 'weekly', userId] as const,
  breathWeeklyOrg: (orgId: string) => ['breath', 'weekly', 'org', orgId] as const,
  
  // Assessments
  assessments: (userId: string, instrument?: string) => 
    instrument 
      ? ['assessments', userId, instrument] as const
      : ['assessments', userId] as const,
  
  // User
  userProfile: (userId: string) => ['user', 'profile', userId] as const,
  
  // Organization
  orgMembers: (orgId: string) => ['org', 'members', orgId] as const,
} as const;

/**
 * Configuration spécifique par type de données
 */
export const queryOptions = {
  // Données temps réel : refresh fréquent
  realtime: {
    staleTime: 30 * 1000, // 30 secondes
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 60 * 1000, // Poll toutes les 60 secondes
  },
  
  // Données statiques : cache long
  static: {
    staleTime: 60 * 60 * 1000, // 1 heure
    gcTime: 24 * 60 * 60 * 1000, // 24 heures
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  },
  
  // Données sensibles : pas de cache
  sensitive: {
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  },
} as const;
