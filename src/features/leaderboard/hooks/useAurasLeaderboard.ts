/**
 * Hook pour récupérer les auras des utilisateurs pour le leaderboard visuel
 * Affiche un "ciel d'auras" sans classement numérique, basé sur WHO-5 / activité
 * Connecté au système d'interconnexion des modules
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { useModuleInterconnect } from '@/hooks/useModuleInterconnect';

export interface AuraEntry {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl?: string | null;
  /** Teinte HSL 0-360 */
  colorHue: number;
  /** Luminosité 0-1 (0.3-0.9 typiquement) */
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
const computeHue = (who5Level?: number, seed = 0): number => {
  // Utiliser seed pour éviter re-render aléatoire
  const pseudoRandom = ((seed * 9301 + 49297) % 233280) / 233280;
  
  if (typeof who5Level !== 'number') return 180; // neutre
  if (who5Level <= 1) return 220 + pseudoRandom * 50; // cool
  if (who5Level >= 3) return 30 + pseudoRandom * 30; // warm
  return 120 + pseudoRandom * 60; // neutre
};

/**
 * Convertit luminosity DB (integer 0-100) en float 0-1
 */
const normalizeLuminosity = (dbValue?: number | null): number => {
  if (typeof dbValue !== 'number' || dbValue < 0) return 0.6;
  // Si > 1, c'est un pourcentage, diviser par 100
  if (dbValue > 1) return Math.min(dbValue / 100, 1);
  return dbValue;
};

const normalizeSize = (dbValue?: number | null): number => {
  if (typeof dbValue !== 'number' || dbValue <= 0) return 0.8;
  // Si valeur entre 0-2, c'est déjà normalisé
  if (dbValue <= 2) return dbValue;
  // Sinon considérer comme pourcentage
  return Math.min(dbValue / 100, 1.5);
};

/** Génère des auras de démonstration si la table est vide */
const generateDemoAuras = (): AuraEntry[] => {
  const demoNames = [
    'Étoile Paisible', 'Lueur Sereine', 'Flamme Douce', 
    'Océan Calme', 'Soleil Bienveillant', 'Lune Apaisante',
    'Nuage Léger', 'Brise Matinale', 'Aurore Céleste'
  ];
  
  return demoNames.map((name, i) => ({
    id: `demo-${i}`,
    userId: `demo-user-${i}`,
    displayName: name,
    avatarUrl: null,
    colorHue: computeHue(Math.floor(i / 3), i),
    luminosity: 0.5 + (i % 5) * 0.1,
    sizeScale: 0.7 + (i % 4) * 0.15,
    who5Badge: null,
    streakDays: i * 2,
    lastUpdated: new Date().toISOString(),
    isMe: false,
  }));
};

export const useAurasLeaderboard = (): UseAurasLeaderboardResult => {
  const [rawAuras, setRawAuras] = useState<AuraEntry[]>([]);
  const [_profiles, setProfiles] = useState<Map<string, { name: string; avatar: string | null }>>(new Map());
  const [myAura, setMyAura] = useState<AuraEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [_currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Connexion au système d'interconnexion pour les insights cross-modules
  useModuleInterconnect({ autoFetch: true });

  const fetchAuras = useCallback(async () => {
    try {
      setLoading(true);

      // Récupérer l'utilisateur courant
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id || null;
      setCurrentUserId(userId);

      // Récupérer les dernières entrées de aura_history
      const { data: auraData, error: fetchError } = await supabase
        .from('aura_history')
        .select('*')
        .order('week_end', { ascending: false })
        .limit(100);

      if (fetchError) throw fetchError;

      // Si pas de données, utiliser des données de démo
      if (!auraData || auraData.length === 0) {
        const demoAuras = generateDemoAuras();
        setRawAuras(demoAuras);
        setMyAura(null);
        setError(null);
        setLoading(false);
        return;
      }

      // Récupérer les profils pour les noms et avatars
      const userIds = [...new Set(auraData.map((row) => row.user_id))];
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);

      // Récupérer les streaks des utilisateurs
      const { data: streakData } = await supabase
        .from('activity_streaks')
        .select('user_id, current_streak')
        .in('user_id', userIds);

      const streakMap = new Map<string, number>();
      (streakData || []).forEach((s) => {
        streakMap.set(s.user_id, s.current_streak || 0);
      });

      const profileMap = new Map<string, { name: string; avatar: string | null }>();
      (profileData || []).forEach((p) => {
        profileMap.set(p.id, {
          name: p.full_name || `Explorateur ${p.id.slice(0, 4)}`,
          avatar: p.avatar_url,
        });
      });
      setProfiles(profileMap);

      const mapped: AuraEntry[] = auraData.map((row, index) => {
        const profile = profileMap.get(row.user_id);
        const streak = streakMap.get(row.user_id);
        return {
          id: row.id,
          userId: row.user_id,
          displayName: profile?.name || `Explorateur ${row.user_id.slice(0, 4)}`,
          avatarUrl: profile?.avatar || null,
          colorHue: row.color_hue ?? computeHue(row.who5_badge ? 3 : undefined, index),
          luminosity: normalizeLuminosity(row.luminosity),
          sizeScale: normalizeSize(row.size_scale),
          who5Badge: row.who5_badge,
          streakDays: streak,
          lastUpdated: row.week_end,
          isMe: row.user_id === userId,
        };
      });

      // Dédupliquer par user_id (garder le plus récent)
      const uniqueByUser = new Map<string, AuraEntry>();
      mapped.forEach((a) => {
        if (!uniqueByUser.has(a.userId)) {
          uniqueByUser.set(a.userId, a);
        }
      });

      const finalAuras = Array.from(uniqueByUser.values());
      setRawAuras(finalAuras);

      const mine = finalAuras.find((a) => a.isMe) || null;
      setMyAura(mine);
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      logger.error('Erreur chargement auras leaderboard:', err as Error, 'HOOK');
      setError(message);
      // En cas d'erreur, afficher des données de démo
      setRawAuras(generateDemoAuras());
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

  // Mémoiser les auras pour éviter les re-renders inutiles
  const auras = useMemo(() => rawAuras, [rawAuras]);

  return {
    auras,
    myAura,
    loading,
    error,
    refresh: fetchAuras,
  };
};
