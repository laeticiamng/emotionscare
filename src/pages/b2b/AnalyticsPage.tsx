import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, TrendingUp, Users, Activity, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface AnalyticsData {
  activeUsers: number;
  totalSessions: number;
  avgSessionMinutes: number;
  engagementRate: number;
  moduleUsage: { name: string; value: number; color: string }[];
  monthlyTrend: { month: string; sessions: number }[];
}

/**
 * Page d'analytics B2B avec données réelles Supabase
 */
export default function AnalyticsPage() {
  const { user } = useAuth();

  const { data: analytics, isLoading, error, refetch } = useQuery({
    queryKey: ['b2b-analytics', user?.id],
    queryFn: async (): Promise<AnalyticsData> => {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

      // Fetch real data from Supabase
      const [
        usersResult,
        sessionsResult,
        coachResult,
        journalResult,
        musicResult,
        breathResult,
        monthlyResult
      ] = await Promise.all([
        // Active users (distinct users with activity in last 30 days)
        supabase.from('profiles').select('user_id', { count: 'exact' }),
        // Total sessions (breathing + meditation + coach)
        supabase.from('breathing_vr_sessions')
          .select('duration_seconds, created_at')
          .gte('created_at', thirtyDaysAgo.toISOString()),
        // Coach sessions
        supabase.from('ai_coach_sessions')
          .select('id')
          .gte('created_at', thirtyDaysAgo.toISOString()),
        // Journal entries
        supabase.from('journal_entries')
          .select('id')
          .gte('created_at', thirtyDaysAgo.toISOString()),
        // Music sessions
        supabase.from('music_sessions')
          .select('id')
          .gte('created_at', thirtyDaysAgo.toISOString()),
        // Breath sessions count
        supabase.from('breathing_vr_sessions')
          .select('id')
          .gte('created_at', thirtyDaysAgo.toISOString()),
        // Monthly trend
        supabase.from('breathing_vr_sessions')
          .select('created_at')
          .gte('created_at', sixMonthsAgo.toISOString())
      ]);

      const activeUsers = usersResult.count || 0;
      const breathSessions = sessionsResult.data || [];
      const coachSessions = coachResult.data?.length || 0;
      const journalEntries = journalResult.data?.length || 0;
      const musicSessions = musicResult.data?.length || 0;
      const breathCount = breathResult.data?.length || 0;

      const totalSessions = breathCount + coachSessions + journalEntries + musicSessions;
      const avgSessionMinutes = breathSessions.length > 0
        ? Math.round(breathSessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / breathSessions.length / 60)
        : 0;

      // Calculate module usage percentages
      const total = Math.max(1, totalSessions);
      const moduleUsage = [
        { name: 'Coach IA', value: Math.round((coachSessions / total) * 100), color: 'bg-blue-500' },
        { name: 'Journal', value: Math.round((journalEntries / total) * 100), color: 'bg-green-500' },
        { name: 'Music Therapy', value: Math.round((musicSessions / total) * 100), color: 'bg-purple-500' },
        { name: 'Respiration', value: Math.round((breathCount / total) * 100), color: 'bg-orange-500' },
      ];

      // Calculate monthly trend
      const monthlyData = (monthlyResult.data || []).reduce((acc, session) => {
        const month = new Date(session.created_at).toLocaleString('fr-FR', { month: 'short' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const monthlyTrend = Object.entries(monthlyData).map(([month, sessions]) => ({
        month,
        sessions
      }));

      // Engagement rate (users with >3 sessions / total users)
      const engagementRate = activeUsers > 0 ? Math.min(100, Math.round((totalSessions / activeUsers) * 10)) : 0;

      return {
        activeUsers,
        totalSessions,
        avgSessionMinutes,
        engagementRate,
        moduleUsage,
        monthlyTrend
      };
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <BarChart className="h-8 w-8" />
            Analytics Organisation
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardContent className="flex items-center gap-4 py-6">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div>
              <p className="font-medium">Erreur de chargement</p>
              <p className="text-sm text-muted-foreground">Impossible de charger les analytics</p>
            </div>
            <Button onClick={() => refetch()} variant="outline" className="ml-auto">
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <BarChart className="h-8 w-8" />
            Analytics Organisation
          </h1>
          <p className="text-muted-foreground mt-2">
            Vue d'ensemble des métriques et statistiques de votre organisation
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Utilisateurs actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">{analytics?.activeUsers || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Inscrits</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sessions totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">{analytics?.totalSessions || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Ce mois</p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Temps moyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">{analytics?.avgSessionMinutes || 0}m</p>
                <p className="text-xs text-muted-foreground mt-1">Par session</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">{analytics?.engagementRate || 0}%</p>
                <p className="text-xs text-muted-foreground mt-1">Taux d'adoption</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Détails analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Utilisation par module</CardTitle>
            <CardDescription>Répartition des sessions par fonctionnalité</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(analytics?.moduleUsage || []).map((module) => (
                <div key={module.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground">{module.name}</span>
                    <span className="text-muted-foreground">{module.value}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`${module.color} h-2 rounded-full transition-all`}
                      style={{ width: `${module.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendances mensuelles</CardTitle>
            <CardDescription>Évolution de l'activité sur 6 mois</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics?.monthlyTrend && analytics.monthlyTrend.length > 0 ? (
              <div className="space-y-3">
                {analytics.monthlyTrend.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-12 text-sm text-muted-foreground">{item.month}</span>
                    <div className="flex-1 bg-muted rounded-full h-4">
                      <div 
                        className="bg-primary h-4 rounded-full transition-all"
                        style={{ 
                          width: `${Math.min(100, (item.sessions / Math.max(...analytics.monthlyTrend.map(t => t.sessions))) * 100)}%` 
                        }}
                      />
                    </div>
                    <span className="w-12 text-sm text-right font-medium">{item.sessions}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center bg-muted/30 rounded-lg">
                <div className="text-center">
                  <LineChart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Pas assez de données</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
