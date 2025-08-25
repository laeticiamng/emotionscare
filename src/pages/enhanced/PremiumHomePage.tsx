import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Heart, Building2, Sparkles, Users, Brain, Music, ArrowRight, Star, 
  Zap, Globe, Shield, Target, Trophy, Activity, TrendingUp, 
  Play, Sun, Moon, ChevronDown, Settings, Loader2, Clock, 
  Headphones, BookOpen, MessageCircle, CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface UserMetrics {
  emotional_balance: number;
  stress_level: number;
  focus_score: number;
  wellness_streak: number;
  total_sessions: number;
  mood_trend: 'improving' | 'stable' | 'declining';
}

interface LiveFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  route: string;
  premium: boolean;
  live_users: number;
  avg_rating: number;
  category: 'therapy' | 'wellness' | 'social' | 'analytics' | 'entertainment';
  ai_powered: boolean;
  real_time: boolean;
}

interface RecentActivity {
  id: string;
  type: 'scan' | 'music' | 'breathwork' | 'journal' | 'coach';
  title: string;
  timestamp: Date;
  duration: number;
  score?: number;
}

const PremiumHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, profile } = useAuth();
  const { toast } = useToast();
  const shouldReduceMotion = useReducedMotion();
  
  // États simplifiés
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userMetrics, setUserMetrics] = useState<UserMetrics | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [personalizedGreeting, setPersonalizedGreeting] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Features statiques pour éviter les re-renders
  const liveFeatures = useMemo(() => [
    {
      id: 'ai-emotion-scan',
      title: 'Scan Émotionnel IA',
      description: 'Analyse instantanée de votre état émotionnel avec IA multimodale',
      icon: Brain,
      gradient: 'from-purple-500 via-blue-500 to-cyan-500',
      route: '/scan',
      premium: true,
      live_users: 1247,
      avg_rating: 4.9,
      category: 'therapy' as const,
      ai_powered: true,
      real_time: true
    },
    {
      id: 'adaptive-music',
      title: 'Thérapie Musicale Adaptative',
      description: 'Musique générée en temps réel selon votre rythme cardiaque',
      icon: Music,
      gradient: 'from-green-400 via-teal-500 to-blue-500',
      route: '/music',
      premium: true,
      live_users: 892,
      avg_rating: 4.8,
      category: 'wellness' as const,
      ai_powered: true,
      real_time: true
    },
    {
      id: 'ai-coach-premium',
      title: 'Coach IA Premium',
      description: 'Coaching personnalisé 24/7 avec analyse comportementale',
      icon: Users,
      gradient: 'from-pink-400 via-rose-500 to-red-500',
      route: '/coach',
      premium: true,
      live_users: 2134,
      avg_rating: 4.9,
      category: 'social' as const,
      ai_powered: true,
      real_time: true
    },
    {
      id: 'voice-analysis',
      title: 'Analyse Vocale IA',
      description: 'Détection des émotions dans votre voix',
      icon: Headphones,
      gradient: 'from-indigo-400 via-purple-500 to-pink-500',
      route: '/scan-voice',
      premium: true,
      live_users: 567,
      avg_rating: 4.7,
      category: 'therapy' as const,
      ai_powered: true,
      real_time: true
    },
    {
      id: 'breathwork',
      title: 'Exercices Respiratoires',
      description: 'Techniques de respiration guidées avec biofeedback',
      icon: Activity,
      gradient: 'from-emerald-400 via-green-500 to-teal-500',
      route: '/breathwork',
      premium: false,
      live_users: 1456,
      avg_rating: 4.8,
      category: 'wellness' as const,
      ai_powered: false,
      real_time: true
    },
    {
      id: 'journal',
      title: 'Journal Émotionnel IA',
      description: 'Suivi des émotions avec analyses prédictives',
      icon: BookOpen,
      gradient: 'from-orange-400 via-red-500 to-pink-500',
      route: '/journal',
      premium: true,
      live_users: 789,
      avg_rating: 4.9,
      category: 'analytics' as const,
      ai_powered: true,
      real_time: false
    }
  ], []);

  // Horloge (optimisée)
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  // Chargement des données utilisateur (mémorisé)
  const loadUserData = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      // Charger les métriques utilisateur
      const { data: metricsData } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (metricsData) {
        setUserMetrics(metricsData);
      } else {
        // Créer des métriques par défaut
        const defaultMetrics = {
          emotional_balance: 75,
          stress_level: 30,
          focus_score: 80,
          wellness_streak: 1,
          total_sessions: 0,
          mood_trend: 'stable' as const
        };
        setUserMetrics(defaultMetrics);
      }

      // Charger l'activité récente
      const { data: activityData } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (activityData) {
        setRecentActivity(activityData.map(activity => ({
          id: activity.id,
          type: activity.activity_type,
          title: activity.title || 'Session',
          timestamp: new Date(activity.created_at),
          duration: activity.duration || 0,
          score: activity.score
        })));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Données par défaut
      setUserMetrics({
        emotional_balance: 75,
        stress_level: 30,
        focus_score: 80,
        wellness_streak: 1,
        total_sessions: 0,
        mood_trend: 'stable'
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Greeting personnalisé (mémorisé)
  const loadPersonalizedContent = useCallback(() => {
    const hour = new Date().getHours();
    const name = profile?.display_name || user?.email?.split('@')[0] || 'là';
    
    if (hour < 12) setPersonalizedGreeting(`Bonjour ${name}, excellente journée !`);
    else if (hour < 18) setPersonalizedGreeting(`Bon après-midi ${name}, continuez sur votre lancée !`);
    else setPersonalizedGreeting(`Bonsoir ${name}, temps de vous détendre ?`);
  }, [profile?.display_name, user?.email]);

  // Chargement initial (stable)
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadUserData();
    }
    loadPersonalizedContent();
  }, [isAuthenticated, user?.id, loadUserData, loadPersonalizedContent]);

  const getGreetingIcon = () => {
    const hour = new Date().getHours();
    if (hour < 12) return <Sun className="h-5 w-5 text-yellow-400" />;
    if (hour < 18) return <Sun className="h-5 w-5 text-orange-400" />;
    return <Moon className="h-5 w-5 text-blue-400" />;
  };

  const getMoodTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <ArrowRight className="h-4 w-4 text-blue-600" />;
    }
  };

  const getActivityIcon = (type: string) => {
    const icons = {
      scan: Brain,
      music: Music,
      breathwork: Activity,
      journal: BookOpen,
      coach: MessageCircle
    };
    const IconComponent = icons[type as keyof typeof icons] || CheckCircle;
    return <IconComponent className="h-4 w-4" />;
  };

  const startQuickSession = (route: string) => {
    toast({
      title: "Session démarrée",
      description: "Redirection vers votre activité...",
    });
    navigate(route);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section 
        className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-12 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Greeting personnalisé */}
            <motion.div
              className="inline-flex items-center space-x-3 bg-card/80 backdrop-blur-sm rounded-full px-6 py-3 border shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {getGreetingIcon()}
              <span className="font-medium">
                {personalizedGreeting}
              </span>
            </motion.div>

            {/* Titre principal */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                EmotionsCare
              </h1>
              
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-lg text-muted-foreground font-medium">
                  Votre compagnon bien-être personnel
                </span>
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
            </motion.div>

            {/* Actions rapides */}
            <motion.div
              className="flex flex-wrap gap-3 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button 
                onClick={() => startQuickSession('/scan')}
                className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90"
              >
                <Brain className="w-4 h-4 mr-2" />
                Scan Rapide
              </Button>
              <Button 
                variant="outline"
                onClick={() => startQuickSession('/music')}
              >
                <Music className="w-4 h-4 mr-2" />
                Musique Thérapie
              </Button>
              <Button 
                variant="outline"
                onClick={() => startQuickSession('/breathwork')}
              >
                <Activity className="w-4 h-4 mr-2" />
                Respiration
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Métriques utilisateur */}
        {userMetrics && (
          <motion.section
            className="mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Votre Tableau de Bord</CardTitle>
                  <Badge className={cn(
                    "px-3 py-1 flex items-center gap-1",
                    userMetrics.mood_trend === 'improving' && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                    userMetrics.mood_trend === 'stable' && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
                    userMetrics.mood_trend === 'declining' && "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                  )}>
                    {getMoodTrendIcon(userMetrics.mood_trend)}
                    {userMetrics.mood_trend === 'improving' && 'En amélioration'}
                    {userMetrics.mood_trend === 'stable' && 'Stable'}
                    {userMetrics.mood_trend === 'declining' && 'À surveiller'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Équilibre Émotionnel</span>
                      <span className="font-bold">{userMetrics.emotional_balance}%</span>
                    </div>
                    <Progress value={userMetrics.emotional_balance} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Niveau de Stress</span>
                      <span className="font-bold">{userMetrics.stress_level}%</span>
                    </div>
                    <Progress value={100 - userMetrics.stress_level} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Score de Focus</span>
                      <span className="font-bold">{userMetrics.focus_score}%</span>
                    </div>
                    <Progress value={userMetrics.focus_score} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Série Consécutive</span>
                      <span className="font-bold">{userMetrics.wellness_streak}j</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(userMetrics.wellness_streak, 7) }).map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-primary rounded-full" />
                      ))}
                      {userMetrics.wellness_streak > 7 && (
                        <span className="text-primary text-xs ml-2">+{userMetrics.wellness_streak - 7}</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        )}

        {/* Activité récente et Fonctionnalités */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activité récente */}
          <motion.section
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Activité Récente
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50">
                        <div className="p-1.5 bg-primary/10 rounded-lg">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.timestamp.toLocaleDateString()}
                          </p>
                        </div>
                        {activity.score && (
                          <Badge variant="outline" className="text-xs">
                            {activity.score}%
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucune activité récente</p>
                    <p className="text-xs">Commencez votre première session !</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.section>

          {/* Fonctionnalités principales */}
          <motion.section
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Fonctionnalités Premium</h2>
              <p className="text-muted-foreground">Explorez nos outils thérapeutiques alimentés par l'IA</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveFeatures.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 + index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group"
                        onClick={() => navigate(feature.route)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${feature.gradient} group-hover:scale-110 transition-transform`}>
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-right">
                          {feature.premium && (
                            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 mb-1">
                              Premium
                            </Badge>
                          )}
                          {feature.ai_powered && (
                            <Badge variant="outline" className="text-xs">
                              IA
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {feature.live_users.toLocaleString()}
                          </span>
                          <span className="flex items-center">
                            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                            {feature.avg_rating}
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default PremiumHomePage;