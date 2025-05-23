
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, BarChart3, Settings, FileText, AlertCircle, TrendingUp, Activity } from 'lucide-react';

const B2BAdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const adminModules = [
    {
      title: 'Analytiques',
      description: 'Vue d\'ensemble des données organisationnelles',
      icon: BarChart3,
      path: '/b2b/admin/analytics',
      color: 'bg-blue-500',
      stats: '156 rapports'
    },
    {
      title: 'Gestion utilisateurs',
      description: 'Administration des comptes et permissions',
      icon: Users,
      path: '/b2b/admin/users',
      color: 'bg-green-500',
      stats: '89 utilisateurs'
    },
    {
      title: 'Rapports',
      description: 'Génération et export de rapports',
      icon: FileText,
      path: '/reports',
      color: 'bg-purple-500',
      stats: '24 ce mois'
    },
    {
      title: 'Paramètres',
      description: 'Configuration de l\'organisation',
      icon: Settings,
      path: '/admin/settings',
      color: 'bg-orange-500',
      stats: 'Mis à jour'
    }
  ];

  const organizationStats = [
    { label: 'Utilisateurs actifs', value: '89', change: '+12%', trend: 'up' },
    { label: 'Engagement moyen', value: '87%', change: '+5%', trend: 'up' },
    { label: 'Sessions quotidiennes', value: '156', change: '+8%', trend: 'up' },
    { label: 'Bien-être global', value: '8.4/10', change: '+0.3', trend: 'up' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Shield className="h-8 w-8 text-slate-700 dark:text-slate-300" />
            <span className="text-2xl font-bold">EmotionsCare</span>
          </div>
          
          <h1 className="text-4xl font-light tracking-tight text-slate-900 dark:text-white mb-4">
            Tableau de bord administrateur
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Vue d'ensemble de votre organisation
          </p>
        </motion.div>

        {/* Organization Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          {organizationStats.map((stat, index) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className={`h-4 w-4 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Admin Modules */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        >
          {adminModules.map((module, index) => (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.8 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <module.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm text-slate-500">{module.stats}</span>
                  </div>
                  <CardTitle className="text-xl">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full"
                    onClick={() => navigate(module.path)}
                  >
                    Accéder
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activity & Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">15 nouveaux utilisateurs cette semaine</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Rapport mensuel généré</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Session d'équipe Marketing planifiée</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Mise à jour des paramètres de sécurité</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Alertes et notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    ✅ Tous les systèmes fonctionnent normalement
                  </p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    📊 Nouveau rapport d'engagement disponible
                  </p>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    ⚠️ 3 demandes d'accès en attente
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default B2BAdminDashboardPage;
