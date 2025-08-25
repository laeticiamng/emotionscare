import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusIndicatorProps {
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ className }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [systemStatus, setSystemStatus] = useState<'healthy' | 'warning' | 'error'>('healthy');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Simuler le statut système (dans un vrai app, cela viendrait d'une API)
  useEffect(() => {
    const checkSystemHealth = () => {
      // Logique de vérification du système
      const healthCheck = Math.random();
      if (healthCheck > 0.9) setSystemStatus('warning');
      else if (healthCheck > 0.95) setSystemStatus('error');
      else setSystemStatus('healthy');
    };

    const interval = setInterval(checkSystemHealth, 30000); // Vérifier toutes les 30s
    return () => clearInterval(interval);
  }, []);

  if (!isOnline) {
    return (
      <div className={cn("fixed bottom-4 right-4 z-50", className)}>
        <Badge variant="destructive" className="flex items-center gap-2">
          <WifiOff className="h-3 w-3" />
          Hors ligne
        </Badge>
      </div>
    );
  }

  if (systemStatus === 'error') {
    return (
      <div className={cn("fixed bottom-4 right-4 z-50", className)}>
        <Badge variant="destructive" className="flex items-center gap-2">
          <AlertCircle className="h-3 w-3" />
          Problème système
        </Badge>
      </div>
    );
  }

  if (systemStatus === 'warning') {
    return (
      <div className={cn("fixed bottom-4 right-4 z-50", className)}>
        <Badge variant="secondary" className="flex items-center gap-2 bg-yellow-100 text-yellow-800 border-yellow-200">
          <AlertCircle className="h-3 w-3" />
          Performance dégradée
        </Badge>
      </div>
    );
  }

  // Système en bonne santé - ne rien afficher pour ne pas encombrer
  return null;
};