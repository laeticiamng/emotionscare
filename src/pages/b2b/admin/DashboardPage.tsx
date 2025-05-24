
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, BarChart3, Settings, AlertTriangle, UserCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const adminModules = [
    {
      title: 'Gestion des Utilisateurs',
      description: 'Administrer les comptes collaborateurs',
      icon: Users,
      path: '/b2b/admin/users',
      color: 'from-blue-500 to-cyan-500',
      stats: '156 utilisateurs'
    },
    {
      title: 'Analyses & Rapports',
      description: 'Tableaux de bord et métriques RH',
      icon: BarChart3,
      path: '/b2b/admin/analytics',
      color: 'from-green-500 to-teal-500',
      stats: '23 rapports'
    },
    {
      title: 'Paramètres Organisation',
      description: 'Configuration de l\'entreprise',
      icon: Settings,
      path: '/b2b/admin/settings',
      color: 'from-purple-500 to-indigo-500',
      stats: 'Configuration'
    },
    {
      title: 'Alertes RH',
      description: 'Suivi des indicateurs critiques',
      icon: AlertTriangle,
      path: '/b2b/admin/alerts',
      color: 'from-orange-500 to-red-500',
      stats: '3 alertes'
    },
    {
      title: 'Validation des Comptes',
      description: 'Approuver les nouvelles inscriptions',
      icon: UserCheck,
      path: '/b2b/admin/approvals',
      color: 'from-indigo-500 to-purple-500',
      stats: '7 en attente'
    },
    {
      title: 'Support Équipes',
      description: 'Assistance et accompagnement',
      icon: Shield,
      path: '/b2b/admin/support',
      color: 'from-teal-500 to-green-500',
      stats: '12 tickets'
    }
  ];

  const quickStats = [
    { label: 'Utilisateurs Actifs', value: '142', change: '+12%' },
    { label: 'Taux de Satisfaction', value: '87%', change: '+5%' },
    { label: 'Sessions Aujourd\'hui', value: '89', change: '+23%' },
    { label: 'Alertes Ouvertes', value: '3', change: '-2' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Tableau de Bord Administrateur RH
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Gérez et supervisez le bien-être de votre organisation
            </p>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
                    <div className="text-xs text-green-500">{stat.change}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Modules d'administration */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminModules.map((module, index) => (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader className="text-center">
                    <div className={`mx-auto mb-4 p-4 rounded-full bg-gradient-to-r ${module.color} text-white group-hover:scale-110 transition-transform`}>
                      <module.icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {module.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      {module.stats}
                    </div>
                    <Button
                      onClick={() => navigate(module.path)}
                      className="w-full"
                      variant="outline"
                    >
                      Gérer
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-12">
            <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center">
                  <Shield className="mr-3 h-6 w-6" />
                  Administration RH
                </CardTitle>
                <CardDescription className="text-green-100">
                  Pilotez le bien-être émotionnel de vos équipes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-green-100">
                  Accédez à tous les outils nécessaires pour superviser, analyser et optimiser l'expérience de vos collaborateurs sur la plateforme EmotionsCare.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
