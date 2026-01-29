/**
 * Composant ApiConfigPanel
 * 
 * Panneau de configuration des API pour les administrateurs.
 * Les clés API sont gérées côté serveur via Supabase Edge Function secrets.
 * Ce panneau affiche uniquement le statut et les options de configuration.
 */
import React, { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Loader2, Key, RefreshCw, CheckCircle, XCircle, Shield } from 'lucide-react';
import ApiStatus from '@/components/status/ApiStatus';
import { supabase } from '@/integrations/supabase/client';

interface ApiConfigPanelProps {
  className?: string;
}

interface ApiServiceStatus {
  name: string;
  configured: boolean;
  lastCheck?: string;
}

const ApiConfigPanel: React.FC<ApiConfigPanelProps> = ({ className = '' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<ApiServiceStatus[]>([
    { name: 'OpenAI', configured: false },
    { name: 'Hume AI', configured: false },
    { name: 'Suno AI', configured: false },
  ]);
  
  // Options avancées
  const [advanced, setAdvanced] = useState({
    cacheResponses: true,
    logUsage: true,
    fallbackToLocalModels: false,
    useProxy: true,
  });
  
  // Vérifier le statut des API via Edge Function
  const checkApiStatus = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-api-connection', {
        body: { services: ['openai', 'hume', 'suno'] }
      });
      
      if (error) throw error;
      
      if (data?.status) {
        setApiStatus([
          { name: 'OpenAI', configured: data.status.openai || false, lastCheck: new Date().toISOString() },
          { name: 'Hume AI', configured: data.status.hume || false, lastCheck: new Date().toISOString() },
          { name: 'Suno AI', configured: data.status.suno || false, lastCheck: new Date().toISOString() },
        ]);
      }
      
      logger.info('API status checked successfully', {}, 'SYSTEM');
    } catch (error) {
      logger.error('Error checking API status', error, 'SYSTEM');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    checkApiStatus();
  }, []);
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Configuration des API
        </CardTitle>
        <CardDescription>
          Les clés API sont gérées de manière sécurisée via Supabase Edge Function secrets
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue="status">
          <TabsList className="mx-6">
            <TabsTrigger value="status">Statut des API</TabsTrigger>
            <TabsTrigger value="advanced">Options avancées</TabsTrigger>
          </TabsList>
          
          {/* Onglet de statut */}
          <TabsContent value="status" className="px-6 py-4 space-y-4">
            <Alert>
              <Key className="h-4 w-4" />
              <AlertTitle>Sécurité des clés API</AlertTitle>
              <AlertDescription>
                Les clés API sont stockées de manière sécurisée dans les secrets Supabase et ne sont jamais exposées au client. 
                Gérez vos clés dans le tableau de bord Supabase → Settings → Edge Functions.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3 mt-4">
              {apiStatus.map((api) => (
                <div key={api.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {api.configured ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium">{api.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {api.lastCheck ? `Vérifié: ${new Date(api.lastCheck).toLocaleTimeString()}` : 'Non vérifié'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={api.configured ? 'default' : 'secondary'}>
                    {api.configured ? 'Configuré' : 'Non configuré'}
                  </Badge>
                </div>
              ))}
            </div>
            
            <ApiStatus />
          </TabsContent>
          
          {/* Onglet des options avancées */}
          <TabsContent value="advanced" className="px-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cache"
                  checked={advanced.cacheResponses}
                  onCheckedChange={() => setAdvanced(prev => ({ ...prev, cacheResponses: !prev.cacheResponses }))}
                />
                <div>
                  <label
                    htmlFor="cache"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Mettre en cache les réponses
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Améliore les performances et réduit les coûts API
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="log"
                  checked={advanced.logUsage}
                  onCheckedChange={() => setAdvanced(prev => ({ ...prev, logUsage: !prev.logUsage }))}
                />
                <div>
                  <label
                    htmlFor="log"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Journaliser l'utilisation des API
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Enregistre les statistiques d'utilisation pour analyse
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fallback"
                  checked={advanced.fallbackToLocalModels}
                  onCheckedChange={() => setAdvanced(prev => ({ ...prev, fallbackToLocalModels: !prev.fallbackToLocalModels }))}
                />
                <div>
                  <label
                    htmlFor="fallback"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Utiliser des modèles locaux en cas d'échec
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Se replie sur des modèles locaux si les API externes sont indisponibles
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="proxy"
                  checked={advanced.useProxy}
                  onCheckedChange={() => setAdvanced(prev => ({ ...prev, useProxy: !prev.useProxy }))}
                />
                <div>
                  <label
                    htmlFor="proxy"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Utiliser un proxy pour les appels API
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Renforce la sécurité en acheminant les appels via Edge Functions
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-end border-t px-6 py-4">
        <Button
          onClick={checkApiStatus}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Rafraîchir le statut
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApiConfigPanel;
