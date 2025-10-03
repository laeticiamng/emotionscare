import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Zap, Music, Brain } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ApiTestResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

interface ApiIntegrationStatus {
  overall: 'success' | 'error' | 'warning';
  timestamp: string;
  results: ApiTestResult[];
  platform_status: {
    openai_ready: boolean;
    suno_ready: boolean;
    integration_ready: boolean;
  };
}

const ApiIntegrationChecker: React.FC = () => {
  const [status, setStatus] = useState<ApiIntegrationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runIntegrationTest = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('api-integration-test');
      
      if (error) {
        throw error;
      }
      
      setStatus(data);
    } catch (err) {
      setError(`Erreur lors du test: ${err.message}`);
      console.error('API Integration Test Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runIntegrationTest();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <RefreshCw className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-500 bg-green-50';
      case 'error':
        return 'border-red-500 bg-red-50';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const getOverallHealthScore = () => {
    if (!status) return 0;
    
    const successCount = status.results.filter(r => r.status === 'success').length;
    return Math.round((successCount / status.results.length) * 100);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Brain className="h-8 w-8 text-blue-500" />
          Vérification Intégration APIs
        </h1>
        <p className="text-muted-foreground">
          Diagnostic complet des intégrations OpenAI et Suno pour la plateforme EmotionsCare
        </p>
      </div>

      {/* État global de la plateforme */}
      {status && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">
                {getOverallHealthScore()}%
              </div>
              <div className="text-sm text-muted-foreground">Score Santé</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${status.platform_status.openai_ready ? 'text-green-500' : 'text-red-500'}`}>
                {status.platform_status.openai_ready ? 'ON' : 'OFF'}
              </div>
              <div className="text-sm text-muted-foreground">OpenAI API</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${status.platform_status.suno_ready ? 'text-green-500' : 'text-red-500'}`}>
                {status.platform_status.suno_ready ? 'ON' : 'OFF'}
              </div>
              <div className="text-sm text-muted-foreground">Suno API</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${status.platform_status.integration_ready ? 'text-green-500' : 'text-red-500'}`}>
                {status.platform_status.integration_ready ? 'OK' : 'KO'}
              </div>
              <div className="text-sm text-muted-foreground">Intégration</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bouton de test */}
      <div className="flex justify-center">
        <Button 
          onClick={runIntegrationTest} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Test en cours...' : 'Relancer les tests'}
        </Button>
      </div>

      {/* Barre de progression lors du chargement */}
      {isLoading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Test des intégrations API...</span>
            <span>En cours</span>
          </div>
          <Progress value={undefined} className="h-2" />
        </div>
      )}

      {/* Erreur globale */}
      {error && (
        <Alert className="border-red-500 bg-red-50">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Résultats détaillés */}
      {status && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Résultats des Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {status.results.map((result, index) => (
              <Card key={index} className={`border-2 ${getStatusColor(result.status)}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      {result.name === 'OpenAI Integration' && <Brain className="h-4 w-4" />}
                      {result.name === 'Suno Integration' && <Music className="h-4 w-4" />}
                      {result.name === 'Integration Flow' && <Zap className="h-4 w-4" />}
                      {result.name}
                    </CardTitle>
                    <Badge 
                      variant={result.status === 'success' ? 'default' : 'destructive'}
                      className={result.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''}
                    >
                      {result.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">{result.message}</p>
                  
                  {result.details && (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="text-xs font-medium mb-2">Détails:</div>
                      {typeof result.details === 'object' ? (
                        <div className="space-y-1 text-xs">
                          {Object.entries(result.details).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-muted-foreground">{key}:</span>
                              <span className="font-mono">
                                {Array.isArray(value) 
                                  ? value.join(', ') 
                                  : String(value).substring(0, 50)
                                }
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs font-mono bg-background p-2 rounded">
                          {String(result.details).substring(0, 200)}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Statut de la plateforme */}
      {status && (
        <Card className={`border-2 ${getStatusColor(status.overall)}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(status.overall)}
              État Global de la Plateforme
            </CardTitle>
            <CardDescription>
              Test effectué le {status.timestamp ? new Date(status.timestamp).toLocaleString() : 'N/A'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert className={`${
                status.overall === 'success' ? 'border-green-500 bg-green-50' :
                status.overall === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                'border-red-500 bg-red-50'
              }`}>
                <AlertDescription>
                  {status.overall === 'success' && '🎉 Toutes les APIs sont intégrées et fonctionnelles !'}
                  {status.overall === 'warning' && '⚠️ La plateforme fonctionne mais certaines APIs ont des problèmes mineurs.'}
                  {status.overall === 'error' && '🔧 Des problèmes critiques empêchent le bon fonctionnement de la plateforme.'}
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="font-medium">Services Actifs:</div>
                  <div className="space-y-1">
                    <div className={`flex items-center gap-2 ${status.platform_status.openai_ready ? 'text-green-600' : 'text-red-600'}`}>
                      {status.platform_status.openai_ready ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      Intelligence Artificielle (OpenAI)
                    </div>
                    <div className={`flex items-center gap-2 ${status.platform_status.suno_ready ? 'text-green-600' : 'text-red-600'}`}>
                      {status.platform_status.suno_ready ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      Génération Musicale (Suno)
                    </div>
                    <div className={`flex items-center gap-2 ${status.platform_status.integration_ready ? 'text-green-600' : 'text-red-600'}`}>
                      {status.platform_status.integration_ready ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      Flux d'Intégration
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="font-medium">Fonctionnalités Impact:</div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>• Coach IA et analyse d'émotions</div>
                    <div>• Génération de musique thérapeutique</div>
                    <div>• Recommandations personnalisées</div>
                    <div>• Intégration Text-to-Music</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ApiIntegrationChecker;