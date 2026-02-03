/**
 * Dashboard RH B2B
 * Vue d'ensemble pour les responsables RH
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrgAggregates } from '@/hooks/b2b/useOrgAggregates';
import { useB2BTeams } from '@/hooks/useB2BTeams';
import { useB2BAnalytics } from '@/hooks/useB2BAnalytics';
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

// Mock data pour démonstration
const MOCK_TEAM_SCORES: TeamWellnessScore[] = [
  { teamId: '1', teamName: 'Développement', score: 72, trend: 'up', memberCount: 12, activeRate: 85 },
  { teamId: '2', teamName: 'Marketing', score: 68, trend: 'stable', memberCount: 8, activeRate: 78 },
  { teamId: '3', teamName: 'Support', score: 58, trend: 'down', memberCount: 15, activeRate: 92 },
  { teamId: '4', teamName: 'RH', score: 81, trend: 'up', memberCount: 5, activeRate: 100 },
  { teamId: '5', teamName: 'Finance', score: 65, trend: 'stable', memberCount: 6, activeRate: 67 },
];

const MOCK_ALERTS: RiskAlert[] = [
  {
    id: '1',
    type: 'burnout',
    severity: 'high',
    teamId: '3',
    teamName: 'Support',
    message: 'Signaux de burnout détectés - baisse de 15% du score bien-être sur 2 semaines',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'engagement',
    severity: 'medium',
    teamId: '5',
    teamName: 'Finance',
    message: 'Taux de participation en baisse - 33% des membres inactifs depuis 7 jours',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    type: 'stress',
    severity: 'low',
    message: 'Niveau de stress global légèrement élevé cette semaine',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

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
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  
  // Les vrais hooks seront utilisés ici
  const teamScores = MOCK_TEAM_SCORES;
  const alerts = MOCK_ALERTS;

  const avgScore = Math.round(teamScores.reduce((acc, t) => acc + t.score, 0) / teamScores.length);
  const totalMembers = teamScores.reduce((acc, t) => acc + t.memberCount, 0);
  const avgActiveRate = Math.round(teamScores.reduce((acc, t) => acc + t.activeRate, 0) / teamScores.length);
  const criticalAlerts = alerts.filter(a => a.severity === 'high').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            Dashboard RH
          </h1>
          <p className="text-muted-foreground">Vue d'ensemble du bien-être de votre organisation</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                )} />
              </div>
            </div>
            <Progress value={avgScore} className="mt-4 h-2" />
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
                <Users className="h-6 w-6 text-blue-500" />
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
                <BarChart3 className="h-6 w-6 text-purple-500" />
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
                )} />
              </div>
            </div>
            {criticalAlerts > 0 && (
              <p className="text-sm text-red-500 mt-2">
                {criticalAlerts} alerte(s) critique(s)
              </p>
            )}
          </CardContent>
        </Card>
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
                  <SelectTrigger className="w-[180px]">
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Alertes et signalements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Aucune alerte active 🎉
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
                        <Button variant="ghost" size="sm">
                          Voir détails
                        </Button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
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
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
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
