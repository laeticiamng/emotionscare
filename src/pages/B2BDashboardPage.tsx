// @ts-nocheck
/**
 * B2BDashboardPage - Dashboard principal B2B
 * Vue d'ensemble avec stats temps réel, navigation et actions rapides
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Calendar,
  BarChart3,
  FileText,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Loader2,
  UserPlus,
  Zap,
  Heart,
  Target,
  Sparkles,
} from 'lucide-react';
import { useB2BTeams } from '@/hooks/useB2BTeams';
import { useB2BEvents } from '@/hooks/useB2BEvents';
import { useB2BReports } from '@/hooks/useB2BReports';
import { useB2BRole } from '@/hooks/useB2BRole';
import { usePageSEO } from '@/hooks/usePageSEO';
import { cn } from '@/lib/utils';

const B2BDashboardPage: React.FC = () => {
  const teamsData = useB2BTeams();
  const eventsData = useB2BEvents();
  const reportsData = useB2BReports();
  const { role, isAdmin, canManageTeams } = useB2BRole();
  const [isRefreshing, setIsRefreshing] = useState(false);

  usePageSEO({
    title: 'Dashboard B2B - EmotionsCare',
    description: 'Tableau de bord bien-être de votre organisation',
    keywords: 'dashboard, bien-être, entreprise, RH, équipes',
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      teamsData.refetch(),
      eventsData.refetch(),
      reportsData.refetch(),
    ]);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const loading = teamsData.loading || eventsData.loading || reportsData.loading;

  // Métriques principales
  const stats = [
    {
      label: 'Équipes',
      value: teamsData.data.teams.length,
      icon: Users,
      color: 'text-primary',
      href: '/b2b/teams',
      trend: null,
    },
    {
      label: 'Membres',
      value: teamsData.data.totalMembers,
      icon: UserPlus,
      color: 'text-info',
      href: '/b2b/teams',
      trend: null,
    },
    {
      label: 'Bien-être moyen',
      value: `${teamsData.data.avgWellness}%`,
      icon: Heart,
      color: teamsData.data.avgWellness >= 75 ? 'text-success' : 'text-warning',
      href: '/b2b/analytics',
      trend: reportsData.data.avgWellnessTrend,
    },
    {
      label: 'Événements à venir',
      value: eventsData.data.upcomingCount,
      icon: Calendar,
      color: 'text-accent',
      href: '/b2b/events',
      trend: null,
    },
  ];

  const quickActions = [
    { label: 'Nouvelle équipe', icon: Users, href: '/b2b/teams', action: 'create-team' },
    { label: 'Planifier événement', icon: Calendar, href: '/b2b/events', action: 'create-event' },
    { label: 'Générer rapport', icon: FileText, href: '/b2b/reports', action: 'generate' },
    { label: 'Voir analytics', icon: BarChart3, href: '/b2b/analytics' },
  ];

  const getTrendIcon = (trend: 'up' | 'down' | 'stable' | null) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-success" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-destructive" />;
    return null;
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard B2B</h1>
          <p className="text-muted-foreground mt-1">
            Vue d'ensemble du bien-être de votre organisation
          </p>
        </div>
        <div className="flex items-center gap-2">
          {role && (
            <Badge variant="outline" className="gap-1">
              {role === 'b2b_admin' && <Zap className="h-3 w-3" />}
              {role.replace('b2b_', '').charAt(0).toUpperCase() + role.replace('b2b_', '').slice(1)}
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading || isRefreshing}>
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Link key={index} to={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn('p-2 rounded-lg bg-muted', stat.color)}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      {loading ? (
                        <Skeleton className="h-8 w-16 mt-1" />
                      ) : (
                        <p className="text-2xl font-bold">{stat.value}</p>
                      )}
                    </div>
                  </div>
                  {stat.trend && getTrendIcon(stat.trend)}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Teams Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Teams */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Équipes</CardTitle>
                <CardDescription>État du bien-être par équipe</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/b2b/teams">Voir tout <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-2 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : teamsData.data.teams.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">Aucune équipe créée</p>
                  <Button className="mt-4" asChild>
                    <Link to="/b2b/teams">Créer une équipe</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {teamsData.data.teams.slice(0, 5).map(team => (
                    <div key={team.id} className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium truncate">{team.name}</p>
                          <span className={cn(
                            "text-sm font-medium",
                            team.avgWellness >= 80 ? "text-success" :
                            team.avgWellness >= 70 ? "text-warning" : "text-destructive"
                          )}>
                            {team.avgWellness}%
                          </span>
                        </div>
                        <Progress value={team.avgWellness} className="h-1.5" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Événements à venir</CardTitle>
                <CardDescription>Prochaines sessions planifiées</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/b2b/events">Voir tout <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                </div>
              ) : eventsData.data.events.filter(e => e.status === 'upcoming').length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">Aucun événement planifié</p>
                  <Button className="mt-4" asChild>
                    <Link to="/b2b/events">Planifier un événement</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {eventsData.data.events
                    .filter(e => e.status === 'upcoming')
                    .slice(0, 3)
                    .map(event => (
                      <div key={event.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{event.title}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(event.date).toLocaleDateString('fr-FR')} • {event.time}</span>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {event.participants}/{event.maxParticipants}
                        </Badge>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Actions rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start gap-2"
                  asChild
                >
                  <Link to={action.href}>
                    <action.icon className="h-4 w-4" />
                    {action.label}
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Latest Report */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-info" />
                Dernier rapport
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-24 w-full" />
              ) : reportsData.data.latestReport ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {new Date(reportsData.data.latestReport.generatedAt).toLocaleDateString('fr-FR', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                    {getTrendIcon(reportsData.data.avgWellnessTrend)}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 bg-muted rounded-lg">
                      <p className="text-xl font-bold">{reportsData.data.latestReport.metrics.avgWellness}%</p>
                      <p className="text-xs text-muted-foreground">Bien-être</p>
                    </div>
                    <div className="p-2 bg-muted rounded-lg">
                      <p className="text-xl font-bold">{reportsData.data.latestReport.metrics.engagement}%</p>
                      <p className="text-xs text-muted-foreground">Engagement</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="/b2b/reports">Voir les rapports</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-2">Aucun rapport disponible</p>
                  <Button size="sm" onClick={() => reportsData.generateReport()}>
                    Générer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Alertes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teamsData.data.teams.filter(t => t.status === 'needs-attention').length === 0 ? (
                <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <p className="text-sm">Aucune alerte active</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {teamsData.data.teams
                    .filter(t => t.status === 'needs-attention')
                    .slice(0, 3)
                    .map(team => (
                      <div key={team.id} className="flex items-center gap-2 p-2 bg-warning/10 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        <p className="text-sm flex-1 truncate">{team.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {team.avgWellness}%
                        </Badge>
                      </div>
                    ))}
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <Link to="/b2b/alerts">Voir toutes les alertes</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2BDashboardPage;
