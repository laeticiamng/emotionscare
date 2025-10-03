// @ts-nocheck
import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  TrendingUp,
  Activity,
  Heart,
  Settings,
  HelpCircle,
  Shield,
  BarChart3,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const DashboardWidgetSkeleton: React.FC = () => (
  <Card className="border-dashed" aria-hidden="true">
    <CardHeader className="space-y-2">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-3 w-1/2" />
    </CardHeader>
    <CardContent className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-full" />
      ))}
    </CardContent>
  </Card>
);

export default function DashboardRH() {
  // Fetch organization metrics (anonymized)
  const { data: orgMetrics, isLoading } = useQuery({
    queryKey: ['org-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('breath_weekly_org_metrics')
        .select('*')
        .order('week_start', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      {/* Skip Links */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
      >
        Aller au contenu principal
      </a>

      {/* Navigation */}
      <nav role="navigation" aria-label="Navigation RH" className="bg-card border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold">EmotionsCare</h2>
              <Badge variant="secondary">
                <Shield className="h-3 w-3 mr-1" aria-hidden="true" />
                Manager RH
              </Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <Users className="h-3 w-3 mr-1" aria-hidden="true" />
                <span>Données anonymisées</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild aria-label="Paramètres">
                <Link to="/settings">
                  <Settings className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild aria-label="Aide">
                <Link to="/help">
                  <HelpCircle className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main id="main-content" role="main" className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard RH & Management</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble du bien-être organisationnel (données anonymisées)
          </p>
        </header>

        {/* RGPD Compliance Banner */}
        <Card className="mb-6 bg-primary/5 border-primary/20">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Shield className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary">Protection RGPD Active</h3>
              <p className="text-sm text-muted-foreground">
                Toutes les données affichées sont agrégées et anonymisées. 
                Aucune donnée individuelle identifiable n'est accessible.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Organization Overview */}
        <section aria-labelledby="org-overview" className="mb-8">
          <h2 id="org-overview" className="text-xl font-semibold mb-4">
            Vue d'Ensemble Organisationnelle
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Collaborateurs Actifs
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? <Skeleton className="h-8 w-16" /> : orgMetrics?.members || 0}
                </div>
                <p className="text-xs text-muted-foreground">membres cette semaine</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Cohérence Moyenne
                </CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    `${Math.round(orgMetrics?.org_coherence || 0)}%`
                  )}
                </div>
                <p className="text-xs text-muted-foreground">agrégat organisation</p>
                <Progress
                  value={orgMetrics?.org_coherence || 0}
                  className="mt-2"
                  aria-label={`Cohérence ${orgMetrics?.org_coherence || 0}%`}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Index Stress Org
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    orgMetrics?.org_hrv_idx?.toFixed(1) || 'N/A'
                  )}
                </div>
                <p className="text-xs text-muted-foreground">HRV stress collectif</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Activité Physique
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    `${orgMetrics?.org_mvpa || 0}min`
                  )}
                </div>
                <p className="text-xs text-muted-foreground">MVPA moyenne/semaine</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Detailed Metrics */}
        <section aria-labelledby="detailed-metrics" className="mb-8">
          <h2 id="detailed-metrics" className="text-xl font-semibold mb-4">
            Métriques Détaillées (Agrégées)
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" aria-hidden="true" />
                  Bien-être Cardiaque
                </CardTitle>
                <CardDescription>Indicateurs de cohérence et relaxation</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <DashboardWidgetSkeleton />
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Cohérence moyenne</span>
                        <span className="font-semibold">
                          {Math.round(orgMetrics?.org_coherence || 0)}%
                        </span>
                      </div>
                      <Progress
                        value={orgMetrics?.org_coherence || 0}
                        aria-label={`Cohérence ${orgMetrics?.org_coherence}%`}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Index de relaxation</span>
                        <span className="font-semibold">
                          {orgMetrics?.org_relax?.toFixed(1) || 'N/A'}
                        </span>
                      </div>
                      <Progress
                        value={(orgMetrics?.org_relax || 0) * 10}
                        aria-label={`Relaxation ${orgMetrics?.org_relax}`}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Mindfulness</span>
                        <span className="font-semibold">
                          {orgMetrics?.org_mindfulness?.toFixed(1) || 'N/A'}
                        </span>
                      </div>
                      <Progress
                        value={(orgMetrics?.org_mindfulness || 0) * 10}
                        aria-label={`Mindfulness ${orgMetrics?.org_mindfulness}`}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" aria-hidden="true" />
                  Tendances & Humeur
                </CardTitle>
                <CardDescription>Évolution du bien-être collectif</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <DashboardWidgetSkeleton />
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Humeur moyenne</span>
                        <span className="font-semibold">
                          {orgMetrics?.org_mood?.toFixed(1) || 'N/A'}/10
                        </span>
                      </div>
                      <Progress
                        value={(orgMetrics?.org_mood || 0) * 10}
                        aria-label={`Humeur ${orgMetrics?.org_mood}/10`}
                      />
                    </div>
                    <div className="pt-4">
                      <p className="text-sm text-muted-foreground">
                        Les données sont automatiquement anonymisées et agrégées 
                        pour préserver la confidentialité de chaque collaborateur.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Recommendations for Management */}
        <section aria-labelledby="recommendations-title" className="mb-8">
          <h2 id="recommendations-title" className="text-xl font-semibold mb-4">
            Recommandations Managériales
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" aria-hidden="true" />
                  Action Prioritaire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Envisager des sessions de cohérence cardiaque collectives 
                  pour améliorer le bien-être général (+12% estimé).
                </p>
                <Button asChild size="sm">
                  <Link to="/b2b/events">Planifier Session</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" aria-hidden="true" />
                  Optimisation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Encourager les pauses actives : +15 min MVPA/jour améliorerait 
                  les métriques de 8%.
                </p>
                <Button asChild size="sm" variant="outline">
                  <Link to="/b2b/optimization">Voir Détails</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Access to Reports */}
        <section aria-labelledby="reports-title">
          <h2 id="reports-title" className="text-xl font-semibold mb-4">
            Rapports & Analyses
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Accès aux Rapports Avancés</CardTitle>
              <CardDescription>
                Analyses détaillées et historiques anonymisés
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button asChild>
                <Link to="/b2b/reports">
                  <BarChart3 className="h-4 w-4 mr-2" aria-hidden="true" />
                  Rapports Hebdomadaires
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/b2b/teams">
                  <Users className="h-4 w-4 mr-2" aria-hidden="true" />
                  Gestion Équipes
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/b2b/audit">
                  <Shield className="h-4 w-4 mr-2" aria-hidden="true" />
                  Audit RGPD
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="bg-card border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>© 2025 EmotionsCare - Données anonymisées & conformes RGPD</p>
            <nav aria-label="Liens footer">
              <div className="flex space-x-4">
                <Link to="/privacy" className="hover:text-foreground">
                  Politique RGPD
                </Link>
                <Link to="/b2b/security" className="hover:text-foreground">
                  Sécurité
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
