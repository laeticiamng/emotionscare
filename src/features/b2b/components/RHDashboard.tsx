/**
 * Dashboard RH B2B
 * Vue d'ensemble pour les responsables RH
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Heart,
  Brain,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface TeamWellnessScore {
  teamId: string;
  teamName: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  memberCount: number;
  activeRate: number;
}

interface RiskAlert {
  id: string;
  type: 'burnout' | 'stress' | 'engagement' | 'isolation';
  severity: 'low' | 'medium' | 'high';
  teamId?: string;
  teamName?: string;
  message: string;
  createdAt: string;
}

const SEVERITY_COLORS = {
  low: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
  medium: 'text-orange-500 bg-orange-500/10 border-orange-500/30',
  high: 'text-red-500 bg-red-500/10 border-red-500/30',
};

const TREND_ICONS = {
  up: <TrendingUp className="h-4 w-4 text-green-500" />,
  down: <TrendingDown className="h-4 w-4 text-red-500" />,
  stable: <span className="text-muted-foreground">→</span>,
};

export function RHDashboard() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');

  // Fetch team wellness scores from Supabase
  const {
    data: teamScores = [],
    isLoading: isLoadingScores,
    error: scoresError,
  } = useQuery<TeamWellnessScore[]>({
    queryKey: ['team_wellness_scores', user?.id, selectedPeriod],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_wellness_scores')
        .select('*')
        .order('score', { ascending: false });

      if (error) throw error;

      return (data ?? []).map((row: any) => ({
        teamId: row.team_id ?? row.id,
        teamName: row.team_name ?? row.name ?? 'Équipe',
        score: row.score ?? 0,
        trend: row.trend ?? 'stable',
        memberCount: row.member_count ?? 0,
        activeRate: row.active_rate ?? 0,
      }));
    },
    enabled: !!user,
  });

  // Fetch alerts from Supabase
  const {
    data: alerts = [],
    isLoading: isLoadingAlerts,
    error: alertsError,
  } = useQuery<RiskAlert[]>({
    queryKey: ['wellness_alerts', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clinical_signals')
        .select('*')
        .eq('signal_type', 'alert')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      return (data ?? []).map((row: any) => ({
        id: row.id,
        type: row.severity_level === 'high' ? 'burnout' : row.severity_level === 'medium' ? 'stress' : 'engagement',
        severity: row.severity_level ?? 'low',
        teamId: row.team_id,
        teamName: row.team_name,
        message: row.summary ?? row.description ?? 'Alerte détectée',
        createdAt: row.created_at,
      }));
    },
    enabled: !!user,
  });

  const isLoading = isLoadingScores || isLoadingAlerts;
  const hasError = scoresError || alertsError;

  const avgScore = teamScores.length > 0
    ? Math.round(teamScores.reduce((acc, t) => acc + t.score, 0) / teamScores.length)
    : 0;
  const totalMembers = teamScores.reduce((acc, t) => acc + t.memberCount, 0);
  const avgActiveRate = teamScores.length > 0
    ? Math.round(teamScores.reduce((acc, t) => acc + t.activeRate, 0) / teamScores.length)
    : 0;
  const criticalAlerts = alerts.filter(a => a.severity === 'high').length;

  if (hasError) {
    return (
      <div className="space-y-6" role="alert" aria-label="Erreur de chargement du dashboard RH">
        <Card className="border-red-500/50">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-3" />
            <p className="text-red-500 font-medium">Erreur lors du chargement des données</p>
            <p className="text-sm text-muted-foreground mt-1">
              Veuillez réessayer ultérieurement.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6" aria-label="Dashboard RH">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" aria-hidden="true" />
            Dashboard RH
          </h1>
          <p className="text-muted-foreground">Vue d'ensemble du bien-être de votre organisation</p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px]" aria-label="Sélectionner la période">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" aria-label="Rafraîchir les données">
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button variant="outline" className="gap-2" aria-label="Exporter les données">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map(i => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16 mb-4" />
                  <Skeleton className="h-2 w-full" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Score bien-être</p>
                    <p className="text-3xl font-bold text-primary">{avgScore}%</p>
                  </div>
                  <div className={cn(
                    'p-3 rounded-full',
                    avgScore >= 70 ? 'bg-green-500/10' : avgScore >= 50 ? 'bg-yellow-500/10' : 'bg-red-500/10'
                  )}>
                    <Sparkles className={cn(
                      'h-6 w-6',
                      avgScore >= 70 ? 'text-green-500' : avgScore >= 50 ? 'text-yellow-500' : 'text-red-500'
                    )} aria-hidden="true" />
                  </div>
                </div>
                <Progress value={avgScore} className="mt-4 h-2" aria-label={`Score bien-être : ${avgScore}%`} />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Collaborateurs actifs</p>
                    <p className="text-3xl font-bold text-foreground">{totalMembers}</p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-500/10">
                    <Users className="h-6 w-6 text-blue-500" aria-hidden="true" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {avgActiveRate}% de taux de participation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Équipes suivies</p>
                    <p className="text-3xl font-bold text-foreground">{teamScores.length}</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-500/10">
                    <BarChart3 className="h-6 w-6 text-purple-500" aria-hidden="true" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {teamScores.filter(t => t.trend === 'up').length} en progression
                </p>
              </CardContent>
            </Card>

            <Card className={cn(criticalAlerts > 0 && 'border-red-500/50')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Alertes actives</p>
                    <p className="text-3xl font-bold text-foreground">{alerts.length}</p>
                  </div>
                  <div className={cn(
                    'p-3 rounded-full',
                    criticalAlerts > 0 ? 'bg-red-500/10' : 'bg-green-500/10'
                  )}>
                    <AlertTriangle className={cn(
                      'h-6 w-6',
                      criticalAlerts > 0 ? 'text-red-500' : 'text-green-500'
                    )} aria-hidden="true" />
                  </div>
                </div>
                {criticalAlerts > 0 && (
                  <p className="text-sm text-red-500 mt-2">
                    {criticalAlerts} alerte(s) critique(s)
                  </p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="teams" className="space-y-4">
        <TabsList>
          <TabsTrigger value="teams" className="gap-2">
            <Users className="h-4 w-4" />
            Équipes
          </TabsTrigger>
          <TabsTrigger value="alerts" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alertes ({alerts.length})
          </TabsTrigger>
          <TabsTrigger value="trends" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Tendances
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teams">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Scores par équipe</span>
                <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                  <SelectTrigger className="w-[180px]" aria-label="Filtrer par équipe">
                    <SelectValue placeholder="Toutes les équipes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les équipes</SelectItem>
                    {teamScores.map(t => (
                      <SelectItem key={t.teamId} value={t.teamId}>{t.teamName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingScores ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-border/50">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-2 w-full" />
                      </div>
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              ) : teamScores.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground" aria-label="Aucune équipe trouvée">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" aria-hidden="true" />
                  <p>Aucune équipe trouvée</p>
                  <p className="text-sm">Les scores de bien-être des équipes apparaîtront ici.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {teamScores
                    .filter(t => selectedTeam === 'all' || t.teamId === selectedTeam)
                    .sort((a, b) => b.score - a.score)
                    .map((team) => (
                      <motion.div
                        key={team.teamId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                        aria-label={`${team.teamName} : score ${team.score}%`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-foreground">{team.teamName}</span>
                            {TREND_ICONS[team.trend]}
                            <Badge variant="secondary" className="text-xs">
                              {team.memberCount} membres
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4">
                            <Progress
                              value={team.score}
                              className={cn(
                                'flex-1 h-2',
                                team.score >= 70 ? '[&>div]:bg-green-500' :
                                team.score >= 50 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'
                              )}
                            />
                            <span className={cn(
                              'text-sm font-medium min-w-[3rem] text-right',
                              team.score >= 70 ? 'text-green-500' :
                              team.score >= 50 ? 'text-yellow-500' : 'text-red-500'
                            )}>
                              {team.score}%
                            </span>
                          </div>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <p>{team.activeRate}% actifs</p>
                        </div>
                      </motion.div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Alertes et signalements</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingAlerts ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-4 rounded-lg border">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8" aria-label="Aucune alerte active">
                      Aucune alerte active
                    </p>
                  ) : (
                    alerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          'p-4 rounded-lg border',
                          SEVERITY_COLORS[alert.severity]
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge
                                variant="outline"
                                className={cn('text-xs', SEVERITY_COLORS[alert.severity])}
                              >
                                {alert.severity === 'high' ? 'Critique' :
                                 alert.severity === 'medium' ? 'Attention' : 'Info'}
                              </Badge>
                              {alert.teamName && (
                                <span className="text-sm text-muted-foreground">
                                  {alert.teamName}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-foreground">{alert.message}</p>
                          </div>
                          <Button variant="ghost" size="sm" aria-label="Voir les détails de l'alerte">
                            Voir détails
                          </Button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Évolution du bien-être</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" aria-hidden="true" />
                <p>Graphiques de tendances</p>
                <p className="text-sm">Intégration Recharts à venir</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default RHDashboard;
