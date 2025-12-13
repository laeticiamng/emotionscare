// @ts-nocheck
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

/** Catégorie de badge */
export type BadgeCategory =
  | 'breathing'
  | 'meditation'
  | 'music'
  | 'community'
  | 'streak'
  | 'milestone'
  | 'special'
  | 'seasonal'
  | 'challenge';

/** Rareté du badge */
export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

/** Badge */
export interface Badge {
  id: string;
  user_id: string;
  badge_id: string;
  badge_name: string;
  badge_description?: string;
  badge_icon?: string;
  badge_image_url?: string;
  badge_category: BadgeCategory;
  badge_rarity: BadgeRarity;
  earned_at: string;
  expires_at?: string;
  progress?: {
    current: number;
    target: number;
  };
  unlocked: boolean;
  viewed: boolean;
  pinned: boolean;
  shared_on_social: boolean;
  xp_reward: number;
  points_reward: number;
  secret: boolean;
  requirements: BadgeRequirement[];
}

/** Exigence pour débloquer un badge */
export interface BadgeRequirement {
  type: string;
  value: number;
  current?: number;
  completed: boolean;
}

/** Définition de badge (template) */
export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  image_url?: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  xp_reward: number;
  points_reward: number;
  requirements: BadgeRequirement[];
  secret: boolean;
  seasonal?: boolean;
  available_from?: string;
  available_until?: string;
}

/** Statistiques des badges */
export interface BadgeStats {
  total: number;
  unlocked: number;
  locked: number;
  progress: number;
  byCategory: Record<BadgeCategory, { total: number; unlocked: number }>;
  byRarity: Record<BadgeRarity, { total: number; unlocked: number }>;
  totalXP: number;
  totalPoints: number;
  recentUnlocks: Badge[];
  nearCompletion: Badge[];
}

/** Configuration du hook */
export interface BadgesConfig {
  autoRefresh: boolean;
  refreshInterval: number;
  showNotifications: boolean;
  includeSecret: boolean;
}

const DEFAULT_CONFIG: BadgesConfig = {
  autoRefresh: true,
  refreshInterval: 30000,
  showNotifications: true,
  includeSecret: false
};

/** Couleurs par rareté */
export const RARITY_COLORS: Record<BadgeRarity, string> = {
  common: '#9CA3AF',
  uncommon: '#10B981',
  rare: '#3B82F6',
  epic: '#8B5CF6',
  legendary: '#F59E0B',
  mythic: '#EC4899'
};

/** XP par rareté */
const XP_BY_RARITY: Record<BadgeRarity, number> = {
  common: 10,
  uncommon: 25,
  rare: 50,
  epic: 100,
  legendary: 250,
  mythic: 500
};

export const useBadges = (config?: Partial<BadgesConfig>) => {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  const [badges, setBadges] = useState<Badge[]>([]);
  const [definitions, setDefinitions] = useState<BadgeDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | 'all'>('all');
  const [selectedRarity, setSelectedRarity] = useState<BadgeRarity | 'all'>('all');
  const [newUnlocks, setNewUnlocks] = useState<Badge[]>([]);

  /** Récupérer les badges de l'utilisateur */
  const fetchBadges = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error: fetchError } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Enrichir les badges avec des valeurs par défaut
      const enrichedBadges = (data || []).map(badge => ({
        ...badge,
        badge_rarity: badge.badge_rarity || 'common',
        xp_reward: badge.xp_reward || XP_BY_RARITY[badge.badge_rarity || 'common'],
        points_reward: badge.points_reward || 0,
        viewed: badge.viewed ?? true,
        pinned: badge.pinned ?? false,
        secret: badge.secret ?? false,
        requirements: badge.requirements || []
      }));

      setBadges(enrichedBadges);
      setError(null);

      // Détecter les nouveaux déblocages
      const unviewed = enrichedBadges.filter(b => b.unlocked && !b.viewed);
      if (unviewed.length > 0) {
        setNewUnlocks(unviewed);
      }
    } catch (err: any) {
      logger.error('Error fetching badges:', err, 'HOOK');
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /** Récupérer les définitions de badges */
  const fetchDefinitions = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('badge_definitions')
        .select('*')
        .order('rarity', { ascending: false });

      if (fetchError) throw fetchError;
      setDefinitions(data || []);
    } catch (err: any) {
      logger.error('Error fetching badge definitions:', err, 'HOOK');
    }
  }, []);

  /** Débloquer un badge */
  const unlockBadge = useCallback(async (badgeId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const badge = badges.find(b => b.badge_id === badgeId);
      if (badge?.unlocked) return true;

      const { error } = await supabase
        .from('user_badges')
        .update({
          unlocked: true,
          earned_at: new Date().toISOString(),
          viewed: false
        })
        .eq('user_id', user.id)
        .eq('badge_id', badgeId);

      if (error) throw error;

      // Ajouter les récompenses
      if (badge) {
        await supabase.rpc('add_user_xp', {
          p_user_id: user.id,
          p_xp: badge.xp_reward
        });
      }

      if (mergedConfig.showNotifications) {
        toast.success(`Badge débloqué : ${badge?.badge_name || badgeId} ! 🎉`);
      }

      await fetchBadges();
      return true;
    } catch (err: any) {
      logger.error('Error unlocking badge:', err, 'HOOK');
      toast.error('Erreur lors du déblocage du badge');
      return false;
    }
  }, [badges, mergedConfig.showNotifications, fetchBadges]);

  /** Créer et débloquer un nouveau badge */
  const awardBadge = useCallback(async (
    badgeId: string,
    name: string,
    category: BadgeCategory = 'milestone',
    rarity: BadgeRarity = 'common'
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Vérifier si le badge existe déjà
      const existing = badges.find(b => b.badge_id === badgeId);
      if (existing?.unlocked) return true;

      if (existing) {
        return await unlockBadge(badgeId);
      }

      // Créer le badge
      const { error } = await supabase
        .from('user_badges')
        .insert({
          user_id: user.id,
          badge_id: badgeId,
          badge_name: name,
          badge_category: category,
          badge_rarity: rarity,
          xp_reward: XP_BY_RARITY[rarity],
          unlocked: true,
          earned_at: new Date().toISOString(),
          viewed: false
        });

      if (error) throw error;

      if (mergedConfig.showNotifications) {
        toast.success(`Nouveau badge obtenu : ${name} ! 🎉`);
      }

      await fetchBadges();
      return true;
    } catch (err: any) {
      logger.error('Error awarding badge:', err, 'HOOK');
      return false;
    }
  }, [badges, unlockBadge, mergedConfig.showNotifications, fetchBadges]);

  /** Mettre à jour la progression d'un badge */
  const updateBadgeProgress = useCallback(async (
    badgeId: string,
    current: number,
    target: number
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const progress = { current, target };
      const unlocked = current >= target;

      const { error } = await supabase
        .from('user_badges')
        .update({
          progress,
          unlocked,
          ...(unlocked ? { earned_at: new Date().toISOString(), viewed: false } : {})
        })
        .eq('user_id', user.id)
        .eq('badge_id', badgeId);

      if (error) throw error;

      if (unlocked && mergedConfig.showNotifications) {
        const badge = badges.find(b => b.badge_id === badgeId);
        toast.success(`Badge débloqué : ${badge?.badge_name || badgeId} ! 🎉`);
      }

      await fetchBadges();
    } catch (err: any) {
      logger.error('Error updating badge progress:', err, 'HOOK');
    }
  }, [badges, mergedConfig.showNotifications, fetchBadges]);

  /** Épingler/désépingler un badge */
  const togglePinBadge = useCallback(async (badgeId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const badge = badges.find(b => b.badge_id === badgeId);
      if (!badge) return;

      const { error } = await supabase
        .from('user_badges')
        .update({ pinned: !badge.pinned })
        .eq('user_id', user.id)
        .eq('badge_id', badgeId);

      if (error) throw error;
      await fetchBadges();
    } catch (err: any) {
      logger.error('Error toggling badge pin:', err, 'HOOK');
    }
  }, [badges, fetchBadges]);

  /** Marquer les badges comme vus */
  const markBadgesAsViewed = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const unviewedIds = badges.filter(b => !b.viewed).map(b => b.badge_id);
      if (unviewedIds.length === 0) return;

      await supabase
        .from('user_badges')
        .update({ viewed: true })
        .eq('user_id', user.id)
        .in('badge_id', unviewedIds);

      setNewUnlocks([]);
      await fetchBadges();
    } catch (err: any) {
      logger.error('Error marking badges as viewed:', err, 'HOOK');
    }
  }, [badges, fetchBadges]);

  /** Partager un badge sur les réseaux sociaux */
  const shareBadgeOnSocial = useCallback(async (
    badgeId: string,
    platform: 'twitter' | 'linkedin' | 'facebook'
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const badge = badges.find(b => b.badge_id === badgeId);
      if (!badge) return;

      const text = `Je viens de débloquer le badge "${badge.badge_name}" sur EmotionsCare ! ${badge.badge_icon || '🏆'}`;
      const url = `${window.location.origin}/app/achievements`;

      const shareUrls: Record<string, string> = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`
      };

      window.open(shareUrls[platform], '_blank', 'width=600,height=400');

      await supabase
        .from('user_badges')
        .update({ shared_on_social: true })
        .eq('user_id', user.id)
        .eq('badge_id', badgeId);

      toast.success('Badge partagé !');
      await fetchBadges();
    } catch (err: any) {
      logger.error('Error sharing badge:', err, 'HOOK');
      toast.error('Erreur lors du partage');
    }
  }, [badges, fetchBadges]);

  /** Exporter les badges */
  const exportBadges = useCallback(async (): Promise<string> => {
    const unlockedBadges = badges.filter(b => b.unlocked);
    const exportData = {
      exportDate: new Date().toISOString(),
      totalBadges: unlockedBadges.length,
      badges: unlockedBadges.map(b => ({
        name: b.badge_name,
        category: b.badge_category,
        rarity: b.badge_rarity,
        earnedAt: b.earned_at
      }))
    };
    return JSON.stringify(exportData, null, 2);
  }, [badges]);

  /** Statistiques des badges */
  const stats = useMemo((): BadgeStats => {
    const unlocked = badges.filter(b => b.unlocked);
    const locked = badges.filter(b => !b.unlocked);

    const byCategory = {} as Record<BadgeCategory, { total: number; unlocked: number }>;
    const byRarity = {} as Record<BadgeRarity, { total: number; unlocked: number }>;

    badges.forEach(badge => {
      const cat = badge.badge_category as BadgeCategory;
      const rar = badge.badge_rarity as BadgeRarity;

      if (!byCategory[cat]) byCategory[cat] = { total: 0, unlocked: 0 };
      if (!byRarity[rar]) byRarity[rar] = { total: 0, unlocked: 0 };

      byCategory[cat].total++;
      byRarity[rar].total++;

      if (badge.unlocked) {
        byCategory[cat].unlocked++;
        byRarity[rar].unlocked++;
      }
    });

    const nearCompletion = locked
      .filter(b => b.progress && b.progress.current >= b.progress.target * 0.7)
      .slice(0, 5);

    return {
      total: badges.length,
      unlocked: unlocked.length,
      locked: locked.length,
      progress: badges.length > 0 ? Math.round((unlocked.length / badges.length) * 100) : 0,
      byCategory,
      byRarity,
      totalXP: unlocked.reduce((sum, b) => sum + (b.xp_reward || 0), 0),
      totalPoints: unlocked.reduce((sum, b) => sum + (b.points_reward || 0), 0),
      recentUnlocks: unlocked.slice(0, 5),
      nearCompletion
    };
  }, [badges]);

  /** Badges filtrés */
  const filteredBadges = useMemo(() => {
    let result = badges;

    if (selectedCategory !== 'all') {
      result = result.filter(b => b.badge_category === selectedCategory);
    }

    if (selectedRarity !== 'all') {
      result = result.filter(b => b.badge_rarity === selectedRarity);
    }

    if (!mergedConfig.includeSecret) {
      result = result.filter(b => !b.secret || b.unlocked);
    }

    return result;
  }, [badges, selectedCategory, selectedRarity, mergedConfig.includeSecret]);

  /** Badges épinglés */
  const pinnedBadges = useMemo(() => {
    return badges.filter(b => b.pinned && b.unlocked);
  }, [badges]);

  // Charger au montage
  useEffect(() => {
    fetchBadges();
    fetchDefinitions();
  }, [fetchBadges, fetchDefinitions]);

  // Auto-refresh
  useEffect(() => {
    if (!mergedConfig.autoRefresh) return;

    const interval = setInterval(fetchBadges, mergedConfig.refreshInterval);
    return () => clearInterval(interval);
  }, [mergedConfig.autoRefresh, mergedConfig.refreshInterval, fetchBadges]);

  return {
    // Données
    badges: filteredBadges,
    allBadges: badges,
    definitions,
    pinnedBadges,
    newUnlocks,
    stats,
    loading,
    error,

    // Actions
    unlockBadge,
    awardBadge,
    updateBadgeProgress,
    togglePinBadge,
    markBadgesAsViewed,
    shareBadgeOnSocial,
    exportBadges,
    refetch: fetchBadges,

    // Filtres
    selectedCategory,
    setSelectedCategory,
    selectedRarity,
    setSelectedRarity,

    // Constantes
    RARITY_COLORS,
    XP_BY_RARITY
  };
};
