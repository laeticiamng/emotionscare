import React from 'react';
import { HealthBadge } from '@/components/system/HealthBadge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, WifiOff } from 'lucide-react';

/**
 * Bandeau de statut compact en haut du dashboard
 */
export const StatusStrip: React.FC = () => {
  const isOnline = navigator.onLine;

  return (
    <div className="bg-muted/30 border-b px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left side - Online status */}
        <div className="flex items-center gap-4">
          {!isOnline && (
            <Alert className="py-1 px-2 bg-amber-50 border-amber-200">
              <WifiOff className="h-3 w-3 text-amber-600" />
              <AlertDescription className="text-xs text-amber-700 ml-1">
                Mode hors-ligne
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Right side - System health */}
        <div className="flex items-center gap-2">
          <HealthBadge />
        </div>
      </div>
    </div>
  );
};