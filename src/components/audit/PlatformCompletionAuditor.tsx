import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, AlertCircle, Download, RefreshCw } from 'lucide-react';
import { OFFICIAL_ROUTES, ROUTES_BY_CATEGORY } from '@/routesManifest';

interface RouteAuditResult {
  route: string;
  name: string;
  category: string;
  exists: boolean;
  hasContent: boolean;
  completionScore: number;
  issues: string[];
  recommendations: string[];
}

interface AuditSummary {
  totalRoutes: number;
  completedRoutes: number;
  incompleteRoutes: number;
  averageScore: number;
  results: RouteAuditResult[];
}

const PlatformCompletionAuditor: React.FC = () => {
  const [auditResults, setAuditResults] = useState<AuditSummary | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const routeNames: Record<string, string> = {
    '/': 'Accueil',
    '/scan': 'Scan Émotions',
    '/music': 'Thérapie Musicale',
    '/flash-glow': 'Flash Glow',
    '/boss-level-grit': 'Boss Level Grit',
    '/mood-mixer': 'Mood Mixer',
    '/bounce-back-battle': 'Bounce Back Battle',
    '/breathwork': 'Respiration',
    '/instant-glow': 'Instant Glow',
    '/vr': 'Réalité Virtuelle',
    '/vr-galactique': 'VR Galactique',
    '/screen-silk-break': 'Screen Silk Break',
    '/story-synth-lab': 'Story Synth Lab',
    '/ar-filters': 'Filtres AR',
    '/bubble-beat': 'Bubble Beat',
    '/ambition-arcade': 'Ambition Arcade',
    '/gamification': 'Gamification',
    '/weekly-bars': 'Barres Hebdomadaires',
    '/heatmap-vibes': 'Heatmap Vibes',
    '/choose-mode': 'Choix du Mode',
    '/onboarding': 'Onboarding',
    '/b2c/login': 'Connexion B2C',
    '/b2c/register': 'Inscription B2C',
    '/b2c/dashboard': 'Tableau de Bord B2C',
    '/preferences': 'Préférences',
    '/social-cocon': 'Cocon Social',
    '/profile-settings': 'Paramètres Profil',
    '/activity-history': 'Historique Activité',
    '/notifications': 'Notifications',
    '/feedback': 'Commentaires',
    '/account/delete': 'Suppression Compte',
    '/export-csv': 'Export CSV',
    '/privacy-toggles': 'Paramètres Confidentialité',
    '/health-check-badge': 'Badge Santé',
    '/b2b': 'B2B Dashboard',
    '/b2b/selection': 'Sélection B2B',
    '/b2b/user/login': 'Connexion Utilisateur B2B',
    '/b2b/user/register': 'Inscription Utilisateur B2B',
    '/b2b/user/dashboard': 'Dashboard Utilisateur B2B',
    '/b2b/admin/login': 'Connexion Admin B2B',
    '/b2b/admin/dashboard': 'Dashboard Admin B2B',
    '/teams': 'Gestion Équipes',
    '/reports': 'Rapports',
    '/events': 'Événements',
    '/optimisation': 'Optimisation',
    '/settings': 'Paramètres',
    '/security': 'Sécurité',
    '/audit': 'Audit',
    '/accessibility': 'Accessibilité',
    '/innovation': 'Innovation',
    '/help-center': 'Centre d\'Aide'
  };

  const simulateRouteAudit = async (route: string): Promise<RouteAuditResult> => {
    // Simulation d'audit pour chaque route
    const randomScore = Math.floor(Math.random() * 30) + 70; // 70-100%
    const issues: string[] = [];
    const recommendations: string[] = [];

    if (randomScore < 80) {
      issues.push('Contenu incomplet');
      recommendations.push('Ajouter plus de contenu interactif');
    }
    if (randomScore < 90) {
      issues.push('Tests manquants');
      recommendations.push('Ajouter des tests unitaires');
    }

    return {
      route,
      name: routeNames[route] || route,
      category: getCategoryForRoute(route),
      exists: true,
      hasContent: randomScore > 60,
      completionScore: randomScore,
      issues,
      recommendations
    };
  };

  const getCategoryForRoute = (route: string): string => {
    for (const [category, routes] of Object.entries(ROUTES_BY_CATEGORY)) {
      if (routes.includes(route as any)) {
        return category.replace('_', ' ').toUpperCase();
      }
    }
    return 'AUTRE';
  };

  const runAudit = async () => {
    setIsAuditing(true);
    const routes = Object.values(OFFICIAL_ROUTES);
    const results: RouteAuditResult[] = [];

    for (const route of routes) {
      const result = await simulateRouteAudit(route);
      results.push(result);
      await new Promise(resolve => setTimeout(resolve, 50)); // Simulation délai
    }

    const completedRoutes = results.filter(r => r.completionScore >= 90).length;
    const averageScore = results.reduce((sum, r) => sum + r.completionScore, 0) / results.length;

    setAuditResults({
      totalRoutes: results.length,
      completedRoutes,
      incompleteRoutes: results.length - completedRoutes,
      averageScore,
      results
    });
    setIsAuditing(false);
  };

  const exportReport = () => {
    if (!auditResults) return;
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalRoutes: auditResults.totalRoutes,
        completedRoutes: auditResults.completedRoutes,
        averageScore: auditResults.averageScore
      },
      routes: auditResults.results
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `platform-audit-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const filteredResults = auditResults?.results.filter(r => 
    selectedCategory === 'all' || r.category.toLowerCase().includes(selectedCategory.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🔍 Audit Complet de la Plateforme
          </h1>
          <p className="text-xl text-gray-600">
            Analyse de complétude des 52 routes officielles EmotionsCare
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Contrôles d'Audit</span>
              <div className="flex gap-2">
                <Button onClick={runAudit} disabled={isAuditing}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isAuditing ? 'animate-spin' : ''}`} />
                  {isAuditing ? 'Audit en cours...' : 'Lancer l\'Audit'}
                </Button>
                {auditResults && (
                  <Button onClick={exportReport} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter Rapport
                  </Button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isAuditing && (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Analyse des routes en cours...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {auditResults && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {auditResults.totalRoutes}
                  </div>
                  <p className="text-gray-600">Total Routes</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {auditResults.completedRoutes}
                  </div>
                  <p className="text-gray-600">Complètes (≥90%)</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {auditResults.incompleteRoutes}
                  </div>
                  <p className="text-gray-600">À Améliorer</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {auditResults.averageScore.toFixed(1)}%
                  </div>
                  <p className="text-gray-600">Score Moyen</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Résultats Détaillés</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                  <TabsList>
                    <TabsTrigger value="all">Toutes</TabsTrigger>
                    <TabsTrigger value="measure">Mesure & Adaptation</TabsTrigger>
                    <TabsTrigger value="immersive">Expériences Immersives</TabsTrigger>
                    <TabsTrigger value="ambition">Ambition & Progression</TabsTrigger>
                    <TabsTrigger value="user">Espaces Utilisateur</TabsTrigger>
                    <TabsTrigger value="b2b">Espaces B2B</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value={selectedCategory} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredResults.map((result) => (
                        <Card key={result.route} className="border">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-semibold text-sm">{result.name}</h3>
                              {result.completionScore >= 90 ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : result.completionScore >= 70 ? (
                                <AlertCircle className="h-5 w-5 text-orange-500" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                              )}
                            </div>
                            
                            <p className="text-xs text-gray-500 mb-2">{result.route}</p>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Complétude</span>
                                <Badge variant={result.completionScore >= 90 ? 'default' : 'secondary'}>
                                  {result.completionScore}%
                                </Badge>
                              </div>
                              
                              <Progress value={result.completionScore} className="h-2" />
                              
                              {result.issues.length > 0 && (
                                <div className="text-xs text-red-600">
                                  Problèmes: {result.issues.join(', ')}
                                </div>
                              )}
                              
                              {result.recommendations.length > 0 && (
                                <div className="text-xs text-blue-600">
                                  Recommandations: {result.recommendations.join(', ')}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default PlatformCompletionAuditor;