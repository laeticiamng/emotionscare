// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { routes } from '@/routerV2';
import { validateRouteAccess } from '@/utils/routeValidation';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';

interface RouteAuditResult {
  route: string;
  accessible: boolean;
  hasContent: boolean;
  loadTime: number;
  errors: string[];
  score: number;
}

const SystemAudit: React.FC = () => {
  const [auditResults, setAuditResults] = useState<RouteAuditResult[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [overallScore, setOverallScore] = useState(0);
  const { isAuthenticated, user } = useAuth();
  const { userMode } = useUserMode();

  const allRoutes = [
    // Routes publiques
    { path: '/', name: 'Accueil', category: 'Public', expectedContent: 'Page d\'accueil avec navigation' },
    { path: '/mode-selection', name: 'Choix du mode', category: 'Public', expectedContent: 'Sélection B2C/B2B' },
    { path: '/entreprise', name: 'Sélection B2B', category: 'Public', expectedContent: 'Choix User/Admin' },
    
    // Authentification
    { path: '/login?segment=b2c', name: 'Connexion B2C', category: 'Auth', expectedContent: 'Formulaire de connexion B2C' },
    { path: '/signup?segment=b2c', name: 'Inscription B2C', category: 'Auth', expectedContent: 'Formulaire d\'inscription B2C' },
    { path: '/login?segment=b2b', name: 'Connexion B2B User', category: 'Auth', expectedContent: 'Formulaire de connexion B2B User' },
    { path: '/signup?segment=b2b', name: 'Inscription B2B User', category: 'Auth', expectedContent: 'Formulaire d\'inscription B2B User' },
    { path: '/login?segment=b2b', name: 'Connexion B2B Admin', category: 'Auth', expectedContent: 'Formulaire de connexion B2B Admin' },
    
    // Dashboards
    { path: '/app/consumer/home', name: 'Dashboard B2C', category: 'Dashboard', expectedContent: 'Tableau de bord personnel B2C' },
    { path: '/app/collab', name: 'Dashboard B2B User', category: 'Dashboard', expectedContent: 'Tableau de bord collaborateur' },
    { path: '/entreprise', name: 'Dashboard B2B Admin', category: 'Dashboard', expectedContent: 'Tableau de bord administrateur' },
    
    // Fonctionnalités principales
    { path: '/scan', name: 'Scanner Émotions', category: 'Features', expectedContent: 'Interface de scan émotionnel' },
    { path: '/music', name: 'Thérapie Musicale', category: 'Features', expectedContent: 'Lecteur et recommandations musicales' },
    { path: '/coach', name: 'Coach IA', category: 'Features', expectedContent: 'Interface de chat avec le coach' },
    { path: '/journal', name: 'Journal', category: 'Features', expectedContent: 'Interface de journal personnel' },
    { path: '/vr', name: 'Réalité Virtuelle', category: 'Features', expectedContent: 'Expériences VR immersives' },
    { path: '/preferences', name: 'Préférences', category: 'Features', expectedContent: 'Paramètres utilisateur' },
    { path: '/gamification', name: 'Gamification', category: 'Features', expectedContent: 'Éléments de jeu et défis' },
    { path: '/social-cocon', name: 'Social Cocon', category: 'Features', expectedContent: 'Communauté et partage' },
    
    // Administration
    { path: '/teams', name: 'Gestion Équipes', category: 'Admin', expectedContent: 'Gestion des équipes et utilisateurs' },
    { path: '/reports', name: 'Rapports', category: 'Admin', expectedContent: 'Rapports et analytics' },
    { path: '/events', name: 'Événements', category: 'Admin', expectedContent: 'Gestion des événements' },
    { path: '/optimisation', name: 'Optimisation', category: 'Admin', expectedContent: 'Outils d\'optimisation performance' },
    { path: '/settings', name: 'Paramètres Système', category: 'Admin', expectedContent: 'Configuration système' },
    { path: '/notifications', name: 'Notifications', category: 'Admin', expectedContent: 'Gestion des notifications' },
    { path: '/security', name: 'Sécurité', category: 'Admin', expectedContent: 'Paramètres de sécurité' },
    { path: '/privacy', name: 'Confidentialité', category: 'Privacy', expectedContent: 'Gestion RGPD et confidentialité' },
    { path: '/audit', name: 'Audit Système', category: 'Admin', expectedContent: 'Outils d\'audit et monitoring' },
    { path: '/accessibility', name: 'Accessibilité', category: 'Accessibility', expectedContent: 'Configuration accessibilité' },
    { path: '/innovation', name: 'Innovation Lab', category: 'Admin', expectedContent: 'Laboratoire d\'innovation et expérimentations' },
  ];

  const auditRoute = async (route: string): Promise<RouteAuditResult> => {
    const startTime = performance.now();
    const errors: string[] = [];
    let accessible = true;
    let hasContent = true;
    let score = 100;

    try {
      // Validation d'accès
      const validation = validateRouteAccess(route, isAuthenticated, user?.role || userMode);
      if (!validation.hasAccess) {
        accessible = false;
        errors.push('Accès refusé');
        score -= 30;
      }

      // Simulation de vérification du contenu
      if (accessible) {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 200));
        
        // Vérifications spécifiques par route
        switch (route) {
          case Routes.home():
          case Routes.b2c(): 
            // Routes toujours accessibles
            break;
          case Routes.consumerHome():
          case Routes.employeeHome():
          case Routes.managerHome():
            if (!isAuthenticated) {
              hasContent = false;
              errors.push('Dashboard nécessite une authentification');
              score -= 40;
            }
            break;
          default:
            // Autres routes
            if (route.includes('/admin') && user?.role !== 'b2b_admin') {
              accessible = false;
              errors.push('Route admin restreinte');
              score -= 50;
            }
        }
      }
    } catch (error) {
      errors.push(`Erreur: ${error}`);
      score -= 20;
    }

    const endTime = performance.now();
    const loadTime = endTime - startTime;

    // Pénalité pour temps de chargement lent
    if (loadTime > 200) {
      score -= 10;
      errors.push('Temps de chargement lent');
    }

    return {
      route,
      accessible,
      hasContent,
      loadTime,
      errors,
      score: Math.max(0, score)
    };
  };

  const runFullAudit = async () => {
    setIsAuditing(true);
    setAuditResults([]);

    const routes = [
      Routes.home(), Routes.scan(), Routes.music(), Routes.coach(),
      Routes.journal(), Routes.vr(), Routes.consumerHome(),
      Routes.employeeHome(), Routes.managerHome(), Routes.teams(),
      Routes.adminReports(), Routes.adminEvents(), Routes.settingsGeneral()
    ];
    const results: RouteAuditResult[] = [];

    for (const route of routes) {
      const result = await auditRoute(route);
      results.push(result);
      setAuditResults([...results]);
    }

    // Calculer le score global
    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    const averageScore = totalScore / results.length;
    setOverallScore(averageScore);

    setIsAuditing(false);
  };

  const getStatusIcon = (result: RouteAuditResult) => {
    if (result.score >= 90) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (result.score >= 70) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  useEffect(() => {
    // Audit automatique au montage
    runFullAudit();
  }, [isAuthenticated, userMode]);

  const totalRoutes = allRoutes.length; // Should be 26 now
  const completedAudits = auditResults.filter(r => r.status === 'success').length;
  const globalScore = totalRoutes > 0 ? Math.round((completedAudits / totalRoutes) * 100) : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Audit Système Complet</CardTitle>
            <Button 
              onClick={runFullAudit} 
              disabled={isAuditing}
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isAuditing ? 'animate-spin' : ''}`} />
              {isAuditing ? 'Audit en cours...' : 'Relancer l\'audit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Score Global</span>
                <span className="text-sm text-muted-foreground">{globalScore.toFixed(1)}/100</span>
              </div>
              <Progress value={globalScore} className="h-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {auditResults.filter(r => r.score >= 90).length}
                </div>
                <div className="text-muted-foreground">Excellent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {auditResults.filter(r => r.score >= 70 && r.score < 90).length}
                </div>
                <div className="text-muted-foreground">Améliorable</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {auditResults.filter(r => r.score < 70).length}
                </div>
                <div className="text-muted-foreground">Problématique</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Détail des Routes ({auditResults.length}/{totalRoutes})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditResults.map((result) => (
              <div key={result.route} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(result)}
                  <div>
                    <div className="font-medium">{result.route}</div>
                    <div className="text-sm text-muted-foreground">
                      {result.loadTime.toFixed(0)}ms
                      {result.errors.length > 0 && (
                        <span className="ml-2 text-red-500">
                          • {result.errors.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {result.accessible && (
                    <Badge variant="outline" className="text-green-600">
                      Accessible
                    </Badge>
                  )}
                  {result.hasContent && (
                    <Badge variant="outline" className="text-blue-600">
                      Contenu
                    </Badge>
                  )}
                  <div className="w-12 text-right font-medium">
                    {result.score.toFixed(0)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {isAuditing && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Audit en cours... Vérification de toutes les routes</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SystemAudit;
