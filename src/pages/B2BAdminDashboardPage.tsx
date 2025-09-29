import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  BarChart3, 
  Calendar, 
  Shield,
  Settings,
  HelpCircle,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { useAccessibilityAudit } from '@/lib/accessibility-checker';

const B2BAdminDashboardPage: React.FC = () => {
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
        href="#admin-actions" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-40 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
        tabIndex={2}
      >
        Aller aux actions administrateur
      </a>

      {/* Navigation principale */}
      <nav role="navigation" aria-label="Navigation du tableau de bord administrateur" className="bg-card border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold">EmotionsCare</h2>
              <Badge variant="secondary" aria-label="Mode administrateur RH">
                <Shield className="h-3 w-3 mr-1" aria-hidden="true" />
                Administrateur RH
              </Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1" aria-hidden="true"></div>
                <span>Données anonymisées</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                aria-label="Accéder aux paramètres administrateur"
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
                aria-label="Accéder à l'aide administrateur"
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
            Dashboard Administration
          </h1>
          <p className="text-muted-foreground text-lg">
            Pilotage du bien-être organisationnel - Vue d'ensemble anonymisée
          </p>
        </header>

        {/* Métriques globales */}
        <section aria-labelledby="metrics-title" className="mb-8">
          <h2 id="metrics-title" className="text-xl font-semibold mb-4">
            Indicateurs généraux cette semaine
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Engagement global
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-green-600">Élevé</div>
                  <TrendingUp className="h-4 w-4 text-green-600" aria-hidden="true" />
                </div>
                <Progress value={82} className="mt-2" aria-label="Engagement 82%" />
                <p className="text-xs text-muted-foreground mt-1">
                  +8% vs mois dernier
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Participation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">73%</div>
                  <Users className="h-4 w-4 text-blue-500" aria-hidden="true" />
                </div>
                <Progress value={73} className="mt-2" aria-label="Participation 73%" />
                <p className="text-xs text-muted-foreground mt-1">
                  156 collaborateurs actifs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Stress collectif
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-orange-600">Modéré</div>
                  <AlertTriangle className="h-4 w-4 text-orange-600" aria-hidden="true" />
                </div>
                <Progress value={45} className="mt-2" aria-label="Niveau de stress 45%" />
                <p className="text-xs text-muted-foreground mt-1">
                  Stable, surveillance continue
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tendance générale
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-primary">Positive</div>
                  <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" />
                </div>
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">
                    Amélioration continue
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Croissance soutenue
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Actions administrateur */}
        <section id="admin-actions" aria-labelledby="admin-title" className="mb-8">
          <h2 id="admin-title" className="text-xl font-semibold mb-4">
            Gestion et pilotage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card data-testid="admin-panel" className="group hover:shadow-md transition-shadow cursor-pointer">
              <Link to="/teams" className="block" aria-describedby="teams-desc">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <span>Gestion des Équipes</span>
                    <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p id="teams-desc" className="text-muted-foreground mb-4">
                    Gérez les équipes et leurs membres - Vue organisationnelle du bien-être
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Équipes actives</span>
                      <span className="font-medium">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Membres totaux</span>
                      <span className="font-medium">214</span>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
            
            <Card data-testid="team-management" className="group hover:shadow-md transition-shadow cursor-pointer">
              <Link to="/reports" className="block" aria-describedby="reports-desc">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-blue-500" aria-hidden="true" />
                    </div>
                    <span>Rapports</span>
                    <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p id="reports-desc" className="text-muted-foreground mb-4">
                    Consultez les rapports de bien-être et les analyses approfondies
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Rapports mensuels</span>
                      <span className="font-medium">Disponibles</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dernière mise à jour</span>
                      <span className="font-medium">Aujourd'hui</span>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
            
            <Card data-testid="reports-section" className="group hover:shadow-md transition-shadow cursor-pointer">
              <Link to="/events" className="block" aria-describedby="events-desc">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-green-500" aria-hidden="true" />
                    </div>
                    <span>Événements</span>
                    <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p id="events-desc" className="text-muted-foreground mb-4">
                    Organisez des événements de bien-être et suivez leur impact
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Événements ce mois</span>
                      <span className="font-medium">3 planifiés</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Participation moyenne</span>
                      <span className="font-medium">68%</span>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>
        </section>

        {/* Alertes et recommandations */}
        <section aria-labelledby="alerts-title">
          <h2 id="alerts-title" className="text-xl font-semibold mb-4">
            Alertes et recommandations
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" aria-hidden="true" />
                  <span>Attention requise</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800 rounded-lg">
                    <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-1">
                      Équipe Commercial
                    </h4>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      Niveau de stress légèrement élevé cette semaine. 
                      Envisager une session Flash Glow collective.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-blue-500" aria-hidden="true" />
                  <span>Actions recommandées</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                      Bonnes pratiques
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      L'équipe Support affiche d'excellents résultats. 
                      Documenter leurs méthodes pour les partager.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="bg-card border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground gap-4">
            <p>© 2025 EmotionsCare - Plateforme RH conforme RGPD</p>
            <nav aria-label="Liens footer administrateur">
              <div className="flex space-x-4">
                <Link to="/privacy" className="hover:text-foreground">
                  Confidentialité RGPD
                </Link>
                <Link to="/terms" className="hover:text-foreground">
                  Conditions RH
                </Link>
                <Link to="/help" className="hover:text-foreground">
                  Support Admin
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default B2BAdminDashboardPage;