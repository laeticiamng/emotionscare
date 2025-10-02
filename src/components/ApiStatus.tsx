
/**
 * Composant ApiStatus
 * 
 * Affiche l'état des différentes API intégrées dans l'application.
 * Utile pour le debugging et la vérification de la connectivité.
 */
import React, { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import apiServices, { APIStatus } from '@/services';

interface ApiStatusProps {
  autoCheck?: boolean;
  className?: string;
}

const ApiStatus: React.FC<ApiStatusProps> = ({ 
  autoCheck = false,
  className = '' 
}) => {
  const [apiStatus, setApiStatus] = useState<Record<string, APIStatus>>({});
  const [isChecking, setIsChecking] = useState(false);
  
  const checkApiStatus = async () => {
    setIsChecking(true);
    try {
      const status = await (apiServices as any).checkAllAPIs?.() || {};
      setApiStatus(status);
    } catch (error) {
      logger.error('Error checking API status', error, 'API');
    } finally {
      setIsChecking(false);
    }
  };
  
  useEffect(() => {
    // Vérification automatique au montage si activée
    if (autoCheck) {
      checkApiStatus();
    }
  }, [autoCheck]);
  
  // Formate la date de dernière vérification
  const formatLastChecked = (date: Date | null) => {
    if (!date) return 'Jamais';
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Statut des API</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkApiStatus}
            disabled={isChecking}
          >
            {isChecking ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-1" />
            )}
            Vérifier
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.keys(apiStatus).length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              {isChecking ? "Vérification en cours..." : "Cliquez sur Vérifier pour tester les API"}
            </div>
          ) : (
            Object.entries(apiStatus).map(([key, status]) => (
              <div key={key} className="flex items-center justify-between p-2 border rounded-md">
                <div>
                  <span className="font-medium">{(status as any).name || key}</span>
                  <div className="text-xs text-muted-foreground">
                    Dernière vérification: {formatLastChecked((status as any).lastCheck || null)}
                  </div>
                </div>
                <Badge 
                  variant={(status as any).available ? "default" : "destructive"}
                  className="flex items-center gap-1"
                >
                  {(status as any).available ? (
                    <>
                      <CheckCircle className="h-3 w-3" />
                      Disponible
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3" />
                      Indisponible
                    </>
                  )}
                </Badge>
              </div>
            ))
          )}
          
          {/* Configuration des API */}
          <div className="mt-4 pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">Configuration</h3>
            <div className="space-y-2">
              {Object.entries((apiServices as any).getAPIConfiguration?.() || {}).map(([key, isConfigured]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm">{key}</span>
                  <Badge variant={isConfigured ? "outline" : "secondary"}>
                    {isConfigured ? "Configuré" : "Non configuré"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiStatus;
