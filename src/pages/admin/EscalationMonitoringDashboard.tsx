import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw,
  Brain,
  BarChart3,
  MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { MonitoringChatbot } from '@/components/monitoring/MonitoringChatbot';

const EscalationMonitoringDashboard: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedEscalation, setSelectedEscalation] = useState<any>(null);

  // Fetch active escalations
  const { data: activeEscalations, refetch: refetchEscalations } = useQuery({
    queryKey: ['active-escalations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('active_escalations')
        .select('*, unified_alerts(*)')
        .eq('status', 'active')
        .order('started_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 5000, // Real-time refresh every 5s
  });

  // Fetch ML predictions
  const { data: mlPredictions } = useQuery({
    queryKey: ['ml-predictions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ml_predictions')
        .select('*')
        .order('predicted_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch performance metrics
  const { data: performanceMetrics } = useQuery({
    queryKey: ['escalation-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('escalation_performance_metrics')
        .select('*')
        .order('metric_date', { ascending: false })
        .limit(30);
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch error patterns for heatmap
  const { data: errorPatterns } = useQuery({
    queryKey: ['error-patterns-heatmap'],
    queryFn: async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data, error } = await supabase
        .from('error_patterns_history')
        .select('*')
        .gte('occurred_at', sevenDaysAgo.toISOString())
        .order('occurred_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const triggerMLAnalysis = async () => {
    setIsRefreshing(true);
    try {
      const { error } = await supabase.functions.invoke('ml-alert-predictor');
      if (error) throw error;
      
      toast.success('Analyse ML lancée avec succès');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('ML analysis error:', error);
      toast.error('Erreur lors de l\'analyse ML');
    } finally {
      setIsRefreshing(false);
    }
  };

  const triggerOptimization = async () => {
    setIsRefreshing(true);
    try {
      const { error } = await supabase.functions.invoke('optimize-escalation-rules');
      if (error) throw error;
      
      toast.success('Optimisation des règles lancée');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Optimization error:', error);
      toast.error('Erreur lors de l\'optimisation');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Generate heatmap data
  const generateHeatmapData = () => {
    if (!errorPatterns) return [];
    
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    
    const heatmap: any[] = [];
    
    days.forEach((day, dayIndex) => {
      hours.forEach(hour => {
        const count = errorPatterns.filter(p => {
          const date = new Date(p.occurred_at);
          return date.getDay() === dayIndex && date.getHours() === hour;
        }).length;
        
        heatmap.push({ day, hour, count });
      });
    });
    
    return heatmap;
  };

  const heatmapData = generateHeatmapData();
  const maxCount = Math.max(...heatmapData.map(d => d.count), 1);

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Monitoring Escalades</h1>
          <p className="text-muted-foreground">
            Visualisation temps réel avec ML et analytics avancés
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={triggerMLAnalysis} 
            disabled={isRefreshing}
            variant="outline"
          >
            <Brain className="mr-2 h-4 w-4" />
            Analyse ML
          </Button>
          <Button 
            onClick={triggerOptimization} 
            disabled={isRefreshing}
            variant="outline"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Optimiser
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Escalades Actives</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeEscalations?.length || 0}</div>
            <p className="text-xs text-muted-foreground">En cours de résolution</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Prédictions ML</CardTitle>
            <Brain className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mlPredictions?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Analyses disponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taux de Résolution</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceMetrics && performanceMetrics.length > 0
                ? Math.round(
                    performanceMetrics.reduce((sum, m) => sum + (m.escalation_accuracy || 0), 0) / 
                    performanceMetrics.length
                  )
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Précision moyenne</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Temps Moyen</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceMetrics && performanceMetrics.length > 0
                ? Math.round(
                    performanceMetrics.reduce((sum, m) => sum + (m.avg_resolution_time_minutes || 0), 0) / 
                    performanceMetrics.length
                  )
                : 0}min
            </div>
            <p className="text-xs text-muted-foreground">Temps de résolution</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">Timeline Interactive</TabsTrigger>
          <TabsTrigger value="heatmap">Heatmap Patterns</TabsTrigger>
          <TabsTrigger value="predictions">Prédictions ML</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Timeline Interactive */}
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Escalades en Cours - Timeline</CardTitle>
              <CardDescription>
                Mise à jour automatique toutes les 5 secondes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!activeEscalations || activeEscalations.length === 0 ? (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Aucune escalade active pour le moment
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {activeEscalations.map((escalation) => {
                    const alert = escalation.unified_alerts;
                    const duration = Math.floor(
                      (new Date().getTime() - new Date(escalation.started_at).getTime()) / 60000
                    );
                    
                    return (
                      <Card key={escalation.id} className="border-l-4" style={{
                        borderLeftColor: 
                          escalation.current_level >= 3 ? '#ef4444' :
                          escalation.current_level === 2 ? '#f59e0b' : '#3b82f6'
                      }}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <CardTitle className="text-lg">{alert?.title}</CardTitle>
                              <div className="flex gap-2 items-center flex-wrap">
                                <Badge variant={
                                  alert?.severity === 'critical' ? 'destructive' :
                                  alert?.severity === 'high' ? 'destructive' :
                                  alert?.severity === 'medium' ? 'default' : 'secondary'
                                }>
                                  {alert?.severity}
                                </Badge>
                                <Badge variant="outline">
                                  Niveau {escalation.current_level}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {alert?.context}
                                </span>
                              </div>
                            </div>
                            <div className="text-right text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {duration}min
                              </div>
                              <div>{format(new Date(escalation.started_at), 'HH:mm')}</div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-2">
                            {alert?.description}
                          </p>
                          {escalation.assigned_to && escalation.assigned_to.length > 0 && (
                            <div className="flex gap-1 flex-wrap">
                              {escalation.assigned_to.map((user: string, idx: number) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {user}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Heatmap */}
        <TabsContent value="heatmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Heatmap des Patterns d'Erreurs</CardTitle>
              <CardDescription>
                Distribution temporelle des erreurs (7 derniers jours)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="inline-grid gap-1" style={{
                  gridTemplateColumns: `auto repeat(24, 24px)`,
                  gridTemplateRows: `auto repeat(7, 32px)`,
                }}>
                  {/* Header row with hours */}
                  <div></div>
                  {Array.from({ length: 24 }, (_, i) => (
                    <div key={i} className="text-xs text-center text-muted-foreground">
                      {i}
                    </div>
                  ))}
                  
                  {/* Data rows */}
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, dayIndex) => (
                    <React.Fragment key={day}>
                      <div className="text-xs pr-2 flex items-center text-muted-foreground">
                        {day}
                      </div>
                      {Array.from({ length: 24 }, (_, hour) => {
                        const cell = heatmapData.find(d => d.day === day && d.hour === hour);
                        const intensity = cell ? cell.count / maxCount : 0;
                        
                        return (
                          <div
                            key={`${day}-${hour}`}
                            className="rounded cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                            style={{
                              backgroundColor: intensity === 0 
                                ? 'hsl(var(--muted))' 
                                : `rgba(239, 68, 68, ${0.2 + intensity * 0.8})`,
                              height: '32px',
                            }}
                            title={`${day} ${hour}h: ${cell?.count || 0} erreurs`}
                          />
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded bg-muted" />
                  Aucune
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.4)' }} />
                  Faible
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.7)' }} />
                  Moyen
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 1)' }} />
                  Élevé
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ML Predictions */}
        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prédictions Machine Learning</CardTitle>
              <CardDescription>
                Analyses prédictives basées sur l'historique
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!mlPredictions || mlPredictions.length === 0 ? (
                <Alert>
                  <Brain className="h-4 w-4" />
                  <AlertDescription>
                    Aucune prédiction disponible. Lancez une analyse ML.
                  </AlertDescription>
                </Alert>
              ) : (
                mlPredictions.map((prediction) => (
                  <Card key={prediction.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">
                            {prediction.prediction_type === 'alert_forecast' && 'Prévision Alertes'}
                            {prediction.prediction_type === 'pattern_detection' && 'Détection Patterns'}
                            {prediction.prediction_type === 'escalation_optimization' && 'Optimisation Escalades'}
                          </CardTitle>
                          <CardDescription>
                            {format(new Date(prediction.predicted_at), 'dd/MM/yyyy HH:mm')}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">
                          Confiance: {Math.round((prediction.confidence_score || 0) * 100)}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs bg-muted p-4 rounded overflow-auto max-h-64">
                        {JSON.stringify(prediction.prediction_data, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Metrics */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Métriques de Performance</CardTitle>
              <CardDescription>
                Analyse des performances d'escalade par règle
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!performanceMetrics || performanceMetrics.length === 0 ? (
                <Alert>
                  <BarChart3 className="h-4 w-4" />
                  <AlertDescription>
                    Aucune métrique disponible
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {performanceMetrics.slice(0, 10).map((metric) => (
                    <Card key={metric.id}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="space-y-1">
                            <div className="font-medium">
                              {format(new Date(metric.metric_date), 'dd/MM/yyyy')}
                            </div>
                            <div className="flex gap-2 text-sm text-muted-foreground">
                              <span>Précision: {metric.escalation_accuracy?.toFixed(1)}%</span>
                              <span>•</span>
                              <span>Temps: {metric.avg_resolution_time_minutes}min</span>
                            </div>
                          </div>
                          <Badge variant={
                            (metric.escalation_accuracy || 0) > 80 ? 'default' :
                            (metric.escalation_accuracy || 0) > 60 ? 'secondary' : 'destructive'
                          }>
                            {(metric.escalation_accuracy || 0) > 80 ? 'Excellent' :
                             (metric.escalation_accuracy || 0) > 60 ? 'Bon' : 'À améliorer'}
                          </Badge>
                        </div>
                        {metric.recommendation && (
                          <Alert className="mt-2">
                            <TrendingUp className="h-4 w-4" />
                            <AlertDescription className="text-xs">
                              {JSON.stringify(metric.recommendation)}
                            </AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chatbot">
          <div className="h-[600px]">
            <MonitoringChatbot />
          </div>
        </TabsContent>

        <TabsContent value="chatbot">
          <div className="h-[600px]">
            <MonitoringChatbot />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EscalationMonitoringDashboard;