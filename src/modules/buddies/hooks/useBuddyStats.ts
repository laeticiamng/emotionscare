/**
 * Hook dédié aux statistiques du buddy system
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { BuddyService } from '../services/buddyService';
import type { BuddyStats } from '../types';

export function useBuddyStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<BuddyStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await BuddyService.getStats(user.id);
      setStats(data);
    } catch (err) {
      console.error('Error loading buddy stats:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Calcul du niveau basé sur l'XP
  const level = Math.floor((stats?.xp_from_buddies || 0) / 1000) + 1;
  const xpToNextLevel = 1000 - ((stats?.xp_from_buddies || 0) % 1000);
  const levelProgress = ((stats?.xp_from_buddies || 0) % 1000) / 10;

  // Badges basés sur les statistiques
  const badges = [];
  if ((stats?.total_buddies || 0) >= 5) badges.push('social_butterfly');
  if ((stats?.current_streak_days || 0) >= 7) badges.push('streak_master');
  if ((stats?.total_activities_completed || 0) >= 10) badges.push('activity_champion');
  if ((stats?.total_messages_sent || 0) >= 100) badges.push('chatterbox');
  if ((stats?.total_session_minutes || 0) >= 300) badges.push('time_investor');

  // Tier de supporteur
  const getSupportTier = () => {
    const score = stats?.xp_from_buddies || 0;
    if (score >= 5000) return { tier: 'gold', label: 'Or', color: 'text-amber-500' };
    if (score >= 2000) return { tier: 'silver', label: 'Argent', color: 'text-gray-400' };
    if (score >= 500) return { tier: 'bronze', label: 'Bronze', color: 'text-orange-600' };
    return { tier: 'starter', label: 'Débutant', color: 'text-blue-500' };
  };

  return {
    stats,
    loading,
    loadStats,
    level,
    xpToNextLevel,
    levelProgress,
    badges,
    supportTier: getSupportTier()
  };
}
