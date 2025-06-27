
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MusicGenerationTest from '@/components/music/MusicGenerationTest';
import AppHealthCheck from '@/components/diagnostics/AppHealthCheck';
import { useAppDiagnostics } from '@/hooks/useAppDiagnostics';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const HomePage: React.FC = () => {
  const diagnostic = useAppDiagnostics();

  return (
    <div data-testid="page-root" className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">EmotionsCare</h1>
          <p className="text-muted-foreground">Page d'accueil fonctionnelle</p>
        </div>

        {/* Diagnostic Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {diagnostic.isHealthy ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              )}
              État de l'application
            </CardTitle>
          </CardHeader>
          <CardContent>
            {diagnostic.isHealthy ? (
              <p className="text-green-600">Application fonctionnelle</p>
            ) : (
              <div className="space-y-2">
                <p className="text-yellow-600">Problèmes détectés :</p>
                <ul className="list-disc list-inside space-y-1">
                  {diagnostic.issues.map((issue, index) => (
                    <li key={index} className="text-sm text-muted-foreground">{issue}</li>
                  ))}
                </ul>
                {diagnostic.recommendations.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium">Recommandations :</p>
                    <ul className="list-disc list-inside space-y-1">
                      {diagnostic.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-blue-600">{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Diagnostic complet */}
        <AppHealthCheck />

        {/* Test de génération musicale */}
        <Card>
          <CardHeader>
            <CardTitle>Test de Génération Musicale</CardTitle>
          </CardHeader>
          <CardContent>
            <MusicGenerationTest />
          </CardContent>
        </Card>

        {/* Information système */}
        <Card>
          <CardHeader>
            <CardTitle>Informations Système</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>User Agent:</strong> {navigator.userAgent}</p>
            <p><strong>URL actuelle:</strong> {window.location.href}</p>
            <p><strong>Mode de développement:</strong> {import.meta.env.DEV ? 'Oui' : 'Non'}</p>
            <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
