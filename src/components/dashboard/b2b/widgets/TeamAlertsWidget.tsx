// @ts-nocheck
/**
 * TeamAlertsWidget - Widget des alertes équipe
 * Affiche les alertes RH sans données individuelles
 */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Shield, TrendingDown, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useB2BTeamStats } from '@/hooks/useB2BTeamStats';

interface Alert {
  id: string;
  type: 'burnout_risk' | 'low_engagement' | 'stress_increase';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affectedCount: number;
  createdAt: string;
}

const MOCK_ALERTS: Alert[] = [
  {
    id: '1',
    type: 'stress_increase',
    severity: 'medium',
    title: 'Hausse du stress détectée',
    description: 'Une équipe présente des signaux de tension accrue cette semaine',
    affectedCount: 5,
    createdAt: '2025-01-15',
  },
  {
    id: '2',
    type: 'low_engagement',
    severity: 'low',
    title: 'Engagement en baisse',
    description: 'Participation aux activités bien-être en recul',
    affectedCount: 8,
    createdAt: '2025-01-14',
  },
];

export const TeamAlertsWidget: React.FC = () => {
  const { stats, loading } = useB2BTeamStats();

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

  const alerts = stats.alertsCount > 0 ? MOCK_ALERTS : [];

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
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
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
