/**
 * Hook pour utiliser le service d'intégration des modules
 */

import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getModuleConfig, checkAchievements } from '@/services/moduleIntegration.service';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface ModuleSessionData {
  moduleType: string;
  durationSeconds: number;
  score?: number;
  completed: boolean;
}

export function useModuleIntegration() {
  const { user } = useAuth();
  const { toast } = useToast();

  const recordSession = useCallback(async (session: ModuleSessionData) => {
    if (!user) return;
    
    const config = getModuleConfig(session.moduleType);
    const baseXp = Math.round((session.durationSeconds / 60) * (config?.pointsPerAction || 10));
    const bonusXp = session.completed ? 25 : 0;
    const totalXp = baseXp + bonusXp + (session.score || 0);

    // Update user stats
    await supabase
      .from('user_stats_consolidated')
      .upsert({
        user_id: user.id,
        total_xp: totalXp,
        total_sessions: 1,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    toast({
      title: '✨ Session terminée !',
      description: `+${totalXp} XP gagnés`,
    });
  }, [user, toast]);

  return { recordSession, getModuleConfig };
}
