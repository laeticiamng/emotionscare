import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ROUTES_REGISTRY } from '@/routerV2/registry';
import { AlertTriangle, CheckCircle, XCircle, FileX, File, Folder } from 'lucide-react';

interface ComponentAuditResult {
  component: string;
  routes: string[];
  status: 'exists' | 'missing' | 'unknown';
  expectedPath: string;
  issues: string[];
}

export default function ComponentVerificationAudit() {
  const [auditResults, setAuditResults] = useState<ComponentAuditResult[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);

  // Liste des pages existantes (basée sur le listing des fichiers)
  const existingPages = [
    'HomePage', 'AboutPage', 'ContactPage', 'HelpPage', 'DemoPage', 'OnboardingPage',
    'SimpleLogin', 'SignupPage', 'HomeB2CPage', 'AppGatePage',
    'B2CDashboardPage', 'B2BUserDashboardPage', 'B2BAdminDashboardPage', 'B2BCollabDashboard', 'B2BRHDashboard',
    'B2CScanPage', 'B2CMusicEnhanced', 'B2CAICoachPage', 'B2CJournalPage',
    'B2CVRBreathGuidePage', 'B2CVRGalaxyPage', 'VRBreathPage',
    'B2CFlashGlowPage', 'B2CBreathworkPage', 'B2CARFiltersPage', 'B2CBubbleBeatPage', 'B2CScreenSilkBreakPage',
    'B2CGamificationPage', 'B2CWeeklyBarsPage', 'B2CHeatmapVibesPage',
    'B2CSettingsPage', 'B2CProfileSettingsPage', 'B2CPrivacyTogglesPage', 'B2CNotificationsPage', 'B2CDataPrivacyPage',
    'B2BTeamsPage', 'B2BSocialCoconPage', 'B2BReportsPage', 'B2BEventsPage',
    'B2BOptimisationPage', 'B2BSecurityPage', 'B2BAuditPage', 'B2BAccessibilityPage',
    'ApiMonitoringPage', 'B2CAmbitionArcadePage', 'B2CBossLevelGritPage', 'B2CBounceBackBattlePage',
    'B2CMoodMixerPage', 'B2CSocialCoconPage', 'B2CStorySynthLabPage', 'B2CEmotionsPage', 'B2CCommunautePage',
    'B2BSelectionPage', 'B2CMusicTherapyPremiumPage', 'B2CAICoachMicroPage', 'B2CActivitePage',
    'B2BEntreprisePage', 'B2CNyveeCoconPage', 'ValidationPage', 'SubscribePage',
    'LegalTermsPage', 'LegalPrivacyPage', 'UnauthorizedPage', 'ForbiddenPage', 'NotFoundPage', 'ServerErrorPage',
    'MessagesPage', 'CalendarPage', 'Point20Page', 'TestPage', 'JournalPage', 'MusicPage', 'EmotionsPage',
    'ProfilePage', 'GeneralPage', 'PrivacyPage', 'ChooseModePage', 'CoachChatPage', 'VRSessionsPage',
    'JournalNewPage', 'ReportingPage', 'ExportPage', 'NavigationPage', 'LeaderboardPage', 'GamificationPage',
    'HeatmapPage', 'RouterAuditPage'
  ];

  // Composants de redirection (à vérifier séparément)
  const redirectComponents = [
    'RedirectToScan', 'RedirectToJournal', 'RedirectToSocialCocon', 'RedirectToEntreprise'
  ];

  const runAudit = async () => {
    setIsAuditing(true);
    
    // Obtenir la liste unique des composants utilisés dans le registry
    const uniqueComponents = Array.from(
      new Set(ROUTES_REGISTRY.map(route => route.component))
    );

    const results: ComponentAuditResult[] = [];
    
    for (const component of uniqueComponents) {
      const routes = ROUTES_REGISTRY
        .filter(route => route.component === component)
        .map(route => route.path);

      let status: 'exists' | 'missing' | 'unknown' = 'unknown';
      const issues: string[] = [];
      let expectedPath = '';

      if (component === 'LoginPage') {
        // LoginPage est mappé vers SimpleLogin
        expectedPath = 'src/pages/SimpleLogin.tsx';
        status = existingPages.includes('SimpleLogin') ? 'exists' : 'missing';
        if (status === 'missing') {
          issues.push('SimpleLogin.tsx manquant (mappé depuis LoginPage)');
        }
      } else if (redirectComponents.includes(component)) {
        expectedPath = `src/components/redirects/${component}.tsx`;
        // Les composants de redirection seront vérifiés séparément
        status = 'unknown';
        issues.push('Composant de redirection - vérification manuelle requise');
      } else {
        expectedPath = `src/pages/${component}.tsx`;
        status = existingPages.includes(component) ? 'exists' : 'missing';
        
        if (status === 'missing') {
          issues.push(`Fichier ${component}.tsx manquant dans src/pages/`);
        }
      }

      // Vérifications supplémentaires
      if (routes.length > 5) {
        issues.push(`Composant utilisé par ${routes.length} routes (peut-être trop générique)`);
      }

      if (component.includes('B2C') && routes.some(r => r.includes('b2b'))) {
        issues.push('Composant B2C utilisé pour des routes B2B');
      }

      if (component.includes('B2B') && routes.some(r => r.includes('b2c'))) {
        issues.push('Composant B2B utilisé pour des routes B2C');
      }

      results.push({
        component,
        routes,
        status,
        expectedPath,
        issues
      });
    }

    // Trier par statut (erreurs en premier)
    results.sort((a, b) => {
      if (a.status === 'missing' && b.status !== 'missing') return -1;
      if (b.status === 'missing' && a.status !== 'missing') return 1;
      if (a.status === 'unknown' && b.status === 'exists') return -1;
      if (b.status === 'unknown' && a.status === 'exists') return 1;
      return a.component.localeCompare(b.component);
    });

    setAuditResults(results);
    setIsAuditing(false);
  };

  useEffect(() => {
    runAudit();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'exists': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'missing': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'unknown': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'exists': return 'bg-green-100 text-green-800';
      case 'missing': return 'bg-red-100 text-red-800';
      case 'unknown': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const missingCount = auditResults.filter(r => r.status === 'missing').length;
  const unknownCount = auditResults.filter(r => r.status === 'unknown').length;
  const existsCount = auditResults.filter(r => r.status === 'exists').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Audit des Composants Router</h1>
          <p className="text-muted-foreground">
            Vérification de l'existence des composants référencés dans RouterV2
          </p>
        </div>
        <Button onClick={runAudit} disabled={isAuditing}>
          {isAuditing ? 'Audit en cours...' : 'Relancer l\'audit'}
        </Button>
      </div>

      {/* Résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Composants Trouvés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{existsCount}</div>
            <p className="text-sm text-muted-foreground">
              Fichiers existants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              À Vérifier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{unknownCount}</div>
            <p className="text-sm text-muted-foreground">
              Statut incertain
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Manquants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{missingCount}</div>
            <p className="text-sm text-muted-foreground">
              Fichiers introuvables
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerte globale */}
      {missingCount > 0 && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            {missingCount} composant(s) manquent ! Ces routes ne fonctionneront pas correctement.
          </AlertDescription>
        </Alert>
      )}

      {/* Liste des composants */}
      <Card>
        <CardHeader>
          <CardTitle>Détail des composants ({auditResults.length})</CardTitle>
          <CardDescription>
            Liste complète des composants référencés dans le registry
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {auditResults.map((result, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <h4 className="font-medium">{result.component}</h4>
                      <code className="text-xs text-muted-foreground">
                        {result.expectedPath}
                      </code>
                    </div>
                  </div>
                  <Badge className={`text-xs ${getStatusColor(result.status)}`}>
                    {result.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="text-sm">
                  <span className="text-muted-foreground">Utilisé par {result.routes.length} route(s): </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {result.routes.map(route => (
                      <code key={route} className="bg-muted px-2 py-1 rounded text-xs">
                        {route}
                      </code>
                    ))}
                  </div>
                </div>

                {result.issues.length > 0 && (
                  <div className="space-y-1">
                    {result.issues.map((issue, issueIndex) => (
                      <div key={issueIndex} className="text-sm text-red-600 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {issue}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Composants par type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Pages B2C</span>
                <span>{auditResults.filter(r => r.component.includes('B2C')).length}</span>
              </div>
              <div className="flex justify-between">
                <span>Pages B2B</span>
                <span>{auditResults.filter(r => r.component.includes('B2B')).length}</span>
              </div>
              <div className="flex justify-between">
                <span>Pages publiques</span>
                <span>{auditResults.filter(r => !r.component.includes('B2C') && !r.component.includes('B2B')).length}</span>
              </div>
              <div className="flex justify-between">
                <span>Redirections</span>
                <span>{auditResults.filter(r => r.component.includes('Redirect')).length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions recommandées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {missingCount > 0 && (
                <p className="text-red-600">
                  • Créer les {missingCount} composants manquants
                </p>
              )}
              {unknownCount > 0 && (
                <p className="text-yellow-600">
                  • Vérifier manuellement {unknownCount} composants
                </p>
              )}
              <p className="text-blue-600">
                • Vérifier les composants de redirection dans src/components/redirects/
              </p>
              <p className="text-blue-600">
                • Valider que tous les imports lazy sont corrects
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}