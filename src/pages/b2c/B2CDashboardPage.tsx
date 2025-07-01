
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Music, 
  MessageCircle, 
  FileText, 
  Heart, 
  TrendingUp,
  Calendar,
  Award,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

const B2CDashboardPage: React.FC = () => {
  const quickActions = [
    { icon: Brain, title: 'Scanner émotions', desc: 'Analysez votre état émotionnel', path: '/scan', color: 'from-blue-500 to-cyan-500' },
    { icon: Music, title: 'Musique thérapeutique', desc: 'Écoutez des mélodies apaisantes', path: '/music', color: 'from-purple-500 to-pink-500' },
    { icon: MessageCircle, title: 'Coach IA', desc: 'Parlez avec votre coach virtuel', path: '/coach', color: 'from-green-500 to-emerald-500' },
    { icon: Heart, title: 'VR Thérapie', desc: 'Immersion thérapeutique', path: '/vr', color: 'from-red-500 to-orange-500' }
  ];

  const stats = [
    { label: 'Sessions cette semaine', value: '12', icon: Calendar, color: 'text-blue-600' },
    { label: 'Progression', value: '+15%', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Badges obtenus', value: '8', icon: Award, color: 'text-purple-600' },
    { label: 'Communauté', value: '1,2k', icon: Users, color: 'text-orange-600' }
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Bienvenue sur votre espace personnel
          </h1>
          <p className="text-lg text-muted-foreground">
            Prenez soin de votre bien-être mental avec nos outils thérapeutiques
          </p>
        </motion.div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
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

        {/* Actions rapides */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
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

        {/* Journal récent */}
        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Dernières entrées de journal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                <p className="text-sm text-muted-foreground">Aujourd'hui</p>
                <p>Session de méditation très apaisante ce matin...</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                <p className="text-sm text-muted-foreground">Hier</p>
                <p>Excellente journée avec mes exercices de respiration...</p>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full mt-4">
              <Link to="/journal">Voir tout le journal</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default B2CDashboardPage;
