import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { routes } from '@/routerV2';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ImportTest {
  name: string;
  status: 'success' | 'error' | 'loading';
  error?: string;
}

interface RouteTest {
  path: string;
  name: string;
  accessible: boolean;
  reason?: string;
}

const AccessDiagnostic: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading, session } = useAuth();
  const { userMode, isLoading: modeLoading } = useUserMode();
  const navigate = useNavigate();
  const [imports, setImports] = useState<ImportTest[]>([]);
  const [routeTests, setRouteTests] = useState<RouteTest[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Test des imports critiques
  const testImports = async () => {
    const tests: ImportTest[] = [
      { name: 'AuthContext', status: 'loading' },
      { name: 'UserModeContext', status: 'loading' },
      { name: 'MusicContext', status: 'loading' },
      { name: 'Routes', status: 'loading' },
      { name: 'Supabase Client', status: 'loading' },
    ];

    setImports([...tests]);

    // Test AuthContext
    try {
      if (typeof useAuth === 'function') {
        tests[0].status = 'success';
      } else {
        tests[0] = { name: 'AuthContext', status: 'error', error: 'Hook non disponible' };
      }
    } catch (error) {
      tests[0] = { name: 'AuthContext', status: 'error', error: String(error) };
    }

    // Test UserModeContext
    try {
      if (typeof useUserMode === 'function') {
        tests[1].status = 'success';
      } else {
        tests[1] = { name: 'UserModeContext', status: 'error', error: 'Hook non disponible' };
      }
    } catch (error) {
      tests[1] = { name: 'UserModeContext', status: 'error', error: String(error) };
    }

    // Test MusicContext
    try {
      const { useMusic } = await import('@/contexts/MusicContext');
      if (typeof useMusic === 'function') {
        tests[2].status = 'success';
      } else {
        tests[2] = { name: 'MusicContext', status: 'error', error: 'Hook non disponible' };
      }
    } catch (error) {
      tests[2] = { name: 'MusicContext', status: 'error', error: String(error) };
    }

    // Test Routes
    try {
      if (routes && typeof routes.public.home === 'function') {
        tests[3].status = 'success';
      } else {
        tests[3] = { name: 'Routes', status: 'error', error: 'Structure routes invalide' };
      }
    } catch (error) {
      tests[3] = { name: 'Routes', status: 'error', error: String(error) };
    }

    // Test Supabase Client
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      if (supabase && supabase.auth) {
        tests[4].status = 'success';
      } else {
        tests[4] = { name: 'Supabase Client', status: 'error', error: 'Client non initialisé' };
      }
    } catch (error) {
      tests[4] = { name: 'Supabase Client', status: 'error', error: String(error) };
    }

    setImports([...tests]);
  };

  // Test des routes accessibles
  const testRoutes = () => {
    const currentRole = user?.role || user?.user_metadata?.role || userMode;
    
    const routesToTest: RouteTest[] = [
      {
        path: routes.public.home(),
        name: 'Accueil',
        accessible: true
      },
      {
        path: routes.b2c.dashboard(),
        name: 'Dashboard B2C',
        accessible: isAuthenticated && (currentRole === 'b2c' || currentRole === 'consumer' || userMode === 'b2c'),
        reason: !isAuthenticated ? 'Non authentifié' : currentRole !== 'b2c' ? 'Rôle incorrect' : undefined
      },
      {
        path: routes.b2c.scan(),
        name: 'Scanner',
        accessible: isAuthenticated,
        reason: !isAuthenticated ? 'Non authentifié' : undefined
      },
      {
        path: routes.b2c.music(),
        name: 'Musique',
        accessible: isAuthenticated,
        reason: !isAuthenticated ? 'Non authentifié' : undefined
      },
      {
        path: routes.b2c.coach(),
        name: 'Coach IA',
        accessible: isAuthenticated,
        reason: !isAuthenticated ? 'Non authentifié' : undefined
      },
      {
        path: routes.b2b.teams(),
        name: 'Équipes B2B',
        accessible: isAuthenticated && (currentRole === 'b2b_admin' || currentRole === 'b2b_user'),
        reason: !isAuthenticated ? 'Non authentifié' : 'Rôle B2B requis'
      }
    ];

    setRouteTests(routesToTest);
  };

  // Lancer tous les tests
  const runDiagnostic = async () => {
    setIsRunning(true);
    await testImports();
    testRoutes();
    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostic();
  }, [user, userMode, isAuthenticated]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'loading':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const successImports = imports.filter(imp => imp.status === 'success').length;
  const accessibleRoutes = routeTests.filter(route => route.accessible).length;

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            Diagnostic d'Accès et Imports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{successImports}/{imports.length}</p>
              <p className="text-sm text-muted-foreground">Imports OK</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{accessibleRoutes}/{routeTests.length}</p>
              <p className="text-sm text-muted-foreground">Routes Accessibles</p>
            </div>
            <div className="text-center">
              <Badge variant={isAuthenticated ? "default" : "destructive"}>
                {isAuthenticated ? 'Authentifié' : 'Non authentifié'}
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">État Auth</p>
            </div>
            <div className="text-center">
              <Badge variant="outline">{userMode || 'Aucun'}</Badge>
              <p className="text-sm text-muted-foreground mt-1">Mode Utilisateur</p>
            </div>
          </div>

          <Button 
            onClick={runDiagnostic} 
            disabled={isRunning}
            className="w-full mb-4"
          >
            {isRunning ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Relancer le diagnostic
          </Button>
        </CardContent>
      </Card>

      {/* Tests des imports */}
      <Card>
        <CardHeader>
          <CardTitle>Tests des Imports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {imports.map((imp, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(imp.status)}
                  <span className="font-medium">{imp.name}</span>
                </div>
                {imp.error && (
                  <Badge variant="destructive" className="text-xs">
                    {imp.error}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tests des routes */}
      <Card>
        <CardHeader>
          <CardTitle>Accès aux Routes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {routeTests.map((route, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  {route.accessible ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <span className="font-medium">{route.name}</span>
                    <p className="text-sm text-muted-foreground">{route.path}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {route.reason && (
                    <Badge variant="secondary" className="text-xs">
                      {route.reason}
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    variant={route.accessible ? "default" : "outline"}
                    disabled={!route.accessible}
                    onClick={() => route.accessible && navigate(route.path)}
                  >
                    {route.accessible ? 'Tester' : 'Bloqué'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Détails utilisateur */}
      <Card>
        <CardHeader>
          <CardTitle>Détails Utilisateur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Authentification</h4>
              <p className="text-sm">Email: {user?.email || 'Non connecté'}</p>
              <p className="text-sm">ID: {user?.id || 'N/A'}</p>
              <p className="text-sm">Session: {session ? 'Active' : 'Inactive'}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Rôles et Permissions</h4>
              <p className="text-sm">Rôle direct: {user?.role || 'N/A'}</p>
              <p className="text-sm">Rôle metadata: {user?.user_metadata?.role || 'N/A'}</p>
              <p className="text-sm">Mode utilisateur: {userMode || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessDiagnostic;