/**
 * Hook useUserQuota - Gestion des quotas utilisateur
 *
 * Fonctionnalités:
 * - Récupération quota temps réel
 * - Rafraîchissement automatique
 * - Vérifications avant génération
 *
 * @module hooks/music/useUserQuota
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { quotaService, type UserQuota, type QuotaStatus } from '@/services/music/quota-service';
import { logger } from '@/lib/logger';

export interface UserQuotaStats {
  quota: UserQuota | null;
  status: QuotaStatus;
  concurrent: {
    current: number;
    limit: number;
  };
}

/**
 * Hook pour récupérer et gérer le quota utilisateur
 */
export function useUserQuota() {
  const queryClient = useQueryClient();

  // Récupérer l'utilisateur actuel
  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Récupérer les stats de quota
  const quotaQuery = useQuery({
    queryKey: ['music-quota', user?.id],
    queryFn: async (): Promise<UserQuotaStats | null> => {
      if (!user?.id) return null;

      try {
        return await quotaService.getUsageStats(user.id);
      } catch (error) {
        logger.error('Failed to fetch quota stats', error as Error, 'MUSIC');
        return null;
      }
    },
    enabled: !!user?.id,
    staleTime: 30 * 1000, // 30 secondes
    refetchInterval: 60 * 1000, // Rafraîchir toutes les minutes
    refetchOnWindowFocus: true
  });

  // Fonction pour forcer le rafraîchissement
  const refetch = () => {
    return quotaQuery.refetch();
  };

  // Fonction pour invalider le cache
  const invalidate = () => {
    return queryClient.invalidateQueries({ queryKey: ['music-quota', user?.id] });
  };

  // Vérifier si l'utilisateur peut générer
  const canGenerate = quotaQuery.data?.status.canGenerate ?? false;

  // Quota restant
  const remaining = quotaQuery.data?.status.remaining ?? 0;

  // Limite du quota
  const limit = quotaQuery.data?.status.limit ?? 0;

  // Pourcentage utilisé
  const percentage = quotaQuery.data?.status.percentage ?? 0;

  // Date de reset
  const resetDate = quotaQuery.data?.status.resetDate;

  // Tier de l'utilisateur
  const tier = quotaQuery.data?.status.tier;

  // Générations concurrentes
  const concurrentCurrent = quotaQuery.data?.concurrent.current ?? 0;
  const concurrentLimit = quotaQuery.data?.concurrent.limit ?? 0;

  // Raison si ne peut pas générer
  const reason = quotaQuery.data?.status.reason;

  return {
    // Données brutes
    quota: quotaQuery.data?.quota,
    status: quotaQuery.data?.status,
    concurrent: quotaQuery.data?.concurrent,

    // États React Query
    isLoading: quotaQuery.isLoading,
    isError: quotaQuery.isError,
    error: quotaQuery.error,

    // Valeurs calculées
    canGenerate,
    remaining,
    limit,
    percentage,
    resetDate,
    tier,
    concurrentCurrent,
    concurrentLimit,
    reason,

    // Actions
    refetch,
    invalidate
  };
}

/**
 * Hook pour vérifier si l'utilisateur peut générer avec une durée spécifique
 */
export function useCanGenerateWithDuration(durationSeconds?: number) {
  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    }
  });

  return useQuery({
    queryKey: ['can-generate-duration', user?.id, durationSeconds],
    queryFn: async () => {
      if (!user?.id || !durationSeconds) {
        return { canGenerate: false, reason: 'Missing user or duration' };
      }

      return await quotaService.canGenerateWithDuration(user.id, durationSeconds);
    },
    enabled: !!user?.id && !!durationSeconds,
    staleTime: 10 * 1000 // 10 secondes
  });
}

/**
 * Hook pour vérifier les générations concurrentes
 */
export function useConcurrentGenerations() {
  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    }
  });

  return useQuery({
    queryKey: ['concurrent-generations', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return { canGenerate: false, current: 0, limit: 0, reason: 'No user' };
      }

      return await quotaService.checkConcurrentGenerations(user.id);
    },
    enabled: !!user?.id,
    staleTime: 5 * 1000, // 5 secondes
    refetchInterval: 10 * 1000 // Rafraîchir toutes les 10 secondes
  });
}

/**
 * Hook pour obtenir les limites d'un tier
 */
export function useTierLimits() {
  const { tier } = useUserQuota();

  if (!tier) {
    return null;
  }

  return quotaService.getLimitsForTier(tier);
}

/**
 * Hook pour formater la date de reset
 */
export function useFormattedResetDate() {
  const { resetDate } = useUserQuota();

  if (!resetDate) {
    return null;
  }

  const date = new Date(resetDate);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Aujourd'hui";
  } else if (diffDays === 1) {
    return 'Demain';
  } else if (diffDays < 7) {
    return `Dans ${diffDays} jours`;
  } else {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}

/**
 * Hook pour obtenir la couleur du quota (pour UI)
 */
export function useQuotaColor() {
  const { percentage } = useUserQuota();

  if (percentage >= 90) {
    return 'red'; // Critique
  } else if (percentage >= 70) {
    return 'orange'; // Attention
  } else if (percentage >= 50) {
    return 'yellow'; // Modéré
  } else {
    return 'green'; // OK
  }
}

/**
 * Hook combiné pour UI - toutes les infos nécessaires
 */
export function useQuotaUI() {
  const quotaData = useUserQuota();
  const formattedResetDate = useFormattedResetDate();
  const quotaColor = useQuotaColor();
  const tierLimits = useTierLimits();

  return {
    ...quotaData,
    formattedResetDate,
    quotaColor,
    tierLimits
  };
}

export default useUserQuota;
