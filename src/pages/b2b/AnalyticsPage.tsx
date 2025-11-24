import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, TrendingUp, Users, Activity, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface OrganizationStats {
  activeUsers: number;
  totalSessions: number;
  avgSessionDuration: number;
  engagementRate: number;
  userGrowth: number;
  sessionGrowth: number;
}

interface ModuleUsage {
  name: string;
  value: number;
  color: string;
}

/**
 * Page d'analytics B2B pour les organisations
 * Affiche les métriques agrégées pour tous les utilisateurs de l'organisation
 */
export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<OrganizationStats>({
    activeUsers: 0,
    totalSessions: 0,
    avgSessionDuration: 0,
    engagementRate: 0,
    userGrowth: 0,
    sessionGrowth: 0,
  });
  const [moduleUsage, setModuleUsage] = useState<ModuleUsage[]>([]);

  useEffect(() => {
    loadOrganizationAnalytics();
  }, []);

  const loadOrganizationAnalytics = async () => {
    try {
      setLoading(true);

      // Calculate date ranges
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      // Fetch active users (users with activity in last 30 days)
      const { data: recentScans } = await supabase
        .from('emotion_scans')
        .select('user_id, created_at')
        .gte('created_at', thirtyDaysAgo.toISOString());

      const activeUserIds = new Set(recentScans?.map(s => s.user_id) || []);

      // Fetch sessions for last 30 days
      const { data: recentSessions } = await supabase
        .from('module_sessions')
        .select('*')
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Fetch sessions for previous 30 days (for growth calculation)
      const { data: previousSessions } = await supabase
        .from('module_sessions')
        .select('user_id, created_at')
        .gte('created_at', sixtyDaysAgo.toISOString())
        .lt('created_at', thirtyDaysAgo.toISOString());

      // Calculate statistics
      const totalSessions = recentSessions?.length || 0;
      const previousSessionCount = previousSessions?.length || 0;

      // Calculate average session duration
      const totalDuration = recentSessions?.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) || 0;
      const avgDuration = totalSessions > 0 ? Math.round(totalDuration / totalSessions / 60) : 0;

      // Calculate engagement rate (users with sessions / active users)
      const usersWithSessions = new Set(recentSessions?.map(s => s.user_id) || []);
      const engagementRate = activeUserIds.size > 0
        ? Math.round((usersWithSessions.size / activeUserIds.size) * 100)
        : 0;

      // Calculate growth rates
      const sessionGrowth = previousSessionCount > 0
        ? Math.round(((totalSessions - previousSessionCount) / previousSessionCount) * 100)
        : 0;

      // Get previous period active users for growth
      const { data: oldScans } = await supabase
        .from('emotion_scans')
        .select('user_id')
        .gte('created_at', sixtyDaysAgo.toISOString())
        .lt('created_at', thirtyDaysAgo.toISOString());

      const previousActiveUsers = new Set(oldScans?.map(s => s.user_id) || []).size;
      const userGrowth = previousActiveUsers > 0
        ? Math.round(((activeUserIds.size - previousActiveUsers) / previousActiveUsers) * 100)
        : 0;

      setStats({
        activeUsers: activeUserIds.size,
        totalSessions,
        avgSessionDuration: avgDuration,
        engagementRate,
        userGrowth,
        sessionGrowth,
      });

      // Calculate module usage breakdown
      const moduleMap = new Map<string, number>();
      recentSessions?.forEach(session => {
        const moduleName = session.module_name || 'Autre';
        moduleMap.set(moduleName, (moduleMap.get(moduleName) || 0) + 1);
      });

      const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-yellow-500'];
      const moduleData: ModuleUsage[] = Array.from(moduleMap.entries())
        .map(([name, count], index) => ({
          name,
          value: totalSessions > 0 ? Math.round((count / totalSessions) * 100) : 0,
          color: colors[index % colors.length],
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);

      setModuleUsage(moduleData);

      logger.info('Organization analytics loaded', {
        activeUsers: activeUserIds.size,
        totalSessions,
      }, 'B2B_ANALYTICS');
    } catch (error) {
      logger.error('Failed to load organization analytics', error as Error, 'B2B_ANALYTICS');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <BarChart className="h-8 w-8" />
          Analytics Organisation
        </h1>
        <p className="text-muted-foreground mt-2">
          Vue d'ensemble des métriques et statistiques de votre organisation
        </p>
      </div>

      {/* Statistiques principales - Données en temps réel */}
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
                <p className="text-3xl font-bold text-foreground">
                  {loading ? '...' : stats.activeUsers.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.userGrowth >= 0 ? '+' : ''}{stats.userGrowth}% ce mois
                </p>
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
                <p className="text-3xl font-bold text-foreground">
                  {loading ? '...' : stats.totalSessions.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.sessionGrowth >= 0 ? '+' : ''}{stats.sessionGrowth}% ce mois
                </p>
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
                <p className="text-3xl font-bold text-foreground">
                  {loading ? '...' : `${stats.avgSessionDuration}m`}
                </p>
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
                <p className="text-3xl font-bold text-foreground">
                  {loading ? '...' : `${stats.engagementRate}%`}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Taux d'adoption</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Détails analytics - Données en temps réel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Utilisation par module</CardTitle>
            <CardDescription>Répartition des sessions par fonctionnalité</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <p className="text-sm text-muted-foreground">Chargement...</p>
              ) : moduleUsage.length > 0 ? (
                moduleUsage.map((module) => (
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
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Aucune donnée disponible</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendances mensuelles</CardTitle>
            <CardDescription>Évolution de l'activité sur 6 mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Graphique détaillé disponible prochainement
              </p>
              <div className="h-48 flex items-center justify-center bg-muted/30 rounded-lg">
                <LineChart className="h-16 w-16 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
