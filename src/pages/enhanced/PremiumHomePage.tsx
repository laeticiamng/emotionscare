import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion, useMotionValue, useTransform, AnimatePresence, useViewportScroll } from 'framer-motion';
import { 
  Heart, Building2, Sparkles, Users, Brain, Music, ArrowRight, Star, 
  Zap, Globe, Shield, Target, Trophy, Mic, Camera, Volume2, 
  Play, Pause, RotateCcw, Eye, Waves, Wind, Sun, Moon, ChevronDown,
  Activity, TrendingUp, Calendar, Clock, MessageCircle, Headphones,
  Smartphone, Monitor, Tablet, Battery, Wifi, Signal, Settings,
  Maximize2, Minimize2, BarChart3, PieChart, LineChart, 
  Layers3, Cpu, Database, Network, CloudLightning, Sparkle,
  Palette, Brush, Wand2, Stars, Compass, Map, Navigation,
  Timer, Stopwatch, AlarmClock, Coffee, BookOpen, Lightbulb,
  Rocket, Award, Medal, Crown, Gem, Diamond, Infinity,
  MousePointer2, Fingerprint, ScanLine, Radar, Crosshair, Watch
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
  daily_goals: number;
  weekly_progress: number;
  energy_level: number;
  mindfulness_score: number;
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
  completion_rate: number;
  trending: boolean;
  new_feature: boolean;
}

interface InteractiveParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
}

interface PerformanceMetrics {
  cpu_usage: number;
  memory_usage: number;
  network_latency: number;
  frame_rate: number;
  ai_response_time: number;
}

const PremiumHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useViewportScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  // États avancés de l'interface
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userMetrics, setUserMetrics] = useState<UserMetrics | null>(null);
  const [liveFeatures, setLiveFeatures] = useState<LiveFeature[]>([]);
  const [isLiveDataLoading, setIsLiveDataLoading] = useState(true);
  const [ambientMode, setAmbientMode] = useState<'cosmic' | 'forest' | 'ocean' | 'aurora' | 'nebula' | 'off'>('cosmic');
  const [deviceOptimization, setDeviceOptimization] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [personalizedGreeting, setPersonalizedGreeting] = useState('');
  const [todayInsights, setTodayInsights] = useState<string[]>([]);
  const [isImmersiveMode, setIsImmersiveMode] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [particles, setParticles] = useState<InteractiveParticle[]>([]);
  const [cursorTrail, setCursorTrail] = useState<Array<{x: number, y: number, timestamp: number}>>([]);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [biometricData, setBiometricData] = useState({
    heartRate: 72,
    stressIndex: 25,
    focusLevel: 85,
    energyLevel: 78
  });
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [interactionHeatMap, setInteractionHeatMap] = useState<Array<{x: number, y: number, intensity: number}>>([]);
  const [immersiveElements, setImmersiveElements] = useState({
    showParticles: true,
    enableSoundscape: false,
    adaptiveLighting: true,
    biometricSync: false,
    personalizedAnimations: true
  });

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

  // Système de particules interactives (simplifié)
  useEffect(() => {
    if (!particleCanvasRef.current || shouldReduceMotion || !immersiveElements.showParticles) return;

    const canvas = particleCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Réduire la fréquence de mise à jour du canvas pour éviter les problèmes de performance
    let lastUpdateTime = 0;
    const targetFPS = 30; // Limiter à 30 FPS
    const frameDuration = 1000 / targetFPS;

    canvas.width = Math.min(window.innerWidth, 1920);
    canvas.height = Math.min(window.innerHeight, 1080);

    const createParticle = (): InteractiveParticle => ({
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1, // Réduire la vitesse
      vy: (Math.random() - 0.5) * 1,
      size: Math.random() * 2 + 1, // Réduire la taille
      opacity: Math.random() * 0.3 + 0.1, // Réduire l'opacité
      color: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'][Math.floor(Math.random() * 4)],
      life: 1
    });

    const particlePool = Array.from({ length: 25 }, createParticle); // Réduire le nombre de particules

    const animateParticles = (timestamp: number) => {
      if (timestamp - lastUpdateTime < frameDuration) {
        animationRef.current = requestAnimationFrame(animateParticles);
        return;
      }
      lastUpdateTime = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlePool.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Boundary collision
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        // Draw particle
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animateParticles);
    };

    animationRef.current = requestAnimationFrame(animateParticles);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [shouldReduceMotion, immersiveElements.showParticles]);

  // Monitoring des performances en temps réel (optimisé)
  useEffect(() => {
    let mounted = true;
    
    const updatePerformanceMetrics = () => {
      if (!mounted) return;
      
      try {
        const memory = (performance as any).memory;
        
        setPerformanceMetrics({
          cpu_usage: Math.random() * 40 + 10, // Simulation
          memory_usage: memory ? Math.min((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100, 100) : Math.random() * 60 + 20,
          network_latency: Math.random() * 50 + 10,
          frame_rate: 60, // Valeur fixe pour éviter les calculs complexes
          ai_response_time: Math.random() * 200 + 100
        });
      } catch (error) {
        console.warn('Performance metrics error:', error);
      }
    };

    const interval = setInterval(updatePerformanceMetrics, 5000); // Réduire la fréquence
    updatePerformanceMetrics();

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Cursor trail effect (simplifié)
  useEffect(() => {
    if (shouldReduceMotion || deviceOptimization === 'mobile') return;

    let trailTimeout: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      setCursorTrail(prev => [
        ...prev.slice(-5), // Réduire la longueur du trail
        { x: e.clientX, y: e.clientY, timestamp: now }
      ]);

      // Nettoyer le trail automatiquement
      clearTimeout(trailTimeout);
      trailTimeout = setTimeout(() => {
        setCursorTrail([]);
      }, 2000);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(trailTimeout);
    };
  }, [shouldReduceMotion, deviceOptimization]);

  // Simulation de données biométriques (optimisée)
  useEffect(() => {
    if (!immersiveElements.biometricSync) return;

    let mounted = true;

    const updateBiometrics = () => {
      if (!mounted) return;
      
      setBiometricData(prev => ({
        heartRate: Math.max(60, Math.min(100, prev.heartRate + (Math.random() - 0.5) * 2)), // Réduire la variation
        stressIndex: Math.max(0, Math.min(100, prev.stressIndex + (Math.random() - 0.5) * 4)),
        focusLevel: Math.max(0, Math.min(100, prev.focusLevel + (Math.random() - 0.5) * 3)),
        energyLevel: Math.max(0, Math.min(100, prev.energyLevel + (Math.random() - 0.5) * 2))
      }));
    };

    const interval = setInterval(updateBiometrics, 5000); // Moins fréquent
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [immersiveElements.biometricSync]);

  // IA Insights génération (optimisée)
  useEffect(() => {
    if (!isAuthenticated || !userMetrics) return;

    let mounted = true;

    const generateAIInsights = () => {
      if (!mounted) return;
      
      const insights = [
        "Votre niveau de stress a diminué de 15% cette semaine 📉",
        "Moment optimal pour une séance de méditation détecté 🧘‍♀️",
        "Votre rythme cardiaque indique un état de relaxation idéal 💚",
        "Suggestion IA : Essayez une pause respiration de 5 minutes 🌬️",
        "Tendance positive détectée dans votre équilibre émotionnel 📈",
        "Votre focus est à son maximum, parfait pour les tâches importantes ⚡"
      ];

      setAiInsights(insights.slice(0, 3));
    };

    const interval = setInterval(generateAIInsights, 30000); // Moins fréquent
    generateAIInsights();

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [isAuthenticated, userMetrics]);

  // Mode immersif toggle
  const toggleImmersiveMode = useCallback(() => {
    setIsImmersiveMode(prev => {
      const newMode = !prev;
      
      if (newMode) {
        // Activer mode plein écran
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {
            toast({
              title: "Mode immersif activé",
              description: "Plein écran non disponible sur cet appareil",
              duration: 3000
            });
          });
        }
        
        // Activer tous les effets immersifs
        setImmersiveElements({
          showParticles: true,
          enableSoundscape: true,
          adaptiveLighting: true,
          biometricSync: true,
          personalizedAnimations: true
        });
        
        toast({
          title: "🚀 Mode Immersif Activé",
          description: "Expérience premium complètement débloquée",
          duration: 4000
        });
      } else {
        // Désactiver mode plein écran
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
        
        setImmersiveElements({
          showParticles: true,
          enableSoundscape: false,
          adaptiveLighting: true,
          biometricSync: false,
          personalizedAnimations: true
        });
        
        toast({
          title: "Mode Standard",
          description: "Retour à l'affichage normal",
          duration: 2000
        });
      }
      
      return newMode;
    });
  }, [toast]);

  // Fonction pour ajuster les métriques utilisateur par défaut
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
        // Données par défaut enrichies pour nouveaux utilisateurs
        setUserMetrics({
          emotional_balance: 75,
          stress_level: 30,
          focus_score: 80,
          wellness_streak: 1,
          total_sessions: 0,
          achievements: [],
          mood_trend: 'stable',
          last_session: new Date().toISOString(),
          daily_goals: 3,
          weekly_progress: 65,
          energy_level: 82,
          mindfulness_score: 78
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
      // Simulation de données live enrichies (en réalité, cela viendrait de l'API)
      const features: LiveFeature[] = [
        {
          id: 'ai-emotion-scan',
          title: 'Scan Émotionnel IA',
          description: 'Analyse instantanée multimodale : voix, texte, expressions faciales avec IA GPT-4 Vision',
          icon: Brain,
          gradient: 'from-purple-500 via-blue-500 to-cyan-500',
          route: '/scan',
          premium: true,
          live_users: 1247,
          avg_rating: 4.9,
          category: 'therapy',
          ai_powered: true,
          real_time: true,
          completion_rate: 94,
          trending: true,
          new_feature: false
        },
        {
          id: 'adaptive-music',
          title: 'Thérapie Musicale Adaptative',
          description: 'Génération musicale IA basée sur biométrie temps réel + analyse émotionnelle avancée',
          icon: Music,
          gradient: 'from-green-400 via-teal-500 to-blue-500',
          route: '/music',
          premium: true,
          live_users: 892,
          avg_rating: 4.8,
          category: 'wellness',
          ai_powered: true,
          real_time: true,
          completion_rate: 89,
          trending: true,
          new_feature: true
        },
        {
          id: 'immersive-vr',
          title: 'Métavers Thérapeutique',
          description: 'Environnements VR/AR immersifs avec eye-tracking et biofeedback neural',
          icon: Eye,
          gradient: 'from-indigo-500 via-purple-500 to-pink-500',
          route: '/vr',
          premium: true,
          live_users: 453,
          avg_rating: 4.7,
          category: 'therapy',
          ai_powered: true,
          real_time: false,
          completion_rate: 76,
          trending: false,
          new_feature: true
        },
        {
          id: 'ai-coach-premium',
          title: 'Coach IA Premium',
          description: 'Coaching personnalisé 24/7 avec analyse comportementale prédictive et NLP avancé',
          icon: Users,
          gradient: 'from-pink-400 via-rose-500 to-red-500',
          route: '/coach',
          premium: true,
          live_users: 2134,
          avg_rating: 4.9,
          category: 'social',
          ai_powered: true,
          real_time: true,
          completion_rate: 91,
          trending: true,
          new_feature: false
        },
        {
          id: 'neural-gamification',
          title: 'Gamification Neurale',
          description: 'Quêtes adaptatiques basées sur neurofeedback avec récompenses blockchain NFT',
          icon: Trophy,
          gradient: 'from-yellow-400 via-orange-500 to-red-500',
          route: '/gamification',
          premium: true,
          live_users: 1876,
          avg_rating: 4.8,
          category: 'entertainment',
          ai_powered: true,
          real_time: true,
          completion_rate: 87,
          trending: true,
          new_feature: true
        },
        {
          id: 'quantum-analytics',
          title: 'Analytics Quantiques',
          description: 'Prédictions comportementales avec algorithmes quantiques et ML distribué',
          icon: Activity,
          gradient: 'from-emerald-400 via-green-500 to-teal-500',
          route: '/weekly-bars',
          premium: true,
          live_users: 687,
          avg_rating: 4.9,
          category: 'analytics',
          ai_powered: true,
          real_time: true,
          completion_rate: 95,
          trending: false,
          new_feature: true
        },
        {
          id: 'holographic-journal',
          title: 'Journal Holographique',
          description: 'Journaling immersif avec analyse sémantique et reconstruction 3D des souvenirs',
          icon: BookOpen,
          gradient: 'from-violet-400 via-purple-500 to-indigo-500',
          route: '/journal',
          premium: true,
          live_users: 1203,
          avg_rating: 4.7,
          category: 'therapy',
          ai_powered: true,
          real_time: false,
          completion_rate: 82,
          trending: false,
          new_feature: true
        },
        {
          id: 'biometric-sync',
          title: 'Synchronisation Biométrique',
          description: 'Intégration Apple Watch, Fitbit, Oura avec IA prédictive de santé mentale',
          icon: Watch,
          gradient: 'from-cyan-400 via-blue-500 to-purple-500',
          route: '/breathwork',
          premium: true,
          live_users: 956,
          avg_rating: 4.8,
          category: 'wellness',
          ai_powered: true,
          real_time: true,
          completion_rate: 88,
          trending: true,
          new_feature: false
        },
        {
          id: 'ar-meditation',
          title: 'Méditation AR Spatiale',
          description: 'Réalité augmentée avec tracking spatial pour méditation guidée immersive',
          icon: Compass,
          gradient: 'from-rose-400 via-pink-500 to-purple-500',
          route: '/ar-filters',
          premium: true,
          live_users: 534,
          avg_rating: 4.6,
          category: 'wellness',
          ai_powered: false,
          real_time: false,
          completion_rate: 73,
          trending: false,
          new_feature: true
        }
      ];

      // Simulation de mise à jour en temps réel des utilisateurs actifs
      const updatedFeatures = features.map(feature => ({
        ...feature,
        live_users: feature.live_users + Math.floor((Math.random() - 0.5) * 50)
      }));

      setLiveFeatures(updatedFeatures);
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
                          {feature.new_feature && (
                            <Badge className="bg-gradient-to-r from-green-400/20 to-emerald-500/20 border-green-500/50 text-green-300 text-xs animate-pulse">
                              NOUVEAU
                            </Badge>
                          )}
                          {feature.trending && (
                            <Badge className="bg-gradient-to-r from-red-400/20 to-pink-500/20 border-red-500/50 text-red-300 text-xs">
                              🔥 TENDANCE
                            </Badge>
                          )}
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
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center space-x-1 text-blue-300">
                          <Users className="h-3 w-3" />
                          <span>{feature.live_users.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-yellow-300">
                          <Star className="h-3 w-3 fill-current" />
                          <span>{feature.avg_rating}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-green-300">
                          <Target className="h-3 w-3" />
                          <span>{feature.completion_rate}% succès</span>
                        </div>
                        <div className="flex items-center space-x-1 text-purple-300">
                          <TrendingUp className="h-3 w-3" />
                          <span>{feature.category}</span>
                        </div>
                      </div>
                      
                      {/* Barre de progression pour le taux de completion */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-300">Taux de réussite</span>
                          <span className="text-white">{feature.completion_rate}%</span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-2">
                          <motion.div 
                            className={cn(
                              "h-2 rounded-full transition-all duration-1000",
                              feature.completion_rate >= 90 ? "bg-gradient-to-r from-green-400 to-emerald-500" :
                              feature.completion_rate >= 80 ? "bg-gradient-to-r from-blue-400 to-cyan-500" :
                              feature.completion_rate >= 70 ? "bg-gradient-to-r from-yellow-400 to-orange-500" :
                              "bg-gradient-to-r from-red-400 to-pink-500"
                            )}
                            initial={{ width: 0 }}
                            animate={{ width: `${feature.completion_rate}%` }}
                            transition={{ delay: 0.3 * index, duration: 1 }}
                          />
                        </div>
                      </div>
                      
                      <NavigationButton
                        to={feature.route}
                        className={cn(
                          "w-full text-white border-white/20 transition-all duration-300",
                          feature.trending 
                            ? "bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 border-red-500/30" 
                            : "bg-white/10 hover:bg-white/20"
                        )}
                        variant="outline"
                        showArrow
                      >
                        {feature.new_feature ? "✨ Découvrir" : "Explorer"}
                      </NavigationButton>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Panneau de Contrôle Immersif - Desktop seulement */}
          {deviceOptimization === 'desktop' && (
            <motion.section
              className="relative z-10 mb-20"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <Card className="bg-gradient-to-br from-black/20 to-gray-900/20 backdrop-blur-xl border-white/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="text-white text-2xl font-bold flex items-center">
                      <Settings className="mr-3 h-6 w-6 text-cyan-400" />
                      Centre de Contrôle Premium
                    </h2>
                    <FunctionalButton
                      actionId="immersive-toggle"
                      onClick={toggleImmersiveMode}
                      variant={isImmersiveMode ? "default" : "outline"}
                      size="lg"
                      className={cn(
                        "relative overflow-hidden",
                        isImmersiveMode 
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25" 
                          : "border-white/20 text-white hover:bg-white/10"
                      )}
                    >
                      {isImmersiveMode ? (
                        <>
                          <Minimize2 className="mr-2 h-4 w-4" />
                          Mode Immersif ON
                        </>
                      ) : (
                        <>
                          <Maximize2 className="mr-2 h-4 w-4" />
                          Activer Mode Immersif
                        </>
                      )}
                    </FunctionalButton>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-6">
                    {/* Métriques de Performance */}
                    {performanceMetrics && (
                      <div className="space-y-4">
                        <h3 className="text-cyan-300 font-medium flex items-center">
                          <Cpu className="mr-2 h-4 w-4" />
                          Performance Système
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-300">CPU</span>
                              <span className="text-white">{performanceMetrics.cpu_usage.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-700/50 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${performanceMetrics.cpu_usage}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-300">RAM</span>
                              <span className="text-white">{performanceMetrics.memory_usage.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-700/50 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${performanceMetrics.memory_usage}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-300">Latence IA</span>
                              <span className="text-white">{performanceMetrics.ai_response_time.toFixed(0)}ms</span>
                            </div>
                            <div className="w-full bg-gray-700/50 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${Math.min(performanceMetrics.ai_response_time / 5, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Données Biométriques */}
                    {immersiveElements.biometricSync && (
                      <div className="space-y-4">
                        <h3 className="text-green-300 font-medium flex items-center">
                          <Activity className="mr-2 h-4 w-4" />
                          Biométrie Live
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300 text-sm">Rythme Cardiaque</span>
                            <span className="text-red-400 font-bold">{biometricData.heartRate} BPM</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300 text-sm">Index Stress</span>
                            <span className="text-orange-400 font-bold">{biometricData.stressIndex}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300 text-sm">Niveau Focus</span>
                            <span className="text-blue-400 font-bold">{biometricData.focusLevel}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300 text-sm">Niveau Énergie</span>
                            <span className="text-green-400 font-bold">{biometricData.energyLevel}%</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Insights IA */}
                    {aiInsights.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-purple-300 font-medium flex items-center">
                          <Brain className="mr-2 h-4 w-4" />
                          Insights IA Live
                        </h3>
                        <div className="space-y-2">
                          {aiInsights.map((insight, index) => (
                            <motion.div
                              key={index}
                              className="p-2 bg-white/5 rounded-lg border border-white/10"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.2 }}
                            >
                              <p className="text-xs text-purple-200">{insight}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contrôles Environnement */}
                    <div className="space-y-4">
                      <h3 className="text-yellow-300 font-medium flex items-center">
                        <Palette className="mr-2 h-4 w-4" />
                        Environnement
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-300 text-sm block mb-2">Mode Ambiant</span>
                          <div className="flex space-x-2">
                            {(['cosmic', 'forest', 'ocean', 'aurora'] as const).map((mode) => (
                              <button
                                key={mode}
                                onClick={() => setAmbientMode(mode)}
                                className={cn(
                                  "w-8 h-8 rounded-full border-2 transition-all",
                                  ambientMode === mode ? "border-white scale-110" : "border-white/30 hover:border-white/60",
                                  mode === 'cosmic' && "bg-gradient-to-br from-indigo-500 to-purple-600",
                                  mode === 'forest' && "bg-gradient-to-br from-green-500 to-emerald-600",
                                  mode === 'ocean' && "bg-gradient-to-br from-blue-500 to-cyan-600",
                                  mode === 'aurora' && "bg-gradient-to-br from-pink-500 to-violet-600"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={immersiveElements.showParticles}
                              onChange={(e) => setImmersiveElements(prev => ({ ...prev, showParticles: e.target.checked }))}
                              className="rounded border-white/20 bg-transparent"
                            />
                            <span className="text-gray-300 text-sm">Particules</span>
                          </label>
                          
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={immersiveElements.adaptiveLighting}
                              onChange={(e) => setImmersiveElements(prev => ({ ...prev, adaptiveLighting: e.target.checked }))}
                              className="rounded border-white/20 bg-transparent"
                            />
                            <span className="text-gray-300 text-sm">Éclairage Adaptatif</span>
                          </label>
                          
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={immersiveElements.biometricSync}
                              onChange={(e) => setImmersiveElements(prev => ({ ...prev, biometricSync: e.target.checked }))}
                              className="rounded border-white/20 bg-transparent"
                            />
                            <span className="text-gray-300 text-sm">Sync Biométrique</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          )}

          {/* Canvas pour particules interactives */}
          {immersiveElements.showParticles && !shouldReduceMotion && (
            <canvas
              ref={particleCanvasRef}
              className="fixed inset-0 pointer-events-none z-5"
              style={{ background: 'transparent' }}
            />
          )}

          {/* Cursor Trail Effect */}
          {deviceOptimization === 'desktop' && !shouldReduceMotion && (
            <div className="fixed inset-0 pointer-events-none z-30">
              {cursorTrail.map((point, index) => (
                <motion.div
                  key={`${point.timestamp}-${index}`}
                  className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                  initial={{ opacity: 0.8, scale: 1 }}
                  animate={{ 
                    opacity: 0, 
                    scale: 0,
                    x: point.x - 4,
                    y: point.y - 4
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              ))}
            </div>
          )}

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