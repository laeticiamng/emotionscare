import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion, useMotionValue, useTransform, AnimatePresence, useViewportScroll } from 'framer-motion';
import { 
  Heart, Building2, Sparkles, Users, Brain, Music, ArrowRight, Star, 
  Zap, Globe, Shield, Target, Trophy, Mic, Camera, Volume2, 
  Play, Pause, RotateCcw, Eye, Waves, Wind, Sun, Moon, ChevronDown,
  Activity, TrendingUp, Calendar, Clock, MessageCircle, Headphones,
  Smartphone, Monitor, Tablet, Battery, Wifi, Signal
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase';
import ResponsiveWrapper from '@/components/responsive/ResponsiveWrapper';
import { FunctionalButton } from '@/components/ui/functional-button';
import { NavigationButton } from '@/components/ui/navigation-button';
import { cn } from '@/lib/utils';

interface UserMetrics {
  emotional_balance: number;
  stress_level: number;
  focus_score: number;
  wellness_streak: number;
  total_sessions: number;
  achievements: string[];
  mood_trend: 'improving' | 'stable' | 'declining';
  last_session: string;
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
  const { scrollY } = useViewportScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // État de l'interface
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userMetrics, setUserMetrics] = useState<UserMetrics | null>(null);
  const [liveFeatures, setLiveFeatures] = useState<LiveFeature[]>([]);
  const [isLiveDataLoading, setIsLiveDataLoading] = useState(true);
  const [ambientMode, setAmbientMode] = useState<'cosmic' | 'forest' | 'ocean' | 'off'>('cosmic');
  const [deviceOptimization, setDeviceOptimization] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [personalizedGreeting, setPersonalizedGreeting] = useState('');
  const [todayInsights, setTodayInsights] = useState<string[]>([]);

  // Animation values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const backgroundX = useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1920], [-20, 20]);
  const backgroundY = useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1080], [-20, 20]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);

  // Détection de l'appareil
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

  // Chargement des données utilisateur
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserMetrics();
      loadPersonalizedContent();
    }
    loadLiveFeatures();
  }, [isAuthenticated, user]);

  // Horloge en temps réel
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadUserMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setUserMetrics(data);
      } else {
        // Données par défaut pour nouveaux utilisateurs
        setUserMetrics({
          emotional_balance: 75,
          stress_level: 30,
          focus_score: 80,
          wellness_streak: 1,
          total_sessions: 0,
          achievements: [],
          mood_trend: 'stable',
          last_session: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error loading user metrics:', error);
    }
  };

  const loadPersonalizedContent = async () => {
    try {
      const response = await supabase.functions.invoke('personalized-homepage', {
        body: {
          user_id: user?.id,
          time_of_day: new Date().getHours(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      });

      if (response.data) {
        setPersonalizedGreeting(response.data.greeting);
        setTodayInsights(response.data.insights || []);
      }
    } catch (error) {
      console.error('Error loading personalized content:', error);
      // Fallback greeting basé sur l'heure
      const hour = new Date().getHours();
      if (hour < 12) setPersonalizedGreeting('Bonjour et excellente journée !');
      else if (hour < 18) setPersonalizedGreeting('Bon après-midi, continuez sur votre lancée !');
      else setPersonalizedGreeting('Bonsoir, temps de vous détendre ?');
    }
  };

  const loadLiveFeatures = async () => {
    setIsLiveDataLoading(true);
    try {
      // Simulation de données live (en réalité, cela viendrait de l'API)
      const features: LiveFeature[] = [
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
          category: 'therapy',
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
          category: 'wellness',
          ai_powered: true,
          real_time: true
        },
        {
          id: 'immersive-vr',
          title: 'Réalité Virtuelle Thérapeutique',
          description: 'Environnements immersifs pour méditation et relaxation profonde',
          icon: Eye,
          gradient: 'from-indigo-500 via-purple-500 to-pink-500',
          route: '/vr',
          premium: true,
          live_users: 453,
          avg_rating: 4.7,
          category: 'therapy',
          ai_powered: false,
          real_time: false
        },
        {
          id: 'social-wellness',
          title: 'Communauté Bien-être',
          description: 'Groupes de soutien et challenges collaboratifs en temps réel',
          icon: Users,
          gradient: 'from-pink-400 via-rose-500 to-red-500',
          route: '/social-cocon',
          premium: false,
          live_users: 2134,
          avg_rating: 4.6,
          category: 'social',
          ai_powered: false,
          real_time: true
        },
        {
          id: 'gamified-goals',
          title: 'Objectifs Gamifiés',
          description: 'Transformez vos ambitions en quêtes épiques avec récompenses',
          icon: Trophy,
          gradient: 'from-yellow-400 via-orange-500 to-red-500',
          route: '/gamification',
          premium: true,
          live_users: 1876,
          avg_rating: 4.8,
          category: 'entertainment',
          ai_powered: true,
          real_time: false
        },
        {
          id: 'biometric-insights',
          title: 'Analyses Biométriques',
          description: 'Insights avancés basés sur vos données de santé connectées',
          icon: Activity,
          gradient: 'from-emerald-400 via-green-500 to-teal-500',
          route: '/weekly-bars',
          premium: true,
          live_users: 687,
          avg_rating: 4.9,
          category: 'analytics',
          ai_powered: true,
          real_time: true
        }
      ];

      setLiveFeatures(features);
    } catch (error) {
      console.error('Error loading live features:', error);
    } finally {
      setIsLiveDataLoading(false);
    }
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (containerRef.current && !shouldReduceMotion) {
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    }
  }, [mouseX, mouseY, shouldReduceMotion]);

  const toggleAmbientMode = () => {
    const modes: typeof ambientMode[] = ['cosmic', 'forest', 'ocean', 'off'];
    const currentIndex = modes.indexOf(ambientMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setAmbientMode(nextMode);
    
    if (nextMode !== 'off') {
      toast({
        title: `Mode ambiant activé`,
        description: `Environnement ${nextMode} sélectionné`,
        duration: 2000
      });
    }
  };

  const getGreetingIcon = () => {
    const hour = new Date().getHours();
    if (hour < 12) return <Sun className="h-5 w-5 text-yellow-400" />;
    if (hour < 18) return <Sun className="h-5 w-5 text-orange-400" />;
    return <Moon className="h-5 w-5 text-blue-400" />;
  };

  const getAmbientBackground = () => {
    switch (ambientMode) {
      case 'cosmic':
        return 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900';
      case 'forest':
        return 'bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900';
      case 'ocean':
        return 'bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900';
      default:
        return 'bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900';
    }
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
        ref={containerRef}
        className={cn(
          "min-h-screen overflow-hidden relative",
          getAmbientBackground()
        )}
        onMouseMove={handleMouseMove}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Ambient Background Effects */}
        {ambientMode !== 'off' && !shouldReduceMotion && (
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute inset-0 opacity-20"
              style={{
                background: `radial-gradient(circle at 30% 50%, rgba(139, 92, 246, 0.4) 0%, transparent 60%)`,
                x: backgroundX,
                y: backgroundY
              }}
            />
            <motion.div
              className="absolute inset-0 opacity-10"
              animate={{
                background: [
                  "radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 60%)",
                  "radial-gradient(circle at 30% 70%, rgba(139, 92, 246, 0.3) 0%, transparent 60%)",
                  "radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 60%)"
                ]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}

        {/* Status Bar - Desktop Only */}
        {deviceOptimization === 'desktop' && (
          <motion.div
            className="fixed top-0 left-0 right-0 z-40 bg-black/10 backdrop-blur-sm border-b border-white/5"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="container mx-auto px-8 py-2">
              <div className="flex items-center justify-between text-xs text-white/60">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>Système IA Actif</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{currentTime.toLocaleTimeString('fr-FR')}</span>
                  </div>
                  {isAuthenticated && userMetrics && (
                    <div className="flex items-center space-x-1">
                      <Activity className="h-3 w-3" />
                      <span>Séries: {userMetrics.wellness_streak}j</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Wifi className="h-3 w-3" />
                    <span>Connecté</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Signal className="h-3 w-3" />
                    <span>Premium</span>
                  </div>
                  <FunctionalButton
                    actionId="ambient-toggle"
                    onClick={toggleAmbientMode}
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                  >
                    {ambientMode === 'off' ? 'Ambiant Off' : `${ambientMode}`}
                  </FunctionalButton>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <DeviceOptimizedLayout>
          {/* Hero Section */}
          <motion.section 
            className={cn(
              "relative z-10 py-20",
              deviceOptimization === 'desktop' && "py-32 pt-40",
              deviceOptimization === 'tablet' && "py-24 pt-28",
              "py-16 pt-20"
            )}
            style={{ opacity: heroOpacity, scale: heroScale }}
          >
            <div className="text-center space-y-8">
              {/* Greeting */}
              {isAuthenticated && (
                <motion.div
                  className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-md rounded-full px-6 py-3 border border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {getGreetingIcon()}
                  <span className="text-white font-medium">
                    {personalizedGreeting || 'Bienvenue sur EmotionsCare'}
                  </span>
                  {userMetrics && (
                    <Badge className="bg-gradient-to-r from-green-400/20 to-blue-400/20 text-green-300 border-green-400/30">
                      Niveau {Math.floor(userMetrics.total_sessions / 5) + 1}
                    </Badge>
                  )}
                </motion.div>
              )}

              {/* Main Title */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h1 className={cn(
                  "font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent",
                  deviceOptimization === 'desktop' && "text-7xl lg:text-8xl",
                  deviceOptimization === 'tablet' && "text-5xl md:text-6xl",
                  "text-4xl sm:text-5xl"
                )}>
                  EmotionsCare
                </h1>
                
                <motion.div
                  className="flex items-center justify-center space-x-2"
                  animate={shouldReduceMotion ? {} : {
                    scale: [1, 1.05, 1],
                  }}
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
                  "text-purple-100 leading-relaxed mx-auto",
                  deviceOptimization === 'desktop' && "text-xl max-w-4xl",
                  deviceOptimization === 'tablet' && "text-lg max-w-3xl",
                  "text-base max-w-2xl"
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
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
                transition={{ delay: 0.8 }}
              >
                <NavigationButton
                  to="/choose-mode"
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg rounded-full shadow-2xl hover:shadow-purple-500/25 border-0"
                  showArrow
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Commencer Maintenant
                </NavigationButton>
                
                <NavigationButton
                  to="/demo"
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-full backdrop-blur-md"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Découvrir
                </NavigationButton>
              </motion.div>

              {/* Quick Stats */}
              {!isLiveDataLoading && liveFeatures.length > 0 && (
                <motion.div
                  className="flex items-center justify-center space-x-8 pt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {liveFeatures.reduce((acc, f) => acc + f.live_users, 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-purple-200">Utilisateurs actifs</div>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {(liveFeatures.reduce((acc, f) => acc + f.avg_rating, 0) / liveFeatures.length).toFixed(1)}★
                    </div>
                    <div className="text-xs text-purple-200">Satisfaction</div>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">24/7</div>
                    <div className="text-xs text-purple-200">Support IA</div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.section>

          {/* User Dashboard Preview - Authenticated Users Only */}
          {isAuthenticated && userMetrics && (
            <motion.section
              className="relative z-10 mb-20"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
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
                        <span className="text-purple-200 text-sm">Équilibre Émotionnel</span>
                        <span className="text-white font-bold">{userMetrics.emotional_balance}%</span>
                      </div>
                      <Progress value={userMetrics.emotional_balance} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-purple-200 text-sm">Niveau de Stress</span>
                        <span className="text-white font-bold">{userMetrics.stress_level}%</span>
                      </div>
                      <Progress value={100 - userMetrics.stress_level} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-purple-200 text-sm">Score de Focus</span>
                        <span className="text-white font-bold">{userMetrics.focus_score}%</span>
                      </div>
                      <Progress value={userMetrics.focus_score} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-purple-200 text-sm">Séries Consécutives</span>
                        <span className="text-white font-bold">{userMetrics.wellness_streak}j</span>
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

                  {todayInsights.length > 0 && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-white/10">
                      <h4 className="text-white font-medium mb-2 flex items-center">
                        <Brain className="h-4 w-4 mr-2 text-blue-400" />
                        Insights du Jour
                      </h4>
                      <div className="space-y-1">
                        {todayInsights.slice(0, 2).map((insight, index) => (
                          <p key={index} className="text-purple-200 text-sm leading-relaxed">
                            • {insight}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.section>
          )}

          {/* Live Features Grid */}
          <motion.section
            className="relative z-10 mb-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
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
              <p className="text-purple-200 max-w-2xl mx-auto">
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
                      
                      <h3 className="text-white text-lg font-semibold leading-none tracking-tight group-hover:text-purple-200 transition-colors">
                        {feature.title}
                      </h3>
                      <CardDescription className="text-purple-200 text-sm leading-relaxed">
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
                      
                      <NavigationButton
                        to={feature.route}
                        className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
                        variant="outline"
                        showArrow
                      >
                        Explorer
                      </NavigationButton>
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
                className="flex flex-col items-center text-white/60 cursor-pointer"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
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