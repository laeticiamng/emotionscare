import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  Clock, 
  Zap,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface AnalyticsData {
  activeUsers: number;
  pageViews: number;
  sessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  errorRate: number;
  performanceScore: number;
  userSatisfaction: number;
  realTimeEvents: RealtimeEvent[];
  trends: {
    [key: string]: {
      value: number;
      change: number;
      trend: 'up' | 'down' | 'stable';
    };
  };
}

interface RealtimeEvent {
  id: string;
  type: 'user_action' | 'performance' | 'error' | 'conversion';
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, any>;
}

interface AlertRule {
  id: string;
  metric: string;
  condition: 'above' | 'below';
  threshold: number;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Composant d'analytics en temps réel avec monitoring avancé
 */
export const RealTimeAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    activeUsers: 0,
    pageViews: 0,
    sessionDuration: 0,
    bounceRate: 0,
    conversionRate: 0,
    errorRate: 0,
    performanceScore: 0,
    userSatisfaction: 0,
    realTimeEvents: [],
    trends: {}
  });

  const [isConnected, setIsConnected] = useState(false);
  const [alerts, setAlerts] = useState<RealtimeEvent[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string>('activeUsers');
  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    {
      id: '1',
      metric: 'errorRate',
      condition: 'above',
      threshold: 5,
      message: 'Taux d\'erreur élevé détecté',
      severity: 'high'
    },
    {
      id: '2',
      metric: 'performanceScore',
      condition: 'below',
      threshold: 70,
      message: 'Performance dégradée',
      severity: 'medium'
    }
  ]);

  const wsRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();

  // Connexion WebSocket pour les données temps réel
  useEffect(() => {
    connectWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Monitoring des alertes
  useEffect(() => {
    checkAlerts();
  }, [analyticsData, alertRules]);

  const connectWebSocket = useCallback(() => {
    try {
      // En production, remplacer par votre endpoint WebSocket réel
      wsRef.current = new WebSocket('wss://your-analytics-ws-endpoint.com');
      
      wsRef.current.onopen = () => {
        setIsConnected(true);
        toast({
          title: "Analytics connectées",
          description: "Monitoring en temps réel activé",
        });
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        updateAnalyticsData(data);
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        // Reconnexion automatique
        setTimeout(connectWebSocket, 5000);
      };

      wsRef.current.onerror = (error) => {
        logger.error('WebSocket error', { error }, 'ANALYTICS');
        setIsConnected(false);
      };

    } catch (error) {
      logger.error('Failed to connect WebSocket', { error }, 'ANALYTICS');
      // Fallback sur des données simulées
      startMockData();
    }
  }, [toast]);

  // Simulation de données pour développement
  const startMockData = useCallback(() => {
    const interval = setInterval(() => {
      const mockData = generateMockData();
      updateAnalyticsData(mockData);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const generateMockData = (): Partial<AnalyticsData> => {
    const now = new Date();
    
    return {
      activeUsers: Math.floor(Math.random() * 500) + 100,
      pageViews: Math.floor(Math.random() * 1000) + 500,
      sessionDuration: Math.floor(Math.random() * 300) + 120,
      bounceRate: Math.random() * 40 + 20,
      conversionRate: Math.random() * 10 + 2,
      errorRate: Math.random() * 8,
      performanceScore: Math.random() * 40 + 60,
      userSatisfaction: Math.random() * 30 + 70,
      realTimeEvents: [
        {
          id: Math.random().toString(36),
          type: 'user_action',
          message: 'Nouvel utilisateur connecté',
          timestamp: now,
          severity: 'low'
        }
      ],
      trends: {
        activeUsers: {
          value: Math.floor(Math.random() * 500) + 100,
          change: (Math.random() - 0.5) * 20,
          trend: Math.random() > 0.5 ? 'up' : 'down'
        }
      }
    };
  };

  const updateAnalyticsData = useCallback((newData: Partial<AnalyticsData>) => {
    setAnalyticsData(prev => ({
      ...prev,
      ...newData,
      realTimeEvents: [
        ...(newData.realTimeEvents || []),
        ...prev.realTimeEvents.slice(0, 19) // Garder les 20 derniers événements
      ]
    }));
  }, []);

  const checkAlerts = useCallback(() => {
    alertRules.forEach(rule => {
      const value = analyticsData[rule.metric as keyof AnalyticsData] as number;
      
      if (
        (rule.condition === 'above' && value > rule.threshold) ||
        (rule.condition === 'below' && value < rule.threshold)
      ) {
        const alertEvent: RealtimeEvent = {
          id: Math.random().toString(36),
          type: 'error',
          message: rule.message,
          timestamp: new Date(),
          severity: rule.severity,
          metadata: { metric: rule.metric, value, threshold: rule.threshold }
        };

        setAlerts(prev => [alertEvent, ...prev.slice(0, 4)]);
        
        if (rule.severity === 'critical' || rule.severity === 'high') {
          toast({
            title: "🚨 Alerte critique",
            description: rule.message,
            variant: "destructive"
          });
        }
      }
    });
  }, [analyticsData, alertRules, toast]);

  const getMetricIcon = (metric: string) => {
    const icons = {
      activeUsers: Users,
      pageViews: Eye,
      sessionDuration: Clock,
      performanceScore: Zap,
      errorRate: AlertCircle,
      conversionRate: TrendingUp,
      bounceRate: TrendingDown,
      userSatisfaction: CheckCircle
    };
    return icons[metric as keyof typeof icons] || Activity;
  };

  const getMetricColor = (value: number, metric: string) => {
    const ranges = {
      performanceScore: { good: 80, warning: 60 },
      errorRate: { good: 2, warning: 5 },
      conversionRate: { good: 5, warning: 2 },
      userSatisfaction: { good: 80, warning: 60 }
    };

    const range = ranges[metric as keyof typeof ranges];
    if (!range) return 'text-foreground';

    if (metric === 'errorRate') {
      return value <= range.good ? 'text-green-500' : 
             value <= range.warning ? 'text-yellow-500' : 'text-red-500';
    } else {
      return value >= range.good ? 'text-green-500' : 
             value >= range.warning ? 'text-yellow-500' : 'text-red-500';
    }
  };

  const formatValue = (value: number, metric: string) => {
    switch (metric) {
      case 'sessionDuration':
        return `${Math.floor(value / 60)}:${(value % 60).toString().padStart(2, '0')}`;
      case 'bounceRate':
      case 'conversionRate':
      case 'errorRate':
        return `${value.toFixed(1)}%`;
      case 'performanceScore':
      case 'userSatisfaction':
        return `${Math.round(value)}/100`;
      default:
        return Math.round(value).toLocaleString();
    }
  };

  const metrics = [
    { key: 'activeUsers', label: 'Utilisateurs actifs', description: 'Actuellement en ligne' },
    { key: 'pageViews', label: 'Vues de page', description: 'Dernière heure' },
    { key: 'sessionDuration', label: 'Durée de session', description: 'Moyenne' },
    { key: 'bounceRate', label: 'Taux de rebond', description: 'Pourcentage' },
    { key: 'conversionRate', label: 'Taux de conversion', description: 'Objectifs atteints' },
    { key: 'errorRate', label: 'Taux d\'erreur', description: 'Erreurs système' },
    { key: 'performanceScore', label: 'Performance', description: 'Score global' },
    { key: 'userSatisfaction', label: 'Satisfaction', description: 'Score utilisateur' }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header avec statut de connexion */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Temps Réel</h1>
          <p className="text-muted-foreground">
            Monitoring en direct de votre plateforme EmotionsCare
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge 
            variant={isConnected ? "default" : "destructive"}
            className="flex items-center gap-2"
          >
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
            {isConnected ? 'Connecté' : 'Déconnecté'}
          </Badge>
          
          <Button
            variant="outline"
            onClick={connectWebSocket}
            disabled={isConnected}
          >
            Reconnecter
          </Button>
        </div>
      </div>

      {/* Alertes critiques */}
      {alerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Alertes Actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.map(alert => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-white rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={
                      alert.severity === 'critical' ? 'destructive' : 
                      alert.severity === 'high' ? 'destructive' :
                      alert.severity === 'medium' ? 'secondary' : 'outline'
                    }>
                      {alert.severity}
                    </Badge>
                    <span className="font-medium">{alert.message}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {alert.timestamp.toLocaleTimeString()}
                  </span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Métriques principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = getMetricIcon(metric.key);
          const value = analyticsData[metric.key as keyof AnalyticsData] as number;
          const trend = analyticsData.trends[metric.key];
          
          return (
            <motion.div
              key={metric.key}
              layout
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedMetric(metric.key)}
              className={`cursor-pointer ${selectedMetric === metric.key ? 'ring-2 ring-primary' : ''}`}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 ${getMetricColor(value, metric.key)}`} />
                    {trend && (
                      <Badge variant={trend.trend === 'up' ? 'default' : 'secondary'} className="text-xs">
                        {trend.change > 0 ? '+' : ''}{trend.change.toFixed(1)}%
                      </Badge>
                    )}
                  </div>
                  
                  <motion.div
                    className="space-y-1"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    key={value} // Re-animate when value changes
                  >
                    <div className={`text-2xl font-bold ${getMetricColor(value, metric.key)}`}>
                      {formatValue(value, metric.key)}
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {metric.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {metric.description}
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Événements temps réel et graphiques */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Événements temps réel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Activité Temps Réel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {analyticsData.realTimeEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                >
                  <div className={`w-3 h-3 rounded-full ${
                    event.type === 'error' ? 'bg-red-400' :
                    event.type === 'conversion' ? 'bg-green-400' :
                    event.type === 'performance' ? 'bg-yellow-400' :
                    'bg-blue-400'
                  }`} />
                  
                  <div className="flex-1">
                    <div className="font-medium text-sm">{event.message}</div>
                    <div className="text-xs text-muted-foreground">
                      {event.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  
                  <Badge variant={
                    event.severity === 'critical' ? 'destructive' :
                    event.severity === 'high' ? 'destructive' :
                    event.severity === 'medium' ? 'secondary' :
                    'outline'
                  } className="text-xs">
                    {event.severity}
                  </Badge>
                </motion.div>
              ))}
              
              {analyticsData.realTimeEvents.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  Aucun événement récent
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Visualisation de la métrique sélectionnée */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Détails: {metrics.find(m => m.key === selectedMetric)?.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MetricChart 
              metric={selectedMetric}
              currentValue={analyticsData[selectedMetric as keyof AnalyticsData] as number}
              trend={analyticsData.trends[selectedMetric]}
            />
          </CardContent>
        </Card>
      </div>

      {/* Configuration des alertes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Règles d'Alerte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alertRules.map(rule => (
              <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">
                    {rule.metric} {rule.condition === 'above' ? '>' : '<'} {rule.threshold}
                  </div>
                  <div className="text-sm text-muted-foreground">{rule.message}</div>
                </div>
                <Badge variant={
                  rule.severity === 'critical' ? 'destructive' :
                  rule.severity === 'high' ? 'destructive' :
                  'secondary'
                }>
                  {rule.severity}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Composant de graphique pour métrique individuelle
interface MetricChartProps {
  metric: string;
  currentValue: number;
  trend?: {
    value: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
}

const MetricChart: React.FC<MetricChartProps> = ({ metric: _metric, currentValue, trend }) => {
  const [historicalData, setHistoricalData] = useState<number[]>([]);

  useEffect(() => {
    // Simuler des données historiques
    setHistoricalData(prev => {
      const newData = [...prev, currentValue].slice(-20);
      return newData;
    });
  }, [currentValue]);

  const maxValue = Math.max(...historicalData, currentValue);
  const minValue = Math.min(...historicalData, currentValue);

  return (
    <div className="space-y-4">
      {/* Graphique simple avec SVG */}
      <div className="h-32 relative bg-muted/30 rounded-lg p-4">
        <svg width="100%" height="100%" className="absolute inset-0">
          {historicalData.map((value, index) => {
            const x = (index / (historicalData.length - 1)) * 100;
            const y = 100 - ((value - minValue) / (maxValue - minValue)) * 80;
            
            return (
              <motion.circle
                key={index}
                cx={`${x}%`}
                cy={`${y}%`}
                r="2"
                fill="currentColor"
                className="text-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              />
            );
          })}
          
          {historicalData.length > 1 && (
            <motion.path
              d={`M ${historicalData.map((value, index) => {
                const x = (index / (historicalData.length - 1)) * 100;
                const y = 100 - ((value - minValue) / (maxValue - minValue)) * 80;
                return `${x} ${y}`;
              }).join(' L ')}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1 }}
            />
          )}
        </svg>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-sm text-muted-foreground">Actuel</div>
          <div className="font-bold text-lg">{currentValue.toFixed(1)}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Max</div>
          <div className="font-bold text-lg">{maxValue.toFixed(1)}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Min</div>
          <div className="font-bold text-lg">{minValue.toFixed(1)}</div>
        </div>
      </div>

      {trend && (
        <div className="text-center">
          <Badge variant={trend.trend === 'up' ? 'default' : 'secondary'}>
            {trend.trend === 'up' ? '↗' : trend.trend === 'down' ? '↘' : '→'} 
            {trend.change.toFixed(1)}% vs précédent
          </Badge>
        </div>
      )}
    </div>
  );
};