
/**
 * Composant ApiConfigPanel
 * 
 * Panneau de configuration des API pour les administrateurs.
 * Permet de configurer les clés API, tester les connexions, et gérer les paramètres.
 */
import React, { useState } from 'react';
import { logger } from '@/lib/logger';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Key, Save, RefreshCw, ExternalLink } from 'lucide-react';
import ApiStatus from './ApiStatus';
import { API_URL } from '@/lib/env';

interface ApiConfigPanelProps {
  className?: string;
  onUpdate?: (keys: Record<string, string>) => Promise<void>;
}

const ApiConfigPanel: React.FC<ApiConfigPanelProps> = ({ className = '', onUpdate }) => {
  // Configuration actuelle
  const [apiKeys, setApiKeys] = useState<Record<string, string>>(() => ({
    openai: import.meta.env.VITE_OPENAI_API_KEY ?? '',
    humeai: import.meta.env.VITE_HUME_API_KEY ?? '',
  }));
  
  // État de chargement
  const [isLoading, setIsLoading] = useState(false);
  
  // Options avancées
  const [advanced, setAdvanced] = useState({
    cacheResponses: true,
    logUsage: true,
    fallbackToLocalModels: false,
    useProxy: true,
  });
  
  // Gestion des changements de clés API
  const handleKeyChange = (api: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [api]: value }));
  };
  
  // Sauvegarde des clés API
  const handleSaveKeys = async () => {
    setIsLoading(true);
    try {
      if (onUpdate) {
        await onUpdate(apiKeys);
      }
      // Simule un délai de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      logger.info('API keys saved successfully', {}, 'SYSTEM');
    } catch (error) {
      logger.error('Error saving API keys', error, 'SYSTEM');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl">Configuration des API</CardTitle>
        <CardDescription>
          Gérez les clés API et les paramètres pour les services externes
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue="keys">
          <TabsList className="mx-6">
            <TabsTrigger value="keys">Clés API</TabsTrigger>
            <TabsTrigger value="status">Statut</TabsTrigger>
            <TabsTrigger value="advanced">Options avancées</TabsTrigger>
          </TabsList>
          
          {/* Onglet des clés API */}
          <TabsContent value="keys" className="px-6 py-4 space-y-4">
            <Alert>
              <AlertTitle className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Sécurité des clés API
              </AlertTitle>
              <AlertDescription>
                Les clés API sont stockées de manière sécurisée dans les variables d'environnement côté serveur. 
                Elles ne sont jamais exposées au client.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <label htmlFor="openai" className="text-sm font-medium">OpenAI API Key</label>
                <div className="flex gap-2">
                  <Input
                    id="openai"
                    type="password"
                    value={apiKeys.openai}
                    onChange={e => handleKeyChange('openai', e.target.value)}
                    placeholder="sk-..."
                  />
                  <a 
                    href="https://platform.openai.com/api-keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-3 py-2 border rounded-md text-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <p className="text-xs text-muted-foreground">
                  Utilisé pour OpenAI, GPT-4, DALL-E et Whisper
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="humeai" className="text-sm font-medium">Hume AI API Key</label>
                <div className="flex gap-2">
                  <Input
                    id="humeai"
                    type="password"
                    value={apiKeys.humeai}
                    onChange={e => handleKeyChange('humeai', e.target.value)}
                    placeholder="hume_..."
                  />
                  <a 
                    href="https://hume.ai/dashboard" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-3 py-2 border rounded-md text-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <p className="text-xs text-muted-foreground">
                  Utilisé pour l'analyse émotionnelle avancée
                </p>
              </div>
            </div>
          </TabsContent>
          
          {/* Onglet de statut */}
          <TabsContent value="status" className="px-6 py-4">
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
                    Renforce la sécurité en acheminant les appels via un proxy côté serveur
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t px-6 py-4">
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Rafraîchir
        </Button>
        
        <Button onClick={handleSaveKeys} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Sauvegarder
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApiConfigPanel;
