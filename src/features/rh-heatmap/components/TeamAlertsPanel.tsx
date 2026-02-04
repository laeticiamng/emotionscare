/**
 * TeamAlertsPanel - Panneau d'alertes équipes RH
 * Affiche les alertes de bien-être par équipe
 */

import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, TrendingDown, Users, Bell, CheckCircle, Clock } from 'lucide-react';
import type { TeamAlert } from '../rhHeatmapService';

interface TeamAlertsPanelProps {
  alerts: TeamAlert[];
  onAlertClick?: (alert: TeamAlert) => void;
  onDismiss?: (teamId: string) => void;
  onAcknowledge?: (teamId: string) => void;
  maxHeight?: number;
}

const getSeverityConfig = (severity: TeamAlert['severity']) => {
  switch (severity) {
    case 'high':
      return {
        color: 'bg-destructive',
        textColor: 'text-destructive',
        bgColor: 'bg-destructive/10',
        borderColor: 'border-destructive/30',
        icon: AlertTriangle,
        label: 'Critique'
      };
    case 'medium':
      return {
        color: 'bg-orange-500',
        textColor: 'text-orange-700 dark:text-orange-400',
        bgColor: 'bg-orange-50 dark:bg-orange-950/30',
        borderColor: 'border-orange-200 dark:border-orange-800',
        icon: TrendingDown,
        label: 'Attention'
      };
    case 'low':
    default:
      return {
        color: 'bg-blue-500',
        textColor: 'text-blue-700 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        borderColor: 'border-blue-200 dark:border-blue-800',
        icon: Bell,
        label: 'Info'
      };
  }
};

const formatTimeAgo = (date: string): string => {
  const now = new Date();
  const alertDate = new Date(date);
  const diffMs = now.getTime() - alertDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `il y a ${diffDays}j`;
  if (diffHours > 0) return `il y a ${diffHours}h`;
  if (diffMins > 0) return `il y a ${diffMins}min`;
  return 'à l\'instant';
};

export const TeamAlertsPanel = memo<TeamAlertsPanelProps>(({
  alerts,
  onAlertClick,
  onDismiss,
  onAcknowledge,
  maxHeight = 400
}) => {
  const highCount = alerts.filter(a => a.severity === 'high').length;
  const mediumCount = alerts.filter(a => a.severity === 'medium').length;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alertes Équipes
          </CardTitle>
          <div className="flex gap-2">
            {highCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {highCount} critique{highCount > 1 ? 's' : ''}
              </Badge>
            )}
            {mediumCount > 0 && (
              <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                {mediumCount} attention
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mb-3 text-green-500" />
            <p className="text-sm font-medium">Aucune alerte active</p>
            <p className="text-xs">Toutes les équipes sont dans les seuils normaux</p>
          </div>
        ) : (
          <ScrollArea style={{ maxHeight }} className="pr-4">
            <div className="space-y-3">
              {alerts.map((alert, index) => {
                const config = getSeverityConfig(alert.severity);
                const Icon = config.icon;

                return (
                  <div
                    key={`${alert.teamId}-${index}`}
                    className={`
                      p-3 rounded-lg border cursor-pointer transition-all
                      hover:shadow-md hover:scale-[1.01]
                      ${config.bgColor} ${config.borderColor}
                    `}
                    onClick={() => onAlertClick?.(alert)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && onAlertClick?.(alert)}
                    aria-label={`Alerte ${config.label}: ${alert.message}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${config.color}`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium text-sm ${config.textColor}`}>
                            {alert.teamName}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {config.label}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {alert.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {alert.teamName}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimeAgo(alert.createdAt)}
                            </span>
                          </div>
                          
                          <div className="flex gap-1">
                            {onAcknowledge && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 text-xs px-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAcknowledge(alert.teamId);
                                }}
                              >
                                Accusé
                              </Button>
                            )}
                            {onDismiss && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 text-xs px-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDismiss(alert.teamId);
                                }}
                              >
                                Ignorer
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Barre de valeur */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Score actuel</span>
                        <span className={`font-medium ${config.textColor}`}>
                          {alert.value}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${config.color} transition-all`}
                          style={{ width: `${alert.value}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Seuil: {alert.threshold}%</span>
                        <span className={alert.value < alert.threshold ? 'text-destructive' : 'text-green-500'}>
                          {alert.value >= alert.threshold ? '✓ OK' : '⚠ Sous seuil'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
});

TeamAlertsPanel.displayName = 'TeamAlertsPanel';

export default TeamAlertsPanel;
