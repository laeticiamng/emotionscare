// @ts-nocheck
/**
 * B2BAnalyticsPage - Analytics avancées B2B
 * Tableau de bord analytique pour les équipes
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  Heart,
  Download,
  RefreshCw,
  Loader2,
  Building2,
  Settings,
  HelpCircle,
  Bell,
  Shield,
  Zap,
  Target,
  Clock,
} from 'lucide-react';
import { useB2BAnalytics } from '@/hooks/useB2BAnalytics';
import { usePageSEO } from '@/hooks/usePageSEO';
import { cn } from '@/lib/utils';

const B2BAnalyticsPage: React.FC = () => {
  const { data, loading, refetch } = useB2BAnalytics();
  const [isRefreshing, setIsRefreshing] = useState(false);

  usePageSEO({
    title: 'Analytics B2B - EmotionsCare',
    description: 'Tableau de bord analytique pour le bien-être des équipes',
    keywords: 'analytics, bien-être, équipes, RH',
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-success" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return null;
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      {/* Skip Links */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md">
        Aller au contenu principal
      </a>

      {/* Navigation sticky */}
      <nav role="navigation" aria-label="Navigation analytics" className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/b2b/dashboard" className="text-lg font-semibold hover:text-primary transition-colors">
                EmotionsCare
              </Link>
              <Badge variant="secondary" className="gap-1">
                <BarChart3 className="h-3 w-3" aria-hidden="true" />
                Analytics
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/notifications"><Bell className="h-4 w-4" /></Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
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
      <main id="main-content" role="main" className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" aria-hidden="true" />
              Analytics Bien-être
            </h1>
            <p className="text-muted-foreground">
              Insights et tendances pour votre organisation
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={loading || isRefreshing}>
              {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" aria-hidden="true" />
              Exporter
            </Button>
          </div>
        </header>

        {/* KPIs Overview */}
        <section aria-labelledby="kpi-title" className="mb-8">
          <h2 id="kpi-title" className="sr-only">Indicateurs clés</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Heart className="h-5 w-5 text-primary" aria-hidden="true" />
                  {getTrendIcon(data.wellbeingTrend)}
                </div>
                {loading ? <Skeleton className="h-10 w-20" /> : (
                  <div className="text-3xl font-bold">{data.avgWellbeing}%</div>
                )}
                <p className="text-sm text-muted-foreground">Bien-être moyen</p>
                {data.wellbeingTrend !== 0 && (
                  <p className={cn("text-xs mt-1", data.wellbeingTrend > 0 ? "text-success" : "text-destructive")}>
                    {data.wellbeingTrend > 0 ? '+' : ''}{data.wellbeingTrend}% vs mois dernier
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="h-5 w-5 text-success" aria-hidden="true" />
                  {getTrendIcon(data.engagementTrend)}
                </div>
                {loading ? <Skeleton className="h-10 w-20" /> : (
                  <div className="text-3xl font-bold">{data.avgEngagement}%</div>
                )}
                <p className="text-sm text-muted-foreground">Engagement</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-5 w-5 text-info" aria-hidden="true" />
                </div>
                {loading ? <Skeleton className="h-10 w-16" /> : (
                  <div className="text-3xl font-bold">{data.activeUsers}/{data.totalUsers}</div>
                )}
                <p className="text-sm text-muted-foreground">Utilisateurs actifs</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Zap className="h-5 w-5 text-warning" aria-hidden="true" />
                </div>
                {loading ? <Skeleton className="h-10 w-20" /> : (
                  <div className="text-3xl font-bold">{data.totalSessions}</div>
                )}
                <p className="text-sm text-muted-foreground">Sessions ce mois</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Detailed Analytics */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="activities">Activités</TabsTrigger>
            <TabsTrigger value="trends">Tendances</TabsTrigger>
            <TabsTrigger value="teams">Équipes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Distribution émotionnelle */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" aria-hidden="true" />
                    Distribution Émotionnelle
                  </CardTitle>
                  <CardDescription>Répartition des états émotionnels cette semaine</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">😊 Positif</span>
                          <span className="text-sm font-medium">{data.moodDistribution.positive}%</span>
                        </div>
                        <Progress value={data.moodDistribution.positive} className="h-2 bg-success/20" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">😐 Neutre</span>
                          <span className="text-sm font-medium">{data.moodDistribution.neutral}%</span>
                        </div>
                        <Progress value={data.moodDistribution.neutral} className="h-2 bg-warning/20" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">😔 À surveiller</span>
                          <span className="text-sm font-medium">{data.moodDistribution.negative}%</span>
                        </div>
                        <Progress value={data.moodDistribution.negative} className="h-2 bg-destructive/20" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Top activités */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" aria-hidden="true" />
                    Activités Populaires
                  </CardTitle>
                  <CardDescription>Top 5 des activités les plus utilisées</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-10 w-full" />)}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data.topActivities.map((activity, index) => (
                        <div key={activity.name} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">{activity.name}</span>
                              <span className="text-muted-foreground">{activity.sessions} sessions</span>
                            </div>
                            <Progress value={(activity.sessions / data.topActivities[0].sessions) * 100} className="h-1.5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Heures d'activité */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" aria-hidden="true" />
                  Heures d'Activité
                </CardTitle>
                <CardDescription>Répartition des activités par tranche horaire</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-32 w-full" />
                ) : (
                  <div className="grid grid-cols-6 gap-2">
                    {data.activityByHour.map((hour) => (
                      <div key={hour.hour} className="text-center">
                        <div 
                          className="bg-primary/20 rounded-lg mx-auto mb-1 transition-all hover:bg-primary/30"
                          style={{ 
                            height: `${Math.max(20, (hour.sessions / Math.max(...data.activityByHour.map(h => h.sessions))) * 80)}px`,
                            width: '100%',
                          }}
                        />
                        <span className="text-xs text-muted-foreground">{hour.hour}h</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities">
            <Card>
              <CardHeader>
                <CardTitle>Détail des Activités</CardTitle>
                <CardDescription>Statistiques détaillées par catégorie d'activité</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.activityCategories.map((category) => (
                      <div key={category.name} className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Activity className="h-4 w-4 text-primary" />
                          </div>
                          <h4 className="font-medium">{category.name}</h4>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Sessions</span>
                            <span className="font-medium">{category.sessions}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Utilisateurs</span>
                            <span className="font-medium">{category.users}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Durée moy.</span>
                            <span className="font-medium">{category.avgDuration}min</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>Évolution sur 30 Jours</CardTitle>
                <CardDescription>Tendances du bien-être et de l'engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-12">
                  Graphiques de tendances à venir
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teams">
            <Card>
              <CardHeader>
                <CardTitle>Performance par Équipe</CardTitle>
                <CardDescription>Comparaison anonymisée entre équipes</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <div className="space-y-4">
                    {data.teamStats.map((team) => (
                      <div key={team.name} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <h4 className="font-medium">{team.name}</h4>
                          </div>
                          <Badge variant="outline">{team.members} membres</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-primary">{team.wellbeing}%</div>
                            <p className="text-xs text-muted-foreground">Bien-être</p>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-success">{team.engagement}%</div>
                            <p className="text-xs text-muted-foreground">Engagement</p>
                          </div>
                          <div>
                            <div className="text-lg font-bold">{team.sessions}</div>
                            <p className="text-xs text-muted-foreground">Sessions</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Indicateur confidentialité */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-8">
          <Shield className="h-4 w-4 text-success" aria-hidden="true" />
          <span>Données agrégées et anonymisées — Conforme RGPD</span>
        </div>
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="bg-card border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2025 EmotionsCare B2B</p>
            <nav aria-label="Liens footer">
              <div className="flex gap-4">
                <Link to="/legal/privacy" className="hover:text-foreground">Confidentialité</Link>
                <Link to="/b2b/security" className="hover:text-foreground">Sécurité</Link>
                <Link to="/help" className="hover:text-foreground">Support</Link>
              </div>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default B2BAnalyticsPage;
