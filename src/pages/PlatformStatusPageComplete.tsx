/**
 * PlatformStatusPage - Interface Platform Status complète
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, XCircle, Clock, Activity } from 'lucide-react';

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'down' | 'maintenance';
  uptime: string;
  responseTime: string;
}

interface Incident {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  timestamp: string;
  description: string;
}

const PlatformStatusPageComplete: React.FC = () => {
  const [services] = useState<ServiceStatus[]>([
    { name: 'API Principal', status: 'operational', uptime: '99.9%', responseTime: '150ms' },
    { name: 'Authentification', status: 'operational', uptime: '99.8%', responseTime: '80ms' },
    { name: 'Base de données', status: 'operational', uptime: '99.9%', responseTime: '45ms' },
    { name: 'CDN & Assets', status: 'operational', uptime: '99.7%', responseTime: '25ms' },
    { name: 'Notifications Push', status: 'degraded', uptime: '98.5%', responseTime: '300ms' },
    { name: 'Analytics', status: 'operational', uptime: '99.6%', responseTime: '120ms' }
  ]);

  const [incidents] = useState<Incident[]>([
    {
      id: '1',
      title: 'Ralentissement des notifications push',
      status: 'monitoring',
      timestamp: 'Il y a 2 heures',
      description: 'Nous surveillons un léger ralentissement du service de notifications.'
    },
    {
      id: '2',
      title: 'Maintenance programmée - Base de données',
      status: 'resolved',
      timestamp: 'Il y a 1 jour',
      description: 'Maintenance programmée terminée avec succès.'
    }
  ]);

  const [overallStatus, setOverallStatus] = useState<'operational' | 'degraded' | 'down'>('operational');

  useEffect(() => {
    const hasDown = services.some(s => s.status === 'down');
    const hasDegraded = services.some(s => s.status === 'degraded');
    
    if (hasDown) setOverallStatus('down');
    else if (hasDegraded) setOverallStatus('degraded');
    else setOverallStatus('operational');
  }, [services]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'degraded': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'down': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'maintenance': return <Clock className="w-5 h-5 text-blue-500" />;
      default: return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      operational: { variant: 'default' as const, text: 'Opérationnel', className: 'bg-green-100 text-green-800' },
      degraded: { variant: 'secondary' as const, text: 'Dégradé', className: 'bg-yellow-100 text-yellow-800' },
      down: { variant: 'destructive' as const, text: 'Hors ligne', className: 'bg-red-100 text-red-800' },
      maintenance: { variant: 'outline' as const, text: 'Maintenance', className: 'bg-blue-100 text-blue-800' }
    };

    const { text, className } = config[status as keyof typeof config] || config.operational;
    return <Badge className={className}>{text}</Badge>;
  };

  const getOverallStatusMessage = () => {
    switch (overallStatus) {
      case 'operational': return 'Tous les systèmes sont opérationnels';
      case 'degraded': return 'Certains services rencontrent des problèmes';
      case 'down': return 'Problèmes majeurs détectés';
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            État de la plateforme EmotionsCare
          </h1>
          <div className="flex items-center justify-center space-x-2">
            {getStatusIcon(overallStatus)}
            <span className="text-lg text-gray-600">{getOverallStatusMessage()}</span>
          </div>
        </motion.div>

        {/* Overall Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={`border-l-4 ${
            overallStatus === 'operational' ? 'border-l-green-500' :
            overallStatus === 'degraded' ? 'border-l-yellow-500' :
            'border-l-red-500'
          }`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Statut global</span>
                {getStatusBadge(overallStatus)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Services Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>État des services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service, index) => (
                  <motion.div
                    key={service.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(service.status)}
                      <span className="font-medium">{service.name}</span>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Uptime: </span>
                        {service.uptime}
                      </div>
                      <div>
                        <span className="font-medium">Réponse: </span>
                        {service.responseTime}
                      </div>
                      {getStatusBadge(service.status)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Incidents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Incidents récents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incidents.map((incident, index) => (
                  <motion.div
                    key={incident.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="border-l-4 border-l-blue-500 pl-4 py-2"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{incident.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{incident.timestamp}</span>
                        {getStatusBadge(incident.status)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{incident.description}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Historical Uptime */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Historique de disponibilité (90 derniers jours)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">99.8%</div>
                  <div className="text-sm text-gray-500">Uptime global</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">125ms</div>
                  <div className="text-sm text-gray-500">Temps de réponse moyen</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">2</div>
                  <div className="text-sm text-gray-500">Incidents résolus</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PlatformStatusPageComplete;