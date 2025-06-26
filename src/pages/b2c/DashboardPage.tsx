
import React from 'react';
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
  Settings,
  Bell
} from 'lucide-react';
import { motion } from 'framer-motion';
import { UNIFIED_ROUTES } from '@/utils/routeUtils';

const B2CDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    { icon: Brain, title: 'Scanner Émotionnel', route: UNIFIED_ROUTES.SCAN, color: 'bg-blue-500', description: 'Analysez vos émotions actuelles' },
    { icon: Music, title: 'Musicothérapie', route: UNIFIED_ROUTES.MUSIC, color: 'bg-purple-500', description: 'Musique adaptée à votre humeur' },
    { icon: BookOpen, title: 'Journal', route: UNIFIED_ROUTES.JOURNAL, color: 'bg-green-500', description: 'Notez vos pensées' },
    { icon: Heart, title: 'Coach IA', route: UNIFIED_ROUTES.COACH, color: 'bg-red-500', description: 'Parlez à votre coach' },
    { icon: Headphones, title: 'Réalité Virtuelle', route: UNIFIED_ROUTES.VR, color: 'bg-indigo-500', description: 'Expériences immersives' },
    { icon: Trophy, title: 'Récompenses', route: UNIFIED_ROUTES.GAMIFICATION, color: 'bg-yellow-500', description: 'Vos badges et progrès' }
  ];

  const stats = [
    { label: 'Sessions cette semaine', value: '12', trend: '+15%', color: 'text-green-600' },
    { label: 'Score bien-être', value: '8.2/10', trend: '+0.5', color: 'text-blue-600' },
    { label: 'Objectifs atteints', value: '85%', trend: '+12%', color: 'text-purple-600' },
    { label: 'Badges obtenus', value: '7', trend: '+2', color: 'text-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Tableau de bord personnel
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Bienvenue dans votre espace bien-être
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigate(UNIFIED_ROUTES.PREFERENCES)}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                    <div className={`text-sm font-medium ${stat.color} flex items-center gap-1`}>
                      <TrendingUp className="h-4 w-4" />
                      {stat.trend}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                Actions rapides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => navigate(action.route)}
                      variant="outline"
                      className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:shadow-lg transition-all duration-300"
                    >
                      <div className={`w-8 h-8 rounded-full ${action.color} flex items-center justify-center`}>
                        <action.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-xs text-gray-500">{action.description}</div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Dernières sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: 'Scan émotionnel', time: 'Il y a 2h', score: '7.5/10' },
                    { type: 'Musicothérapie', time: 'Hier', duration: '25 min' },
                    { type: 'Journal', time: 'Hier', entries: '3 entrées' },
                    { type: 'Coach IA', time: 'Il y a 2 jours', messages: '8 messages' }
                  ].map((session, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium">{session.type}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{session.time}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {session.score || session.duration || session.entries || session.messages}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Réalisations récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { badge: 'Utilisateur régulier', description: '7 jours consécutifs', icon: '🔥' },
                    { badge: 'Explorateur musical', description: '20 playlists écoutées', icon: '🎵' },
                    { badge: 'Journaliste assidu', description: '50 entrées de journal', icon: '📝' },
                    { badge: 'Méditateur zen', description: '10 sessions VR', icon: '🧘' }
                  ].map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div>
                        <p className="font-medium">{achievement.badge}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default B2CDashboardPage;
