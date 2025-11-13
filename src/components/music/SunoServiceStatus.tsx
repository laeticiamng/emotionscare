/**
 * Indicateur visuel de statut du service Suno API
 */

import React from 'react';
import { Activity, AlertCircle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { useSunoServiceStatus } from '@/hooks/useSunoServiceStatus';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export const SunoServiceStatus: React.FC = () => {
  const { status, pendingCount, processingCount, isLoading, refresh } = useSunoServiceStatus();

  if (!status) {
    return null;
  }

  const isAvailable = status.is_available;
  const hasIssues = status.consecutive_failures > 0;

  return (
    <Card className="border-border/50 bg-background/40 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Statut principal */}
          <div className="flex items-center gap-3">
            <div className={cn(
              "relative flex h-10 w-10 items-center justify-center rounded-full",
              isAvailable ? "bg-green-500/10" : "bg-red-500/10"
            )}>
              {isAvailable ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              {isAvailable && (
                <span className="absolute -right-1 -top-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  Service de génération musicale
                </span>
                <Badge variant={isAvailable ? "default" : "destructive"} className="text-xs">
                  {isAvailable ? 'Opérationnel' : 'Indisponible'}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {status.response_time_ms && isAvailable && (
                  <span className="flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    {status.response_time_ms}ms
                  </span>
                )}
                {hasIssues && (
                  <span className="text-orange-500">
                    {status.consecutive_failures} échec(s) consécutif(s)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* File d'attente */}
          {(pendingCount > 0 || processingCount > 0) && (
            <div className="flex items-center gap-3">
              {pendingCount > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1.5">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-medium text-orange-500">
                          {pendingCount}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{pendingCount} génération(s) en attente</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {processingCount > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1.5">
                        <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                        <span className="text-sm font-medium text-blue-500">
                          {processingCount}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{processingCount} génération(s) en cours</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          )}

          {/* Bouton refresh */}
          <Button
            variant="ghost"
            size="sm"
            onClick={refresh}
            disabled={isLoading}
            className="ml-auto"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
        </div>

        {/* Message d'erreur si indisponible */}
        {!isAvailable && status.error_message && (
          <div className="mt-3 rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
            <p className="font-medium">Le service est temporairement indisponible</p>
            <p className="mt-1 text-xs opacity-80">
              Les nouvelles demandes sont mises en file d'attente et seront traitées automatiquement
              dès que le service sera à nouveau disponible.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
