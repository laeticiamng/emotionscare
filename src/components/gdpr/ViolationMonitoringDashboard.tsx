// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertTriangle,
  Shield,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  EyeOff,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { useViolationMonitoring, GDPRViolation, ViolationAlert } from '@/hooks/useViolationMonitoring';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ViolationMonitoringDashboard: React.FC = () => {
  const {
    violations,
    alerts,
    metrics,
    stats,
    riskScore,
    isLoading,
    isScanning,
    runDetection,
    updateViolationStatus,
    markAlertAsRead,
    dismissAlert,
    refresh,
  } = useViolationMonitoring();

  const [selectedViolation, setSelectedViolation] = useState<GDPRViolation | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'warning': return 'default';
      case 'low': return 'secondary';
      case 'info': return 'secondary';
      default: return 'secondary';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <Shield className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-destructive" />;
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-success" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 75) return 'text-destructive';
    if (score >= 50) return 'text-warning';
    if (score >= 25) return 'text-primary';
    return 'text-success';
  };

  const handleResolveViolation = async (status: GDPRViolation['status']) => {
    if (!selectedViolation) return;
    await updateViolationStatus(selectedViolation.id, status, resolutionNotes);
    setSelectedViolation(null);
    setResolutionNotes('');
  };

  const activeViolations = violations.filter(v => v.status === 'detected' || v.status === 'investigating');
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.is_read);
  const anomalies = metrics.filter(m => m.is_anomaly);

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Monitoring des Violations</h2>
          <p className="text-muted-foreground">
            Détection ML en temps réel et alertes proactives
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={refresh} variant="outline" disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button onClick={() => runDetection('scan')} disabled={isScanning}>
            <Zap className={`mr-2 h-4 w-4 ${isScanning ? 'animate-pulse' : ''}`} />
            {isScanning ? 'Analyse en cours...' : 'Lancer une analyse'}
          </Button>
        </div>
      </div>

      {/* Score de risque global */}
      <Card className="border-l-4" style={{ borderLeftColor: `hsl(var(--${riskScore >= 75 ? 'destructive' : riskScore >= 50 ? 'warning' : 'success'}))` }}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Score de Risque Global</span>
            <span className={`text-4xl font-bold ${getRiskScoreColor(riskScore)}`}>
              {riskScore.toFixed(0)}%
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={riskScore} className="h-3" />
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-destructive">{stats?.critical_violations || 0}</p>
              <p className="text-sm text-muted-foreground">Critiques</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">{stats?.high_violations || 0}</p>
              <p className="text-sm text-muted-foreground">Élevées</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-success">{stats?.resolved_violations || 0}</p>
              <p className="text-sm text-muted-foreground">Résolues</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertes critiques */}
      {criticalAlerts.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Alertes Critiques Non Lues</AlertTitle>
          <AlertDescription>
            {criticalAlerts.length} alerte(s) critique(s) nécessitent votre attention immédiate
          </AlertDescription>
        </Alert>
      )}

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Violations Actives</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeViolations.length}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {getTrendIcon(stats?.trend_direction || 'stable')}
              <span className="ml-1">{stats?.trend_direction || 'stable'}</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes Non Lues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.filter(a => !a.is_read).length}</div>
            <p className="text-xs text-muted-foreground">
              {criticalAlerts.length} critique(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anomalies Détectées</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{anomalies.length}</div>
            <p className="text-xs text-muted-foreground">
              24 dernières heures
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs pour violations et alertes */}
      <Tabs defaultValue="violations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="violations">
            Violations ({violations.length})
          </TabsTrigger>
          <TabsTrigger value="alerts">
            Alertes Proactives ({alerts.length})
          </TabsTrigger>
          <TabsTrigger value="anomalies">
            Anomalies ({anomalies.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="violations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Violations Détectées</CardTitle>
              <CardDescription>
                Liste des violations RGPD détectées par le système ML
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                {violations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 text-success" />
                    <p>Aucune violation détectée</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {violations.map((violation) => (
                      <Card key={violation.id} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setSelectedViolation(violation)}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <Badge variant={getSeverityColor(violation.severity)}>
                                  {getSeverityIcon(violation.severity)}
                                  <span className="ml-1">{violation.severity}</span>
                                </Badge>
                                <Badge variant="outline">{violation.violation_type}</Badge>
                                <Badge variant={
                                  violation.status === 'resolved' ? 'default' :
                                  violation.status === 'investigating' ? 'secondary' :
                                  'destructive'
                                }>
                                  {violation.status}
                                </Badge>
                              </div>
                              <CardTitle className="text-base">{violation.title}</CardTitle>
                            </div>
                            <div className="text-right text-sm">
                              <p className="font-semibold text-destructive">
                                Risque: {violation.risk_score}%
                              </p>
                              <p className="text-muted-foreground text-xs">
                                ML: {violation.ml_confidence}%
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground mb-2">
                            {violation.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{violation.affected_users_count} utilisateurs affectés</span>
                            <span>{format(new Date(violation.detected_at), 'Pp', { locale: fr })}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertes Proactives</CardTitle>
              <CardDescription>
                Alertes ML pour prévenir les incidents avant qu'ils ne surviennent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                {alerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="h-12 w-12 mx-auto mb-2" />
                    <p>Aucune alerte active</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <Alert key={alert.id} variant={alert.severity === 'critical' ? 'destructive' : 'default'}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={getSeverityColor(alert.severity)}>
                                {alert.severity}
                              </Badge>
                              <Badge variant="outline">{alert.alert_type}</Badge>
                              {!alert.is_read && <Badge variant="secondary">Non lu</Badge>}
                            </div>
                            <AlertTitle>{alert.title}</AlertTitle>
                            <AlertDescription className="mt-2">
                              {alert.message}
                            </AlertDescription>
                            {alert.recommendations.length > 0 && (
                              <div className="mt-3 space-y-1">
                                <p className="text-sm font-semibold">Recommandations:</p>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                  {alert.recommendations.map((rec, idx) => (
                                    <li key={idx}>{rec}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            <div className="mt-3 flex gap-2">
                              {!alert.is_read && (
                                <Button size="sm" variant="outline" onClick={() => markAlertAsRead(alert.id)}>
                                  <Eye className="mr-1 h-3 w-3" />
                                  Marquer comme lu
                                </Button>
                              )}
                              <Button size="sm" variant="ghost" onClick={() => dismissAlert(alert.id)}>
                                <EyeOff className="mr-1 h-3 w-3" />
                                Ignorer
                              </Button>
                            </div>
                          </div>
                          <div className="text-right text-xs text-muted-foreground">
                            <p>Confiance: {alert.confidence_score}%</p>
                            <p>{format(new Date(alert.triggered_at), 'Pp', { locale: fr })}</p>
                          </div>
                        </div>
                      </Alert>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Anomalies Détectées</CardTitle>
              <CardDescription>
                Métriques système présentant des valeurs anormales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                {anomalies.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-2" />
                    <p>Aucune anomalie détectée</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {anomalies.map((metric) => (
                      <Card key={metric.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">{metric.metric_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(metric.recorded_at), 'Pp', { locale: fr })}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-destructive">
                                {metric.metric_value} {metric.metric_unit}
                              </p>
                              {metric.threshold_value && (
                                <p className="text-xs text-muted-foreground">
                                  Seuil: {metric.threshold_value}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog pour résoudre une violation */}
      <Dialog open={!!selectedViolation} onOpenChange={() => setSelectedViolation(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la Violation</DialogTitle>
            <DialogDescription>
              Gérer le statut et la résolution de la violation
            </DialogDescription>
          </DialogHeader>
          {selectedViolation && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={getSeverityColor(selectedViolation.severity)}>
                  {selectedViolation.severity}
                </Badge>
                <Badge variant="outline">{selectedViolation.violation_type}</Badge>
              </div>
              <div>
                <h4 className="font-semibold mb-2">{selectedViolation.title}</h4>
                <p className="text-sm text-muted-foreground">{selectedViolation.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">Score de risque</p>
                  <p>{selectedViolation.risk_score}%</p>
                </div>
                <div>
                  <p className="font-semibold">Confiance ML</p>
                  <p>{selectedViolation.ml_confidence}%</p>
                </div>
                <div>
                  <p className="font-semibold">Utilisateurs affectés</p>
                  <p>{selectedViolation.affected_users_count}</p>
                </div>
                <div>
                  <p className="font-semibold">Détecté le</p>
                  <p>{format(new Date(selectedViolation.detected_at), 'Pp', { locale: fr })}</p>
                </div>
              </div>
              {selectedViolation.affected_data_types.length > 0 && (
                <div>
                  <p className="font-semibold text-sm mb-2">Types de données affectées</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedViolation.affected_data_types.map((type, idx) => (
                      <Badge key={idx} variant="outline">{type}</Badge>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm font-semibold mb-2 block">Notes de résolution</label>
                <Textarea
                  placeholder="Décrire les actions prises pour résoudre la violation..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => handleResolveViolation('false_positive')}>
              Faux positif
            </Button>
            <Button variant="secondary" onClick={() => handleResolveViolation('investigating')}>
              En investigation
            </Button>
            <Button onClick={() => handleResolveViolation('resolved')}>
              Résolu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViolationMonitoringDashboard;
