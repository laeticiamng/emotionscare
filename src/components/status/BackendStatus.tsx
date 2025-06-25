
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';

// Hook simplifié pour éviter les erreurs d'import
const useBackendStatus = () => {
  const [isConnected, setIsConnected] = React.useState<boolean | null>(null);
  const [lastCheck, setLastCheck] = React.useState<Date | null>(null);

  const refetch = React.useCallback(async () => {
    try {
      // Test de connexion simple
      const response = await fetch('/api/health', { method: 'HEAD' });
      setIsConnected(response.ok);
      setLastCheck(new Date());
    } catch (error) {
      setIsConnected(false);
      setLastCheck(new Date());
    }
  }, []);

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  return { isConnected, lastCheck, refetch };
};

const BackendStatus: React.FC = () => {
  const { isConnected, lastCheck, refetch } = useBackendStatus();

  const getStatusColor = () => {
    if (isConnected === null) return 'default';
    return isConnected ? 'default' : 'destructive';
  };

  const getStatusIcon = () => {
    if (isConnected === null) return <Clock className="h-3 w-3" />;
    return isConnected ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />;
  };

  const getStatusText = () => {
    if (isConnected === null) return 'Vérification...';
    return isConnected ? 'Backend connecté' : 'Backend déconnecté';
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant={getStatusColor()} className="flex items-center gap-1">
        {getStatusIcon()}
        <span className="text-xs">{getStatusText()}</span>
      </Badge>
      
      {lastCheck && (
        <span className="text-xs text-muted-foreground">
          {lastCheck.toLocaleTimeString()}
        </span>
      )}
      
      <Button
        variant="ghost"
        size="sm"
        onClick={refetch}
        className="h-6 w-6 p-0"
      >
        <RefreshCw className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default BackendStatus;
