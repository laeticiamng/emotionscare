import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Bell, CheckCircle, Info, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface GDPRAlert {
  id: string;
  alert_type: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string | null;
  metadata: any;
  user_id: string | null;
  resolved: boolean;
  created_at: string;
}

const GDPRAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<GDPRAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('gdpr_alerts')
        .select('*')
        .eq('resolved', false)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      setAlerts(data || []);
    } catch (error) {
      logger.error('Error fetching GDPR alerts', error as Error, 'GDPR');
      toast.error('Erreur lors du chargement des alertes RGPD');
    } finally {
      setIsLoading(false);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('gdpr_alerts')
        .update({
          resolved: true,
          resolved_at: new Date().toISOString(),
          resolved_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq('id', alertId);

      if (error) throw error;

      setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
      toast.success('Alerte résolue');
    } catch (error) {
      logger.error('Error resolving alert', error as Error, 'GDPR');
      toast.error('Erreur lors de la résolution de l\'alerte');
    }
  };

  useEffect(() => {
    fetchAlerts();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('gdpr-alerts-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'gdpr_alerts',
        },
        (payload) => {
          const newAlert = payload.new as GDPRAlert;
          if (!newAlert.resolved) {
            setAlerts((prev) => [newAlert, ...prev]);
            toast.warning(`Nouvelle alerte RGPD: ${newAlert.title}`, {
              description: newAlert.description || undefined,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getSeverityVariant = (severity: string): 'default' | 'destructive' => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'warning':
      case 'info':
      default:
        return 'default';
    }
  };

  const getAlertTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      export_urgent: 'Export Urgent',
      deletion_urgent: 'Suppression Urgente',
      consent_anomaly: 'Anomalie Consentements',
      multiple_requests: 'Demandes Multiples',
      suspicious_activity: 'Activité Suspecte',
    };
    return labels[type] || type;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alertes RGPD</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Chargement des alertes...</p>
        </CardContent>
      </Card>
    );
  }

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Alertes RGPD
          </CardTitle>
          <CardDescription>Aucune alerte active</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Tout va bien !</AlertTitle>
            <AlertDescription>
              Aucune anomalie RGPD détectée. Continuez votre excellente gestion des données.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-orange-500" />
          Alertes RGPD
          <Badge variant="destructive">{alerts.length}</Badge>
        </CardTitle>
        <CardDescription>
          Alertes actives nécessitant votre attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Alert key={alert.id} variant={getSeverityVariant(alert.severity)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  {getSeverityIcon(alert.severity)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTitle className="mb-0">{alert.title}</AlertTitle>
                      <Badge variant="outline" className="text-xs">
                        {getAlertTypeLabel(alert.alert_type)}
                      </Badge>
                    </div>
                    <AlertDescription>{alert.description}</AlertDescription>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(alert.created_at).toLocaleString('fr-FR', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => resolveAlert(alert.id)}
                >
                  Résoudre
                </Button>
              </div>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GDPRAlerts;
