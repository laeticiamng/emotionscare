
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Users, 
  BarChart3, 
  Calendar, 
  Settings,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const B2BAdminDashboard: React.FC = () => {
  const adminStats = [
    { label: 'Collaborateurs actifs', value: '127', icon: Users, color: 'text-blue-600' },
    { label: 'Taux engagement', value: '84%', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Alertes', value: '3', icon: AlertTriangle, color: 'text-red-600' },
    { label: 'Sessions complétées', value: '1,254', icon: CheckCircle, color: 'text-purple-600' }
  ];

  const adminActions = [
    { icon: Users, title: 'Gestion équipes', desc: 'Gérer les collaborateurs', path: '/teams', color: 'from-blue-500 to-cyan-500' },
    { icon: BarChart3, title: 'Rapports détaillés', desc: 'Analytics et insights', path: '/reports', color: 'from-green-500 to-emerald-500' },
    { icon: Calendar, title: 'Événements', desc: 'Organiser des sessions', path: '/events', color: 'from-purple-500 to-pink-500' },
    { icon: Settings, title: 'Configuration', desc: 'Paramètres avancés', path: '/settings', color: 'from-orange-500 to-red-500' }
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 bg-clip-text text-transparent mb-2">
            Dashboard Administrateur RH
          </h1>
          <p className="text-lg text-muted-foreground">
            Pilotez le bien-être de vos équipes
          </p>
        </motion.div>

        {/* Statistiques admin */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="premium-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <Icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Actions admin */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Outils d'administration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="premium-card group cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold mb-2">{action.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{action.desc}</p>
                      <Button asChild variant="outline" className="w-full">
                        <Link to={action.path}>Accéder</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Aperçu des équipes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Vue d'ensemble des équipes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                  <div>
                    <p className="font-medium">Équipe Marketing</p>
                    <p className="text-sm text-muted-foreground">15 membres</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">95% actifs</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                  <div>
                    <p className="font-medium">Équipe Développement</p>
                    <p className="text-sm text-muted-foreground">22 membres</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-600">87% actifs</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
                  <div>
                    <p className="font-medium">Équipe Support</p>
                    <p className="text-sm text-muted-foreground">12 membres</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-orange-600">78% actifs</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Alertes & Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Stress élevé détecté</p>
                    <p className="text-sm text-muted-foreground">3 collaborateurs de l'équipe Dev</p>
                    <Button size="sm" variant="outline" className="mt-2">Voir détails</Button>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Session planifiée</p>
                    <p className="text-sm text-muted-foreground">Méditation d'équipe demain à 14h</p>
                    <Button size="sm" variant="outline" className="mt-2">Gérer</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default B2BAdminDashboard;
