
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Shield, Users, BarChart3, TrendingUp, Calendar, 
  UserCheck, AlertTriangle, Heart, Settings 
} from 'lucide-react';
import LoadingAnimation from '@/components/ui/loading-animation';

const B2BAdminDashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 156,
    activeUsers: 89,
    weeklyEngagement: 72,
    avgWellbeingScore: 7.2,
    alertsCount: 3
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const adminActions = [
    {
      title: 'Gestion des utilisateurs',
      description: 'Voir et gérer les comptes utilisateurs',
      icon: Users,
      action: () => navigate('/b2b/admin/users'),
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Analytics avancées',
      description: 'Rapports détaillés et insights',
      icon: BarChart3,
      action: () => navigate('/b2b/admin/analytics'),
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Paramètres',
      description: 'Configuration de l\'organisation',
      icon: Settings,
      action: () => navigate('/settings'),
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Support',
      description: 'Centre d\'aide et assistance',
      icon: Heart,
      action: () => navigate('/help'),
      color: 'bg-red-100 text-red-600'
    }
  ];

  const recentAlerts = [
    { type: 'warning', message: 'Baisse d\'engagement équipe Marketing', time: '2h' },
    { type: 'info', message: 'Nouveau pic d\'utilisation détecté', time: '1j' },
    { type: 'success', message: 'Objectif bien-être atteint', time: '2j' }
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Chargement du tableau de bord administrateur..." />
      </div>
    );
  }

  const isDemo = user?.email?.endsWith('@exemple.fr');

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* En-tête administrateur */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Shield className="h-8 w-8 text-slate-600" />
              Administration EmotionsCare
            </h1>
            <p className="text-muted-foreground">
              {user?.user_metadata?.company || 'Votre organisation'} • Tableau de bord administrateur
            </p>
          </div>
          {isDemo && (
            <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
              Mode Démo Admin
            </div>
          )}
        </div>
      </motion.div>

      {/* Métriques principales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
              <div className="text-sm text-muted-foreground">Utilisateurs totaux</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
              <div className="text-sm text-muted-foreground">Actifs (7j)</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.weeklyEngagement}%</div>
              <div className="text-sm text-muted-foreground">Engagement</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.avgWellbeingScore}/10</div>
              <div className="text-sm text-muted-foreground">Score bien-être</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.alertsCount}</div>
              <div className="text-sm text-muted-foreground">Alertes actives</div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Actions administrateur */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Actions administrateur
            </CardTitle>
            <CardDescription>
              Gérez votre organisation EmotionsCare
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {adminActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Button
                      onClick={action.action}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-3 w-full"
                    >
                      <div className={`p-3 rounded-full ${action.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="text-center">
                        <h3 className="font-medium">{action.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {action.description}
                        </p>
                      </div>
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aperçu des équipes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Aperçu des équipes
              </CardTitle>
              <CardDescription>
                État du bien-être par département
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium">Marketing</div>
                    <div className="text-sm text-muted-foreground">32 collaborateurs</div>
                  </div>
                  <div className="text-green-600 font-semibold">8.2/10</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-medium">Développement</div>
                    <div className="text-sm text-muted-foreground">28 collaborateurs</div>
                  </div>
                  <div className="text-blue-600 font-semibold">7.8/10</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <div>
                    <div className="font-medium">Commercial</div>
                    <div className="text-sm text-muted-foreground">24 collaborateurs</div>
                  </div>
                  <div className="text-orange-600 font-semibold">6.9/10</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <div>
                    <div className="font-medium">Support</div>
                    <div className="text-sm text-muted-foreground">18 collaborateurs</div>
                  </div>
                  <div className="text-purple-600 font-semibold">7.5/10</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alertes et notifications */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alertes et notifications
              </CardTitle>
              <CardDescription>
                Événements importants à surveiller
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAlerts.map((alert, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        alert.type === 'warning' ? 'bg-orange-500' :
                        alert.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium">{alert.message}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Voir toutes les alertes
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Graphique d'activité rapide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tendances d'utilisation
            </CardTitle>
            <CardDescription>
              Activité des 30 derniers jours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 h-32">
              {Array.from({ length: 7 }, (_, i) => (
                <div key={i} className="flex flex-col justify-end">
                  <div 
                    className="bg-primary rounded-sm mb-2"
                    style={{ height: `${Math.random() * 80 + 20}%` }}
                  ></div>
                  <div className="text-xs text-center text-muted-foreground">
                    {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][i]}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2BAdminDashboardPage;
