
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Activity,
  Server,
  Database,
  Wifi,
  Lock,
  Eye,
  Award,
  Trophy,
  Star,
  Target,
  Zap
} from 'lucide-react';

const HealthCheckBadgePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('health');

  // Données de santé du système
  const systemHealth = {
    overall: 'good',
    uptime: '99.9%',
    responseTime: '120ms',
    services: [
      { name: 'API Backend', status: 'healthy', icon: Server },
      { name: 'Base de données', status: 'healthy', icon: Database },
      { name: 'Réseau', status: 'healthy', icon: Wifi },
      { name: 'Sécurité', status: 'warning', icon: Lock },
      { name: 'Monitoring', status: 'healthy', icon: Eye }
    ]
  };

  // Badges de santé disponibles
  const healthBadges = [
    {
      id: 1,
      name: 'Système Stable',
      description: 'Maintenir 99%+ d\'uptime pendant 30 jours',
      icon: '🛡️',
      earned: true,
      progress: 100,
      category: 'stability'
    },
    {
      id: 2,
      name: 'Performance Pro',
      description: 'Temps de réponse < 200ms pendant une semaine',
      icon: '⚡',
      earned: true,
      progress: 100,
      category: 'performance'
    },
    {
      id: 3,
      name: 'Sécurité Renforcée',
      description: 'Aucune vulnérabilité critique détectée',
      icon: '🔒',
      earned: false,
      progress: 75,
      category: 'security'
    },
    {
      id: 4,
      name: 'Monitoring Master',
      description: 'Surveillance active 24/7',
      icon: '👁️',
      earned: true,
      progress: 100,
      category: 'monitoring'
    },
    {
      id: 5,
      name: 'Data Guardian',
      description: 'Sauvegarde réussie tous les jours',
      icon: '💾',
      earned: false,
      progress: 60,
      category: 'backup'
    },
    {
      id: 6,
      name: 'Zero Downtime',
      description: 'Aucune interruption de service ce mois',
      icon: '🎯',
      earned: false,
      progress: 85,
      category: 'availability'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return XCircle;
      default: return Activity;
    }
  };

  const getBadgeColor = (category: string) => {
    switch (category) {
      case 'stability': return 'bg-blue-100 text-blue-800';
      case 'performance': return 'bg-green-100 text-green-800';
      case 'security': return 'bg-red-100 text-red-800';
      case 'monitoring': return 'bg-purple-100 text-purple-800';
      case 'backup': return 'bg-orange-100 text-orange-800';
      case 'availability': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏥 Health Check & Badges
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Surveillez la santé de votre système et débloquez des badges
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="health">État du Système</TabsTrigger>
            <TabsTrigger value="badges">Badges de Santé</TabsTrigger>
            <TabsTrigger value="achievements">Réalisations</TabsTrigger>
          </TabsList>

          <TabsContent value="health" className="space-y-6">
            {/* Vue d'ensemble de la santé */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-6 w-6 text-green-600" />
                  État Global du Système
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {systemHealth.uptime}
                    </div>
                    <p className="text-gray-600">Disponibilité</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {systemHealth.responseTime}
                    </div>
                    <p className="text-gray-600">Temps de réponse</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      5/5
                    </div>
                    <p className="text-gray-600">Services actifs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* État des services */}
            <Card>
              <CardHeader>
                <CardTitle>Services et Composants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemHealth.services.map((service, index) => {
                    const StatusIcon = getStatusIcon(service.status);
                    const ServiceIcon = service.icon;
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <ServiceIcon className="h-6 w-6 text-gray-600" />
                          <span className="font-medium">{service.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getBadgeColor('monitoring')}>
                            {service.status}
                          </Badge>
                          <StatusIcon className={`h-5 w-5 ${getStatusColor(service.status)}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-yellow-600" />
                  Badges de Santé Système
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {healthBadges.map((badge) => (
                    <div 
                      key={badge.id}
                      className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                        badge.earned 
                          ? 'border-green-300 bg-green-50 shadow-lg' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="text-4xl mb-2">{badge.icon}</div>
                      <h3 className="font-medium text-sm mb-1">{badge.name}</h3>
                      {badge.earned ? (
                        <p className="text-xs text-green-600">
                          ✅ Badge débloqué !
                        </p>
                      ) : (
                        <>
                          <p className="text-xs text-gray-600 mb-3">
                            {badge.description}
                          </p>
                          <div className="space-y-2">
                            <Progress value={badge.progress} className="h-2" />
                            <p className="text-xs text-gray-500">
                              Progression: {badge.progress}%
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                  Réalisations et Statistiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Statistiques</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Badges débloqués</span>
                        <Badge className="bg-green-100 text-green-800">
                          3/6
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Jours sans incident</span>
                        <Badge className="bg-blue-100 text-blue-800">
                          45
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Score de santé</span>
                        <Badge className="bg-purple-100 text-purple-800">
                          8.5/10
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Prochains Objectifs</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-sm font-medium text-yellow-800">
                          🎯 Résoudre les alertes de sécurité
                        </p>
                        <p className="text-xs text-yellow-600 mt-1">
                          25% restant pour le badge "Sécurité Renforcée"
                        </p>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-sm font-medium text-orange-800">
                          💾 Améliorer les sauvegardes
                        </p>
                        <p className="text-xs text-orange-600 mt-1">
                          40% restant pour le badge "Data Guardian"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HealthCheckBadgePage;
