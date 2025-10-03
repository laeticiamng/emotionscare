// @ts-nocheck
import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  Briefcase,
  Heart,
  Activity,
  Target,
  TrendingUp,
  Settings,
  HelpCircle,
  Lock,
} from 'lucide-react';
import { BreathWeeklyCard } from '@/components/breath/BreathWeeklyCard';
import { AssessmentHistory } from '@/components/assessment/AssessmentHistory';

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

export default function DashboardCollab() {
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
      <nav role="navigation" aria-label="Navigation collaborateur" className="bg-card border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold">EmotionsCare</h2>
              <Badge variant="secondary">
                <Briefcase className="h-3 w-3 mr-1" aria-hidden="true" />
                Collaborateur
              </Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <Lock className="h-3 w-3 mr-1" aria-hidden="true" />
                <span>Données privées</span>
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
          <h1 className="text-3xl font-bold mb-2">Espace Bien-être Collaborateur</h1>
          <p className="text-muted-foreground">
            Votre équilibre émotionnel au travail, en toute confidentialité
          </p>
        </header>

        {/* Privacy Banner */}
        <Card className="mb-6 bg-muted/50">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Lock className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Confidentialité garantie</h3>
              <p className="text-sm text-muted-foreground">
                Vos données personnelles ne sont jamais partagées avec votre employeur. 
                Seules des statistiques anonymisées sont utilisées pour améliorer le bien-être collectif.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Personal Metrics */}
        <section aria-labelledby="personal-metrics" className="mb-8">
          <h2 id="personal-metrics" className="text-xl font-semibold mb-4">
            Vos métriques personnelles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Cohérence Cardiaque
                </CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">82%</div>
                <p className="text-xs text-muted-foreground">+5% vs semaine dernière</p>
                <Progress value={82} className="mt-2" aria-label="Cohérence 82%" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Gestion du Stress
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Stable</div>
                <p className="text-xs text-muted-foreground">Index de stress maîtrisé</p>
                <Progress value={70} className="mt-2" aria-label="Stress 70%" />
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
                <div className="text-2xl font-bold">150min</div>
                <p className="text-xs text-muted-foreground">MVPA cette semaine</p>
                <Progress value={75} className="mt-2" aria-label="Activité 75%" />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Weekly Breath Metrics */}
        <section aria-labelledby="breath-metrics" className="mb-8">
          <h2 id="breath-metrics" className="text-xl font-semibold mb-4">
            Respiration & Cohérence
          </h2>
          <Card>
            <CardContent className="pt-6">
              <Suspense fallback={<DashboardWidgetSkeleton />}>
                <BreathWeeklyCard />
              </Suspense>
            </CardContent>
          </Card>
        </section>

        {/* Personal Goals */}
        <section aria-labelledby="goals-title" className="mb-8">
          <h2 id="goals-title" className="text-xl font-semibold mb-4">
            Objectifs Personnels
          </h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" aria-hidden="true" />
                Cette Semaine
              </CardTitle>
              <CardDescription>
                Suivez vos progrès vers un meilleur équilibre
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4" role="list" aria-label="Objectifs de la semaine">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg" role="listitem">
                  <div className="flex-1">
                    <div className="font-medium">Sessions de respiration</div>
                    <div className="text-sm text-muted-foreground">4/5 complétées</div>
                  </div>
                  <Badge variant="default">80%</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg" role="listitem">
                  <div className="flex-1">
                    <div className="font-medium">Pauses actives</div>
                    <div className="text-sm text-muted-foreground">8/10 effectuées</div>
                  </div>
                  <Badge variant="default">80%</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg" role="listitem">
                  <div className="flex-1">
                    <div className="font-medium">Cohérence quotidienne</div>
                    <div className="text-sm text-muted-foreground">Maintenir au-dessus de 70%</div>
                  </div>
                  <Badge variant="outline">En cours</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Assessments History */}
        <section aria-labelledby="assessments-title" className="mb-8">
          <h2 id="assessments-title" className="text-xl font-semibold mb-4">
            Évaluations Bien-être
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Historique des Évaluations</CardTitle>
              <CardDescription>
                Résultats qualitatifs uniquement (conforme RGPD)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<DashboardWidgetSkeleton />}>
                <AssessmentHistory />
              </Suspense>
            </CardContent>
          </Card>
        </section>

        {/* Recommendations */}
        <section aria-labelledby="recommendations-title">
          <h2 id="recommendations-title" className="text-xl font-semibold mb-4">
            Recommandations Personnalisées
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Session Flash Glow</CardTitle>
                <CardDescription>Boost d'énergie rapide</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  2 minutes pour recharger vos batteries mentales
                </p>
                <Button asChild size="sm">
                  <Link to="/app/flash-glow">Démarrer</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pause Respiration</CardTitle>
                <CardDescription>Réduire le stress</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  5 minutes de cohérence cardiaque guidée
                </p>
                <Button asChild size="sm">
                  <Link to="/app/breath">Commencer</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="bg-card border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>© 2025 EmotionsCare - Confidentialité garantie</p>
            <nav aria-label="Liens footer">
              <div className="flex space-x-4">
                <Link to="/privacy" className="hover:text-foreground">
                  Vie Privée
                </Link>
                <Link to="/help" className="hover:text-foreground">
                  Support
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
