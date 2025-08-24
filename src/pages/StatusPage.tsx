import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Activity,
  Server,
  Database,
  Globe,
  Zap,
  RefreshCw,
  TrendingUp,
  Users,
  Shield
} from 'lucide-react';

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  uptime: string;
  responseTime: string;
}

interface Incident {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'critical' | 'major' | 'minor';
  description: string;
  timestamp: string;
  updates: Array<{
    time: string;
    message: string;
    status: string;
  }>;
}

const StatusPage: React.FC = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const services: ServiceStatus[] = [
    {
      name: 'API EmotionsCare',
      status: 'operational',
      description: 'Service principal de l\'application',
      icon: Server,
      uptime: '99.97%',
      responseTime: '142ms'
    },
    {
      name: 'Base de données',
      status: 'operational',
      description: 'Stockage des données utilisateur',
      icon: Database,
      uptime: '99.99%',
      responseTime: '23ms'
    },
    {
      name: 'Analyse IA',
      status: 'operational',
      description: 'Services d\'intelligence artificielle',
      icon: Zap,
      uptime: '99.95%',
      responseTime: '890ms'
    },
    {
      name: 'Musicothérapie',
      status: 'degraded',
      description: 'Services de streaming musical',
      icon: Activity,
      uptime: '98.12%',
      responseTime: '2.1s'
    },
    {
      name: 'Authentification',
      status: 'operational',
      description: 'Système de connexion utilisateur',
      icon: Shield,
      uptime: '99.98%',
      responseTime: '89ms'
    },
    {
      name: 'CDN Global',
      status: 'operational',
      description: 'Réseau de distribution de contenu',
      icon: Globe,
      uptime: '99.92%',
      responseTime: '67ms'
    }
  ];

  const recentIncidents: Incident[] = [
    {
      id: '1',
      title: 'Ralentissement des services de musicothérapie',
      status: 'monitoring',
      severity: 'minor',
      description: 'Nous observons des temps de réponse plus lents pour le service de musicothérapie.',
      timestamp: '2024-01-15 14:30',
      updates: [
        {
          time: '14:45',
          message: 'Nous avons identifié la cause du problème et déployons un correctif.',
          status: 'identified'
        },
        {
          time: '14:30',
          message: 'Nous enquêtons sur les ralentissements signalés.',
          status: 'investigating'
        }
      ]
    },
    {
      id: '2',
      title: 'Maintenance programmée de la base de données',
      status: 'resolved',
      severity: 'major',
      description: 'Maintenance planifiée pour optimiser les performances.',
      timestamp: '2024-01-10 02:00',
      updates: [
        {
          time: '04:00',
          message: 'Maintenance terminée avec succès. Tous les services sont opérationnels.',
          status: 'resolved'
        },
        {
          time: '02:00',
          message: 'Début de la maintenance programmée.',
          status: 'monitoring'
        }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'outage':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Opérationnel</Badge>;
      case 'degraded':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">Dégradé</Badge>;
      case 'outage':
        return <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">Indisponible</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getIncidentBadge = (severity: string, status: string) => {
    const severityColor = severity === 'critical' ? 'red' : severity === 'major' ? 'orange' : 'blue';
    const statusText = status === 'resolved' ? 'Résolu' : status === 'monitoring' ? 'Surveillance' : 
                      status === 'identified' ? 'Identifié' : 'Investigation';
    
    return (
      <div className="flex gap-2">
        <Badge variant="outline" className={`text-${severityColor}-600 border-${severityColor}-200 bg-${severityColor}-50`}>
          {severity === 'critical' ? 'Critique' : severity === 'major' ? 'Majeur' : 'Mineur'}
        </Badge>
        <Badge variant="secondary">
          {statusText}
        </Badge>
      </div>
    );
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  const overallStatus = services.every(s => s.status === 'operational') ? 'operational' :
                       services.some(s => s.status === 'outage') ? 'outage' : 'degraded';

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl" data-testid="page-root">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            {getStatusIcon(overallStatus)}
            <h1 className="text-4xl font-bold">Statut des Services EmotionsCare</h1>
          </div>
          
          {overallStatus === 'operational' && (
            <div className="text-green-600 text-lg font-medium mb-4">
              ✅ Tous les systèmes sont opérationnels
            </div>
          )}
          
          {overallStatus === 'degraded' && (
            <div className="text-yellow-600 text-lg font-medium mb-4">
              ⚠️ Certains services rencontrent des problèmes
            </div>
          )}
          
          {overallStatus === 'outage' && (
            <div className="text-red-600 text-lg font-medium mb-4">
              🚨 Interruption de service en cours
            </div>
          )}

          <div className="flex justify-center items-center gap-4 text-sm text-muted-foreground">
            <span>Dernière mise à jour : {lastUpdated.toLocaleString('fr-FR')}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Current Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              État Actuel des Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service, index) => (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <service.icon className="h-4 w-4 text-primary" />
                      <span className="font-medium">{service.name}</span>
                    </div>
                    {getStatusIcon(service.status)}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {service.description}
                  </p>
                  
                  {getStatusBadge(service.status)}
                  
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Disponibilité:</span>
                      <div className="font-medium">{service.uptime}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Temps de réponse:</span>
                      <div className="font-medium">{service.responseTime}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Incidents */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Incidents Récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentIncidents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p>Aucun incident récent à signaler</p>
              </div>
            ) : (
              <div className="space-y-6">
                {recentIncidents.map((incident) => (
                  <motion.div
                    key={incident.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{incident.title}</h4>
                        <p className="text-sm text-muted-foreground">{incident.timestamp}</p>
                      </div>
                      {getIncidentBadge(incident.severity, incident.status)}
                    </div>
                    
                    <p className="text-sm mb-4">{incident.description}</p>
                    
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Mises à jour :</h5>
                      {incident.updates.map((update, index) => (
                        <div key={index} className="flex gap-3 text-sm">
                          <span className="text-muted-foreground font-mono">{update.time}</span>
                          <span>{update.message}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Disponibilité (30j)</p>
                  <p className="text-2xl font-bold text-green-600">99.94%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Utilisateurs actifs</p>
                  <p className="text-2xl font-bold text-blue-600">15,847</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Temps de réponse moyen</p>
                  <p className="text-2xl font-bold text-purple-600">267ms</p>
                </div>
                <Zap className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Besoin d'aide ?</h3>
              <p className="text-muted-foreground mb-4">
                Si vous rencontrez des problèmes non mentionnés ici, n'hésitez pas à nous contacter.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline">
                  Centre d'aide
                </Button>
                <Button>
                  Contacter le support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default StatusPage;