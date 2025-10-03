// @ts-nocheck
import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Heart,
  Activity,
  Brain,
  FileText,
  Calendar,
  TrendingUp,
  Settings,
  HelpCircle,
} from 'lucide-react';

// Lazy loading des composants lourds pour optimiser le bundle initial
const JournalTimeline = lazy(() => import('@/components/journal/JournalTimeline').then(m => ({ default: m.JournalTimeline })));
const VRSessionsHistoryList = lazy(() => import('@/components/vr/VRSessionsHistoryList').then(m => ({ default: m.VRSessionsHistoryList })));
const BreathWeeklyCard = lazy(() => import('@/components/breath/BreathWeeklyCard').then(m => ({ default: m.BreathWeeklyCard })));
const AssessmentHistory = lazy(() => import('@/components/assessment/AssessmentHistory').then(m => ({ default: m.AssessmentHistory })));

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

export default function DashboardHome() {
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
      <nav role="navigation" aria-label="Navigation principale" className="bg-card border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold">EmotionsCare</h2>
              <Badge variant="secondary">Particulier</Badge>
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
          <h1 className="text-3xl font-bold mb-2">Dashboard Bien-être</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble de votre parcours émotionnel
          </p>
        </header>

        {/* Quick Stats */}
        <section aria-labelledby="stats-title" className="mb-8">
          <h2 id="stats-title" className="text-xl font-semibold mb-4">
            Métriques de la semaine
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Journal
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">entrées cette semaine</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  VR Sessions
                </CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">sessions complétées</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Cohérence
                </CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">moyenne hebdo</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Assessments
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">évaluations passées</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="journal">Journal</TabsTrigger>
            <TabsTrigger value="vr">VR</TabsTrigger>
            <TabsTrigger value="breath">Respiration</TabsTrigger>
            <TabsTrigger value="assessments">Évaluations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Suspense fallback={<DashboardWidgetSkeleton />}>
                <Card>
                  <CardHeader>
                    <CardTitle>Cohérence Cardiaque</CardTitle>
                    <CardDescription>Métriques hebdomadaires</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BreathWeeklyCard />
                  </CardContent>
                </Card>
              </Suspense>

              <Card>
                <CardHeader>
                  <CardTitle>Tendances</CardTitle>
                  <CardDescription>Évolution sur 7 jours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-32 text-muted-foreground">
                    <TrendingUp className="h-8 w-8 mr-2" aria-hidden="true" />
                    <span>Graphique de tendance</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="journal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Journal Émotionnel</CardTitle>
                <CardDescription>
                  Vos entrées récentes (résumés uniquement)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<DashboardWidgetSkeleton />}>
                  <JournalTimeline />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vr" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sessions VR</CardTitle>
                <CardDescription>
                  Historique Nebula & Dome
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<DashboardWidgetSkeleton />}>
                  <VRSessionsHistoryList />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="breath" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Respiration & HRV</CardTitle>
                <CardDescription>
                  Suivi de cohérence cardiaque
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<DashboardWidgetSkeleton />}>
                  <BreathWeeklyCard />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Évaluations Cliniques</CardTitle>
                <CardDescription>
                  Historique des assessments (RGPD compliant)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<DashboardWidgetSkeleton />}>
                  <AssessmentHistory />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="bg-card border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>© 2025 EmotionsCare - Données privées et sécurisées</p>
            <nav aria-label="Liens footer">
              <div className="flex space-x-4">
                <Link to="/privacy" className="hover:text-foreground">
                  Confidentialité
                </Link>
                <Link to="/terms" className="hover:text-foreground">
                  Conditions
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
