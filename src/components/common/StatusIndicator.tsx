import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Indicateur de statut global de l'application
 */
export const StatusIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Si tout va bien, ne rien afficher
  if (isOnline && !hasError) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <Badge
        variant="outline"
        className={cn(
          "flex items-center space-x-2 p-3 shadow-lg",
          !isOnline && "bg-red-50 text-red-700 border-red-200",
          hasError && "bg-orange-50 text-orange-700 border-orange-200"
        )}
      >
        {!isOnline ? (
          <>
            <WifiOff className="h-4 w-4" />
            <span>Hors ligne</span>
          </>
        ) : hasError ? (
          <>
            <AlertTriangle className="h-4 w-4" />
            <span>Erreur de connexion</span>
          </>
        ) : (
          <>
            <Wifi className="h-4 w-4" />
            <span>En ligne</span>
          </>
        )}
      </Badge>
    </motion.div>
  );
};