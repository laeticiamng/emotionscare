
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Music, 
  MessageCircle, 
  Users, 
  TrendingUp,
  Target,
  Clock,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

const B2BUserDashboard: React.FC = () => {
  const teamStats = [
    { label: 'Mon équipe', value: '12', icon: Users, color: 'text-blue-600' },
    { label: 'Mes objectifs', value: '8/10', icon: Target, color: 'text-green-600' },
    { label: 'Temps bien-être', value: '2h45', icon: Clock, color: 'text-purple-600' },
    { label: 'Niveau', value: 'Expert', icon: Award, color: 'text-orange-600' }
  ];

  const quickAccess = [
    { icon: Brain, title: 'Check-in quotidien', desc: 'Comment vous sentez-vous ?', path: '/scan', color: 'from-blue-500 to-cyan-500' },
    { icon: Music, title: 'Pause musicale', desc: 'Moment de détente', path: '/music', color: 'from-purple-500 to-pink-500' },
    { icon: MessageCircle, title: 'Coach équipe', desc: 'Conseils pour le travail', path: '/coach', color: 'from-green-500 to-emerald-500' },
    { icon: Users, title: 'Mon équipe', desc: 'Activités collaboratives', path: '/team', color: 'from-orange-500 to-red-500' }
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent mb-2">
            Espace Collaborateur
          </h1>
          <p className="text-lg text-muted-foreground">
            Votre bien-être au travail, notre priorité
          </p>
        </motion.div>

        {/* Statistiques équipe */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamStats.map((stat, index) => {
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

        {/* Accès rapide */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Accès rapide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickAccess.map((action, index) => {
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

        {/* Activités d'équipe */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Challenges d'équipe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                  <div>
                    <p className="font-medium">Méditation collective</p>
                    <p className="text-sm text-muted-foreground">8/12 participants</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">67%</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                  <div>
                    <p className="font-medium">Pause bien-être</p>
                    <p className="text-sm text-muted-foreground">Quotidien</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">100%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Recommandations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                  <p className="font-medium mb-2">Session VR recommandée</p>
                  <p className="text-sm text-muted-foreground">Basée sur votre stress cette semaine</p>
                  <Button size="sm" className="mt-2">Essayer</Button>
                </div>
                <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
                  <p className="font-medium mb-2">Exercice de respiration</p>
                  <p className="text-sm text-muted-foreground">Pour améliorer votre concentration</p>
                  <Button size="sm" variant="outline" className="mt-2">Commencer</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default B2BUserDashboard;
