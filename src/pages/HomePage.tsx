
import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Heart, Building2, Sparkles, Users, Brain, Music, ArrowRight, Star, 
  Zap, Globe, Shield, Target, Trophy, Mic, Camera, Volume2, 
  Play, Pause, RotateCcw, Eye, Waves, Wind, Sun, Moon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { useNavigate } from 'react-router-dom';
import { EnhancedSkipLinks } from '@/components/ui/enhanced-accessibility';
import { cn } from '@/lib/utils';
import '@/styles/optimized-animations.css';

interface FloatingElement {
  id: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  color: string;
  delay: number;
}

interface InteractionPoint {
  id: string;
  x: number;
  y: number;
  timestamp: number;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [ambientVolume, setAmbientVolume] = useState(30);
  const [currentTheme, setCurrentTheme] = useState('cosmic');
  const [interactions, setInteractions] = useState<InteractionPoint[]>([]);
  const [floatingElements] = useState<FloatingElement[]>(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: `element-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: 0.5 + Math.random() * 0.5,
      rotation: Math.random() * 360,
      color: ['text-blue-400', 'text-purple-400', 'text-pink-400', 'text-cyan-400'][Math.floor(Math.random() * 4)],
      delay: Math.random() * 5
    }))
  );

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const backgroundX = useTransform(mouseX, [0, window.innerWidth], [0, 50]);
  const backgroundY = useTransform(mouseY, [0, window.innerHeight], [0, 50]);

  const [userStats] = useState({
    emotionalBalance: 78,
    stressLevel: 23,
    focusScore: 85,
    wellnessStreak: 12,
    achievements: ['Méditateur', 'Explorateur', 'Pionnier'],
    totalSessions: 47
  });

  const features = [
    {
      id: 'emotional-ai',
      title: 'IA Émotionnelle Avancée',
      description: 'Reconnaissance et analyse en temps réel de vos émotions',
      icon: Brain,
      gradient: 'from-purple-500 to-blue-600',
      route: '/scan',
      premium: true,
      stats: '95% précision'
    },
    {
      id: 'immersive-meditation',
      title: 'Méditation Immersive',
      description: 'Expériences de méditation avec environnements 3D',
      icon: Waves,
      gradient: 'from-blue-500 to-cyan-600',
      route: '/meditation',
      premium: true,
      stats: '200+ sessions'
    },
    {
      id: 'adaptive-music',
      title: 'Musicothérapie Adaptative',
      description: 'Musique qui s\'adapte à votre état émotionnel',
      icon: Music,
      gradient: 'from-green-500 to-teal-600',
      route: '/music',
      premium: false,
      stats: '1000+ pistes'
    },
    {
      id: 'gamified-goals',
      title: 'Objectifs Gamifiés',
      description: 'Transformez vos ambitions en aventures épiques',
      icon: Trophy,
      gradient: 'from-yellow-500 to-orange-600',
      route: '/ambition-arcade',
      premium: true,
      stats: 'Système RPG'
    },
    {
      id: 'social-wellness',
      title: 'Bien-être Social',
      description: 'Communauté bienveillante et groupes de soutien',
      icon: Users,
      gradient: 'from-pink-500 to-rose-600',
      route: '/social',
      premium: false,
      stats: '10k+ membres'
    },
    {
      id: 'biometric-sync',
      title: 'Synchronisation Biométrique',
      description: 'Intégration avec vos appareils de santé',
      icon: Heart,
      gradient: 'from-red-500 to-pink-600',
      route: '/biometrics',
      premium: true,
      stats: 'Multi-appareils'
    }
  ];

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      const newInteraction: InteractionPoint = {
        id: Math.random().toString(36).substr(2, 9),
        x,
        y,
        timestamp: Date.now()
      };
      
      setInteractions(prev => [...prev.slice(-4), newInteraction]);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setInteractions(prev => 
        prev.filter(interaction => Date.now() - interaction.timestamp < 2000)
      );
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const toggleVoiceCommand = () => {
    setIsVoiceActive(!isVoiceActive);
    if (!isVoiceActive) {
      setTimeout(() => setIsVoiceActive(false), 3000);
    }
  };

  const toggleAmbientMusic = () => {
    setIsAmbientPlaying(!isAmbientPlaying);
  };

  const ThemeSelector = () => (
    <div className="flex items-center space-x-2">
      {['cosmic', 'aurora', 'ocean'].map((theme) => (
        <Button
          key={theme}
          variant="ghost"
          size="sm"
          onClick={() => setCurrentTheme(theme)}
          className={cn(
            "w-8 h-8 rounded-full p-0",
            theme === 'cosmic' && "bg-gradient-to-br from-purple-500 to-blue-600",
            theme === 'aurora' && "bg-gradient-to-br from-green-400 to-blue-500",
            theme === 'ocean' && "bg-gradient-to-br from-blue-500 to-cyan-400",
            currentTheme === theme && "ring-2 ring-white ring-offset-2"
          )}
        />
      ))}
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.8,
        staggerChildren: shouldReduceMotion ? 0 : 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.1 : 0.6 }
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <EnhancedSkipLinks />

      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)`,
            x: backgroundX,
            y: backgroundY
          }}
        />
        
        {/* Floating Elements */}
        {!shouldReduceMotion && floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className={cn("absolute opacity-20", element.color)}
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [element.rotation, element.rotation + 180, element.rotation + 360],
              scale: [element.scale, element.scale * 1.2, element.scale]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: element.delay,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="h-4 w-4" />
          </motion.div>
        ))}
      </div>

      {/* Interaction Ripples */}
      <AnimatePresence>
        {interactions.map((interaction) => (
          <motion.div
            key={interaction.id}
            className="absolute pointer-events-none z-10"
            style={{
              left: `${interaction.x}%`,
              top: `${interaction.y}%`,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <div className="w-4 h-4 rounded-full border-2 border-cyan-400 -translate-x-2 -translate-y-2" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Control Panel */}
      <motion.div
        className="fixed top-4 right-4 z-50 space-y-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        <Card className="bg-black/20 backdrop-blur-xl border-white/10 p-3">
          <div className="flex items-center space-x-2">
            <ThemeSelector />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleVoiceCommand}
              className={cn(
                "w-8 h-8 p-0",
                isVoiceActive && "bg-blue-500/20 text-blue-400"
              )}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAmbientMusic}
              className="w-8 h-8 p-0"
            >
              {isAmbientPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
          
          {isAmbientPlaying && (
            <div className="flex items-center space-x-2 mt-2">
              <Volume2 className="h-3 w-3 text-white/60" />
              <Slider
                value={[ambientVolume]}
                onValueChange={(value) => setAmbientVolume(value[0])}
                max={100}
                step={1}
                className="w-16"
              />
            </div>
          )}
        </Card>
      </motion.div>

      {/* User Stats Panel */}
      <motion.div
        className="fixed top-4 left-4 z-50"
        variants={itemVariants}
      >
        <Card className="bg-black/20 backdrop-blur-xl border-white/10">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">Système Actif</span>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-white">
                <span>Équilibre</span>
                <span>{userStats.emotionalBalance}%</span>
              </div>
              <Progress value={userStats.emotionalBalance} className="h-1" />
              
              <div className="flex justify-between text-white">
                <span>Focus</span>
                <span>{userStats.focusScore}%</span>
              </div>
              <Progress value={userStats.focusScore} className="h-1" />
            </div>
            
            <div className="flex items-center justify-between text-white text-xs">
              <span>Séries: {userStats.wellnessStreak}j</span>
              <Badge variant="secondary" className="text-xs">
                Niveau {Math.floor(userStats.totalSessions / 10)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          className="text-center space-y-8 mb-20"
          variants={itemVariants}
        >
          <motion.div
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-white text-sm">Plateforme IA Émotionnelle</span>
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs">
              PREMIUM
            </Badge>
          </motion.div>

          <div className="space-y-6">
            <motion.h1 
              className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-300 bg-clip-text text-transparent"
              animate={shouldReduceMotion ? {} : {
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              EmotionsCare
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Explorez votre univers émotionnel avec l'IA la plus avancée.
              <br />
              <span className="text-cyan-300">Thérapie digitale • Bien-être personnalisé • Communauté bienveillante</span>
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              variants={itemVariants}
            >
              <Button
                size="lg"
                onClick={() => navigate('/choose-mode')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg rounded-full shadow-2xl hover:shadow-purple-500/30 transition-all duration-300"
              >
                <Zap className="mr-2 h-5 w-5" />
                Démarrer l'Expérience
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/demo')}
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-full backdrop-blur-md"
              >
                <Play className="mr-2 h-5 w-5" />
                Voir la Démo
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-500 cursor-pointer h-full group"
                onClick={() => navigate(feature.route)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn(
                      "p-3 rounded-xl bg-gradient-to-br",
                      feature.gradient,
                      "shadow-lg group-hover:shadow-xl transition-all duration-300"
                    )}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {feature.premium && (
                        <Badge className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border-yellow-500/50 text-yellow-300 text-xs">
                          PRO
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-white/60 border-white/20 text-xs">
                        {feature.stats}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardTitle className="text-white text-xl group-hover:text-purple-200 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-purple-200 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <Button 
                    className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
                    variant="outline"
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Explorer
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Achievement Section */}
        <motion.div
          className="text-center space-y-8"
          variants={itemVariants}
        >
          <h2 className="text-4xl font-bold text-white mb-8">
            Vos Accomplissements
          </h2>
          
          <div className="flex flex-wrap justify-center gap-4">
            {userStats.achievements.map((achievement, index) => (
              <motion.div
                key={achievement}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md border border-yellow-500/30 rounded-full px-6 py-3"
              >
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-yellow-400" />
                  <span className="text-yellow-300 font-medium">{achievement}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Voice Command Indicator */}
      <AnimatePresence>
        {isVoiceActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <Card className="bg-blue-500/20 backdrop-blur-xl border-blue-500/50">
              <CardContent className="p-4 flex items-center space-x-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Mic className="h-6 w-6 text-blue-400" />
                </motion.div>
                <div>
                  <div className="text-blue-300 font-medium">Écoute Active</div>
                  <div className="text-blue-400 text-sm">Dites "Hey EmotionsCare"</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HomePage;
