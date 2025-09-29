import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Heart, 
  TrendingUp, 
  Target,
  Settings,
  HelpCircle,
  ChevronRight,
  Briefcase,
  Activity
} from 'lucide-react';
import { useAccessibilityAudit } from '@/lib/accessibility-checker';

const B2BUserDashboardPage: React.FC = () => {
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
        href="#wellbeing-section" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-40 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
        tabIndex={2}
      >
        Aller à mon bien-être
      </a>

      {/* Navigation principale */}
      <nav role="navigation" aria-label="Navigation du tableau de bord collaborateur" className="bg-card border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold">EmotionsCare</h2>
              <Badge variant="secondary" aria-label="Mode collaborateur d'entreprise">
                <Briefcase className="h-3 w-3 mr-1" aria-hidden="true" />
                Collaborateur
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
            Dashboard Collaborateur
          </h1>
          <p className="text-muted-foreground text-lg">
            Votre espace bien-être au travail - Données privées et sécurisées
          </p>
        </header>

        {/* Métriques rapides */}
        <section aria-labelledby="metrics-title" className="mb-8">
          <h2 id="metrics-title" className="text-xl font-semibold mb-4">
            Votre bien-être cette semaine
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Niveau d'énergie
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">Bon</div>
                  <Activity className="h-4 w-4 text-green-500" aria-hidden="true" />
                </div>
                <Progress value={75} className="mt-2" aria-label="Niveau d'énergie 75%" />
                <p className="text-xs text-muted-foreground mt-1">
                  Stable par rapport à la semaine dernière
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Satisfaction au travail
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">Élevée</div>
                  <TrendingUp className="h-4 w-4 text-blue-500" aria-hidden="true" />
                </div>
                <Progress value={85} className="mt-2" aria-label="Satisfaction 85%" />
                <p className="text-xs text-muted-foreground mt-1">
                  +10% ce mois-ci
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Gestion du stress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">Maîtrisée</div>
                  <Target className="h-4 w-4 text-green-500" aria-hidden="true" />
                </div>
                <Progress value={70} className="mt-2" aria-label="Gestion du stress 70%" />
                <p className="text-xs text-muted-foreground mt-1">
                  Techniques appliquées régulièrement
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Sections principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card id="wellbeing-section" className="group hover:shadow-md transition-shadow cursor-pointer">
            <Link to="/app/scan" className="block" aria-describedby="wellbeing-desc">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Heart className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <span>Mon Bien-être</span>
                  <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p id="wellbeing-desc" className="text-muted-foreground">
                  Suivez votre bien-être au travail avec nos outils d'analyse émotionnelle
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sessions cette semaine</span>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Amélioration détectée</span>
                    <span className="font-medium text-green-600">+15%</span>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="group hover:shadow-md transition-shadow cursor-pointer">
            <Link to="/teams" className="block" aria-describedby="team-desc">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Users className="h-5 w-5 text-blue-500" aria-hidden="true" />
                  </div>
                  <span>Équipe</span>
                  <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p id="team-desc" className="text-muted-foreground">
                  Ambiance et cohésion d'équipe - Données anonymisées
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Moral d'équipe</span>
                    <span className="font-medium">Positif</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Participation</span>
                    <span className="font-medium">Active</span>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="group hover:shadow-md transition-shadow cursor-pointer md:col-span-2 lg:col-span-1">
            <Link to="/app/journal" className="block" aria-describedby="journal-desc">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Activity className="h-5 w-5 text-green-500" aria-hidden="true" />
                  </div>
                  <span>Journal Personnel</span>
                  <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p id="journal-desc" className="text-muted-foreground">
                  Consignez vos ressentis professionnels en toute confidentialité
                </p>
                <div className="mt-4">
                  <Button variant="outline" size="sm" aria-label="Créer une nouvelle entrée de journal">
                    Nouvelle entrée
                  </Button>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Recommandations */}
        <section aria-labelledby="recommendations-title">
          <h2 id="recommendations-title" className="text-xl font-semibold mb-4">
            Recommandations personnalisées
          </h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="p-2 bg-orange-500/10 rounded">
                  <Target className="h-4 w-4 text-orange-500" aria-hidden="true" />
                </div>
                <span>Pause bien-être suggérée</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Basé sur votre activité récente, une pause de 10 minutes avec notre module Flash Glow 
                pourrait améliorer votre concentration pour le reste de l'après-midi.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button asChild aria-describedby="flash-glow-desc">
                  <Link to="/app/flash-glow">
                    Commencer Flash Glow
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/app/music">
                    Musicothérapie
                  </Link>
                </Button>
              </div>
              <p id="flash-glow-desc" className="sr-only">
                Démarre une session Flash Glow de 10 minutes pour améliorer votre concentration
              </p>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="bg-card border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground gap-4">
            <p>© 2025 EmotionsCare - Votre bien-être au travail, en toute confidentialité</p>
            <nav aria-label="Liens footer">
              <div className="flex space-x-4">
                <Link to="/privacy" className="hover:text-foreground">
                  Confidentialité
                </Link>
                <Link to="/terms" className="hover:text-foreground">
                  Conditions
                </Link>
                <Link to="/help" className="hover:text-foreground">
                  Support RH
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default B2BUserDashboardPage;