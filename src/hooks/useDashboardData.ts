import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardData {
  totalUsers: number;
  activeUsers: number;
  averageScore: number;
  criticalAlerts: number;
}

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData>({
    totalUsers: 0,
    activeUsers: 0,
    averageScore: 0,
    criticalAlerts: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Requêtes Supabase parallèles pour les données réelles
        const [profilesResult, alertsResult, scoresResult] = await Promise.all([
          supabase.from('profiles').select('id, last_login', { count: 'exact' }),
          supabase.from('unified_alerts').select('id', { count: 'exact' }).eq('severity', 'critical').eq('resolved', false),
          supabase.from('assessments').select('score_json').order('created_at', { ascending: false }).limit(100)
        ]);

        const totalUsers = profilesResult.count || 0;
        
        // Utilisateurs actifs (login dans les 7 derniers jours)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const activeUsers = profilesResult.data?.filter(
          p => p.last_login && new Date(p.last_login) > sevenDaysAgo
        ).length || 0;

        const criticalAlerts = alertsResult.count || 0;

        // Calculer score moyen depuis les assessments
        let averageScore = 0;
        if (scoresResult.data && scoresResult.data.length > 0) {
          const scores = scoresResult.data
            .map(a => {
              const json = a.score_json as any;
              return json?.score || json?.total || 0;
            })
            .filter(s => s > 0);
          
          if (scores.length > 0) {
            averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
          }
        }

        setData({
          totalUsers,
          activeUsers,
          averageScore: averageScore || 0,
          criticalAlerts
        });
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
        setError(`Erreur lors du chargement: ${errorMessage}`);
        logger.error('Dashboard data fetch error', err as Error, 'UI');
        // Keep previous data or set to zeros (not fake data)
        setData(prev => prev.totalUsers > 0 ? prev : {
          totalUsers: 0,
          activeUsers: 0,
          averageScore: 0,
          criticalAlerts: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  return { data, isLoading, error };
};
