import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Heart, Building2, Sparkles, Users, Brain, Music, ArrowRight, Star, 
  Zap, Globe, Shield, Target, Trophy, Activity, TrendingUp, 
  Play, Sun, Moon, ChevronDown, Settings, Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase';
import ResponsiveWrapper from '@/components/responsive/ResponsiveWrapper';
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

const PremiumHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const shouldReduceMotion = useReducedMotion();
  
  // États simplifiés
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userMetrics, setUserMetrics] = useState<UserMetrics | null>(null);
  const [deviceOptimization, setDeviceOptimization] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [personalizedGreeting, setPersonalizedGreeting] = useState('');

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
      id: 'gamification',
      title: 'Objectifs Gamifiés',
      description: 'Transformez vos ambitions en quêtes épiques',
      icon: Trophy,
      gradient: 'from-yellow-400 via-orange-500 to-red-500',
      route: '/gamification',
      premium: true,
      live_users: 1876,
      avg_rating: 4.8,
      category: 'entertainment' as const,
      ai_powered: true,
      real_time: false
    },
    {
      id: 'analytics',
      title: 'Analytics Bien-être',
      description: 'Insights avancés basés sur vos données de santé',
      icon: Activity,
      gradient: 'from-emerald-400 via-green-500 to-teal-500',
      route: '/weekly-bars',
      premium: true,
      live_users: 687,
      avg_rating: 4.9,
      category: 'analytics' as const,
      ai_powered: true,
      real_time: true
    }
  ], []);

  // Détection de l'appareil (stable)
  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth;
      if (width >= 1024) setDeviceOptimization('desktop');
      else if (width >= 768) setDeviceOptimization('tablet');
      else setDeviceOptimization('mobile');
    };

    detectDevice();
    window.addEventListener('resize', detectDevice);
    return () => window.removeEventListener('resize', detectDevice);
  }, []);

  // Horloge (optimisée)
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000); // Toutes les 30 secondes
    return () => clearInterval(timer);
  }, []);

  // Chargement des données utilisateur (mémorisé)
  const loadUserMetrics = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setUserMetrics(data);
      } else {
        setUserMetrics({
          emotional_balance: 75,
          stress_level: 30,
          focus_score: 80,
          wellness_streak: 1,
          total_sessions: 0,
          mood_trend: 'stable'
        });
      }
    } catch (error) {
      console.error('Error loading user metrics:', error);
    }
  }, [user?.id]);

  // Greeting personnalisé (mémorisé)
  const loadPersonalizedContent = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) setPersonalizedGreeting('Bonjour et excellente journée !');
    else if (hour < 18) setPersonalizedGreeting('Bon après-midi, continuez sur votre lancée !');
    else setPersonalizedGreeting('Bonsoir, temps de vous détendre ?');
  }, []);

  // Chargement initial (stable)
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadUserMetrics();
    }
    loadPersonalizedContent();
  }, [isAuthenticated, user?.id, loadUserMetrics, loadPersonalizedContent]);

  const getGreetingIcon = () => {
    const hour = new Date().getHours();
    if (hour < 12) return <Sun className="h-5 w-5 text-yellow-400" />;
    if (hour < 18) return <Sun className="h-5 w-5 text-orange-400" />;
    return <Moon className="h-5 w-5 text-blue-400" />;
  };

  const DeviceOptimizedLayout = ({ children }: { children: React.ReactNode }) => {
    const isDesktop = deviceOptimization === 'desktop';
    const isTablet = deviceOptimization === 'tablet';
    
    return (
      <div className={cn(
        "container mx-auto px-4",
        isDesktop && "px-8 max-w-7xl",
        isTablet && "px-6 max-w-6xl",
        "px-4 max-w-sm sm:max-w-md md:max-w-4xl"
      )}>
        {children}
      </div>
    );
  };

  return (
    <ResponsiveWrapper>
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/20 to-accent/10" />

        <DeviceOptimizedLayout>
          {/* Hero Section */}
          <motion.section 
            className={cn(
              "relative z-10 py-20 text-center",
              deviceOptimization === 'desktop' && "py-32",
              deviceOptimization === 'tablet' && "py-24"
            )}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Greeting */}
            {isAuthenticated && (
              <motion.div
                className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-md rounded-full px-6 py-3 border border-white/10 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {getGreetingIcon()}
                <span className="text-white font-medium">
                  {personalizedGreeting || 'Bienvenue sur EmotionsCare'}
                </span>
              </motion.div>
            )}

            {/* Main Title */}
            <motion.div
              className="space-y-4 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h1 className={cn(
                "font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent",
                deviceOptimization === 'desktop' && "text-6xl lg:text-7xl",
                deviceOptimization === 'tablet' && "text-4xl md:text-5xl",
                "text-3xl sm:text-4xl"
              )}>
                EmotionsCare
              </h1>
              
              <motion.div
                className="flex items-center justify-center space-x-2"
                animate={shouldReduceMotion ? {} : { scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Sparkles className="h-6 w-6 text-yellow-400" />
                <span className="text-lg text-purple-200 font-medium">
                  Plateforme IA Émotionnelle Premium
                </span>
                <Sparkles className="h-6 w-6 text-yellow-400" />
              </motion.div>
            </motion.div>

            {/* Description */}
            <motion.p 
              className={cn(
                "text-purple-100 leading-relaxed mx-auto mb-8",
                deviceOptimization === 'desktop' && "text-xl max-w-4xl",
                deviceOptimization === 'tablet' && "text-lg max-w-3xl",
                "text-base max-w-2xl"
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              Découvrez la thérapie digitale de nouvelle génération avec l'IA la plus avancée.
              <br />
              <span className="text-cyan-300 font-medium">
                Analyse émotionnelle • Bien-être personnalisé • Communauté bienveillante
              </span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className={cn(
                "flex items-center justify-center gap-4",
                deviceOptimization === 'mobile' && "flex-col space-y-3"
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Button
                onClick={() => navigate('/choose-mode')}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg rounded-full shadow-2xl hover:shadow-purple-500/25 border-0"
              >
                <Zap className="mr-2 h-5 w-5" />
                Commencer Maintenant
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button
                onClick={() => navigate('/demo')}
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-full backdrop-blur-md"
              >
                <Play className="mr-2 h-5 w-5" />
                Découvrir
              </Button>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              className="flex items-center justify-center space-x-8 pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-xs text-purple-200">Utilisateurs</div>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <div className="text-2xl font-bold text-white">4.9★</div>
                <div className="text-xs text-purple-200">Satisfaction</div>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-xs text-purple-200">Support IA</div>
              </div>
            </motion.div>
          </motion.section>

          {/* User Dashboard Preview */}
          {isAuthenticated && userMetrics && (
            <motion.section
              className="relative z-10 mb-20"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="text-white text-xl font-semibold leading-none tracking-tight">Votre Tableau de Bord</h2>
                    <Badge className={cn(
                      "px-3 py-1",
                      userMetrics.mood_trend === 'improving' && "bg-green-500/20 text-green-300 border-green-500/30",
                      userMetrics.mood_trend === 'stable' && "bg-blue-500/20 text-blue-300 border-blue-500/30",
                      userMetrics.mood_trend === 'declining' && "bg-orange-500/20 text-orange-300 border-orange-500/30"
                    )}>
                      {userMetrics.mood_trend === 'improving' && '📈 En amélioration'}
                      {userMetrics.mood_trend === 'stable' && '➡️ Stable'}
                      {userMetrics.mood_trend === 'declining' && '📉 À surveiller'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={cn(
                    "grid gap-6",
                    deviceOptimization === 'desktop' && "grid-cols-4",
                    deviceOptimization === 'tablet' && "grid-cols-2",
                    "grid-cols-1"
                  )}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-200 text-sm">Équilibre Émotionnel</span>
                        <span className="text-slate-300 font-bold">{userMetrics.emotional_balance}%</span>
                      </div>
                      <Progress value={userMetrics.emotional_balance} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-200 text-sm">Niveau de Stress</span>
                        <span className="text-slate-300 font-bold">{userMetrics.stress_level}%</span>
                      </div>
                      <Progress value={100 - userMetrics.stress_level} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-200 text-sm">Score de Focus</span>
                        <span className="text-slate-300 font-bold">{userMetrics.focus_score}%</span>
                      </div>
                      <Progress value={userMetrics.focus_score} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-200 text-sm">Séries Consécutives</span>
                        <span className="text-slate-300 font-bold">{userMetrics.wellness_streak}j</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(userMetrics.wellness_streak, 7) }).map((_, i) => (
                          <div key={i} className="w-3 h-3 bg-green-400 rounded-full" />
                        ))}
                        {userMetrics.wellness_streak > 7 && (
                          <span className="text-green-300 text-xs ml-2">+{userMetrics.wellness_streak - 7}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          )}

          {/* Live Features Grid */}
          <motion.section
            className="relative z-10 mb-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
          >
            <div className="text-center mb-12">
              <h2 className={cn(
                "font-bold text-white mb-4",
                deviceOptimization === 'desktop' && "text-4xl",
                deviceOptimization === 'tablet' && "text-3xl",
                "text-2xl"
              )}>
                Fonctionnalités Premium
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Explorez nos outils thérapeutiques alimentés par l'IA la plus avancée
              </p>
            </div>

            <div className={cn(
              "grid gap-6",
              deviceOptimization === 'desktop' && "grid-cols-3",
              deviceOptimization === 'tablet' && "grid-cols-2",
              "grid-cols-1"
            )}>
              {liveFeatures.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index }}
                  whileHover={shouldReduceMotion ? {} : { y: -5, scale: 1.02 }}
                  className="group"
                >
                  <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-500 cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <div className={cn(
                          "p-3 rounded-xl bg-gradient-to-br shadow-lg group-hover:shadow-xl transition-all duration-300",
                          feature.gradient
                        )}>
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {feature.premium && (
                            <Badge className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border-yellow-500/50 text-yellow-300 text-xs">
                              PRO
                            </Badge>
                          )}
                          {feature.ai_powered && (
                            <Badge className="bg-gradient-to-r from-purple-400/20 to-pink-500/20 border-purple-500/50 text-purple-300 text-xs">
                              IA
                            </Badge>
                          )}
                          {feature.real_time && (
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                              <span className="text-green-300 text-xs">Live</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <h3 className="text-slate-100 text-lg font-semibold leading-none tracking-tight group-hover:text-slate-200 transition-colors">
                        {feature.title}
                      </h3>
                      <CardDescription className="text-slate-300 text-sm leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-1 text-blue-300">
                          <Users className="h-3 w-3" />
                          <span>{feature.live_users.toLocaleString()} actifs</span>
                        </div>
                        <div className="flex items-center space-x-1 text-yellow-300">
                          <Star className="h-3 w-3 fill-current" />
                          <span>{feature.avg_rating}</span>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => navigate(feature.route)}
                        className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
                        variant="outline"
                      >
                        Explorer
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Scroll Indicator */}
          {deviceOptimization === 'desktop' && (
            <motion.div
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
            >
              <motion.div
                className="flex flex-col items-center text-white/60 cursor-pointer hover:text-white/80 transition-colors"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              >
                <span className="text-xs mb-2">Découvrir plus</span>
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </motion.div>
          )}
        </DeviceOptimizedLayout>
      </motion.div>
    </ResponsiveWrapper>
  );
};

export default PremiumHomePage;