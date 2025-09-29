/**
 * Enhanced Dashboard - Tableau de bord moderne unifié
 * Experience utilisateur complète avec analytics, notifications et actions rapides
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  Brain, 
  Calendar, 
  Heart, 
  Music, 
  Target, 
  TrendingUp, 
  User, 
  Zap,
  Bell,
  Settings,
  BookOpen,
  Award,
  Sparkles,
  Clock,
  ArrowRight,
  Play,
  MessageCircle,
  Camera,
  Headphones
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface DashboardStats {
  totalSessions: number;
  weeklyProgress: number;
  currentStreak: number;
  wellnessScore: number;
  achievements: number;
  favoriteActivity: string;
}

interface RecentActivity {
  id: string;
  type: 'scan' | 'music' | 'journal' | 'coach' | 'vr';
  title: string;
  timestamp: Date;
  duration?: number;
  score?: number;
}

interface Notification {
  id: string;
  type: 'reminder' | 'achievement' | 'recommendation' | 'update';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const EnhancedDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalSessions: 0,
    weeklyProgress: 0,
    currentStreak: 0,
    wellnessScore: 0,
    achievements: 0,
    favoriteActivity: 'Scan émotionnel'
  });
  
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simuler le chargement des données
  useEffect(() => {
    const loadDashboardData = async () => {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalSessions: 47,
        weeklyProgress: 75,
        currentStreak: 7,
        wellnessScore: 85,
        achievements: 12,
        favoriteActivity: 'Musique thérapeutique'
      });

      setRecentActivities([
        {
          id: '1',
          type: 'scan',
          title: 'Analyse émotionnelle',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
          duration: 5,
          score: 82
        },
        {
          id: '2',
          type: 'music',
          title: 'Session musicothérapie',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4h ago
          duration: 15
        },
        {
          id: '3',
          type: 'journal',
          title: 'Entrée journal',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          duration: 8
        },
        {
          id: '4',
          type: 'coach',
          title: 'Session avec Nyvée',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          duration: 20
        }
      ]);

      setNotifications([
        {
          id: '1',
          type: 'achievement',
          title: 'Nouveau badge débloqué !',
          message: 'Félicitations ! Vous avez maintenu une série de 7 jours.',
          timestamp: new Date(),
          read: false
        },
        {
          id: '2',
          type: 'reminder',
          title: 'Session recommandée',
          message: 'Il est temps pour votre session de méditation quotidienne.',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          read: false
        },
        {
          id: '3',
          type: 'recommendation',
          title: 'Nouvelle fonctionnalité',
          message: 'Découvrez notre nouvelle analyse de patterns émotionnels.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: true
        }
      ]);

      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'scan': return <Camera className="h-4 w-4" />;
      case 'music': return <Music className="h-4 w-4" />;
      case 'journal': return <BookOpen className="h-4 w-4" />;
      case 'coach': return <MessageCircle className="h-4 w-4" />;
      case 'vr': return <Headphones className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: RecentActivity['type']) => {
    switch (type) {
      case 'scan': return 'text-green-600 bg-green-100';
      case 'music': return 'text-purple-600 bg-purple-100';
      case 'journal': return 'text-orange-600 bg-orange-100';
      case 'coach': return 'text-blue-600 bg-blue-100';
      case 'vr': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Hier';
    return `Il y a ${diffInDays} jours`;
  };

  const quickActions = [
    {
      title: 'Scan émotionnel',
      description: 'Analyser votre état actuel',
      icon: <Camera className="h-5 w-5" />,
      href: '/app/scan',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Musique thérapeutique',
      description: 'Session personnalisée',
      icon: <Music className="h-5 w-5" />,
      href: '/app/music',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Coach IA',
      description: 'Parler avec Nyvée',
      icon: <MessageCircle className="h-5 w-5" />,
      href: '/app/coach',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Journal',
      description: 'Nouvelle entrée',
      icon: <BookOpen className="h-5 w-5" />,
      href: '/app/journal',
      color: 'from-orange-500 to-red-500'
    }
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4 w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header de bienvenue */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Bonjour, {user?.email?.split('@')[0] || 'Utilisateur'} 👋
          </h1>
          <p className="text-muted-foreground">
            Voici un aperçu de votre progression aujourd'hui
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </Button>
          <Button size="sm">
            <Sparkles className="h-4 w-4 mr-2" />
            Upgrade Pro
          </Button>
        </div>
      </motion.div>

      {/* Notifications importantes */}
      {notifications.filter(n => !n.read).length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Alert className="border-blue-200 bg-blue-50">
            <Bell className="h-4 w-4 text-blue-600" />
            <AlertDescription>
              Vous avez {notifications.filter(n => !n.read).length} nouvelles notifications.
              <Button variant="link" className="p-0 h-auto ml-2">
                Voir toutes
              </Button>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Stats principales */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score de bien-être</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.wellnessScore}%</div>
            <p className="text-xs text-muted-foreground">+5% vs la semaine dernière</p>
            <Progress value={stats.wellnessScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Série actuelle</CardTitle>
            <Zap className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.currentStreak} jours</div>
            <p className="text-xs text-muted-foreground">Continue comme ça !</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progression</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.weeklyProgress}%</div>
            <p className="text-xs text-muted-foreground">Objectif hebdomadaire</p>
            <Progress value={stats.weeklyProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalSessions}</div>
            <p className="text-xs text-muted-foreground">Total cette semaine</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions rapides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Actions rapides
            </CardTitle>
            <CardDescription>
              Commencez une nouvelle session en un clic
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.href}>
                  <Card className="hover:shadow-md transition-all cursor-pointer group border-2 hover:border-primary/20">
                    <CardContent className="p-4">
                      <div className={`h-12 w-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                        {action.icon}
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contenu principal avec onglets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="activities">Activités</TabsTrigger>
            <TabsTrigger value="progress">Progrès</TabsTrigger>
            <TabsTrigger value="achievements">Succès</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Activité récente */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Activité récente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{activity.title}</h4>
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(activity.timestamp)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {activity.duration && <span>{activity.duration} min</span>}
                          {activity.score && (
                            <Badge variant="secondary" className="text-xs">
                              Score: {activity.score}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/app/activity">
                      Voir toute l'activité
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Objectifs et recommandations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Vos objectifs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Méditation quotidienne</span>
                        <span>5/7 jours</span>
                      </div>
                      <Progress value={(5/7) * 100} />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Score de bien-être &gt; 80%</span>
                        <span>{stats.wellnessScore}%</span>
                      </div>
                      <Progress value={stats.wellnessScore} />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Sessions hebdomadaires</span>
                        <span>47/50</span>
                      </div>
                      <Progress value={(47/50) * 100} />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold text-sm mb-3">Recommandations</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Brain className="h-4 w-4 text-blue-500" />
                        <span>Essayez une session de scan émotionnel le matin</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Music className="h-4 w-4 text-purple-500" />
                        <span>Nouvelle playlist relaxante disponible</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activities">
            <Card>
              <CardHeader>
                <CardTitle>Historique des activités</CardTitle>
                <CardDescription>
                  Toutes vos sessions et interactions récentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Fonctionnalité en développement...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Analyse des progrès</CardTitle>
                <CardDescription>
                  Évolution de votre bien-être dans le temps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Graphiques et analytics en développement...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Vos succès ({stats.achievements})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(stats.achievements)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="h-10 w-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <Award className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Badge {i + 1}</h4>
                        <p className="text-xs text-muted-foreground">Débloqué récemment</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default EnhancedDashboard;