/**
 * Hook pour les statistiques Ambition Arcade
 */
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AmbitionStatsData {
  totalRuns: number;
  activeRuns: number;
  completedRuns: number;
  totalQuests: number;
  completedQuests: number;
  totalXP: number;
  artifacts: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  xpToNextLevel: number;
}

function calculateLevel(xp: number): { level: number; xpToNextLevel: number } {
  // XP progressif par niveau : 100, 250, 500, 1000...
  const levels = [0, 100, 350, 850, 1850, 3350, 5850, 9350, 14350, 21350, 30350];
  let level = 1;
  
  for (let i = 1; i < levels.length; i++) {
    if (xp >= levels[i]) {
      level = i + 1;
    } else {
      return { level, xpToNextLevel: levels[i] - xp };
    }
  }
  
  return { level, xpToNextLevel: 0 };
}

export function useAmbitionStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['ambition-stats', user?.id],
    queryFn: async (): Promise<AmbitionStatsData> => {
      if (!user?.id) throw new Error('Non authentifié');

      // Récupérer tous les runs de l'utilisateur
      const { data: runs, error: runsError } = await supabase
        .from('ambition_runs')
        .select('id, status, created_at, completed_at')
        .eq('user_id', user.id);

      if (runsError) throw runsError;

      const runIds = runs?.map(r => r.id) || [];

      // Récupérer toutes les quêtes
      const { data: quests, error: questsError } = await supabase
        .from('ambition_quests')
        .select('status, xp_reward, completed_at')
        .in('run_id', runIds.length > 0 ? runIds : ['none']);

      if (questsError) throw questsError;

      // Récupérer les artifacts
      const { data: artifacts, error: artifactsError } = await supabase
        .from('ambition_artifacts')
        .select('id')
        .in('run_id', runIds.length > 0 ? runIds : ['none']);

      if (artifactsError) throw artifactsError;

      // Calculer les stats
      const activeRuns = runs?.filter(r => r.status === 'active').length || 0;
      const completedRuns = runs?.filter(r => r.status === 'completed').length || 0;
      const completedQuests = quests?.filter(q => q.status === 'completed') || [];
      const totalXP = completedQuests.reduce((sum, q) => sum + (q.xp_reward || 0), 0);
      
      // Calculer le streak
      const sortedCompletedDates = completedQuests
        .filter(q => q.completed_at)
        .map(q => new Date(q.completed_at!).toDateString())
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      for (let i = 0; i < sortedCompletedDates.length; i++) {
        const date = sortedCompletedDates[i];
        if (i === 0) {
          if (date === today || date === yesterday) {
            tempStreak = 1;
            currentStreak = 1;
          }
        } else {
          const prevDate = new Date(sortedCompletedDates[i - 1]);
          const currDate = new Date(date);
          const dayDiff = Math.floor((prevDate.getTime() - currDate.getTime()) / 86400000);
          
          if (dayDiff === 1) {
            tempStreak++;
            if (currentStreak > 0) currentStreak++;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);

      const { level, xpToNextLevel } = calculateLevel(totalXP);
      const completionRate = quests && quests.length > 0 
        ? (completedQuests.length / quests.length) * 100 
        : 0;

      return {
        totalRuns: runs?.length || 0,
        activeRuns,
        completedRuns,
        totalQuests: quests?.length || 0,
        completedQuests: completedQuests.length,
        totalXP,
        artifacts: artifacts?.length || 0,
        completionRate,
        currentStreak,
        longestStreak,
        level,
        xpToNextLevel
      };
    },
    enabled: !!user?.id,
  });
}
