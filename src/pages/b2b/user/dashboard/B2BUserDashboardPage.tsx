
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  Heart,
  Target,
  Clock,
  Award,
  Brain,
  Music,
  BookOpen,
  BarChart3,
  MessageSquare,
  CheckCircle
} from 'lucide-react';

const B2BUserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Collaborateur';
  const company = user?.user_metadata?.company || 'Votre entreprise';
  const isDemoAccount = user?.email?.endsWith('@exemple.fr');

  const stats = [
    {
      title: 'Séances complétées',
      value: isDemoAccount ? '18' : '0',
      icon: <Target className="h-4 w-4" />,
      trend: '+15%',
      color: 'text-green-600'
    },
    {
      title: 'Score bien-être',
      value: isDemoAccount ? '82%' : '--',
      icon: <Heart className="h-4 w-4" />,
      trend: '+5 points',
      color: 'text-red-600'
    },
    {
      title: 'Rang équipe',
      value: isDemoAccount ? '3/12' : '--',
      icon: <Award className="h-4 w-4" />,
      trend: 'Top 25%',
      color: 'text-yellow-600'
    },
    {
      title: 'Minutes actives',
      value: isDemoAccount ? '145' : '0',
      icon: <Clock className="h-4 w-4" />,
      trend: 'Cette semaine',
      color: 'text-blue-600'
    }
  ];

  const teamStats = [
    {
      title: 'Équipe actuelle',
      value: isDemoAccount ? '12 membres' : 'Non assigné',
      subtitle: isDemoAccount ? 'Équipe Développement' : ''
    },
    {
      title: 'Participation équipe',
      value: isDemoAccount ? '89%' : '--',
      subtitle: 'Cette semaine'
    },
    {
      title: 'Objectif collectif',
      value: isDemoAccount ? '76%' : '--',
      subtitle: 'En cours'
    }
  ];

  const quickActions = [
    {
      title: 'Check-in quotidien',
      description: 'Comment vous sentez-vous aujourd\'hui ?',
      icon: <Heart className="h-6 w-6" />,
      action: () => navigate('/scan'),
      color: 'bg-red-500',
      badge: isDemoAccount ? null : 'À faire'
    },
    {
      title: 'Coaching IA',
      description: 'Session personnalisée',
      icon: <Brain className="h-6 w-6" />,
      action: () => navigate('/coach'),
      color: 'bg-blue-500'
    },
    {
      title: 'Méditation guidée',
      description: 'Musique et relaxation',
      icon: <Music className="h-6 w-6" />,
      action: () => navigate('/music'),
      color: 'bg-green-500'
    },
    {
      title: 'Journal d\'équipe',
      description: 'Partager et consulter',
      icon: <BookOpen className="h-6 w-6" />,
      action: () => navigate('/journal'),
      color: 'bg-purple-500'
    }
  ];

  const teamActivities = isDemoAccount ? [
    {
      type: 'team_challenge',
      title: 'Défi bien-être équipe',
      participants: '8/12 participants',
      status: 'En cours',
      deadline: 'Dans 3 jours'
    },
    {
      type: 'group_session',
      title: 'Session méditation groupe',
      participants: '5 participants',
      status: 'Planifiée',
      deadline: 'Demain 14h'
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {getGreeting()}, {userName} !
            </h1>
            <p className="text-muted-foreground mt-1">
              Espace collaborateur - {company}
              {isDemoAccount && ' (Démonstration)'}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Collaborateur
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Personal Stats */}
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
              <Target className="h-5 w-5" />
              <span>Actions rapides</span>
            </CardTitle>
            <CardDescription>
              Vos outils de bien-être au travail
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={action.action}
                  className="h-auto flex flex-col items-center gap-3 p-6 hover:shadow-md transition-all relative"
                >
                  {action.badge && (
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                      {action.badge}
                    </div>
                  )}
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

      {/* Team Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Votre équipe</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {teamStats.map((stat, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{stat.title}</p>
                    <p className="text-sm text-muted-foreground">{stat.subtitle}</p>
                  </div>
                  <p className="text-lg font-semibold">{stat.value}</p>
                </div>
              ))}
              
              {isDemoAccount && (
                <div className="pt-4 border-t">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Objectif hebdomadaire équipe</span>
                    <span>9/12 membres actifs</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Team Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Activités d'équipe</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teamActivities.length > 0 ? (
                <div className="space-y-4">
                  {teamActivities.map((activity, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{activity.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${
                          activity.status === 'En cours' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {activity.participants}
                      </p>
                      <p className="text-xs text-orange-600">
                        {activity.deadline}
                      </p>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full mt-4">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Voir toutes les activités
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Aucune activité d'équipe en cours
                  </p>
                  <Button onClick={() => navigate('/scan')}>
                    Commencer votre check-in
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Votre progression</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Check-ins hebdomadaires</span>
                <span>{isDemoAccount ? '5/7' : '0/7'}</span>
              </div>
              <Progress value={isDemoAccount ? 71 : 0} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Sessions de coaching</span>
                <span>{isDemoAccount ? '3/5' : '0/5'}</span>
              </div>
              <Progress value={isDemoAccount ? 60 : 0} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Objectifs personnels</span>
                <span>{isDemoAccount ? '4/6' : '0/6'}</span>
              </div>
              <Progress value={isDemoAccount ? 67 : 0} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default B2BUserDashboardPage;
