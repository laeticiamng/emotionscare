// @ts-nocheck
/**
 * B2B RH Dashboard - Tableau de bord pour managers RH
 * Vue agrégée et anonymisée du bien-être des équipes
 */
import React, { Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Shield,
  Activity,
  Bell,
  Settings,
  HelpCircle,
  RefreshCw,
  AlertTriangle,
  Heart,
  Calendar,
  Target,
  Eye,
  Loader2,
  Building2,
  FileText,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useB2BTeamStats } from '@/hooks/useB2BTeamStats';
import { useAccessibilityAudit } from '@/lib/accessibility-checker';
import { cn } from '@/lib/utils';

const B2BHeatmapLazy = React.lazy(() => import('@/pages/b2b/reports'));

export default function B2BRHDashboard() {
  const { user } = useAuth();
  const { stats, loading, refetch } = useB2BTeamStats();
  const { runAudit } = useAccessibilityAudit();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const orgName = (user?.user_metadata?.org_name as string) || 'Votre organisation';

  useEffect(() => {
    if (import.meta.env.DEV) {
      setTimeout(runAudit, 1000);
    }
  }, [runAudit]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getTrendIcon = () => {
    if (stats.weeklyTrend === 'up') return <TrendingUp className="h-4 w-4 text-success" />;
    if (stats.weeklyTrend === 'down') return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getTrendLabel = () => {
    if (stats.weeklyTrend === 'up') return 'En hausse';
    if (stats.weeklyTrend === 'down') return 'En baisse';
    return 'Stable';
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      {/* Skip Links */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md">
        Aller au contenu principal
      </a>

      {/* Navigation sticky */}
      <nav role="navigation" aria-label="Navigation dashboard RH" className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold">EmotionsCare</h2>
              <Badge variant="secondary" className="gap-1">
                <Building2 className="h-3 w-3" aria-hidden="true" />
                Manager RH
              </Badge>
              <span className="text-xs text-muted-foreground hidden md:inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                Données anonymisées
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/notifications">
                        <Bell className="h-4 w-4" aria-hidden="true" />
                        {stats.alertsCount > 0 && (
                          <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                            {stats.alertsCount}
                          </span>
                        )}
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Alertes ({stats.alertsCount})</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/b2b/reports"><FileText className="h-4 w-4" /></Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Rapports</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/settings/general"><Settings className="h-4 w-4" /></Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Paramètres</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/help"><HelpCircle className="h-4 w-4" /></Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Aide</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main id="main-content" role="main" className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Tableau de bord RH</h1>
            <p className="text-muted-foreground">{orgName} — Vue d'ensemble du bien-être collectif</p>
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={loading || isRefreshing}>
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Actualiser
          </Button>
        </header>

        {/* KPIs principaux */}
        <section aria-labelledby="kpi-title" className="mb-8">
          <h2 id="kpi-title" className="sr-only">Indicateurs clés</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Bien-être moyen */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Heart className="h-4 w-4" aria-hidden="true" />
                  Score Bien-être
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-10 w-24" />
                ) : (
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold">{stats.avgWellbeing}</span>
                    <span className="text-muted-foreground text-lg">/100</span>
                    <Badge variant="outline" className={cn(
                      'ml-auto gap-1',
                      stats.weeklyTrend === 'up' && 'border-success/50 text-success',
                      stats.weeklyTrend === 'down' && 'border-destructive/50 text-destructive'
                    )}>
                      {getTrendIcon()}
                      {stats.weeklyChange > 0 ? '+' : ''}{stats.weeklyChange}%
                    </Badge>
                  </div>
                )}
                <Progress value={stats.avgWellbeing} className="h-2 mt-3" aria-label={`Score bien-être ${stats.avgWellbeing}%`} />
              </CardContent>
            </Card>

            {/* Membres actifs */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" aria-hidden="true" />
                  Membres actifs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-10 w-20" />
                ) : (
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold">{stats.activeThisWeek}</span>
                    <span className="text-muted-foreground">/ {stats.totalMembers}</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">Cette semaine</p>
              </CardContent>
            </Card>

            {/* Engagement */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Activity className="h-4 w-4" aria-hidden="true" />
                  Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-10 w-16" />
                ) : (
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold">{stats.avgEngagement}%</span>
                  </div>
                )}
                <Progress value={stats.avgEngagement} className="h-2 mt-3" aria-label={`Engagement ${stats.avgEngagement}%`} />
              </CardContent>
            </Card>

            {/* Alertes */}
            <Card className={stats.alertsCount > 0 ? 'border-warning/50' : ''}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                  Alertes actives
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-10 w-12" />
                ) : (
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "text-3xl font-bold",
                      stats.alertsCount > 0 && "text-warning"
                    )}>{stats.alertsCount}</span>
                    {stats.alertsCount === 0 && (
                      <Badge variant="outline" className="text-success border-success/50">Tout va bien</Badge>
                    )}
                  </div>
                )}
                <Button variant="link" size="sm" className="p-0 h-auto mt-2" asChild>
                  <Link to="/b2b/alerts">Voir les détails</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Distribution humeur équipe */}
        <section aria-labelledby="mood-distribution-title" className="mb-8">
          <h2 id="mood-distribution-title" className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" aria-hidden="true" />
            Distribution émotionnelle de l'équipe
          </h2>
          <Card>
            <CardContent className="py-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/20 mb-3">
                    <span className="text-2xl">😊</span>
                  </div>
                  <div className="text-2xl font-bold text-success">{stats.teamMoodDistribution.positive}%</div>
                  <p className="text-sm text-muted-foreground">Positif</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warning/20 mb-3">
                    <span className="text-2xl">😐</span>
                  </div>
                  <div className="text-2xl font-bold text-warning">{stats.teamMoodDistribution.neutral}%</div>
                  <p className="text-sm text-muted-foreground">Neutre</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/20 mb-3">
                    <span className="text-2xl">😔</span>
                  </div>
                  <div className="text-2xl font-bold text-destructive">{stats.teamMoodDistribution.negative}%</div>
                  <p className="text-sm text-muted-foreground">À surveiller</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" aria-hidden="true" />
                <span>Données anonymisées — Minimum 5 réponses par cellule — Conforme RGPD</span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Actions rapides RH */}
        <section aria-labelledby="quick-actions-title" className="mb-8">
          <h2 id="quick-actions-title" className="text-xl font-semibold mb-4">Actions rapides</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <Link to="/b2b/reports" className="block p-6">
                <BarChart3 className="h-8 w-8 text-primary mb-3" aria-hidden="true" />
                <h3 className="font-semibold">Heatmap détaillée</h3>
                <p className="text-sm text-muted-foreground">Vue multicritères par équipe</p>
              </Link>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <Link to="/b2b/teams" className="block p-6">
                <Users className="h-8 w-8 text-primary mb-3" aria-hidden="true" />
                <h3 className="font-semibold">Gestion équipes</h3>
                <p className="text-sm text-muted-foreground">Organiser les groupes</p>
              </Link>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <Link to="/b2b/events" className="block p-6">
                <Calendar className="h-8 w-8 text-primary mb-3" aria-hidden="true" />
                <h3 className="font-semibold">Événements bien-être</h3>
                <p className="text-sm text-muted-foreground">Sessions collectives</p>
              </Link>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <Link to="/b2b/social-cocon" className="block p-6">
                <Target className="h-8 w-8 text-primary mb-3" aria-hidden="true" />
                <h3 className="font-semibold">Cocon Social</h3>
                <p className="text-sm text-muted-foreground">Défis d'équipe</p>
              </Link>
            </Card>
          </div>
        </section>

        {/* Activités les plus utilisées */}
        <section aria-labelledby="top-activities-title" className="mb-8">
          <h2 id="top-activities-title" className="text-xl font-semibold mb-4">Activités populaires</h2>
          <Card>
            <CardContent className="py-6">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.topActivities.map((activity, index) => (
                    <div key={activity.name} className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{activity.name}</span>
                          <span className="text-muted-foreground">{activity.count} sessions</span>
                        </div>
                        <Progress value={(activity.count / 50) * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Heatmap intégrée */}
        <section aria-labelledby="heatmap-title" className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 id="heatmap-title" className="text-xl font-semibold">Heatmap bien-être</h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/b2b/reports">Vue complète</Link>
            </Button>
          </div>
          <Suspense fallback={
            <Card>
              <CardContent className="py-12">
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Chargement de la heatmap...</span>
                </div>
              </CardContent>
            </Card>
          }>
            <B2BHeatmapLazy />
          </Suspense>
        </section>

        {/* Indicateur sync */}
        <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground" aria-live="polite">
          <span className="inline-block h-2 w-2 rounded-full bg-success animate-pulse" aria-hidden="true" />
          <span>Données synchronisées</span>
          <Eye className="h-3 w-3 ml-2" aria-hidden="true" />
          <span>Anonymat garanti</span>
        </div>
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="bg-card border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2025 EmotionsCare B2B — Bien-être au travail en toute confidentialité</p>
            <nav aria-label="Liens footer RH">
              <div className="flex gap-4">
                <Link to="/legal/privacy" className="hover:text-foreground">Confidentialité</Link>
                <Link to="/b2b/security" className="hover:text-foreground">Sécurité</Link>
                <Link to="/b2b/audit" className="hover:text-foreground">Conformité</Link>
                <Link to="/help" className="hover:text-foreground">Support</Link>
              </div>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
