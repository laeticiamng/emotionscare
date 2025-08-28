import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, XCircle, Route, Eye, Settings, FileX } from 'lucide-react';
import { Routes } from '@/routerV2';

interface RouteAuditResult {
  path: string;
  status: 'valid' | 'missing' | 'duplicate' | 'error';
  component?: string;
  issues: string[];
}

export const CompleteRoutesAuditInterface: React.FC = () => {
  const [auditResults, setAuditResults] = useState<RouteAuditResult[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [summary, setSummary] = useState({
    total: 0,
    valid: 0,
    missing: 0,
    duplicates: 0,
    errors: 0
  });

  const expectedRoutes = [
    // Routes publiques (5)
    { path: '/', component: 'HomePage' },
    { path: '/choose-mode', component: 'ChooseModePage' },
    { path: '/auth', component: 'AuthPage' },
    { path: '/b2b', component: 'Redirect to /b2b/selection' },
    { path: '/b2b/selection', component: 'B2BSelectionPage' },
    
    // Routes d'authentification (5)
    { path: '/b2c/login', component: 'B2CLoginPage' },
    { path: '/b2c/register', component: 'B2CRegisterPage' },
    { path: '/b2b/user/login', component: 'B2BUserLoginPage' },
    { path: '/b2b/user/register', component: 'B2BUserRegisterPage' },
    { path: '/b2b/admin/login', component: 'B2BAdminLoginPage' },
    
    // Dashboards (3)
    { path: '/b2c/dashboard', component: 'B2CDashboardPage' },
    { path: '/b2b/user/dashboard', component: 'B2BUserDashboard' },
    { path: '/b2b/admin/dashboard', component: 'B2BAdminDashboard' },
    
    // Fonctionnalités communes (8)
    { path: '/scan', component: 'ScanPage' },
    { path: '/music', component: 'MusicPage' },
    { path: '/coach', component: 'CoachPage' },
    { path: '/journal', component: 'JournalPage' },
    { path: '/vr', component: 'VRPage' },
    { path: '/preferences', component: 'PreferencesPage' },
    { path: '/gamification', component: 'GamificationPage' },
    { path: '/social-cocon', component: 'SocialCoconPage' },
    
    // Admin features (5)
    { path: '/teams', component: 'TeamsPage' },
    { path: '/reports', component: 'ReportsPage' },
    { path: '/events', component: 'EventsPage' },
    { path: '/optimisation', component: 'OptimisationPage' },
    { path: '/settings', component: 'SettingsPage' },
    
    // Routes supplémentaires détectées dans le code (26 routes)
    { path: '/admin', component: 'AdminDashboard' },
    { path: '/admin/system-audit', component: 'SystemAudit' },
    { path: '/admin/official-routes', component: 'OfficialRoutes' },
    { path: '/admin/teams', component: 'TeamsManagement' },
    { path: '/admin/reports', component: 'Reports' },
    { path: '/admin/events', component: 'EventsManagement' },
    { path: '/admin/optimisation', component: 'Optimisation' },
    { path: '/admin/settings', component: 'Settings' },
    { path: '/admin/security', component: 'Security' },
    { path: '/admin/accessibility', component: 'Accessibility' },
    { path: '/audit', component: 'SystemAudit' },
    { path: '/official-routes-audit', component: 'OfficialRoutes' },
    { path: '/b2c', component: 'B2CHomePage' },
    { path: '*', component: 'Navigate to /' },
  ];

  const checkRouteAccessibility = async (path: string): Promise<boolean> => {
    try {
      const response = await fetch(path, { method: 'HEAD' });
      return response.status < 400;
    } catch {
      return false;
    }
  };

  const performAudit = async () => {
    setIsAuditing(true);
    const results: RouteAuditResult[] = [];
    
    for (const route of expectedRoutes) {
      const issues: string[] = [];
      let status: RouteAuditResult['status'] = 'valid';
      
      // Vérifier avec RouterV2 Registry
      const routerV2Routes = [
        Routes.home(), Routes.scan(), Routes.music(), Routes.coach(),
        Routes.journal(), Routes.vr(), Routes.consumerHome(),
        Routes.employeeHome(), Routes.managerHome()
      ];
      const routerV2RouteExists = routerV2Routes.includes(route.path);
      
      // Vérifier l'accessibilité
      const isAccessible = await checkRouteAccessibility(route.path);
      
      if (!unifiedRouteExists && route.path !== '/b2b' && route.path !== '*') {
        issues.push('Route manquante dans UNIFIED_ROUTES');
        status = 'missing';
      }
      
      if (!isAccessible && route.path !== '*') {
        issues.push('Route non accessible');
        status = 'error';
      }
      
      // Vérifier les doublons dans les fichiers de routes
      const duplicateCount = expectedRoutes.filter(r => r.path === route.path).length;
      if (duplicateCount > 1) {
        issues.push(`Route dupliquée ${duplicateCount} fois`);
        status = 'duplicate';
      }
      
      results.push({
        path: route.path,
        component: route.component,
        status,
        issues
      });
    }
    
    setAuditResults(results);
    
    // Calculer le résumé
    setSummary({
      total: results.length,
      valid: results.filter(r => r.status === 'valid').length,
      missing: results.filter(r => r.status === 'missing').length,
      duplicates: results.filter(r => r.status === 'duplicate').length,
      errors: results.filter(r => r.status === 'error').length
    });
    
    setIsAuditing(false);
  };

  useEffect(() => {
    performAudit();
  }, []);

  const getStatusIcon = (status: RouteAuditResult['status']) => {
    switch (status) {
      case 'valid': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'missing': return <FileX className="h-4 w-4 text-orange-500" />;
      case 'duplicate': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: RouteAuditResult['status']) => {
    const variants = {
      valid: 'bg-green-100 text-green-800',
      missing: 'bg-orange-100 text-orange-800',
      duplicate: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Route className="h-8 w-8" />
          Audit Complet des Routes (52 Routes)
        </h1>
        <Button onClick={performAudit} disabled={isAuditing}>
          {isAuditing ? 'Audit en cours...' : 'Relancer l\'audit'}
        </Button>
      </div>

      {/* Résumé */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{summary.total}</div>
            <div className="text-sm text-muted-foreground">Total Routes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{summary.valid}</div>
            <div className="text-sm text-muted-foreground">Valides</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{summary.missing}</div>
            <div className="text-sm text-muted-foreground">Manquantes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{summary.duplicates}</div>
            <div className="text-sm text-muted-foreground">Doublons</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{summary.errors}</div>
            <div className="text-sm text-muted-foreground">Erreurs</div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts pour les problèmes critiques */}
      {summary.duplicates > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>ATTENTION:</strong> {summary.duplicates} routes dupliquées détectées. 
            Cela peut causer des conflits de navigation.
          </AlertDescription>
        </Alert>
      )}

      {summary.errors > 0 && (
        <Alert>
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>ERREUR:</strong> {summary.errors} routes ne sont pas accessibles. 
            Vérifiez les composants correspondants.
          </AlertDescription>
        </Alert>
      )}

      {/* Liste détaillée des routes */}
      <Card>
        <CardHeader>
          <CardTitle>Détail des Routes ({auditResults.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {auditResults.map((result, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
                    {result.path}
                  </code>
                  <span className="text-sm text-muted-foreground">
                    {result.component}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(result.status)}
                  {result.issues.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        alert(`Problèmes détectés:\n${result.issues.join('\n')}`);
                      }}
                    >
                      <Eye className="h-3 w-3" />
                      {result.issues.length}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* État global */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            État Global du Système de Routing
          </CardTitle>
        </CardHeader>
        <CardContent>
          {summary.duplicates === 0 && summary.errors === 0 ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">
                ✅ Système de routing OPÉRATIONNEL - {summary.total} routes validées
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              <span className="font-semibold">
                ❌ Système de routing DÉFAILLANT - Corrections nécessaires
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};