// @ts-nocheck
import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { useHealthcheck } from '@/hooks/useHealthcheck';

export const HealthBadge: React.FC = () => {
  const { state, version, services, lastChecked, refresh } = useHealthcheck();

  const getStateConfig = (currentState: typeof state) => {
    switch (currentState) {
      case 'online':
        return {
          label: 'Online',
          icon: Wifi,
          variant: 'default' as const,
          bgColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
          dotColor: 'bg-green-500'
        };
      case 'degraded':
        return {
          label: 'Dégradé', 
          icon: AlertTriangle,
          variant: 'secondary' as const,
          bgColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
          dotColor: 'bg-amber-500'
        };
      case 'offline':
        return {
          label: 'Hors-ligne',
          icon: WifiOff,
          variant: 'outline' as const,
          bgColor: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
          dotColor: 'bg-gray-500'
        };
    }
  };

  const config = getStateConfig(state);
  const IconComponent = config.icon;

  // Format services for tooltip
  const formatServices = () => {
    if (!services) return [];
    
    return Object.entries(services).map(([name, status]) => ({
      name,
      status,
      label: name.charAt(0).toUpperCase() + name.slice(1)
    }));
  };

  const formatLastChecked = () => {
    if (!lastChecked) return 'Jamais vérifié';
    
    const now = Date.now();
    const diffMs = now - lastChecked;
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) return 'À l\'instant';
    if (diffSec < 3600) return `Il y a ${Math.floor(diffSec / 60)}min`;
    return `Il y a ${Math.floor(diffSec / 3600)}h`;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={refresh}
            className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md p-1"
            aria-label={`État du système : ${config.label}`}
          >
            <Badge 
              variant={config.variant}
              className={`${config.bgColor} flex items-center gap-1.5 px-2 py-1`}
              role="status"
              aria-live="polite"
            >
              {/* Status dot with subtle pulse for online state */}
              <div className={`w-2 h-2 rounded-full ${config.dotColor} ${
                state === 'online' ? 'animate-pulse' : ''
              }`} />
              
              <IconComponent className="w-3 h-3" />
              
              <span className="text-xs font-medium">
                {config.label}
              </span>
            </Badge>
          </button>
        </TooltipTrigger>

        <TooltipContent 
          side="bottom" 
          className="max-w-xs"
          sideOffset={5}
        >
          <div className="space-y-2">
            <div className="font-medium">État du système</div>
            
            <div className="text-xs space-y-1">
              <div>Status: <span className="font-medium">{config.label}</span></div>
              {version && (
                <div>Version: <span className="font-mono">{version}</span></div>
              )}
              <div>Dernière vérification: {formatLastChecked()}</div>
            </div>

            {services && Object.keys(services).length > 0 && (
              <div className="border-t pt-2 mt-2">
                <div className="text-xs font-medium mb-1">Services:</div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  {formatServices().map(({ name, status, label }) => (
                    <div key={name} className="flex items-center justify-between">
                      <span>{label}:</span>
                      <div className={`w-2 h-2 rounded-full ${
                        status ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="text-xs text-muted-foreground pt-1 border-t">
              Cliquer pour actualiser
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};