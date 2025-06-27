
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface DiagnosticCheck {
  name: string;
  status: 'ok' | 'error' | 'warning';
  message: string;
  details?: string;
}

const EmergencyDiagnostics: React.FC = () => {
  const [checks, setChecks] = useState<DiagnosticCheck[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 EmergencyDiagnostics - Starting diagnostic checks...');
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    const diagnostics: DiagnosticCheck[] = [];

    // Check 1: React is running
    try {
      diagnostics.push({
        name: 'React Rendering',
        status: 'ok',
        message: 'React est en cours d\'exécution'
      });
      console.log('✅ React rendering check passed');
    } catch (error) {
      diagnostics.push({
        name: 'React Rendering',
        status: 'error',
        message: 'Erreur React',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
      console.error('❌ React rendering check failed:', error);
    }

    // Check 2: DOM mounting
    try {
      const rootElement = document.getElementById('root');
      if (rootElement) {
        diagnostics.push({
          name: 'DOM Mount',
          status: 'ok',
          message: 'Élément root trouvé dans le DOM'
        });
        console.log('✅ DOM mount check passed');
      } else {
        diagnostics.push({
          name: 'DOM Mount',
          status: 'error',
          message: 'Élément root non trouvé',
          details: 'L\'élément #root n\'existe pas dans le DOM'
        });
        console.error('❌ DOM mount check failed: root element not found');
      }
    } catch (error) {
      diagnostics.push({
        name: 'DOM Mount',
        status: 'error',
        message: 'Erreur DOM',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
      console.error('❌ DOM mount check failed:', error);
    }

    // Check 3: Router configuration
    try {
      const { router } = await import('@/router/index');
      if (router && router.routes) {
        diagnostics.push({
          name: 'Router Configuration',
          status: 'ok',
          message: `Router configuré avec ${router.routes.length} routes`
        });
        console.log('✅ Router configuration check passed');
      } else {
        diagnostics.push({
          name: 'Router Configuration',
          status: 'error',
          message: 'Router mal configuré',
          details: 'Router ou routes non définis'
        });
        console.error('❌ Router configuration check failed');
      }
    } catch (error) {
      diagnostics.push({
        name: 'Router Configuration',
        status: 'error',
        message: 'Erreur de chargement du router',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
      console.error('❌ Router configuration check failed:', error);
    }

    // Check 4: Current location
    try {
      const currentPath = window.location.pathname;
      diagnostics.push({
        name: 'Current Location',
        status: 'ok',
        message: `Path actuel: ${currentPath}`
      });
      console.log('✅ Current location check passed:', currentPath);
    } catch (error) {
      diagnostics.push({
        name: 'Current Location',
        status: 'error',
        message: 'Erreur de localisation',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
      console.error('❌ Current location check failed:', error);
    }

    // Check 5: Console errors
    const consoleErrors: string[] = [];
    const originalError = console.error;
    console.error = (...args) => {
      consoleErrors.push(args.join(' '));
      originalError.apply(console, args);
    };

    setTimeout(() => {
      if (consoleErrors.length > 0) {
        diagnostics.push({
          name: 'Console Errors',
          status: 'warning',
          message: `${consoleErrors.length} erreurs console détectées`,
          details: consoleErrors.slice(0, 3).join('\n')
        });
        console.log('⚠️ Console errors detected:', consoleErrors.length);
      } else {
        diagnostics.push({
          name: 'Console Errors',
          status: 'ok',
          message: 'Aucune erreur console détectée'
        });
        console.log('✅ No console errors detected');
      }
      
      setChecks(diagnostics);
      setIsLoading(false);
      console.log('🏁 EmergencyDiagnostics - All checks completed');
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>🔍 Diagnostic d'urgence en cours...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Analyse de l'application pour identifier la cause de l'écran blanc...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>🚨 Diagnostic d'urgence - Écran blanc</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Timestamp: {new Date().toLocaleString()}
          </div>
          
          {checks.map((check, index) => (
            <div key={index} className="flex items-start gap-3 p-3 border rounded">
              {getStatusIcon(check.status)}
              <div className="flex-1">
                <h4 className="font-medium">{check.name}</h4>
                <p className="text-sm text-muted-foreground">{check.message}</p>
                {check.details && (
                  <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-x-auto">
                    {check.details}
                  </pre>
                )}
              </div>
            </div>
          ))}
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <h4 className="font-medium text-blue-800 mb-2">Actions recommandées :</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Vérifiez la console du navigateur (F12) pour plus de détails</li>
              <li>• Assurez-vous que toutes les dépendances sont installées</li>
              <li>• Vérifiez que le serveur de développement fonctionne correctement</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyDiagnostics;
