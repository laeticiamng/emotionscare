
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Brain, 
  Music, 
  BookOpen, 
  Headphones, 
  Trophy,
  TrendingUp,
  Calendar,
  Bell,
  Settings
} from 'lucide-react';

const B2CDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: 'Scan Émotionnel',
      description: 'Analysez votre état émotionnel',
      icon: Brain,
      color: 'from-blue-500 to-indigo-600',
      route: '/scan',
      status: 'Disponible'
    },
    {
      title: 'Coach IA',
      description: 'Votre assistant personnel',
      icon: Heart,
      color: 'from-pink-500 to-rose-600',
      route: '/coach',
      status: 'Nouveau'
    },
    {
      title: 'Musicothérapie',
      description: 'Playlists personnalisées',
      icon: Music,
      color: 'from-purple-500 to-violet-600',
      route: '/music',
      status: 'Populaire'
    },
    {
      title: 'Journal',
      description: 'Suivez votre progression',
      icon: BookOpen,
      color: 'from-green-500 to-emerald-600',
      route: '/journal',
      status: 'Disponible'
    },
    {
      title: 'Réalité Virtuelle',
      description: 'Expériences immersives',
      icon: Headphones,
      color: 'from-orange-500 to-amber-600',
      route: '/vr',
      status: 'Beta'
    },
    {
      title: 'Gamification',
      description: 'Badges et récompenses',
      icon: Trophy,
      color: 'from-yellow-500 to-orange-500',
      route: '/gamification',
      status: 'Disponible'
    }
  ];

  const stats = [
    { label: 'Sessions cette semaine', value: '12', trend: '+15%' },
    { label: 'Score de bien-être', value: '8.2/10', trend: '+0.8' },
    { label: 'Objectifs atteints', value: '75%', trend: '+10%' },
    { label: 'Temps d\'utilisation', value: '45min', trend: '+5min' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-pink-900 dark:via-rose-900 dark:to-red-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  Tableau de bord personnel
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Bonjour ! Prêt pour une nouvelle session ?
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/preferences')}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      {stat.value}
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      {stat.trend}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {modules.map((module, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(module.route)}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center shadow-lg`}>
                      <module.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                      {module.status}
                    </span>
                  </div>
                  <CardTitle className="text-lg text-slate-800 dark:text-slate-100">
                    {module.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    {module.description}
                  </p>
                  <Button 
                    className={`w-full bg-gradient-to-r ${module.color} hover:opacity-90 text-white font-medium`}
                  >
                    Accéder
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <Calendar className="h-5 w-5" />
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'Session de scan émotionnel', time: 'Il y a 2 heures', score: '8.5/10' },
                  { action: 'Écoute musicothérapie', time: 'Hier', score: '25 min' },
                  { action: 'Entrée journal', time: 'Il y a 2 jours', score: 'Terminé' },
                  { action: 'Session coach IA', time: 'Il y a 3 jours', score: '15 min' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-100">{activity.action}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{activity.time}</p>
                    </div>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {activity.score}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default B2CDashboardPage;
