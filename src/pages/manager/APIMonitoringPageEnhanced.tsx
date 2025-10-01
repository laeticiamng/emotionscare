// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Zap,
  Server,
  Database,
  Globe,
  Shield,
  RefreshCw,
  BarChart3,
  Monitor,
  Wifi,
  AlertCircle
} from 'lucide-react';

interface APIEndpoint {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  status: 'healthy' | 'warning' | 'error' | 'down';
  responseTime: number;
  uptime: number;
  lastCheck: Date;
  errorRate: number;
  requestsPerMinute: number;
}

interface APIMetric {
  timestamp: Date;
  responseTime: number;
  statusCode: number;
  endpoint: string;
}

interface Alert {
  id: string;
  endpoint: string;
  type: 'latency' | 'error' | 'downtime';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

const APIMonitoringPageEnhanced: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([
    {
      id: '1',
      name: 'User Authentication',
      url: '/api/auth/login',
      method: 'POST',
      status: 'healthy',
      responseTime: 245,
      uptime: 99.9,
      lastCheck: new Date(),
      errorRate: 0.1,
      requestsPerMinute: 147
    },
    {
      id: '2',
      name: 'Emotion Analysis',
      url: '/api/emotions/analyze',
      method: 'POST',
      status: 'warning',
      responseTime: 1200,
      uptime: 98.5,
      lastCheck: new Date(Date.now() - 30000),
      errorRate: 2.3,
      requestsPerMinute: 89
    },
    {
      id: '3',
      name: 'User Profile',
      url: '/api/users/profile',
      method: 'GET',
      status: 'healthy',
      responseTime: 89,
      uptime: 99.8,
      lastCheck: new Date(),
      errorRate: 0.05,
      requestsPerMinute: 234
    },
    {
      id: '4',
      name: 'Music Recommendations',
      url: '/api/music/recommendations',
      method: 'GET',
      status: 'error',
      responseTime: 5000,
      uptime: 95.2,
      lastCheck: new Date(Date.now() - 120000),
      errorRate: 15.7,
      requestsPerMinute: 23
    },
    {
      id: '5',
      name: 'Session Management',
      url: '/api/sessions',
      method: 'GET',
      status: 'healthy',
      responseTime: 156,
      uptime: 99.95,
      lastCheck: new Date(),
      errorRate: 0.02,
      requestsPerMinute: 312
    }
  ]);

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      endpoint: 'Music Recommendations',
      type: 'error',
      severity: 'high',
      message: 'Taux d\'erreur élevé (15.7%) détecté',
      timestamp: new Date(Date.now() - 600000),
      resolved: false
    },
    {
      id: '2',
      endpoint: 'Emotion Analysis',
      type: 'latency',
      severity: 'medium',
      message: 'Temps de réponse supérieur à 1s',
      timestamp: new Date(Date.now() - 1800000),
      resolved: false
    },
    {
      id: '3',
      endpoint: 'User Authentication',
      type: 'downtime',
      severity: 'critical',
      message: 'Service indisponible pendant 2 minutes',
      timestamp: new Date(Date.now() - 7200000),
      resolved: true
    }
  ]);

  const overallMetrics = {
    totalRequests: 45678,
    avgResponseTime: 445,
    uptime: 99.2,
    errorRate: 2.8,
    healthyEndpoints: endpoints.filter(e => e.status === 'healthy').length,
    totalEndpoints: endpoints.length
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update random metrics
    setEndpoints(prev => prev.map(endpoint => ({
      ...endpoint,
      responseTime: Math.max(50, endpoint.responseTime + (Math.random() - 0.5) * 200),
      errorRate: Math.max(0, endpoint.errorRate + (Math.random() - 0.5) * 2),
      lastCheck: new Date()
    })));
    
    setIsRefreshing(false);
  };

  const getStatusColor = (status: APIEndpoint['status']) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      case 'down': return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: APIEndpoint['status']) => {
    const variants: Record<string, any> = {
      healthy: 'default',
      warning: 'secondary',
      error: 'destructive',
      down: 'outline'
    };
    return variants[status] || 'outline';
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'low': return 'bg-blue-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
    }
  };

  const getResponseTimeStatus = (time: number) => {
    if (time < 200) return 'excellent';
    if (time < 500) return 'good';
    if (time < 1000) return 'acceptable';
    return 'slow';
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Monitor className="h-8 w-8 text-primary" />
            Monitoring API
          </h1>
          <p className="text-muted-foreground mt-2">
            Surveillance en temps réel des performances et disponibilité
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15m">15 min</SelectItem>
              <SelectItem value="1h">1 heure</SelectItem>
              <SelectItem value="6h">6 heures</SelectItem>
              <SelectItem value="24h">24 heures</SelectItem>
              <SelectItem value="7d">7 jours</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRefreshData} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </motion.div>

      {/* Overview Cards */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibilité Globale</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{overallMetrics.uptime}%</div>
            <p className="text-xs text-muted-foreground">+0.1% vs hier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps de Réponse Moyen</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallMetrics.avgResponseTime}ms</div>
            <p className="text-xs text-muted-foreground">-23ms vs hier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requêtes Totales</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallMetrics.totalRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8.2% vs hier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'Erreur</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{overallMetrics.errorRate}%</div>
            <p className="text-xs text-muted-foreground">+0.5% vs hier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Endpoints Sains</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallMetrics.healthyEndpoints}/{overallMetrics.totalEndpoints}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((overallMetrics.healthyEndpoints / overallMetrics.totalEndpoints) * 100)}% opérationnels
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="alerts">Alertes</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>État des Services</CardTitle>
                <CardDescription>Vue d'ensemble de la santé des APIs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {endpoints.slice(0, 3).map((endpoint) => (
                    <div key={endpoint.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          endpoint.status === 'healthy' ? 'bg-green-500' :
                          endpoint.status === 'warning' ? 'bg-yellow-500' :
                          endpoint.status === 'error' ? 'bg-red-500' : 'bg-gray-500'
                        }`} />
                        <div>
                          <p className="font-medium">{endpoint.name}</p>
                          <p className="text-sm text-muted-foreground">{endpoint.url}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={getStatusBadge(endpoint.status)}>
                          {endpoint.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {endpoint.responseTime}ms
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alertes Récentes</CardTitle>
                <CardDescription>Événements nécessitant attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.filter(alert => !alert.resolved).slice(0, 3).map((alert) => (
                    <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className={`w-3 h-3 rounded-full mt-1 ${getSeverityColor(alert.severity)}`} />
                      <div className="flex-1">
                        <p className="font-medium">{alert.endpoint}</p>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {alert.timestamp.toLocaleString()}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => resolveAlert(alert.id)}
                      >
                        Résoudre
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Endpoints Tab */}
        <TabsContent value="endpoints" className="space-y-4">
          {endpoints.map((endpoint, index) => (
            <motion.div
              key={endpoint.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-4 h-4 rounded-full ${
                          endpoint.status === 'healthy' ? 'bg-green-500' :
                          endpoint.status === 'warning' ? 'bg-yellow-500' :
                          endpoint.status === 'error' ? 'bg-red-500' : 'bg-gray-500'
                        }`} />
                        <h4 className="text-lg font-semibold">{endpoint.name}</h4>
                        <Badge variant="outline">{endpoint.method}</Badge>
                        <Badge variant={getStatusBadge(endpoint.status)}>
                          {endpoint.status}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-4 font-mono text-sm">
                        {endpoint.url}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm font-medium">Temps de réponse</p>
                          <p className={`text-lg font-bold ${getStatusColor(endpoint.status)}`}>
                            {endpoint.responseTime}ms
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Disponibilité</p>
                          <p className="text-lg font-bold">{endpoint.uptime}%</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Taux d'erreur</p>
                          <p className="text-lg font-bold">{endpoint.errorRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Req/min</p>
                          <p className="text-lg font-bold">{endpoint.requestsPerMinute}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Disponibilité</span>
                          <span>{endpoint.uptime}%</span>
                        </div>
                        <Progress value={endpoint.uptime} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Détails
                      </Button>
                      <Button size="sm" variant="outline">
                        <Zap className="h-4 w-4 mr-2" />
                        Tester
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              Alertes Actives ({alerts.filter(a => !a.resolved).length})
            </h3>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurer
            </Button>
          </div>

          {alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Alert className={alert.resolved ? 'opacity-50' : ''}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`w-3 h-3 rounded-full mt-2 ${getSeverityColor(alert.severity)}`} />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{alert.endpoint}</h4>
                        <Badge variant="outline" className="text-xs">
                          {alert.type}
                        </Badge>
                        <Badge variant={
                          alert.severity === 'critical' ? 'destructive' :
                          alert.severity === 'high' ? 'default' :
                          alert.severity === 'medium' ? 'secondary' : 'outline'
                        }>
                          {alert.severity}
                        </Badge>
                      </div>
                      <AlertDescription className="mb-2">
                        {alert.message}
                      </AlertDescription>
                      <p className="text-xs text-muted-foreground">
                        {alert.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!alert.resolved && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => resolveAlert(alert.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Résoudre
                    </Button>
                  )}
                </div>
              </Alert>
            </motion.div>
          ))}
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Métriques de Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Temps de réponse P95</span>
                      <span className="font-medium">850ms</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Throughput</span>
                      <span className="font-medium">1,247 req/min</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Utilisation CPU</span>
                      <span className="font-medium">42%</span>
                    </div>
                    <Progress value={42} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Utilisation Mémoire</span>
                      <span className="font-medium">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Métriques Base de Données
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Connexions actives</span>
                      <span className="font-medium">47/100</span>
                    </div>
                    <Progress value={47} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Temps de requête moyen</span>
                      <span className="font-medium">23ms</span>
                    </div>
                    <Progress value={23} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Cache hit ratio</span>
                      <span className="font-medium">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Espace disque utilisé</span>
                      <span className="font-medium">34%</span>
                    </div>
                    <Progress value={34} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Statistiques par Endpoint</CardTitle>
              <CardDescription>Performance détaillée de chaque API</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Endpoint</th>
                      <th className="text-left p-2">Requêtes/h</th>
                      <th className="text-left p-2">Temps moyen</th>
                      <th className="text-left p-2">P95</th>
                      <th className="text-left p-2">Erreurs</th>
                      <th className="text-left p-2">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {endpoints.map((endpoint) => (
                      <tr key={endpoint.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{endpoint.name}</td>
                        <td className="p-2">{endpoint.requestsPerMinute * 60}</td>
                        <td className="p-2">{endpoint.responseTime}ms</td>
                        <td className="p-2">{Math.round(endpoint.responseTime * 1.5)}ms</td>
                        <td className="p-2">{endpoint.errorRate}%</td>
                        <td className="p-2">
                          <Badge variant={getStatusBadge(endpoint.status)}>
                            {endpoint.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default APIMonitoringPageEnhanced;