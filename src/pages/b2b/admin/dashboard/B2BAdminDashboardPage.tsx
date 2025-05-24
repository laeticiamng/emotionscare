
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  BarChart, 
  TrendingUp, 
  TrendingDown,
  Heart, 
  AlertTriangle,
  Calendar,
  Target,
  Activity,
  UserCheck
} from 'lucide-react';

const B2BAdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 147,
    activeUsers: 92,
    averageScore: 74,
    weeklyGrowth: 8.5,
    alertsCount: 3,
    completionRate: 86
  });

  const company = user?.user_metadata?.company || 'Votre entreprise';
  const isDemo = user?.email?.endsWith('@exemple.fr');

  const quickActions = [
    {
      title: 'Analytics détaillées',
      description: 'Vue d\'ensemble des métriques',
      icon: BarChart,
      color: 'bg-blue-500',
      action: () => navigate('/b2b/admin/analytics')
    },
    {
      title: 'Gestion des utilisateurs',
      description: 'Inviter et gérer les collaborateurs',
      icon: UserCheck,
      color: 'bg-green-500',
      action: () => navigate('/b2b/admin/users')
    },
    {
      title: 'Rapports bien-être',
      description: 'Analyses et recommandations',
      icon: Activity,
      color: 'bg-purple-500',
      action: () => navigate('/b2b/admin/reports')
    },
    {
      title: 'Paramètres entreprise',
      description: 'Configuration et préférences',
      icon: Shield,
      color: 'bg-orange-500',
      action: () => navigate('/b2b/admin/settings')
    }
  ];

  const keyMetrics = [
    {
      title: 'Score moyen équipe',
      value: `${stats.averageScore}%`,
      change: '+5.2%',
      description: 'vs mois dernier',
      icon: Heart,
      positive: true
    },
    {
      title: 'Utilisateurs actifs',
      value: `${stats.activeUsers}/${stats.totalUsers}`,
      change: `+${stats.weeklyGrowth}%`,
      description: 'cette semaine',
      icon: Users,
      positive: true
    },
    {
      title: 'Taux de complétion',
      value: `${stats.completionRate}%`,
      change: '+12%',
      description: 'objectifs atteints',
      icon: Target,
      positive: true
    },
    {
      title: 'Alertes en cours',
      value: stats.alertsCount,
      change: '-2',
      description: 'nécessitent attention',
      icon: AlertTriangle,
      positive: false
    }
  ];

  const recentAlerts = [
    {
      type: 'warning',
      user: 'Marie Dubois',
      message: 'Score en baisse significative',
      time: 'Il y a 2 heures'
    },
    {
      type: 'info',
      user: 'Équipe Marketing',
      message: 'Faible participation cette semaine',
      time: 'Il y a 1 jour'
    },
    {
      type: 'success',
      user: 'Jean Martin',
      message: 'Objectif mensuel atteint',
      time: 'Il y a 2 jours'
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête administrateur */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900/20 dark:to-blue-900/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full">
                  <Shield className="h-8 w-8 text-slate-700 dark:text-slate-300" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    Tableau de bord Admin 🛡️
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Gestion du bien-être chez {company}
                  </CardDescription>
                  {isDemo && (
                    <Badge variant="secondary" className="mt-2">
                      Mode démo
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{stats.totalUsers}</div>
                <p className="text-sm text-muted-foreground">Collaborateurs</p>
                <Badge variant="default" className="mt-1">
                  {((stats.activeUsers / stats.totalUsers) * 100).toFixed(0)}% actifs
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Métriques clés */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Métriques de bien-être</CardTitle>
            <CardDescription>
              Indicateurs clés de performance de votre organisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {keyMetrics.map((metric, index) => (
                <motion.div
                  key={metric.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-full ${
                      metric.positive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      <metric.icon className="h-4 w-4" />
                    </div>
                    <div className={`flex items-center text-xs ${
                      metric.positive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.positive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {metric.change}
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="text-sm font-medium">{metric.title}</div>
                  <div className="text-xs text-muted-foreground">{metric.description}</div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions rapides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Actions administrateur</CardTitle>
            <CardDescription>
              Outils de gestion et d'analyse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    className="h-auto flex flex-col items-center gap-3 p-6 w-full hover:shadow-md transition-all"
                    onClick={action.action}
                  >
                    <div className={`p-3 rounded-full ${action.color} text-white`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-sm">{action.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {action.description}
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Alertes et activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <span>Alertes importantes</span>
              </CardTitle>
              <CardDescription>
                Points d'attention sur le bien-être de l'équipe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAlerts.map((alert, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className={`p-2 rounded-full ${
                    alert.type === 'warning' ? 'bg-orange-100 text-orange-600' :
                    alert.type === 'success' ? 'bg-green-100 text-green-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {alert.type === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
                     alert.type === 'success' ? <TrendingUp className="h-4 w-4" /> :
                     <Activity className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.user}</p>
                    <p className="text-xs text-muted-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" size="sm" className="w-full">
                Voir toutes les alertes
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Tendances cette semaine</CardTitle>
              <CardDescription>
                Évolution du bien-être organisationnel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Participation globale</span>
                  <span className="font-medium">86%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '86%' }}></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Score moyen équipe</span>
                  <span className="font-medium">74%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '74%' }}></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Objectifs atteints</span>
                  <span className="font-medium">91%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '91%' }}></div>
                </div>
              </div>

              <Button className="w-full mt-4" onClick={() => navigate('/b2b/admin/analytics')}>
                Voir les analytics complètes
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default B2BAdminDashboardPage;
