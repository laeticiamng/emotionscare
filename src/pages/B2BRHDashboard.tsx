import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Shield, 
  Download,
  Filter,
  Calendar,
  BarChart3,
  Activity,
  Heart,
  Settings,
  HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAccessibilityAudit } from '@/lib/accessibility-checker';

const B2BRHDashboard: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('week');
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
        href="#heatmap-section" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-40 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
        tabIndex={2}
      >
        Aller à la heatmap
      </a>

      {/* Navigation principale */}
      <nav role="navigation" aria-label="Navigation du tableau de bord RH" className="bg-card border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold">EmotionsCare</h2>
              <Badge variant="secondary" aria-label="Mode tableau de bord RH">
                <Shield className="h-3 w-3 mr-1" aria-hidden="true" />
                Tableau de Bord RH
              </Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1" aria-hidden="true"></div>
                <span>Données anonymisées RGPD</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                aria-label="Accéder aux paramètres RH"
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
                aria-label="Accéder à l'aide RH"
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
      <main id="main-content" role="main" className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header avec contrôles */}
          <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Tableau de Bord RH</h1>
              <p className="text-muted-foreground">
                Vision anonymisée du bien-être des équipes - Conforme RGPD
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" aria-hidden="true" />
                <span>Données anonymisées</span>
              </div>
              
              <Select value={selectedTeam} onValueChange={setSelectedTeam} aria-label="Sélectionner une équipe">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Équipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes équipes</SelectItem>
                  <SelectItem value="dev">Développement</SelectItem>
                  <SelectItem value="sales">Commercial</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="rh">Ressources Humaines</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod} aria-label="Sélectionner une période">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Aujourd'hui</SelectItem>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="quarter">Trimestre</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm" aria-describedby="export-desc">
                <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                Exporter
              </Button>
              <p id="export-desc" className="sr-only">
                Exporter les données en format PDF ou Excel
              </p>
            </div>
          </header>

          {/* Métriques clés */}
          <section aria-labelledby="metrics-title">
            <h2 id="metrics-title" className="text-xl font-semibold mb-4">
              Indicateurs clés de performance
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Engagement Global</p>
                      <p className="text-2xl font-bold text-green-600">Élevé</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" aria-hidden="true" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    +12% vs semaine précédente
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Stress Collectif</p>
                      <p className="text-2xl font-bold text-orange-600">Modéré</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-orange-600" aria-hidden="true" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Stable par rapport au mois dernier
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Participation</p>
                      <p className="text-2xl font-bold text-blue-600">Active</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" aria-hidden="true" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    73% des collaborateurs actifs
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Tendance Globale</p>
                      <p className="text-2xl font-bold text-primary">Positive</p>
                    </div>
                    <Activity className="h-8 w-8 text-primary" aria-hidden="true" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Amélioration continue
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Contenu principal avec onglets */}
          <section id="heatmap-section" aria-labelledby="dashboard-tabs-title">
            <h2 id="dashboard-tabs-title" className="text-xl font-semibold mb-4">
              Analyses approfondies
            </h2>
            <Tabs defaultValue="heatmap" className="space-y-6">
              <TabsList className="grid grid-cols-4 w-full max-w-md" role="tablist" aria-label="Onglets d'analyse">
                <TabsTrigger value="heatmap" role="tab" aria-controls="heatmap-panel">Heatmap</TabsTrigger>
                <TabsTrigger value="trends" role="tab" aria-controls="trends-panel">Tendances</TabsTrigger>
                <TabsTrigger value="activities" role="tab" aria-controls="activities-panel">Activités</TabsTrigger>
                <TabsTrigger value="alerts" role="tab" aria-controls="alerts-panel">Alertes</TabsTrigger>
              </TabsList>

              <TabsContent value="heatmap" id="heatmap-panel" role="tabpanel" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" aria-hidden="true" />
                      Heatmap des Humeurs d'Équipe
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Simulation d'une heatmap */}
                      <div className="grid grid-cols-7 gap-2 text-sm" role="table" aria-label="Heatmap du bien-être par équipe">
                        <div className="font-medium" role="columnheader">Équipe</div>
                        <div className="font-medium text-center" role="columnheader">Lun</div>
                        <div className="font-medium text-center" role="columnheader">Mar</div>
                        <div className="font-medium text-center" role="columnheader">Mer</div>
                        <div className="font-medium text-center" role="columnheader">Jeu</div>
                        <div className="font-medium text-center" role="columnheader">Ven</div>
                        <div className="font-medium text-center" role="columnheader">Moyenne</div>
                      </div>
                      
                      <div className="grid grid-cols-7 gap-2 text-sm" role="row">
                        <div role="rowheader">Développement</div>
                        <div className="h-8 bg-green-200 dark:bg-green-800 rounded flex items-center justify-center" role="cell">Bien</div>
                        <div className="h-8 bg-green-300 dark:bg-green-700 rounded flex items-center justify-center" role="cell">Très bien</div>
                        <div className="h-8 bg-yellow-200 dark:bg-yellow-800 rounded flex items-center justify-center" role="cell">Neutre</div>
                        <div className="h-8 bg-green-200 dark:bg-green-800 rounded flex items-center justify-center" role="cell">Bien</div>
                        <div className="h-8 bg-green-300 dark:bg-green-700 rounded flex items-center justify-center" role="cell">Très bien</div>
                        <div className="h-8 bg-green-200 dark:bg-green-800 rounded flex items-center justify-center font-medium" role="cell">Positif</div>
                      </div>
                      
                      <div className="grid grid-cols-7 gap-2 text-sm" role="row">
                        <div role="rowheader">Commercial</div>
                        <div className="h-8 bg-orange-200 dark:bg-orange-800 rounded flex items-center justify-center" role="cell">Stress</div>
                        <div className="h-8 bg-yellow-200 dark:bg-yellow-800 rounded flex items-center justify-center" role="cell">Neutre</div>
                        <div className="h-8 bg-green-200 dark:bg-green-800 rounded flex items-center justify-center" role="cell">Bien</div>
                        <div className="h-8 bg-green-200 dark:bg-green-800 rounded flex items-center justify-center" role="cell">Bien</div>
                        <div className="h-8 bg-green-300 dark:bg-green-700 rounded flex items-center justify-center" role="cell">Très bien</div>
                        <div className="h-8 bg-yellow-200 dark:bg-yellow-800 rounded flex items-center justify-center font-medium" role="cell">Stable</div>
                      </div>
                      
                      <div className="grid grid-cols-7 gap-2 text-sm" role="row">
                        <div role="rowheader">Support</div>
                        <div className="h-8 bg-green-200 dark:bg-green-800 rounded flex items-center justify-center" role="cell">Bien</div>
                        <div className="h-8 bg-green-200 dark:bg-green-800 rounded flex items-center justify-center" role="cell">Bien</div>
                        <div className="h-8 bg-green-300 dark:bg-green-700 rounded flex items-center justify-center" role="cell">Très bien</div>
                        <div className="h-8 bg-yellow-200 dark:bg-yellow-800 rounded flex items-center justify-center" role="cell">Neutre</div>
                        <div className="h-8 bg-green-200 dark:bg-green-800 rounded flex items-center justify-center" role="cell">Bien</div>
                        <div className="h-8 bg-green-200 dark:bg-green-800 rounded flex items-center justify-center font-medium" role="cell">Positif</div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex items-center gap-4 text-sm" role="list" aria-label="Légende de la heatmap">
                      <div className="flex items-center gap-2" role="listitem">
                        <div className="w-4 h-4 bg-green-300 rounded" aria-hidden="true"></div>
                        <span>Très bien</span>
                      </div>
                      <div className="flex items-center gap-2" role="listitem">
                        <div className="w-4 h-4 bg-green-200 rounded" aria-hidden="true"></div>
                        <span>Bien</span>
                      </div>
                      <div className="flex items-center gap-2" role="listitem">
                        <div className="w-4 h-4 bg-yellow-200 rounded" aria-hidden="true"></div>
                        <span>Neutre</span>
                      </div>
                      <div className="flex items-center gap-2" role="listitem">
                        <div className="w-4 h-4 bg-orange-200 rounded" aria-hidden="true"></div>
                        <span>Stress</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ... keep existing code for other tabs ... */}
              <TabsContent value="trends" id="trends-panel" role="tabpanel" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Évolution des Indicateurs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-2">Utilisation des modules bien-être</h4>
                        <div className="space-y-2" role="list" aria-label="Statistiques d'utilisation des modules">
                          <div className="flex justify-between items-center" role="listitem">
                            <span className="text-sm">Flash Glow</span>
                            <span className="text-sm font-medium">287 sessions</span>
                          </div>
                          <div className="flex justify-between items-center" role="listitem">
                            <span className="text-sm">Musicothérapie</span>
                            <span className="text-sm font-medium">193 sessions</span>
                          </div>
                          <div className="flex justify-between items-center" role="listitem">
                            <span className="text-sm">Journal Vocal</span>
                            <span className="text-sm font-medium">156 sessions</span>
                          </div>
                          <div className="flex justify-between items-center" role="listitem">
                            <span className="text-sm">Scan Émotionnel</span>
                            <span className="text-sm font-medium">128 sessions</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activities" id="activities-panel" role="tabpanel" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Activités Récentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4" role="list" aria-label="Liste des activités récentes">
                      <div className="flex items-center gap-3 p-3 border rounded-lg" role="listitem">
                        <Heart className="h-5 w-5 text-red-500" aria-hidden="true" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Session Flash Glow collective</p>
                          <p className="text-xs text-muted-foreground">Équipe Développement - 15 participants</p>
                        </div>
                        <span className="text-xs text-muted-foreground">Il y a 2h</span>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 border rounded-lg" role="listitem">
                        <Activity className="h-5 w-5 text-blue-500" aria-hidden="true" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Pic d'utilisation Musicothérapie</p>
                          <p className="text-xs text-muted-foreground">+40% vs moyenne hebdomadaire</p>
                        </div>
                        <span className="text-xs text-muted-foreground">Hier</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="alerts" id="alerts-panel" role="tabpanel" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                      Recommandations Préventives
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4" role="list" aria-label="Liste des recommandations préventives">
                      <div className="p-4 bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800 rounded-lg" role="listitem">
                        <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">
                          ⚠️ Attention - Équipe Commercial
                        </h4>
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                          Niveau de stress légèrement élevé détecté cette semaine. 
                          Considérer l'organisation d'une session de groupe Flash Glow.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg" role="listitem">
                        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                          💡 Suggestion
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          L'équipe Support montre un excellent engagement. 
                          Partager leurs bonnes pratiques avec les autres équipes.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-lg" role="listitem">
                        <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                          ✅ Bonne nouvelle
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Amélioration générale du bien-être sur le dernier mois. 
                          Les initiatives mises en place portent leurs fruits.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="bg-card border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground gap-4">
            <p>© 2025 EmotionsCare - Plateforme RH conforme RGPD et anonymisée</p>
            <nav aria-label="Liens footer RH">
              <div className="flex space-x-4">
                <Link to="/privacy" className="hover:text-foreground">
                  Politique RGPD
                </Link>
                <Link to="/terms" className="hover:text-foreground">
                  Conditions RH
                </Link>
                <Link to="/help" className="hover:text-foreground">
                  Support Technique
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default B2BRHDashboard;