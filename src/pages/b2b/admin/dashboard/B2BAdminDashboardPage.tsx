
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Shield, 
  BarChart3, 
  Settings, 
  Calendar,
  MessageCircle,
  Target,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const B2BAdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const organizationStats = [
    { label: 'Collaborateurs actifs', value: '142/156', icon: Users, color: 'text-green-600', percentage: 91 },
    { label: 'Score bien-être moyen', value: '76%', icon: TrendingUp, color: 'text-blue-600', percentage: 76 },
    { label: 'Alertes à traiter', value: '3', icon: AlertTriangle, color: 'text-orange-600', percentage: null },
    { label: 'Engagement équipes', value: '84%', icon: Activity, color: 'text-purple-600', percentage: 84 }
  ];

  const departmentData = [
    { name: 'Marketing', members: 24, avgScore: 82, engagement: 95, alerts: 0 },
    { name: 'IT', members: 18, avgScore: 78, engagement: 88, alerts: 1 },
    { name: 'Ventes', members: 30, avgScore: 74, engagement: 82, alerts: 2 },
    { name: 'RH', members: 12, avgScore: 85, engagement: 92, alerts: 0 },
    { name: 'Finance', members: 15, avgScore: 72, engagement: 78, alerts: 0 },
    { name: 'Production', members: 35, avgScore: 70, engagement: 75, alerts: 1 },
    { name: 'R&D', members: 22, avgScore: 79, engagement: 89, alerts: 0 }
  ];

  const recentAlerts = [
    {
      id: 1,
      type: 'score_drop',
      department: 'Ventes',
      message: 'Baisse significative du score bien-être (-15% cette semaine)',
      severity: 'high',
      timestamp: 'Il y a 2h'
    },
    {
      id: 2,
      type: 'low_engagement',
      department: 'Production',
      message: 'Engagement équipe sous le seuil (75%)',
      severity: 'medium',
      timestamp: 'Il y a 4h'
    },
    {
      id: 3,
      type: 'support_request',
      department: 'IT',
      message: '3 demandes de support émotionnel non traitées',
      severity: 'medium',
      timestamp: 'Il y a 6h'
    }
  ];

  const quickActions = [
    {
      title: 'Gérer les utilisateurs',
      description: 'Inviter, supprimer ou modifier les profils',
      icon: Users,
      action: () => navigate('/b2b/admin/users'),
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      title: 'Analytics détaillées',
      description: 'Rapports et analyses approfondies',
      icon: BarChart3,
      action: () => navigate('/b2b/admin/analytics'),
      color: 'bg-green-50 text-green-600 border-green-200'
    },
    {
      title: 'Paramètres organisation',
      description: 'Configuration et politiques',
      icon: Settings,
      action: () => console.log('Settings'),
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Shield className="mr-3 h-8 w-8 text-primary" />
            Dashboard Administrateur
          </h1>
          <p className="text-muted-foreground">
            Vue d'ensemble du bien-être de votre organisation
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
          </select>
        </div>
      </motion.div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {organizationStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    {stat.percentage && (
                      <Progress value={stat.percentage} className="w-full h-2" />
                    )}
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts & Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Critical Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-orange-600" />
                Alertes Importantes
              </CardTitle>
              <CardDescription>Situations nécessitant votre attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{alert.department}</p>
                      <p className="text-xs mt-1">{alert.message}</p>
                      <p className="text-xs opacity-75 mt-2">{alert.timestamp}</p>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {alert.severity}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" size="sm">
                Voir toutes les alertes
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
              <CardDescription>Accès direct aux fonctionnalités d'administration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`w-full justify-start h-auto p-4 ${action.color}`}
                  onClick={action.action}
                >
                  <div className="flex items-center">
                    <action.icon className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs opacity-80">{action.description}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Department Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
                Aperçu par Département
              </CardTitle>
              <CardDescription>Performance et bien-être par équipe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentData.map((dept) => (
                  <div key={dept.name} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium">{dept.name}</h4>
                        <Badge variant="secondary">{dept.members} membres</Badge>
                        {dept.alerts > 0 && (
                          <Badge variant="destructive">{dept.alerts} alerte{dept.alerts > 1 ? 's' : ''}</Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Score: {dept.avgScore}%</p>
                        <p className="text-xs text-muted-foreground">Engagement: {dept.engagement}%</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Bien-être</p>
                        <Progress value={dept.avgScore} className="h-2" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Engagement</p>
                        <Progress value={dept.engagement} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Analytics Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Analytics Détaillées</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="trends" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="trends">Tendances</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
                <TabsTrigger value="wellness">Bien-être</TabsTrigger>
                <TabsTrigger value="reports">Rapports</TabsTrigger>
              </TabsList>
              
              <TabsContent value="trends" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Progression globale</h4>
                    <p className="text-2xl font-bold text-blue-600">+12%</p>
                    <p className="text-sm text-blue-700">vs mois dernier</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Participation active</h4>
                    <p className="text-2xl font-bold text-green-600">91%</p>
                    <p className="text-sm text-green-700">des collaborateurs</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900">Satisfaction</h4>
                    <p className="text-2xl font-bold text-purple-600">4.6/5</p>
                    <p className="text-sm text-purple-700">note moyenne</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="engagement" className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">Utilisation des fonctionnalités</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Analyses émotionnelles</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={85} className="w-24 h-2" />
                        <span className="text-sm">85%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Communauté interne</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={72} className="w-24 h-2" />
                        <span className="text-sm">72%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Challenges équipe</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={68} className="w-24 h-2" />
                        <span className="text-sm">68%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="wellness" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Répartition des scores</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Excellent (80-100%)</span>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Bon (60-79%)</span>
                        <span className="text-sm font-medium">38%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Moyen (40-59%)</span>
                        <span className="text-sm font-medium">15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Préoccupant (&lt;40%)</span>
                        <span className="text-sm font-medium">2%</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Actions recommandées</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Organiser des sessions de team building</li>
                      <li>• Proposer des ateliers de gestion du stress</li>
                      <li>• Mettre en place des pauses actives</li>
                      <li>• Renforcer la communication interne</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reports" className="space-y-4">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    Générer rapport mensuel
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Exporter analytics départements
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Rapport d'engagement équipes
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="mr-2 h-4 w-4" />
                    Synthèse objectifs bien-être
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2BAdminDashboardPage;
