import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import RecentEmotionScansWidget from '@/components/dashboard/widgets/RecentEmotionScansWidget';
import JournalSummaryCard from '@/components/dashboard/widgets/JournalSummaryCard';
import Who5WeeklyInvitation from '@/components/dashboard/widgets/Who5WeeklyInvitation';
import { 
  Brain, 
  Music, 
  BookOpen, 
  Headphones, 
  Target, 
  TrendingUp, 
  Calendar,
  Settings,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { useAccessibilityAudit } from '@/lib/accessibility-checker';
import { useEffect } from 'react';

export default function B2CDashboardPage() {
  const { runAudit } = useAccessibilityAudit();

  useEffect(() => {
    // Audit d'accessibilité en développement
    if (import.meta.env.DEV) {
      setTimeout(runAudit, 1000);
    }
  }, [runAudit]);

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      {/* Skip Links pour l'accessibilité */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
        tabIndex={1}
      >
        Aller au contenu principal
      </a>
      <a 
        href="#quick-actions" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-40 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
        tabIndex={2}
      >
        Aller aux actions rapides
      </a>

      {/* Navigation principale */}
      <nav role="navigation" aria-label="Navigation du tableau de bord" className="bg-card border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold">EmotionsCare</h2>
              <Badge variant="secondary" aria-label="Mode utilisateur particulier">
                Particulier
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                aria-label="Accéder aux paramètres"
              >
                <Link to="/settings">
                  <Settings className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Paramètres</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                aria-label="Accéder à l'aide"
              >
                <Link to="/help">
                  <HelpCircle className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Aide</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main id="main-content" role="main" className="container mx-auto px-4 py-8">
        {/* En-tête de bienvenue */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Bienvenue sur votre espace bien-être
          </h1>
          <p className="text-muted-foreground text-lg">
            Découvrez vos outils d'intelligence émotionnelle personnalisés
          </p>
        </header>

        {/* Rituel hebdomadaire WHO-5 */}
        <section aria-labelledby="who5-section" className="mb-8">
          <h2 id="who5-section" className="sr-only">
            Invitation hebdomadaire WHO-5
          </h2>
          <Who5WeeklyInvitation />
        </section>

        {/* Statistiques rapides */}
        <section aria-labelledby="stats-title" className="mb-8">
          <h2 id="stats-title" className="text-xl font-semibold mb-4">
            Votre progression aujourd'hui
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="relative">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Sessions d'analyse
                </CardTitle>
                <CardDescription className="sr-only">
                  Nombre de sessions d'analyse émotionnelle effectuées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">3</div>
                  <TrendingUp className="h-4 w-4 text-green-500" aria-hidden="true" />
                </div>
                <Progress value={60} className="mt-2" aria-label="Progression 60%" />
                <p className="text-xs text-muted-foreground mt-1">
                  +20% par rapport à hier
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Temps de méditation
                </CardTitle>
                <CardDescription className="sr-only">
                  Durée totale de méditation aujourd'hui
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">25min</div>
                  <Calendar className="h-4 w-4 text-blue-500" aria-hidden="true" />
                </div>
                <Progress value={83} className="mt-2" aria-label="Progression 83%" />
                <p className="text-xs text-muted-foreground mt-1">
                  Objectif: 30min
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Humeur générale
                </CardTitle>
                <CardDescription className="sr-only">
                  Évaluation de votre humeur générale
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">😊</div>
                  <Target className="h-4 w-4 text-yellow-500" aria-hidden="true" />
                </div>
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">
                    Positive
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tendance stable
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Actions rapides */}
        <section id="quick-actions" aria-labelledby="actions-title" className="mb-8">
          <h2 id="actions-title" className="text-xl font-semibold mb-4">
            Actions rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="group hover:shadow-md transition-shadow cursor-pointer">
              <Link to="/app/scan" className="block p-6" aria-describedby="scan-desc">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Brain className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-medium">Scanner mes émotions</h3>
                    <p id="scan-desc" className="text-sm text-muted-foreground">
                      Analyse faciale temps réel
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </div>
              </Link>
            </Card>

            <Card className="group hover:shadow-md transition-shadow cursor-pointer">
              <Link to="/app/music" className="block p-6" aria-describedby="music-desc">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Music className="h-5 w-5 text-blue-500" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-medium">Musique thérapeutique</h3>
                    <p id="music-desc" className="text-sm text-muted-foreground">
                      Sons adaptatifs personnalisés
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </div>
              </Link>
            </Card>

            <Card className="group hover:shadow-md transition-shadow cursor-pointer">
              <Link to="/app/journal" className="block p-6" aria-describedby="journal-desc">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <BookOpen className="h-5 w-5 text-green-500" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-medium">Journal émotionnel</h3>
                    <p id="journal-desc" className="text-sm text-muted-foreground">
                      Consignez vos ressentis
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </div>
              </Link>
            </Card>

            <Card className="group hover:shadow-md transition-shadow cursor-pointer">
              <Link to="/app/coach" className="block p-6" aria-describedby="coach-desc">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Headphones className="h-5 w-5 text-purple-500" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-medium">Coach IA</h3>
                    <p id="coach-desc" className="text-sm text-muted-foreground">
                      Conseils personnalisés
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </div>
              </Link>
            </Card>
          </div>
        </section>

        <section aria-labelledby="recent-scans-section" className="mb-8">
          <h2 id="recent-scans-section" className="sr-only">
            Historique Emotion Scan
          </h2>
          <RecentEmotionScansWidget />
        </section>

        <section aria-labelledby="journal-summary-section" className="mb-8">
          <h2 id="journal-summary-section" className="sr-only">
            Synthèse du journal émotionnel
          </h2>
          <JournalSummaryCard />
        </section>

        {/* Recommandations personnalisées */}
        <section aria-labelledby="recommendations-title">
          <h2 id="recommendations-title" className="text-xl font-semibold mb-4">
            Recommandé pour vous
          </h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="p-2 bg-orange-500/10 rounded">
                  <Target className="h-4 w-4 text-orange-500" aria-hidden="true" />
                </div>
                <span>Session de respiration guidée</span>
              </CardTitle>
              <CardDescription>
                Basé sur votre niveau de stress détecté ce matin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Une session de 10 minutes pour réduire le stress et améliorer votre concentration.
              </p>
              <Button asChild aria-describedby="breath-session-desc">
                <Link to="/app/breath">
                  Commencer la session
                </Link>
              </Button>
              <p id="breath-session-desc" className="sr-only">
                Démarre une session de respiration guidée de 10 minutes
              </p>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="bg-card border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>© 2025 EmotionsCare - Votre bien-être, notre priorité</p>
            <nav aria-label="Liens footer">
              <div className="flex space-x-4">
                <Link to="/privacy" className="hover:text-foreground">
                  Confidentialité
                </Link>
                <Link to="/terms" className="hover:text-foreground">
                  Conditions
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