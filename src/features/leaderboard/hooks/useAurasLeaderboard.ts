/**
 * Hook pour récupérer les auras des utilisateurs pour le leaderboard visuel
 * Affiche un "ciel d'auras" sans classement numérique, basé sur WHO-5 / activité
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface AuraEntry {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl?: string | null;
  /** Teinte HSL 0-360 */
  colorHue: number;
  /** Luminosité 0.3-0.9 */
  luminosity: number;
  /** Taille relative 0.5-1.5 */
  sizeScale: number;
  /** Badge WHO-5 */
  who5Badge?: string | null;
  /** Streak jours */
  streakDays?: number;
  /** Date dernière mise à jour */
  lastUpdated?: string;
  /** L'utilisateur courant */
  isMe?: boolean;
}

export interface UseAurasLeaderboardResult {
  auras: AuraEntry[];
  myAura: AuraEntry | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Détermine la couleur d'aura basée sur WHO-5 level
 * 0-1 = cool (bleu/violet 200-270)
 * 2 = neutre (vert 120-180)
 * 3-4 = warm (orange/jaune 30-60)
 */
const computeHue = (who5Level?: number): number => {
  if (typeof who5Level !== 'number') return 180; // neutre
  if (who5Level <= 1) return 220 + Math.random() * 50; // cool
  if (who5Level >= 3) return 30 + Math.random() * 30; // warm
  return 120 + Math.random() * 60; // neutre
};

const computeLuminosity = (who5Level?: number): number => {
  if (typeof who5Level !== 'number') return 0.6;
  // Plus le score est haut, plus c'est lumineux
  return 0.4 + (who5Level / 4) * 0.4;
};

const computeSize = (streakDays?: number): number => {
  if (typeof streakDays !== 'number' || streakDays <= 0) return 0.7;
  // Streak augmente la taille (cap à 30 jours)
  const cappedStreak = Math.min(streakDays, 30);
  return 0.7 + (cappedStreak / 30) * 0.6;
};

export const useAurasLeaderboard = (): UseAurasLeaderboardResult => {
  const [auras, setAuras] = useState<AuraEntry[]>([]);
  const [myAura, setMyAura] = useState<AuraEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuras = useCallback(async () => {
    try {
      setLoading(true);

      // Récupérer les dernières entrées de aura_history
      const { data: auraData, error: fetchError } = await supabase
        .from('aura_history')
        .select('*')
        .order('week_end', { ascending: false })
        .limit(100);

      if (fetchError) throw fetchError;

      const { data: userData } = await supabase.auth.getUser();
      const currentUserId = userData?.user?.id;

      const mapped: AuraEntry[] = (auraData || []).map((row) => ({
        id: row.id,
        userId: row.user_id,
        displayName: `Explorateur ${row.user_id.slice(0, 4)}`,
        avatarUrl: null,
        colorHue: row.color_hue ?? computeHue(row.who5_badge ? 3 : undefined),
        luminosity: row.luminosity ?? computeLuminosity(3),
        sizeScale: row.size_scale ?? 1,
        who5Badge: row.who5_badge,
        streakDays: undefined,
        lastUpdated: row.week_end,
        isMe: row.user_id === currentUserId,
      }));

      // Dédupliquer par user_id (garder le plus récent)
      const uniqueByUser = new Map<string, AuraEntry>();
      mapped.forEach((a) => {
        if (!uniqueByUser.has(a.userId)) {
          uniqueByUser.set(a.userId, a);
        }
      });

      const finalAuras = Array.from(uniqueByUser.values());
      setAuras(finalAuras);

      const mine = finalAuras.find((a) => a.isMe) || null;
      setMyAura(mine);
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      logger.error('Erreur chargement auras leaderboard:', err as Error, 'HOOK');
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuras();

    const channel = supabase
      .channel('auras-leaderboard-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'aura_history' },
        () => {
          fetchAuras();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAuras]);

  return {
    auras,
    myAura,
    loading,
    error,
    refresh: fetchAuras,
  };
};
