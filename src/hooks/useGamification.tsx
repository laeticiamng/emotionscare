// @ts-nocheck

import { useState, useEffect, useCallback } from 'react';
import { Challenge, Badge, GamificationStats, UseGamificationReturn } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export function useGamification(): UseGamificationReturn {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [stats, setStats] = useState<GamificationStats>({
    points: 0,
    level: 1,
    badges: [],
    completedChallenges: 0,
    totalChallenges: 0,
    streak: 0,
    nextLevel: 2,
    pointsToNextLevel: 100,
    progressToNextLevel: 0,
    totalPoints: 0,
    currentLevel: 1,
    nextLevelPoints: 100,
    challenges: [],
    activeChallenges: 0,
    badgesCount: 0,
    rank: 'Débutant',
    streakDays: 0,
    lastActivityDate: new Date().toISOString()
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load gamification data from Supabase
  const loadGamificationData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Fetch user badges
      const { data: userBadges } = await supabase
        .from('user_achievements')
        .select('*, achievements(*)')
        .eq('user_id', user.id);

      const formattedBadges: Badge[] = (userBadges || []).map(ub => ({
        id: ub.achievement_id || ub.id,
        name: ub.achievements?.name || 'Badge',
        description: ub.achievements?.description || '',
        imageUrl: ub.achievements?.icon_url || '/images/badges/default.png',
        level: ub.achievements?.tier || 'bronze'
      }));
      setBadges(formattedBadges);

      // Fetch challenges
      const { data: userChallenges } = await supabase
        .from('challenges')
        .select('*')
        .or('is_active.eq.true,status.eq.in-progress');

      const formattedChallenges: Challenge[] = (userChallenges || []).map(c => ({
        id: c.id,
        name: c.name || c.title,
        title: c.title || c.name,
        description: c.description || '',
        points: c.points || 0,
        type: c.type || 'daily',
        category: c.category || 'general',
        progress: c.progress || 0,
        total: c.target || 1,
        status: c.status || 'not-started',
        icon: c.icon || 'activity'
      }));
      setChallenges(formattedChallenges);

      // Fetch gamification metrics
      const { data: metrics } = await supabase
        .from('gamification_metrics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Calculate streak from activity sessions
      const { data: sessions } = await supabase
        .from('activity_sessions')
        .select('created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(365);

      let streak = 0;
      if (sessions && sessions.length > 0) {
        const uniqueDays = new Set(sessions.map(s => s.created_at.split('T')[0]));
        let checkDate = new Date();
        while (uniqueDays.has(checkDate.toISOString().split('T')[0])) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        }
      }

      const totalPoints = metrics?.total_points || 0;
      const currentLevel = Math.floor(totalPoints / 100) + 1;
      const nextLevelPoints = currentLevel * 100;
      const pointsToNextLevel = nextLevelPoints - totalPoints;
      const progressToNextLevel = ((totalPoints % 100) / 100) * 100;

      const ranks = ['Débutant', 'Explorer', 'Aventurier', 'Expert', 'Maître', 'Légende'];
      const rank = ranks[Math.min(currentLevel - 1, ranks.length - 1)];

      setStats({
        points: totalPoints,
        level: currentLevel,
        badges: formattedBadges,
        completedChallenges: formattedChallenges.filter(c => c.status === 'completed').length,
        totalChallenges: formattedChallenges.length,
        streak: streak,
        nextLevel: currentLevel + 1,
        pointsToNextLevel: pointsToNextLevel,
        progressToNextLevel: progressToNextLevel,
        totalPoints: totalPoints,
        currentLevel: currentLevel,
        nextLevelPoints: nextLevelPoints,
        challenges: formattedChallenges,
        activeChallenges: formattedChallenges.filter(c => c.status === 'in-progress').length,
        badgesCount: formattedBadges.length,
        rank: rank,
        streakDays: streak,
        lastActivityDate: sessions?.[0]?.created_at || new Date().toISOString()
      });

    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGamificationData();
  }, [loadGamificationData]);

  // Complete a challenge
  const completeChallenge = async (challengeId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) return;

      // Update challenge in database
      await supabase
        .from('challenges')
        .update({ status: 'completed', progress: challenge.total, completed_at: new Date().toISOString() })
        .eq('id', challengeId);

      // Add points to user metrics
      const { data: existingMetrics } = await supabase
        .from('gamification_metrics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (existingMetrics) {
        await supabase
          .from('gamification_metrics')
          .update({
            total_points: (existingMetrics.total_points || 0) + (challenge.points || 50),
            challenges_completed: (existingMetrics.challenges_completed || 0) + 1,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('gamification_metrics')
          .insert({
            user_id: user.id,
            total_points: challenge.points || 50,
            challenges_completed: 1
          });
      }

      // Update local state
      setChallenges((prevChallenges) =>
        prevChallenges.map((c) =>
          c.id === challengeId
            ? { ...c, status: 'completed' as const, completed: true, progress: c.total }
            : c
        )
      );

      setStats((prev) => ({
        ...prev,
        points: prev.points + (challenge.points || 50),
        completedChallenges: prev.completedChallenges + 1,
        activeChallenges: Math.max(0, prev.activeChallenges - 1)
      }));

    } catch (err) {
      console.error('Error completing challenge:', err);
      setError('Erreur lors de la complétion du défi');
    }
  };

  const refresh = () => {
    loadGamificationData();
  };

  return {
    badges,
    challenges,
    stats,
    completeChallenge,
    isLoading,
    error,
    refresh
  };
}

export default useGamification;
