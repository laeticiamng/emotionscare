// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useAnomalyDetection } from '@/hooks/useAnomalyDetection';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Play,
  Settings,
  TrendingUp,
  TrendingDown,
  Minus,
  Brain,
  Clock,
  Activity,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const anomalyTypeLabels: Record<string, string> = {
  volume_spike: 'Pic de volume',
  unusual_time: 'Horaire inhabituel',
  unusual_resource: 'Ressource inhabituelle',
  velocity: 'Vélocité anormale',
  geographic: 'Anomalie géographique',
  bulk_export: 'Export massif',
};

const anomalyTypeIcons: Record<string, any> = {
  volume_spike: Activity,
  unusual_time: Clock,
  unusual_resource: Shield,
  velocity: TrendingUp,
  geographic: AlertTriangle,
  bulk_export: AlertTriangle,
};

const severityColors: Record<string, string> = {
  low: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  high: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  critical: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export const AnomalyDetectionDashboard: React.FC = () => {
  const {
    anomalies,
    rules,
    stats,
    loading,
    isScanning,
    runDetection,
    resolveAnomaly,
    updateRule,
    fetchAnomalies,
  } = useAnomalyDetection();

  const [selectedAnomaly, setSelectedAnomaly] = useState<any>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const filteredAnomalies = anomalies.filter(a => {
    if (filterSeverity !== 'all' && a.severity !== filterSeverity) return false;
    if (filterType !== 'all' && a.anomaly_type !== filterType) return false;
    return true;
  });

  const trendIcon = stats?.recentTrend === 'increasing' ? TrendingUp :
                    stats?.recentTrend === 'decreasing' ? TrendingDown : Minus;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Total anomalies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              {React.createElement(trendIcon, { className: 'h-3 w-3' })}
              Tendance: {stats?.recentTrend || 'stable'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Non résolues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats?.unresolved || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Nécessite attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Confiance moy.
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((stats?.avgConfidence || 0) * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">ML accuracy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Critique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {stats?.bySeverity?.critical || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Haute priorité</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Règles actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rules.filter(r => r.enabled).length}/{rules.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Détection ML</p>
          </CardContent>
        </Card>
      </div>

      {/* Trend Alert */}
      {stats?.recentTrend === 'increasing' && (
        <Alert className="border-orange-500/20 bg-orange-500/10">
          <TrendingUp className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-orange-500">
            Augmentation des anomalies détectées dans les dernières 24h. Surveillance accrue recommandée.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="anomalies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="anomalies">Anomalies détectées</TabsTrigger>
          <TabsTrigger value="rules">Règles ML</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Anomalies Tab */}
        <TabsContent value="anomalies" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Anomalies d'accès détectées
                  </CardTitle>
                  <CardDescription>
                    Comportements suspects identifiés par ML
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => runDetection({ mode: 'comprehensive' })}
                    disabled={isScanning}
                    size="sm"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {isScanning ? 'Scan en cours...' : 'Scanner maintenant'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium">Sévérité</label>
                  <select
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="all">Toutes</option>
                    <option value="critical">Critique</option>
                    <option value="high">Haute</option>
                    <option value="medium">Moyenne</option>
                    <option value="low">Basse</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="all">Tous</option>
                    {Object.entries(anomalyTypeLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Sévérité</TableHead>
                    <TableHead>Confiance</TableHead>
                    <TableHead>Détecté</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnomalies.map((anomaly) => {
                    const Icon = anomalyTypeIcons[anomaly.anomaly_type] || AlertTriangle;
                    return (
                      <TableRow key={anomaly.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <span className="text-sm">
                              {anomalyTypeLabels[anomaly.anomaly_type] || anomaly.anomaly_type}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {anomaly.description}
                        </TableCell>
                        <TableCell>
                          <Badge className={severityColors[anomaly.severity]}>
                            {anomaly.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary"
                                style={{ width: `${anomaly.confidence_score * 100}%` }}
                              />
                            </div>
                            <span className="text-xs">
                              {(anomaly.confidence_score * 100).toFixed(0)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                          {formatDistanceToNow(new Date(anomaly.detected_at), {
                            addSuffix: true,
                            locale: fr,
                          })}
                        </TableCell>
                        <TableCell>
                          {anomaly.resolved ? (
                            <Badge variant="outline" className="bg-green-500/10">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Résolue
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-orange-500/10">
                              En attente
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedAnomaly(anomaly)}
                                >
                                  Détails
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Détails de l'anomalie</DialogTitle>
                                  <DialogDescription>
                                    Analyse ML complète et contexte
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Description</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedAnomaly?.description}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Contexte ML</h4>
                                    <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                                      {JSON.stringify(selectedAnomaly?.context, null, 2)}
                                    </pre>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            {!anomaly.resolved && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => resolveAnomaly(anomaly.id, false)}
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => resolveAnomaly(anomaly.id, true)}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rules Tab */}
        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration des règles ML</CardTitle>
              <CardDescription>
                Ajustez la sensibilité et les paramètres de détection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Règle</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Activée</TableHead>
                    <TableHead>Sensibilité</TableHead>
                    <TableHead>Seuil</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.rule_name}</TableCell>
                      <TableCell>{rule.rule_type}</TableCell>
                      <TableCell>
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={(checked) =>
                            updateRule(rule.id, { enabled: checked })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="w-32">
                          <Slider
                            value={[rule.sensitivity * 100]}
                            onValueChange={([value]) =>
                              updateRule(rule.id, { sensitivity: value / 100 })
                            }
                            max={100}
                            step={1}
                          />
                          <span className="text-xs text-muted-foreground">
                            {(rule.sensitivity * 100).toFixed(0)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{rule.threshold_multiplier.toFixed(1)}x</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Insights ML et tendances</CardTitle>
              <CardDescription>
                Analyse intelligente des patterns de sécurité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Répartition par type</h4>
                  <div className="space-y-2">
                    {Object.entries(stats?.byType || {}).map(([type, count]) => (
                      <div key={type} className="flex justify-between items-center">
                        <span className="text-sm">{anomalyTypeLabels[type] || type}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Répartition par sévérité</h4>
                  <div className="space-y-2">
                    {Object.entries(stats?.bySeverity || {}).map(([severity, count]) => (
                      <div key={severity} className="flex justify-between items-center">
                        <Badge className={severityColors[severity]}>{severity}</Badge>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
