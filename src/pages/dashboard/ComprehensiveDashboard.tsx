import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Heart, Activity, TrendingUp, Calendar, Target, Award, 
  Brain, Music, Users, BookOpen, Zap, Star, BarChart3,
  Clock, Flame, Shield, Globe, ArrowRight, Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  color: string;
  route: string;
}

interface Activity {
  id: string;
  type: 'scan' | 'music' | 'journal' | 'breathwork' | 'vr' | 'community';
  title: string;
  description: string;
  timestamp: Date;
  icon: React.ElementType;
  color: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  deadline: Date;
  category: 'wellness' | 'social' | 'learning' | 'mindfulness';
}

export const ComprehensiveDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [currentStreak, setCurrentStreak] = useState(7);
  const [weeklyGoal, setWeeklyGoal] = useState(75);

  const metrics: MetricCard[] = [
    {
      title: 'Bien-être Global',
      value: '82%',
      change: +5,
      icon: Heart,
      color: 'text-pink-500',
      route: '/analytics/wellness'
    },
    {
      title: 'Activité Quotidienne',
      value: '12',
      change: +3,
      icon: Activity,
      color: 'text-blue-500',
      route: '/analytics/activity'
    },
    {
      title: 'Progression',
      value: '+18%',
      change: +18,
      icon: TrendingUp,
      color: 'text-green-500',
      route: '/progress'
    },
    {
      title: 'Séries Consécutives',
      value: currentStreak,
      change: +1,
      icon: Flame,
      color: 'text-orange-500',
      route: '/progress/streaks'
    }
  ];

  const recentActivities: Activity[] = [
    {
      id: '1',
      type: 'scan',
      title: 'Scan Émotionnel Matinal',
      description: 'Analyse de votre état émotionnel - Résultat: Équilibré',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      icon: Brain,
      color: 'text-purple-500'
    },
    {
      id: '2',
      type: 'music',
      title: 'Session de Musicothérapie',
      description: 'Thérapie Focus - 25 minutes d\'écoute active',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      icon: Music,
      color: 'text-blue-500'
    },
    {
      id: '3',
      type: 'journal',
      title: 'Entrée de Journal',
      description: 'Réflexion du jour - Gratitude et objectifs',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      icon: BookOpen,
      color: 'text-green-500'
    },
    {
      id: '4',
      type: 'community',
      title: 'Interaction Communauté',
      description: 'Partage d\'expérience dans le groupe "Méditation"',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      icon: Users,
      color: 'text-cyan-500'
    }
  ];

  const goals: Goal[] = [
    {
      id: '1',
      title: 'Méditation Quotidienne',
      description: '20 minutes de méditation par jour',
      progress: 140,
      target: 140, // 7 jours * 20 minutes
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      category: 'mindfulness'
    },
    {
      id: '2',
      title: 'Connexions Sociales',
      description: 'Interagir avec 5 personnes cette semaine',
      progress: 3,
      target: 5,
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      category: 'social'
    },
    {
      id: '3',
      title: 'Exercices de Respiration',
      description: 'Compléter 10 sessions de breathwork',
      progress: 7,
      target: 10,
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      category: 'wellness'
    }
  ];

  const quickActions = [
    {
      title: 'Nouveau Scan',
      description: 'Analyser votre état actuel',
      icon: Brain,
      route: '/scan/new',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Créer Musique',
      description: 'Générer une thérapie musicale',
      icon: Music,
      route: '/music/generator',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Écrire Journal',
      description: 'Nouvelle entrée de journal',
      icon: BookOpen,
      route: '/journal/new',
      gradient: 'from-green-500 to-teal-500'
    },
    {
      title: 'Session VR',
      description: 'Expérience immersive',
      icon: Globe,
      route: '/vr/hub',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours === 1) return 'Il y a 1 heure';
    if (diffInHours < 24) return `Il y a ${diffInHours} heures`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Hier';
    return `Il y a ${diffInDays} jours`;
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header avec salutation personnalisée */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Bonjour {user?.user_metadata?.name || 'Utilisateur'} ! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Voici votre tableau de bord personnel - Continuez votre parcours de bien-être
          </p>
        </div>
        
        <div className="flex items-center justify-center space-x-4">
          <Badge variant="secondary" className="text-sm px-3 py-1">
            <Flame className="w-4 h-4 mr-1" />
            {currentStreak} jours consécutifs
          </Badge>
          <Badge variant="outline" className="text-sm px-3 py-1">
            <Star className="w-4 h-4 mr-1" />
            Niveau: Expert
          </Badge>
        </div>
      </motion.div>

      {/* Métriques principales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {metrics.map((metric, index) => (
          <Card 
            key={metric.title}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => navigate(metric.route)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={metric.change > 0 ? 'text-green-600' : 'text-red-600'}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </span>
                {' '}depuis hier
              </p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Actions rapides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-semibold flex items-center">
          <Zap className="w-6 h-6 mr-2 text-yellow-500" />
          Actions Rapides
        </h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Button
              key={action.title}
              onClick={() => navigate(action.route)}
              className={`h-24 flex-col space-y-2 bg-gradient-to-r ${action.gradient} hover:opacity-90 text-white`}
              variant="default"
            >
              <action.icon className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">{action.title}</div>
                <div className="text-xs opacity-90">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
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
            <TabsTrigger value="goals">Objectifs</TabsTrigger>
            <TabsTrigger value="activity">Activité</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Progrès hebdomadaire */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Progrès de la Semaine
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Objectif hebdomadaire</span>
                      <span>{weeklyGoal}%</span>
                    </div>
                    <Progress value={weeklyGoal} className="h-3" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Sessions complétées</p>
                      <p className="text-2xl font-bold text-green-600">18/25</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Temps total</p>
                      <p className="text-2xl font-bold text-blue-600">6h 42m</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tendances émotionnelles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Tendances Émotionnelles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Bonheur</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={85} className="w-20 h-2" />
                        <span className="text-sm text-green-600">+5%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Sérénité</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={78} className="w-20 h-2" />
                        <span className="text-sm text-green-600">+3%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Énergie</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={72} className="w-20 h-2" />
                        <span className="text-sm text-yellow-600">-2%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Focus</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={90} className="w-20 h-2" />
                        <span className="text-sm text-green-600">+12%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Mes Objectifs</CardTitle>
                <Button onClick={() => navigate('/progress/goals')} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvel Objectif
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <div key={goal.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-medium">{goal.title}</h3>
                          <p className="text-sm text-muted-foreground">{goal.description}</p>
                        </div>
                        <Badge variant={goal.category === 'wellness' ? 'default' : 'secondary'}>
                          {goal.category}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progrès: {goal.progress}/{goal.target}</span>
                          <span>{Math.round((goal.progress / goal.target) * 100)}%</span>
                        </div>
                        <Progress value={(goal.progress / goal.target) * 100} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Échéance: {goal.deadline.toLocaleDateString()}</span>
                        <span>{Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} jours restants</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Activité Récente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={`p-2 rounded-full bg-background border ${activity.color}`}>
                        <activity.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-medium">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    Insights IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">Recommandation du jour</h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                      Vos sessions de méditation matinales montrent d'excellents résultats. 
                      Considérez ajouter une session de 10 minutes l'après-midi pour maintenir votre focus.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                    <h4 className="font-medium text-green-900 dark:text-green-100">Progression notable</h4>
                    <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                      Votre score de bien-être a augmenté de 18% cette semaine, 
                      principalement grâce à vos séances de musicothérapie régulières.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Achievements Récents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                    <div className="p-2 bg-yellow-500 rounded-full">
                      <Flame className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">Série de 7 jours</h4>
                      <p className="text-sm text-muted-foreground">Activité quotidienne maintenue</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <div className="p-2 bg-purple-500 rounded-full">
                      <Music className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">Mélomane Thérapeutique</h4>
                      <p className="text-sm text-muted-foreground">50 sessions de musicothérapie complétées</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="p-2 bg-green-500 rounded-full">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">Mentor Communautaire</h4>
                      <p className="text-sm text-muted-foreground">Aidé 10 nouveaux membres</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default ComprehensiveDashboard;