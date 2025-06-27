
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Music, 
  BookOpen, 
  MessageCircle, 
  Headphones,
  Heart,
  Trophy,
  Calendar,
  TrendingUp,
  Star,
  Zap,
  Target
} from 'lucide-react';

const B2CDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const todayStats = {
    emotionalScore: 8.2,
    sessionsCompleted: 3,
    wellnessStreak: 12,
    totalProgress: 68
  };

  const quickActions = [
    {
      icon: <Brain className="h-5 w-5" />,
      title: "Scanner d'humeur",
      description: "Analyser mes émotions",
      path: "/scan",
      color: "from-blue-500 to-cyan-500",
      urgent: true
    },
    {
      icon: <Music className="h-5 w-5" />,
      title: "Ma playlist",
      description: "Musique adaptée",
      path: "/music",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      title: "Coach IA",
      description: "Conseil personnalisé",
      path: "/coach",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Headphones className="h-5 w-5" />,
      title: "Session VR",
      description: "Relaxation immersive",
      path: "/vr",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const recentActivities = [
    { type: "Méditation", time: "Il y a 2h", score: 9.1, icon: <Heart className="h-4 w-4" /> },
    { type: "Journal", time: "Ce matin", score: 8.5, icon: <BookOpen className="h-4 w-4" /> },
    { type: "Scanner", time: "Hier", score: 7.8, icon: <Brain className="h-4 w-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-900 p-4" data-testid="page-root">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                Tableau de bord personnel
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                Bonjour ! Voici votre résumé bien-être du jour
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <Star className="mr-1 h-3 w-3" />
              Série de {todayStats.wellnessStreak} jours
            </Badge>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Score émotionnel</p>
                    <p className="text-3xl font-bold">{todayStats.emotionalScore}/10</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Sessions aujourd'hui</p>
                    <p className="text-3xl font-bold">{todayStats.sessionsCompleted}</p>
                  </div>
                  <Zap className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Série de jours</p>
                    <p className="text-3xl font-bold">{todayStats.wellnessStreak}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Progression</p>
                    <p className="text-3xl font-bold">{todayStats.totalProgress}%</p>
                  </div>
                  <Target className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                Actions rapides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    <Button
                      onClick={() => navigate(action.path)}
                      className={`w-full h-24 bg-gradient-to-r ${action.color} hover:opacity-90 text-white flex flex-col items-center justify-center space-y-2 relative`}
                      variant="default"
                    >
                      {action.urgent && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      )}
                      {action.icon}
                      <div className="text-center">
                        <div className="font-semibold text-sm">{action.title}</div>
                        <div className="text-xs opacity-90">{action.description}</div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activities & Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Activités récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full">
                          {activity.icon}
                        </div>
                        <div>
                          <p className="font-medium">{activity.type}</p>
                          <p className="text-sm text-slate-500">{activity.time}</p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {activity.score}/10
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Progression hebdomadaire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Objectif bien-être</span>
                      <span>{todayStats.totalProgress}%</span>
                    </div>
                    <Progress value={todayStats.totalProgress} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Sessions VR</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Journal quotidien</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Méditation</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </div>
                
                <Button 
                  onClick={() => navigate('/journal')}
                  className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Voir les détails
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default B2CDashboardPage;
