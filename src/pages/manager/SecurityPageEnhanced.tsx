// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Lock, 
  Key, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Server,
  Database,
  Network,
  RefreshCw
} from 'lucide-react';

interface SecurityAlert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: Date;
  resolved: boolean;
}

interface SecurityMetric {
  name: string;
  value: number;
  status: 'good' | 'warning' | 'critical';
  description: string;
}

const SecurityPageEnhanced: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [securityScore, setSecurityScore] = useState(87);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([
    {
      id: '1',
      severity: 'high',
      title: 'Accès non autorisé détecté',
      description: 'Tentative de connexion suspecte depuis une IP inconnue',
      timestamp: new Date(Date.now() - 3600000),
      resolved: false
    },
    {
      id: '2',
      severity: 'medium',
      title: 'Certificat SSL expirant',
      description: 'Le certificat SSL expire dans 15 jours',
      timestamp: new Date(Date.now() - 7200000),
      resolved: false
    }
  ]);

  const [metrics, setMetrics] = useState<SecurityMetric[]>([
    { name: 'Authentification', value: 95, status: 'good', description: 'MFA activée, politiques strictes' },
    { name: 'Chiffrement', value: 90, status: 'good', description: 'AES-256, TLS 1.3' },
    { name: 'Surveillance', value: 78, status: 'warning', description: 'Logs analysés en temps réel' },
    { name: 'Conformité', value: 85, status: 'good', description: 'RGPD, ISO 27001' }
  ]);

  const handleRefreshSecurity = async () => {
    setIsLoading(true);
    // Simulate security scan
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSecurityScore(Math.floor(Math.random() * 20) + 80);
    setIsLoading(false);
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const getSeverityColor = (severity: SecurityAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
    }
  };

  const getStatusColor = (status: SecurityMetric['status']) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
    }
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
            <Shield className="h-8 w-8 text-primary" />
            Centre de Sécurité
          </h1>
          <p className="text-muted-foreground mt-2">
            Surveillance et gestion de la sécurité système
          </p>
        </div>
        <Button onClick={handleRefreshSecurity} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </motion.div>

      {/* Security Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Score de Sécurité Global
              <Badge variant={securityScore >= 90 ? "default" : securityScore >= 70 ? "secondary" : "destructive"}>
                {securityScore}/100
              </Badge>
            </CardTitle>
            <CardDescription>
              Évaluation en temps réel de la posture sécuritaire
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={securityScore} className="h-3" />
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              {metrics.map((metric, index) => (
                <div key={metric.name} className="text-center">
                  <div className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                    {metric.value}%
                  </div>
                  <div className="text-sm text-muted-foreground">{metric.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {metric.description}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="alerts">Alertes</TabsTrigger>
          <TabsTrigger value="access">Contrôle d'accès</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sessions Actives</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">127</div>
                  <p className="text-xs text-muted-foreground">+12% depuis hier</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tentatives Bloquées</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-muted-foreground">-8% depuis hier</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Vulnérabilités</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">2 critiques</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          {alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Alert className={alert.resolved ? 'opacity-50' : ''}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(alert.severity)} mt-2`} />
                    <div>
                      <h4 className="font-semibold">{alert.title}</h4>
                      <AlertDescription className="mt-1">
                        {alert.description}
                      </AlertDescription>
                      <p className="text-xs text-muted-foreground mt-2">
                        {alert.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!alert.resolved && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleResolveAlert(alert.id)}
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

        {/* Access Control Tab */}
        <TabsContent value="access" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Authentification Multi-Facteurs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Utilisateurs avec MFA</span>
                    <Badge>89%</Badge>
                  </div>
                  <Progress value={89} />
                  <p className="text-sm text-muted-foreground">
                    234 utilisateurs sur 263 ont activé la MFA
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Politiques d'Accès
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Mot de passe fort</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Expiration des sessions</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Limitation des tentatives</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Géolocalisation</span>
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Audit Tab */}
        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Journal d'Audit
              </CardTitle>
              <CardDescription>
                Historique des actions critiques système
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: 'Connexion administrateur', user: 'admin@emotionscare.com', time: '10:45', status: 'success' },
                  { action: 'Modification politique sécurité', user: 'contact@emotionscare.com', time: '09:32', status: 'warning' },
                  { action: 'Tentative accès non autorisé', user: 'unknown', time: '08:15', status: 'error' },
                  { action: 'Sauvegarde système', user: 'system', time: '06:00', status: 'success' }
                ].map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{entry.action}</p>
                      <p className="text-sm text-muted-foreground">{entry.user}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{entry.time}</p>
                      <Badge variant={entry.status === 'success' ? 'default' : entry.status === 'warning' ? 'secondary' : 'destructive'}>
                        {entry.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityPageEnhanced;