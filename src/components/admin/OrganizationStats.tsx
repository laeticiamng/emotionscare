// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface OrgStats {
  activeUsers: number;
  teams: number;
  emotionScans: number;
  avgScore: number;
}

const OrganizationStats: React.FC = () => {
  const [stats, setStats] = useState<OrgStats>({
    activeUsers: 0,
    teams: 0,
    emotionScans: 0,
    avgScore: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { supabase } = await import('@/integrations/supabase/client');

        // Get active users (users with activity in last 7 days)
        const { count: activeUsersCount } = await supabase
          .from('activity_logs')
          .select('user_id', { count: 'exact', head: true })
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        // Get teams count
        const { count: teamsCount } = await supabase
          .from('organizations')
          .select('id', { count: 'exact', head: true });

        // Get emotion scans count and average
        const { data: scansData, count: scansCount } = await supabase
          .from('emotion_scans')
          .select('valence', { count: 'exact' })
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

        let avgScore = 0;
        if (scansData && scansData.length > 0) {
          avgScore = Math.round(
            scansData.reduce((sum, s) => sum + (s.valence || 50), 0) / scansData.length
          );
        }

        setStats({
          activeUsers: activeUsersCount || 0,
          teams: teamsCount || 0,
          emotionScans: scansCount || 0,
          avgScore
        });
      } catch (error) {
        console.error('Error loading org stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-4 animate-pulse">
                <div className="h-3 bg-muted rounded w-20 mb-2" />
                <div className="h-8 bg-muted rounded w-12" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Utilisateurs actifs</div>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Équipes</div>
            <div className="text-2xl font-bold">{stats.teams}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Scans émotionnels</div>
            <div className="text-2xl font-bold">{stats.emotionScans}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Score moyen</div>
            <div className="text-2xl font-bold">{stats.avgScore}%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { OrganizationStats };
export default OrganizationStats;
