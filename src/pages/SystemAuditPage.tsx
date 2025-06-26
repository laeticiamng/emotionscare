
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Activity, 
  Database, 
  Server, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Zap,
  HardDrive,
  Cpu,
  Wifi,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactElement;
}

interface SecurityAlert {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  status: 'open' | 'investigating' | 'resolved';
  description: string;
}

const SystemAuditPage: React.FC = () => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [lastAudit, setLastAudit] = useState(new Date());

  const systemMetrics: SystemMetric[] = [
    {
      name: 'CPU Usage',
      value: 65,
      unit: '%',
      status: 'warning',
      trend: 'up',
      icon: <Cpu className="h-5 w-5" />
    },
    {
      name: 'Memory Usage',
      value: 78,
      unit: '%',
      status: 'healthy',
      trend: 'stable',
      icon: <HardDrive className="h-5 w-5" />
    },
    {
      name: 'Database Performance',
      value: 92,
      unit: '%',
      status: 'healthy',
      trend: 'up',
      icon: <Database className="h-5 w-5" />
    },
    {
      name: 'Network Latency',
      value: 45,
      unit: 'ms',
      status: 'healthy',
      trend: 'down',
      icon: <Wifi className="h-5 w-5" />
    },
    {
      name: 'Active Users',
      value: 1234,
      unit: 'users',
      status: 'healthy',
      trend: 'up',
      icon: <Users className="h-5 w-5" />
    },
    {
      name: 'Response Time',
      value: 180,
      unit: 'ms',
      status: 'warning',
      trend: 'up',
      icon: <Zap className="h-5 w-5" />
    }
  ];

  const securityAlerts: SecurityAlert[] = [
    {
      id: '1',
      title: 'Tentative de connexion suspecte détectée',
      severity: 'high',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'investigating',
      description: 'Plusieurs tentatives de connexion échouées depuis une IP suspecte'
    },
    {
      id: '2',
      title: 'Mise à jour de sécurité disponible',
      severity: 'medium',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: 'open',
      description: 'Une nouvelle mise à jour de sécurité est disponible pour le système'
    },
    {
      id: '3',
      title: 'Certificat SSL expirant bientôt',
      severity: 'medium',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      status: 'open',
      description: 'Le certificat SSL expire dans 15 jours'
    },
    {
      id: '4',
      title: 'Accès administrateur non autorisé bloqué',
      severity: 'critical',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'resolved',
      description: 'Tentative d\'accès administrateur bloquée avec succès'
    }
  ];

  const auditResults = {
    security: {
      score: 85,
      issues: 3,
      recommendations: 7
    },
    performance: {
      score: 92,
      issues: 1,
      recommendations: 3
    },
    compliance: {
      score: 78,
      issues: 5,
      recommendations: 12
    },
    availability: {
      score: 96,
      issues: 0,
      recommendations: 2
    }
  };

  const startAudit = async () => {
    setIsAuditing(true);
    setAuditProgress(0);
    
    // Simulation de l'audit
    const interval = setInterval(() => {
      setAuditProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAuditing(false);
          setLastAudit(new Date());
          toast.success('Audit système terminé avec succès !');
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const exportAuditReport = () => {
    toast.success('Rapport d\'audit exporté avec succès !');
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Audit Système
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Surveillance complète de la sécurité, performance et conformité du système EmotionsCare.
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          {/* Quick Actions */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Dernier audit</p>
                    <p className="font-medium">
                      {lastAudit.toLocaleDateString('fr-FR')} à {lastAudit.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Statut système</p>
                    <Badge className="bg-green-100 text-green-800">Opérationnel</Badge>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline" onClick={exportAuditReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Exporter le rapport
                  </Button>
                  <Button onClick={startAudit} disabled={isAuditing} className="bg-blue-600 hover:bg-blue-700">
                    <Activity className="h-4 w-4 mr-2" />
                    {isAuditing ? 'Audit en cours...' : 'Lancer un audit'}
                  </Button>
                </div>
              </div>
              
              {isAuditing && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Progression de l'audit</span>
                    <span className="text-sm font-medium">{auditProgress}%</span>
                  </div>
                  <Progress value={auditProgress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="alerts">Alertes</TabsTrigger>
              <TabsTrigger value="compliance">Conformité</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* System Metrics */}
                {systemMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-2 rounded-lg ${getStatusColor(metric.status)}`}>
                            {metric.icon}
                          </div>
                          <div className="flex items-center gap-1">
                            {metric.trend === 'up' ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : metric.trend === 'down' ? (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            ) : (
                              <div className="h-4 w-4 bg-gray-400 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        <h3 className="font-medium text-gray-800 mb-2">{metric.name}</h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-gray-900">
                            {metric.value}
                          </span>
                          <span className="text-sm text-gray-600">{metric.unit}</span>
                        </div>
                        <Badge className={getStatusColor(metric.status)} variant="secondary">
                          {metric.status}
                        </Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="security">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      Score de Sécurité
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className={`text-4xl font-bold mb-2 ${getScoreColor(auditResults.security.score)}`}>
                        {auditResults.security.score}/100
                      </div>
                      <Progress value={auditResults.security.score} className="h-3 mb-4" />
                      <p className="text-gray-600">Niveau de sécurité global du système</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{auditResults.security.issues}</div>
                        <div className="text-sm text-red-800">Problèmes détectés</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{auditResults.security.recommendations}</div>
                        <div className="text-sm text-blue-800">Recommandations</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Dernières Vulnérabilités</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-yellow-800">Certificat SSL</h4>
                          <p className="text-sm text-yellow-600">Expire dans 15 jours</p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-red-800">Tentatives de connexion</h4>
                          <p className="text-sm text-red-600">IP suspecte bloquée</p>
                        </div>
                        <Badge className="bg-red-100 text-red-800">High</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-green-800">Firewall</h4>
                          <p className="text-sm text-green-600">Configuration optimale</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Secure</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {Object.entries(auditResults).map(([key, data]) => (
                  <Card key={key} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="capitalize">{key}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center mb-4">
                        <div className={`text-3xl font-bold mb-2 ${getScoreColor(data.score)}`}>
                          {data.score}%
                        </div>
                        <Progress value={data.score} className="h-2 mb-4" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Problèmes</span>
                          <span className="text-sm font-medium text-red-600">{data.issues}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Recommandations</span>
                          <span className="text-sm font-medium text-blue-600">{data.recommendations}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="alerts">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Alertes de Sécurité
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {securityAlerts.map((alert) => (
                      <div key={alert.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-medium text-gray-800">{alert.title}</h3>
                              <Badge className={getSeverityColor(alert.severity)}>
                                {alert.severity}
                              </Badge>
                              <Badge variant={
                                alert.status === 'resolved' ? 'default' :
                                alert.status === 'investigating' ? 'secondary' : 'outline'
                              }>
                                {alert.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>
                                {alert.timestamp.toLocaleDateString('fr-FR')} à {alert.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                          {alert.status === 'resolved' ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                          )}
                        </div>
                        {alert.status !== 'resolved' && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Enquêter
                            </Button>
                            <Button size="sm" variant="outline">
                              Marquer comme résolu
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compliance">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Conformité RGPD</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Consentement utilisateur</span>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Chiffrement des données</span>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Droit à l'oubli</span>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Audit des accès</span>
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Standards ISO</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">ISO 27001 (Sécurité)</span>
                        <Badge className="bg-green-100 text-green-800">Conforme</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">ISO 9001 (Qualité)</span>
                        <Badge className="bg-green-100 text-green-800">Conforme</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">ISO 14971 (Santé)</span>
                        <Badge className="bg-yellow-100 text-yellow-800">En cours</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SystemAuditPage;
