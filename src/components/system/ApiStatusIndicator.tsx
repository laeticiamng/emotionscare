// @ts-nocheck
/**
 * Indicateur compact du statut des APIs
 * Affichage discret dans la navigation ou le dashboard
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Activity,
  RefreshCw
} from 'lucide-react';
import { useApiMonitoring } from '@/hooks/useApiMonitoring';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/routerV2';

interface ApiStatusIndicatorProps {
  compact?: boolean;
  showDetailsButton?: boolean;
}

const ApiStatusIndicator: React.FC<ApiStatusIndicatorProps> = ({ 
  compact = false,
  showDetailsButton = true 
}) => {
  const navigate = useNavigate();
  const {
    report,
    isLoading,
    refresh,
    quickCheck,
    isHealthy,
    isDegraded,
    isCritical,
    healthyCount,
    failedCount,
    totalCount
  } = useApiMonitoring({
    autoRefresh: true,
    refreshInterval: 30000, // 30 secondes
  });

  const getStatusConfig = () => {
    if (isLoading && !report) {
      return {
        icon: RefreshCw,
        color: 'text-gray-500',
        bgColor: 'bg-gray-100',
        label: 'Vérification...',
        variant: 'secondary' as const
      };
    }

    if (isHealthy) {
      return {
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        label: 'APIs opérationnelles',
        variant: 'default' as const
      };
    }

    if (isDegraded) {
      return {
        icon: AlertTriangle,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        label: 'Performance dégradée',
        variant: 'secondary' as const
      };
    }

    if (isCritical) {
      return {
        icon: XCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        label: 'APIs critiques en panne',
        variant: 'destructive' as const
      };
    }

    return {
      icon: AlertTriangle,
      color: 'text-gray-500',
      bgColor: 'bg-gray-100',
      label: 'Statut inconnu',
      variant: 'secondary' as const
    };
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  const handleDetailsClick = () => {
    navigate(routes.b2c.settings());
  };

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={showDetailsButton ? handleDetailsClick : quickCheck}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${config.bgColor} hover:opacity-80`}
            >
              <IconComponent className={`h-3 w-3 ${config.color} ${isLoading ? 'animate-spin' : ''}`} />
              {report && (
                <span className="text-xs font-medium">
                  {healthyCount}/{totalCount}
                </span>
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <div className="font-medium">{config.label}</div>
              {report && (
                <>
                  <div className="text-xs">
                    {healthyCount} APIs fonctionnelles sur {totalCount}
                  </div>
                  {failedCount > 0 && (
                    <div className="text-xs text-red-500">
                      {failedCount} API{failedCount > 1 ? 's' : ''} en erreur
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    Cliquer pour {showDetailsButton ? 'plus de détails' : 'tester'}
                  </div>
                </>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <IconComponent className={`h-4 w-4 ${config.color} ${isLoading ? 'animate-spin' : ''}`} />
        <Badge variant={config.variant}>
          {config.label}
        </Badge>
      </div>

      {report && (
        <div className="text-sm text-gray-600">
          {healthyCount}/{totalCount} APIs
        </div>
      )}

      <div className="flex gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={quickCheck}
                variant="ghost"
                size="sm"
                disabled={isLoading}
              >
                <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Test rapide</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {showDetailsButton && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleDetailsClick}
                  variant="ghost"
                  size="sm"
                >
                  <Activity className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Voir les détails</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};

export default ApiStatusIndicator;