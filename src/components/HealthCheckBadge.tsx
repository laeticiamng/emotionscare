import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

type HealthStatus = 'online' | 'degraded' | 'offline' | 'checking';

interface HealthData {
  status: HealthStatus;
  latency?: number;
  lastCheck: Date;
  services?: {
    api: boolean;
    database: boolean;
    storage: boolean;
  };
}

/**
 * Badge de santé plateforme - GET /healthz polling léger
 * Critères A11y: aria-label, contraste AA, annonces SR
 */
const HealthCheckBadge: React.FC = () => {
  const [health, setHealth] = useState<HealthData>({
    status: 'checking',
    lastCheck: new Date()
  });

  const checkHealth = async () => {
    const startTime = Date.now();
    
    try {
      const response = await fetch('/healthz', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      const latency = Date.now() - startTime;
      
      if (response.ok) {
        const data = await response.json();
        setHealth({
          status: latency > 2000 ? 'degraded' : 'online',
          latency,
          lastCheck: new Date(),
          services: data.services || {}
        });
      } else {
        setHealth({
          status: 'degraded',
          latency,
          lastCheck: new Date()
        });
      }
    } catch (error) {
      setHealth({
        status: 'offline',
        lastCheck: new Date()
      });
    }
  };

  useEffect(() => {
    // Check initial
    checkHealth();
    
    // Poll every 30 seconds (léger)
    const interval = setInterval(checkHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusInfo = () => {
    switch (health.status) {
      case 'online':
        return {
          icon: CheckCircle,
          label: 'En ligne',
          variant: 'default' as const,
          color: 'text-green-600'
        };
      case 'degraded':
        return {
          icon: AlertTriangle,
          label: 'Dégradé',
          variant: 'secondary' as const,
          color: 'text-yellow-600'
        };
      case 'offline':
        return {
          icon: XCircle,
          label: 'Hors ligne',
          variant: 'destructive' as const,
          color: 'text-red-600'
        };
      case 'checking':
        return {
          icon: Activity,
          label: 'Vérification...',
          variant: 'outline' as const,
          color: 'text-blue-600'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const Icon = statusInfo.icon;
  const srStatusMessage = `Statut plateforme ${statusInfo.label}`;

  const getTooltipContent = () => {
    const latencyText = health.latency ? `${health.latency}ms` : '';
    const timeText = health.lastCheck.toLocaleTimeString();
    
    return (
      <div className="text-xs space-y-1">
        <div>Statut: {statusInfo.label}</div>
        {health.latency && <div>Latence: {latencyText}</div>}
        <div>Dernière vérif: {timeText}</div>
        {health.services && (
          <div className="mt-2 space-y-1">
            <div>API: {health.services.api ? '✓' : '✗'}</div>
            <div>DB: {health.services.database ? '✓' : '✗'}</div>
            <div>Storage: {health.services.storage ? '✓' : '✗'}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant={statusInfo.variant}
            className="gap-1 cursor-help"
            aria-label={`Santé plateforme: ${statusInfo.label}`}
          >
            <Icon
              className={`w-3 h-3 ${statusInfo.color}`}
              aria-hidden="true"
            />
            <span className="sr-only" role="status" aria-live="polite">
              {srStatusMessage}
              {health.latency ? ` (latence ${health.latency} millisecondes)` : ''}
            </span>
            <span className="hidden sm:inline">{statusInfo.label}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          {getTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HealthCheckBadge;