import React, { useEffect, useState } from 'react';
import { Bell, AlertTriangle, CheckCircle, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/notification-system';
import { cn } from '@/lib/utils';
import {
  subscribeToSecurityAlerts,
  fetchUnacknowledgedAlerts,
  acknowledgeAlert,
  type SecurityAlert,
} from '@/services/securityAlertsService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const SecurityAlertsPanel: React.FC = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    loadAlerts();
    
    const unsubscribe = subscribeToSecurityAlerts((newAlert) => {
      setAlerts((prev) => [newAlert, ...prev]);
      
      const severityLevel = getSeverityLevel(newAlert.severity);
      if (severityLevel === 'critical' || severityLevel === 'high') {
        toast.error('Alerte de sécurité', newAlert.message);
      } else {
        toast.warning('Nouvelle alerte', newAlert.message);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const loadAlerts = async () => {
    try {
      setIsLoading(true);
      const data = await fetchUnacknowledgedAlerts();
      setAlerts(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcknowledge = async (alertId: string) => {
    try {
      // TODO: Get actual user ID from auth context
      await acknowledgeAlert(alertId, 'current-user-id');
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
      toast.success('Alerte traitée', 'L\'alerte a été marquée comme traitée.');
    } catch (error) {
      toast.error('Erreur', 'Impossible de traiter l\'alerte.');
    }
  };

  const getSeverityLevel = (severity: string) => {
    return severity as 'low' | 'medium' | 'high' | 'critical';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'high':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'medium':
        return 'bg-info/10 text-info border-info/20';
      case 'low':
        return 'bg-muted/10 text-muted-foreground border-muted/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <Bell className="h-4 w-4" />;
      case 'low':
        return <Shield className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Alertes de sécurité
            </CardTitle>
            <CardDescription>
              Alertes non traitées en temps réel
            </CardDescription>
          </div>
          <Badge variant="secondary">
            {alerts.length} {alerts.length > 1 ? 'alertes' : 'alerte'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">Chargement...</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <CheckCircle className="h-12 w-12 text-success mb-2" />
              <p className="text-sm font-medium">Aucune alerte active</p>
              <p className="text-xs text-muted-foreground">
                Tout semble en ordre
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <Card
                  key={alert.id}
                  className={cn(
                    'border-l-4',
                    getSeverityColor(alert.severity)
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {getSeverityIcon(alert.severity)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {alert.alert_type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {alert.severity}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium">
                            {alert.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(alert.created_at), 'PPp', { locale: fr })}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAcknowledge(alert.id)}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Traiter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
