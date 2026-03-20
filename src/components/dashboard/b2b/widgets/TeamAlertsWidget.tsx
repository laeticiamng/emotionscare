/**
 * TeamAlertsWidget - Widget des alertes équipe
 * Affiche les alertes RH sans données individuelles
 */
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Shield, TrendingDown, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Alert {
  id: string;
  type: 'burnout_risk' | 'low_engagement' | 'stress_increase';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affectedCount: number;
  createdAt: string;
}

export const TeamAlertsWidget: React.FC = () => {
  const { user } = useAuth();

  // Fetch team alerts from Supabase
  const {
    data: alerts = [],
    isLoading,
    error,
  } = useQuery<Alert[]>({
    queryKey: ['team_alerts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('team_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      return (data ?? []).map((row: any) => ({
        id: row.id,
        type: row.type ?? 'stress_increase',
        severity: row.severity ?? 'medium',
        title: row.title ?? '',
        description: row.description ?? '',
        affectedCount: row.affected_count ?? 0,
        createdAt: row.created_at,
      }));
    },
    enabled: !!user?.id,
  });

  const getSeverityBadge = (severity: Alert['severity']) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">Urgent</Badge>;
      case 'medium':
        return <Badge className="bg-warning/10 text-warning border-warning/30">Modéré</Badge>;
      default:
        return <Badge variant="secondary">Faible</Badge>;
    }
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'burnout_risk':
        return <AlertTriangle className="h-5 w-5 text-destructive" aria-hidden="true" />;
      case 'stress_increase':
        return <TrendingDown className="h-5 w-5 text-warning" aria-hidden="true" />;
      default:
        return <Users className="h-5 w-5 text-muted-foreground" aria-hidden="true" />;
    }
  };

  return (
    <Card className={alerts.length > 0 ? 'border-warning/30' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            Alertes équipe
          </CardTitle>
          {alerts.length > 0 && (
            <Badge variant="outline" className="text-warning border-warning/50">
              {alerts.length} active{alerts.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : error ? (
          <div className="text-center py-6" role="alert">
            <AlertTriangle className="h-8 w-8 mx-auto text-red-500 mb-2" />
            <p className="text-sm text-red-500">Erreur lors du chargement des alertes</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-6">
            <Shield className="h-12 w-12 text-success mx-auto mb-3" aria-hidden="true" />
            <p className="font-medium text-success">Tout va bien</p>
            <p className="text-sm text-muted-foreground mt-1">
              Aucune alerte détectée pour votre équipe
            </p>
          </div>
        ) : (
          <div className="space-y-4" role="list" aria-label="Liste des alertes">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 bg-muted/50 rounded-lg space-y-2"
                role="listitem"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type)}
                    <div>
                      <h4 className="font-medium">{alert.title}</h4>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                    </div>
                  </div>
                  {getSeverityBadge(alert.severity)}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" aria-hidden="true" />
                    {alert.affectedCount}+ collaborateurs concernés
                  </span>
                  <span>{new Date(alert.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            ))}

            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/b2b/alerts">
                Voir toutes les alertes
                <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
              </Link>
            </Button>

            <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
              <Shield className="h-3 w-3" aria-hidden="true" />
              Alertes anonymisées — Aucune donnée individuelle
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamAlertsWidget;
