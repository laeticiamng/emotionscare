// @ts-nocheck
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, HeartOff, Activity } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HRVStatusBadgeProps {
  connected: boolean;
  active: boolean;
  onConnect: () => Promise<void>;
  className?: string;
}

export const HRVStatusBadge: React.FC<HRVStatusBadgeProps> = ({
  connected,
  active,
  onConnect,
  className = ''
}) => {
  const getStatusIcon = () => {
    if (active && connected) {
      return <Activity className="h-3 w-3 animate-pulse" />;
    } else if (connected) {
      return <Heart className="h-3 w-3" />;
    } else {
      return <HeartOff className="h-3 w-3" />;
    }
  };

  const getStatusText = () => {
    if (active && connected) {
      return 'HRV actif';
    } else if (connected) {
      return 'Capteur connecté';
    } else {
      return 'Pas de capteur';
    }
  };

  const getStatusColor = () => {
    if (active && connected) {
      return 'default'; // Active state - primary color with animation
    } else if (connected) {
      return 'secondary'; // Connected but not active
    } else {
      return 'outline'; // Not connected
    }
  };

  const getTooltipText = () => {
    if (active && connected) {
      return 'Variabilité cardiaque en cours d\'enregistrement';
    } else if (connected) {
      return 'Capteur cardiaque connecté et prêt';
    } else {
      return 'Aucun capteur cardiaque connecté. Cliquez pour connecter un appareil compatible.';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {connected ? (
            <Badge 
              variant={getStatusColor()}
              className={`
                gap-1.5 cursor-help select-none transition-all duration-200
                ${active ? 'bg-primary/10 text-primary border-primary/20' : ''}
                ${className}
              `}
            >
              {getStatusIcon()}
              <span className="text-xs font-medium">
                {getStatusText()}
              </span>
            </Badge>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onConnect}
              className={`gap-1.5 h-6 px-2 text-xs ${className}`}
              aria-label="Connecter un capteur cardiaque"
            >
              {getStatusIcon()}
              Connecter HRV
            </Button>
          )}
        </TooltipTrigger>
        
        <TooltipContent side="bottom" className="max-w-xs">
          <p className="text-xs">{getTooltipText()}</p>
          {!connected && (
            <p className="text-xs text-muted-foreground mt-1">
              Compatible avec les capteurs Bluetooth Low Energy (Polar, Garmin, etc.)
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};