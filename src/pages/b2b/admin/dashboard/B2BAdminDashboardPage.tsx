
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  AlertTriangle,
  Shield,
  BarChart3,
  Settings,
  UserPlus,
  Award,
  Clock,
  Heart,
  Target,
  Building,
  CheckCircle
} from 'lucide-react';

const B2BAdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Administrateur';
  const company = user?.user_metadata?.company || 'Votre entreprise';
  const isDemoAccount = user?.email?.endsWith('@exemple.fr');

  const globalStats = [
    {
      title: 'Utilisateurs actifs',
      value: isDemoAccount ? '156' : '0',
      icon: <Users className="h-4 w-4" />,
      trend: '+12%',
      color: 'text-blue-600'
    },
    {
      title: 'Score bien-être moyen',
      value: isDemoAccount ? '78%' : '--',
      icon: <Heart className="h-4 w-4" />,
      trend: '+5.2%',
      color: 'text-red-600'
    },
    {
      title: 'Sessions cette semaine',
      value: isDemoAccount ? '1,234' : '0',
      icon: <Target className="h-4 w-4" />,
      trend: '+28%',
      color: 'text-green-600'
    },
    {
      title: 'Taux de participation',
      value: isDemoAccount ? '89%' : '--',
      icon: <TrendingUp className="h-4 w-4" />,
      trend: '+3.1%',
      color: 'text-purple-600'
    }
  ];

  const departmentStats = isDemoAccount ? [
    { name: 'Développement', users: 24, engagement: 92, avgScore: 85 },
    { name: 'Marketing', users: 18, engagement: 87, avgScore: 79 },
    { name: 'RH', users: 12, engagement: 95, avgScore: 88 },
    { name: 'Commercial', users: 32, engagement: 78, avgScore: 74 },
    { name: 'Support', users: 16, engagement: 91, avgScore: 82 }
  ] : [];

  const alerts = isDemoAccount ? [
    {
      type: 'warning',
      title: 'Engagement en baisse',
      description: 'Équipe Commercial - 15% de baisse cette semaine',
      priority: 'Moyenne'
    },
    {
      type: 'info',
      title: 'Nouveau défi disponible',
      description: 'Challenge bien-être mensuel prêt à être lancé',
      priority: 'Faible'
    },
    {
      type: 'success',
      title: 'Objectif atteint',
      description: 'Équipe Développement a atteint 95% de participation',
      priority: 'Info'
    }
  ] : [];

  const quickActions = [
    {
      title: 'Gérer les utilisateurs',
      description: 'Ajouter, modifier ou supprimer des comptes',
      icon: <UserPlus className="h-6 w-6" />,
      action: () => navigate('/b2b/admin/users'),
      color: 'bg-blue-500'
    },
    {
      title: 'Analytics détaillés',
      description: 'Rapports et statistiques avancés',
      icon: <BarChart3 className="h-6 w-6" />,
      action: () => navigate('/b2b/admin/analytics'),
      color: 'bg-green-500'
    },
    {
      title: 'Paramètres organisation',
      description: 'Configurer les préférences entreprise',
      icon: <Settings className="h-6 w-6" />,
      action: () => navigate('/settings'),
      color: 'bg-purple-500'
    },
    {
      title: 'Défis et événements',
      description: 'Créer des activités d\'équipe',
      icon: <Award className="h-6 w-6" />,
      action: () => console.log('Défis'),
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {getGreeting()}, {userName} !
            </h1>
            <p className="text-muted-foreground mt-1">
              Administration - {company}
              {isDemoAccount && ' (Démonstration)'}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Administrateur
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Global Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {globalStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-xs ${stat.color}`}>{stat.trend}</p>
                </div>
                <div className={`p-2 rounded-full bg-muted ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Actions administrateur</span>
            </CardTitle>
            <CardDescription>
              Gérez votre organisation EmotionsCare
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={action.action}
                  className="h-auto flex flex-col items-center gap-3 p-6 hover:shadow-md transition-all"
                >
                  <div className={`p-3 rounded-full text-white ${action.color}`}>
                    {action.icon}
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {action.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Departments Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Performance par département</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {departmentStats.length > 0 ? (
                <div className="space-y-4">
                  {departmentStats.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{dept.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {dept.users} utilisateurs
                        </p>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Engagement</p>
                          <p className="font-semibold">{dept.engagement}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Score</p>
                          <p className="font-semibold">{dept.avgScore}%</p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${
                          dept.engagement >= 90 ? 'bg-green-500' :
                          dept.engagement >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Aucune donnée de département disponible
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Alerts & Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Alertes & Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length > 0 ? (
                <div className="space-y-4">
                  {alerts.map((alert, index) => (
                    <div key={index} className={`p-3 rounded-lg border-l-4 ${
                      alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                      alert.type === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                      'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    }`}>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-sm">{alert.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${
                          alert.priority === 'Moyenne' ? 'bg-yellow-200 text-yellow-800' :
                          alert.priority === 'Faible' ? 'bg-blue-200 text-blue-800' :
                          'bg-green-200 text-green-800'
                        }`}>
                          {alert.priority}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {alert.description}
                      </p>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full" size="sm">
                    Voir toutes les alertes
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-muted-foreground text-sm">
                    Aucune alerte en cours
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Activité récente</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isDemoAccount ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nouvel utilisateur ajouté</p>
                    <p className="text-xs text-muted-foreground">Marie Dubois - Équipe Marketing</p>
                  </div>
                  <span className="text-xs text-muted-foreground">Il y a 15 min</span>
                </div>
                
                <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Rapport hebdomadaire généré</p>
                    <p className="text-xs text-muted-foreground">Données de bien-être du 18-24 Jan</p>
                  </div>
                  <span className="text-xs text-muted-foreground">Il y a 2h</span>
                </div>
                
                <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Défi d'équipe terminé</p>
                    <p className="text-xs text-muted-foreground">Challenge méditation - 89% de participation</p>
                  </div>
                  <span className="text-xs text-muted-foreground">Hier</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Aucune activité récente
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2BAdminDashboardPage;
