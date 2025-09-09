import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ROUTES_REGISTRY } from '@/routerV2/registry';
import { AlertTriangle, CheckCircle, XCircle, ExternalLink } from 'lucide-react';

interface RouteAuditResult {
  path: string;
  component: string;
  status: 'ok' | 'warning' | 'error';
  issues: string[];
  aliases?: string[];
  role?: string;
  guard?: boolean;
}

export default function RouterAuditReport() {
  const [auditResults, setAuditResults] = useState<RouteAuditResult[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);

  const runAudit = async () => {
    setIsAuditing(true);
    
    const results: RouteAuditResult[] = [];
    
    // Audit des composants mappés (importés dans routerV2/index.tsx)
    const expectedComponents = [
      'HomePage', 'HomeB2CPage', 'AboutPage', 'ContactPage', 'HelpPage', 'DemoPage',
      'OnboardingPage', 'LoginPage', 'SignupPage', 'AppGatePage', 'B2CDashboardPage',
      'B2BUserDashboardPage', 'B2BAdminDashboardPage', 'B2CScanPage', 'B2CMusicEnhanced',
      'B2CAICoachPage', 'B2CJournalPage', 'B2CVRBreathGuidePage', 'B2CVRGalaxyPage',
      'VRBreathPage', 'B2CFlashGlowPage', 'B2CBreathworkPage', 'B2CARFiltersPage',
      'B2CBubbleBeatPage', 'B2CScreenSilkBreakPage', 'B2CGamificationPage',
      'B2CWeeklyBarsPage', 'B2CHeatmapVibesPage', 'B2CSettingsPage', 'B2CProfileSettingsPage',
      'B2CPrivacyTogglesPage', 'B2CNotificationsPage', 'B2CDataPrivacyPage',
      'B2BTeamsPage', 'B2BSocialCoconPage', 'B2BReportsPage', 'B2BEventsPage',
      'B2BOptimisationPage', 'B2BSecurityPage', 'B2BAuditPage', 'B2BAccessibilityPage',
      'ApiMonitoringPage', 'B2CAmbitionArcadePage', 'B2CBossLevelGritPage',
      'B2CBounceBackBattlePage', 'B2CMoodMixerPage', 'B2CSocialCoconPage',
      'B2CStorySynthLabPage', 'B2CEmotionsPage', 'B2CCommunautePage',
      'B2BSelectionPage', 'B2CMusicTherapyPremiumPage', 'B2CAICoachMicroPage',
      'B2CActivitePage', 'B2BEntreprisePage', 'B2BCollabDashboard', 'B2BRHDashboard',
      'SubscribePage', 'B2CNyveeCoconPage', 'ValidationPage', 'LegalTermsPage',
      'LegalPrivacyPage', 'UnauthorizedPage', 'ForbiddenPage', 'NotFoundPage',
      'ServerErrorPage', 'RedirectToScan', 'RedirectToJournal', 'RedirectToSocialCocon',
      'RedirectToEntreprise'
    ];

    for (const route of ROUTES_REGISTRY) {
      const issues: string[] = [];
      let status: 'ok' | 'warning' | 'error' = 'ok';

      // Vérifier si le composant est mappé
      if (!expectedComponents.includes(route.component)) {
        issues.push(`Composant "${route.component}" non mappé dans routerV2/index.tsx`);
        status = 'error';
      }

      // Vérifier les routes dépréciées
      if (route.deprecated) {
        issues.push('Route marquée comme dépréciée');
        status = status === 'error' ? 'error' : 'warning';
      }

      // Vérifier les routes avec guard mais sans role
      if (route.guard && !route.role && !route.allowedRoles) {
        issues.push('Route protégée sans rôle spécifié');
        status = status === 'error' ? 'error' : 'warning';
      }

      // Vérifier les alias en double
      if (route.aliases) {
        const duplicateAliases = ROUTES_REGISTRY
          .filter(r => r !== route)
          .some(r => r.aliases?.some(alias => route.aliases?.includes(alias)));
        
        if (duplicateAliases) {
          issues.push('Alias en conflit avec d\'autres routes');
          status = status === 'error' ? 'error' : 'warning';
        }
      }

      results.push({
        path: route.path,
        component: route.component,
        status: issues.length === 0 ? 'ok' : status,
        issues,
        aliases: route.aliases,
        role: route.role,
        guard: route.guard
      });
    }

    setAuditResults(results);
    setIsAuditing(false);
  };

  useEffect(() => {
    runAudit();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;  
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const errorCount = auditResults.filter(r => r.status === 'error').length;
  const warningCount = auditResults.filter(r => r.status === 'warning').length;
  const okCount = auditResults.filter(r => r.status === 'ok').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Audit du Router</h1>
          <p className="text-muted-foreground">
            Vérification de l'intégrité de RouterV2 ({ROUTES_REGISTRY.length} routes)
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
              Routes OK
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{okCount}</div>
            <p className="text-sm text-muted-foreground">
              Routes sans problème
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Avertissements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{warningCount}</div>
            <p className="text-sm text-muted-foreground">
              Routes à surveiller
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Erreurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{errorCount}</div>
            <p className="text-sm text-muted-foreground">
              Routes à corriger
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerte globale */}
      {errorCount > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {errorCount} route(s) ont des erreurs critiques qui peuvent empêcher le bon fonctionnement de l'application.
          </AlertDescription>
        </Alert>
      )}

      {/* Liste des routes */}
      <Card>
        <CardHeader>
          <CardTitle>Détail des routes</CardTitle>
          <CardDescription>
            Liste complète des routes avec leur statut d'audit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {auditResults.map((result, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <code className="bg-muted px-2 py-1 rounded text-sm">
                      {result.path}
                    </code>
                    {result.guard && (
                      <Badge variant="outline" className="text-xs">
                        🔒 Protégée
                      </Badge>
                    )}
                    {result.role && (
                      <Badge variant="secondary" className="text-xs">
                        {result.role}
                      </Badge>
                    )}
                  </div>
                  <Badge className={`text-xs ${getStatusColor(result.status)}`}>
                    {result.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="text-sm text-muted-foreground">
                  Composant: <code>{result.component}</code>
                </div>

                {result.aliases && result.aliases.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Alias: {result.aliases.map(alias => (
                      <code key={alias} className="bg-muted px-1 rounded mr-1">
                        {alias}
                      </code>
                    ))}
                  </div>
                )}

                {result.issues.length > 0 && (
                  <div className="space-y-1">
                    {result.issues.map((issue, issueIndex) => (
                      <div key={issueIndex} className="text-sm text-red-600 flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
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

      {/* Routes spéciales */}
      <Card>
        <CardHeader>
          <CardTitle>Routes spéciales détectées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Routes dépréciées</h4>
              <div className="space-y-1">
                {auditResults
                  .filter(r => r.issues.some(i => i.includes('dépréciée')))
                  .map(r => (
                    <code key={r.path} className="text-xs bg-yellow-100 px-2 py-1 rounded block">
                      {r.path}
                    </code>
                  ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Redirections</h4>
              <div className="space-y-1">
                {auditResults
                  .filter(r => r.component.startsWith('RedirectTo'))
                  .map(r => (
                    <code key={r.path} className="text-xs bg-blue-100 px-2 py-1 rounded block">
                      {r.path} → {r.component}
                    </code>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}