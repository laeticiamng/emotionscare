import React, { useState, useEffect } from 'react';
import { 
  Calendar, TrendingUp, Heart, Brain, Music, 
  Activity, Award, Clock, Target, Sparkles,
  ArrowRight, Plus, Smile
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface QuickStat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: any;
  color: string;
}

interface RecentActivity {
  id: string;
  module: string;
  action: string;
  timestamp: Date;
  mood: 'positive' | 'neutral' | 'improving';
  duration?: number;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  action: string;
  url: string;
  priority: 'high' | 'medium' | 'low';
  icon: any;
  color: string;
}

const DashboardPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [quickStats, setQuickStats] = useState<QuickStat[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState(0);

  // Mise à jour de l'heure
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Données simulées
  useEffect(() => {
    // Stats rapides
    setQuickStats([
      {
        label: 'Sessions cette semaine',
        value: '12',
        change: '+3 vs semaine dernière',
        trend: 'up',
        icon: Calendar,
        color: 'from-blue-500 to-cyan-500'
      },
      {
        label: 'Temps bien-être total',
        value: '2h 45min',
        change: '+35min vs semaine dernière',
        trend: 'up',
        icon: Clock,
        color: 'from-green-500 to-emerald-500'
      },
      {
        label: 'Humeur moyenne',
        value: 'Positive',
        change: 'Amélioration continue',
        trend: 'up',
        icon: Smile,
        color: 'from-yellow-500 to-orange-500'
      },
      {
        label: 'Objectifs accomplis',
        value: '4/6',
        change: '2 nouvelles étapes',
        trend: 'up',
        icon: Target,
        color: 'from-purple-500 to-pink-500'
      }
    ]);

    // Activités récentes
    setRecentActivities([
      {
        id: '1',
        module: 'Respiration guidée',
        action: 'Session terminée avec succès',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1h ago
        mood: 'positive',
        duration: 300
      },
      {
        id: '2',
        module: 'Flash Glow',
        action: 'Boost énergétique complété',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3h ago
        mood: 'improving',
        duration: 120
      },
      {
        id: '3',
        module: 'Journal',
        action: 'Nouvelle entrée créée',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5h ago
        mood: 'positive'
      },
      {
        id: '4',
        module: 'Scan émotionnel',
        action: 'État analysé: Calme et focalisé',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8h ago
        mood: 'neutral'
      }
    ]);

    // Recommandations
    setRecommendations([
      {
        id: '1',
        title: 'Moment de respiration',
        description: 'Vous n\'avez pas pratiqué depuis 4h. Une session courte pourrait être bénéfique.',
        action: 'Respirer maintenant',
        url: '/app/breathing',
        priority: 'high',
        icon: Heart,
        color: 'from-green-500 to-emerald-500'
      },
      {
        id: '2',
        title: 'Nouveau dans Story Synth',
        description: 'Découvrez les histoires apaisantes pour la détente du soir.',
        action: 'Découvrir',
        url: '/app/story-synth',
        priority: 'medium',
        icon: Sparkles,
        color: 'from-purple-500 to-indigo-500'
      },
      {
        id: '3',
        title: 'Weekly Recap disponible',
        description: 'Votre synthèse de la semaine est prête avec de nouveaux insights.',
        action: 'Voir le recap',
        url: '/app/weekly-recap',
        priority: 'medium',
        icon: TrendingUp,
        color: 'from-blue-500 to-cyan-500'
      }
    ]);

    // Progrès hebdomadaire (simulation)
    setWeeklyProgress(68);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffHours >= 1) return `Il y a ${diffHours}h`;
    if (diffMins >= 1) return `Il y a ${diffMins}min`;
    return 'À l\'instant';
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'positive': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'improving': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300';
    }
  };

  const handleQuickAction = (action: string, url: string) => {
    toast.success(`${action} lancé !`);
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {getGreeting()} !
          </h1>
          <p className="text-xl text-muted-foreground">
            Prêt pour une nouvelle journée de bien-être ?
          </p>
          <div className="text-sm text-muted-foreground">
            {currentTime.toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} • {currentTime.toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6 bg-card/50 backdrop-blur-sm border-muted">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stat.trend === 'up' && '↗️'}
                    {stat.trend === 'down' && '↘️'}
                    {stat.trend === 'stable' && '→'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                  <div className="text-xs text-primary">{stat.change}</div>
                </div>
              </Card>
            );
          })}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Weekly Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-muted">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Progrès de la semaine
                    </h3>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                      {weeklyProgress}%
                    </Badge>
                  </div>
                  
                  <Progress value={weeklyProgress} className="h-3" />
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Objectif: 5 sessions minimum</span>
                    <span>12 sessions réalisées ✨</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Excellente régularité ! Vous dépassez largement votre objectif hebdomadaire.
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-muted">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Activité récente
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => window.location.href = '/app/activity'}>
                      Voir tout
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <AnimatePresence>
                      {recentActivities.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-sm">{activity.module}</div>
                            <div className="text-xs text-muted-foreground">{activity.action}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getMoodColor(activity.mood)}>
                              {activity.mood === 'positive' && 'Positif'}
                              {activity.mood === 'improving' && 'Amélioration'}
                              {activity.mood === 'neutral' && 'Neutre'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(activity.timestamp)}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-muted">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Actions rapides
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Scan Express', url: '/app/scan', icon: Brain, color: 'from-blue-500 to-cyan-500' },
                    { label: 'Flash Glow', url: '/app/flash-glow', icon: Sparkles, color: 'from-yellow-500 to-orange-500' },
                    { label: 'Respiration', url: '/app/breathing', icon: Heart, color: 'from-green-500 to-emerald-500' },
                    { label: 'Musique', url: '/app/music', icon: Music, color: 'from-purple-500 to-pink-500' }
                  ].map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Button
                        key={index}
                        variant="ghost"
                        onClick={() => handleQuickAction(action.label, action.url)}
                        className="h-20 flex flex-col gap-2 hover:bg-muted/50"
                      >
                        <div className={`w-8 h-8 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs">{action.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-muted">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Recommandé pour vous
                </h3>
                
                <div className="space-y-4">
                  {recommendations.map((rec, index) => {
                    const Icon = rec.icon;
                    return (
                      <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="p-4 rounded-lg bg-muted/20 border border-muted/50"
                      >
                        <div className="flex gap-3">
                          <div className={`w-10 h-10 bg-gradient-to-r ${rec.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <h4 className="font-medium text-sm">{rec.title}</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {rec.description}
                            </p>
                            <Button
                              size="sm"
                              onClick={() => handleQuickAction(rec.action, rec.url)}
                              className="w-full"
                            >
                              {rec.action}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>

            {/* Achievement Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/20 border-primary/30">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Presque là !</h4>
                    <p className="text-sm text-muted-foreground">
                      Plus que 3 sessions pour débloquer le badge "Régularité".
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = '/app/leaderboard'}
                  >
                    Voir mes badges
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Weather/Mood Context */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-muted">
                <h4 className="font-medium mb-3">Contexte du jour</h4>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span>🌤️</span>
                    <span>Météo clémente, idéal pour une pause en plein air</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>⏰</span>
                    <span>Moment propice pour un scan émotionnel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💡</span>
                    <span>Votre énergie semble stable aujourd'hui</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;