import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download, Filter, Clock, TrendingUp, AlertTriangle, Info, XCircle } from 'lucide-react';
import { useGDPRAlertHistory, exportAlertsToCSV } from '@/hooks/useGDPRAlertHistory';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

/**
 * Composant d'historique des alertes RGPD résolues
 * Affiche les alertes avec filtres, statistiques et export CSV
 */
export const GDPRAlertHistory: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [severity, setSeverity] = useState('');
  const [alertType, setAlertType] = useState('');

  const { alerts, statistics, isLoading } = useGDPRAlertHistory({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    severity: severity || undefined,
    alertType: alertType || undefined,
  });

  const handleExport = () => {
    if (alerts.length === 0) {
      toast.error('Aucune alerte à exporter');
      return;
    }
    exportAlertsToCSV(alerts);
    toast.success(`${alerts.length} alertes exportées en CSV`);
  };

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
    setSeverity('');
    setAlertType('');
  };

  const getSeverityIcon = (sev: string) => {
    switch (sev) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getSeverityBadge = (sev: string) => {
    const variants: Record<string, 'default' | 'destructive' | 'outline'> = {
      critical: 'destructive',
      warning: 'default',
      info: 'outline',
    };
    return variants[sev] || 'default';
  };

  const formatResolutionTime = (createdAt: string, resolvedAt: string | null) => {
    if (!resolvedAt) return 'N/A';
    const created = new Date(createdAt).getTime();
    const resolved = new Date(resolvedAt).getTime();
    const hours = Math.round((resolved - created) / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.round((resolved - created) / (1000 * 60));
      return `${minutes}min`;
    }
    if (hours < 24) {
      return `${hours}h`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}j ${remainingHours}h`;
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

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      {statistics && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total résolu</p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {statistics.totalResolved}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-950 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Temps moyen</p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {statistics.averageResolutionTime.toFixed(1)}h
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-950 rounded-full">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Par sévérité</p>
                <div className="space-y-1">
                  {Object.entries(statistics.bySeverity).map(([sev, count]) => (
                    <div key={sev} className="flex items-center justify-between text-sm">
                      <span className="capitalize">{sev}</span>
                      <Badge variant={getSeverityBadge(sev)} className="ml-2">
                        {count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Temps par sévérité</p>
                <div className="space-y-1">
                  {Object.entries(statistics.resolutionTimesBySeverity).map(([sev, time]) => (
                    <div key={sev} className="flex items-center justify-between text-sm">
                      <span className="capitalize">{sev}</span>
                      <span className="font-medium">{time.toFixed(1)}h</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtres */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres
              </CardTitle>
              <CardDescription>Filtrer l'historique des alertes résolues</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Réinitialiser
              </Button>
              <Button size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="severity">Sévérité</Label>
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger id="severity">
                  <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="alertType">Type d'alerte</Label>
              <Select value={alertType} onValueChange={setAlertType}>
                <SelectTrigger id="alertType">
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous</SelectItem>
                  <SelectItem value="export_urgent">Export Urgent</SelectItem>
                  <SelectItem value="deletion_urgent">Suppression Urgente</SelectItem>
                  <SelectItem value="consent_anomaly">Anomalie Consentements</SelectItem>
                  <SelectItem value="multiple_requests">Demandes Multiples</SelectItem>
                  <SelectItem value="suspicious_activity">Activité Suspecte</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des alertes */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des alertes résolues</CardTitle>
          <CardDescription>
            {alerts.length} alerte{alerts.length > 1 ? 's' : ''} résolue{alerts.length > 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune alerte résolue trouvée avec ces filtres
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sévérité</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead>Date de résolution</TableHead>
                    <TableHead>Temps</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(alert.severity)}
                          <Badge variant={getSeverityBadge(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getAlertTypeLabel(alert.alert_type)}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{alert.title}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(alert.created_at).toLocaleString('fr-FR', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {alert.resolved_at
                          ? new Date(alert.resolved_at).toLocaleString('fr-FR', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {formatResolutionTime(alert.created_at, alert.resolved_at)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GDPRAlertHistory;
