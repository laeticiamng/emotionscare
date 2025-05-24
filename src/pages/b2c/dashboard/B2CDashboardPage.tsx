
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Heart, 
  TrendingUp, 
  Calendar, 
  Music, 
  BookOpen, 
  Brain,
  Target,
  Clock,
  Smile,
  Award,
  ArrowRight,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';

const B2CDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isTrialUser, setIsTrialUser] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Check if user is in trial period
    if (user?.email?.endsWith('@exemple.fr')) {
      setIsTrialUser(false); // Demo accounts don't have trial
    } else {
      setIsTrialUser(true);
      // Calculate trial days left (would normally come from user metadata)
      const trialEnd = new Date(Date.now() + trialDaysLeft * 24 * 60 * 60 * 1000);
      const daysLeft = Math.max(0, Math.ceil((trialEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
      setTrialDaysLeft(daysLeft);
    }

    return () => clearInterval(timer);
  }, [user, trialDaysLeft]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Utilisateur';
  const isDemoAccount = user?.email?.endsWith('@exemple.fr');

  const stats = [
    {
      title: 'Séances complétées',
      value: isDemoAccount ? '24' : '0',
      icon: <Target className="h-4 w-4" />,
      trend: '+12%',
      color: 'text-green-600'
    },
    {
      title: 'Streak actuel',
      value: isDemoAccount ? '7 jours' : '0 jours',
      icon: <Calendar className="h-4 w-4" />,
      trend: 'Record !',
      color: 'text-blue-600'
    },
    {
      title: 'Score bien-être',
      value: isDemoAccount ? '85%' : '--',
      icon: <Heart className="h-4 w-4" />,
      trend: '+8 points',
      color: 'text-red-600'
    },
    {
      title: 'Minutes de méditation',
      value: isDemoAccount ? '180' : '0',
      icon: <Clock className="h-4 w-4" />,
      trend: 'Cette semaine',
      color: 'text-purple-600'
    }
  ];

  const quickActions = [
    {
      title: 'Scanner mes émotions',
      description: 'Analyse rapide de votre état émotionnel',
      icon: <Brain className="h-6 w-6" />,
      action: () => navigate('/scan'),
      color: 'bg-blue-500'
    },
    {
      title: 'Session de coaching',
      description: 'Coaching personnalisé avec IA',
      icon: <Heart className="h-6 w-6" />,
      action: () => navigate('/coach'),
      color: 'bg-red-500'
    },
    {
      title: 'Musique apaisante',
      description: 'Créer une playlist adaptée',
      icon: <Music className="h-6 w-6" />,
      action: () => navigate('/music'),
      color: 'bg-green-500'
    },
    {
      title: 'Journal personnel',
      description: 'Écrire et analyser vos pensées',
      icon: <BookOpen className="h-6 w-6" />,
      action: () => navigate('/journal'),
      color: 'bg-purple-500'
    }
  ];

  const recentActivities = isDemoAccount ? [
    {
      type: 'coaching',
      title: 'Session de méditation guidée',
      time: 'Il y a 2 heures',
      mood: 'Calme'
    },
    {
      type: 'scan',
      title: 'Analyse émotionnelle',
      time: 'Hier',
      mood: 'Optimiste'
    },
    {
      type: 'journal',
      title: 'Entrée de journal',
      time: 'Il y a 3 jours',
      mood: 'Réfléchi'
    }
  ] : [];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {getGreeting()}, {userName} !
            </h1>
            <p className="text-muted-foreground mt-1">
              {isDemoAccount 
                ? 'Voici votre aperçu EmotionsCare avec des données de démonstration'
                : 'Bienvenue dans votre espace de bien-être personnel'
              }
            </p>
          </div>
          
          {isTrialUser && !isDemoAccount && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Essai gratuit - {trialDaysLeft} jour{trialDaysLeft > 1 ? 's' : ''} restant{trialDaysLeft > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
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
              <Plus className="h-5 w-5" />
              <span>Actions rapides</span>
            </CardTitle>
            <CardDescription>
              Commencez votre session de bien-être dès maintenant
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

      {/* Recent Activity & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Activités récentes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border">
                      <div className="p-2 rounded-full bg-primary/10">
                        {activity.type === 'coaching' && <Heart className="h-4 w-4 text-red-500" />}
                        {activity.type === 'scan' && <Brain className="h-4 w-4 text-blue-500" />}
                        {activity.type === 'journal' && <BookOpen className="h-4 w-4 text-purple-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                      <span className="text-sm bg-muted px-2 py-1 rounded">
                        {activity.mood}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Smile className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Aucune activité récente. Commencez votre première session !
                  </p>
                  <Button 
                    onClick={() => navigate('/scan')} 
                    className="mt-4"
                  >
                    Commencer maintenant
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress & Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Vos progrès</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Objectif hebdomadaire</span>
                  <span>{isDemoAccount ? '5/7' : '0/7'} sessions</span>
                </div>
                <Progress value={isDemoAccount ? 71 : 0} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Streak de méditation</span>
                  <span>{isDemoAccount ? '7' : '0'} jours</span>
                </div>
                <Progress value={isDemoAccount ? 100 : 0} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Score bien-être mensuel</span>
                  <span>{isDemoAccount ? '85%' : '--'}</span>
                </div>
                <Progress value={isDemoAccount ? 85 : 0} className="h-2" />
              </div>

              {!isDemoAccount && (
                <div className="bg-muted/50 p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Commencez votre première analyse pour voir vos progrès
                  </p>
                  <Button onClick={() => navigate('/scan')} size="sm">
                    Démarrer l'analyse
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default B2CDashboardPage;
