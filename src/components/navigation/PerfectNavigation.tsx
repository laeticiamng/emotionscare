// @ts-nocheck
/**
 * Perfect Navigation - Navigation immersive et intelligente
 * Adapte l'expérience selon l'utilisateur et le contexte
 */

// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES_REGISTRY } from '@/routerV2/registry';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Scan, 
  Music, 
  MessageSquare, 
  BookOpen, 
  Gamepad2,
  Sparkles,
  Wind,
  Camera,
  Zap,
  Users,
  TrendingUp,
  Settings,
  Smile
} from 'lucide-react';

interface NavigationItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  category: string;
  description: string;
  isNew?: boolean;
  isPremium?: boolean;
  emotionBoost?: string[];
}

const navigationItems: NavigationItem[] = [
  // CORE MODULES
  {
    name: 'Accueil',
    path: '/app/home',
    icon: <Home className="w-5 h-5" />,
    category: 'core',
    description: 'Votre tableau de bord personnel',
    emotionBoost: ['calm', 'focus']
  },
  {
    name: 'Scan Émotionnel',
    path: '/app/scan',
    icon: <Scan className="w-5 h-5" />,
    category: 'core',
    description: 'Analyse instantanée de vos émotions',
    emotionBoost: ['curiosity', 'insight'],
    isNew: true
  },
  {
    name: 'Musique Thérapie',
    path: '/app/music',
    icon: <Music className="w-5 h-5" />,
    category: 'core',
    description: 'Compositions personnalisées pour votre bien-être',
    emotionBoost: ['joy', 'calm', 'energy']
  },
  {
    name: 'Coach IA',
    path: '/app/coach',
    icon: <MessageSquare className="w-5 h-5" />,
    category: 'core',
    description: 'Votre assistant de développement personnel',
    emotionBoost: ['motivation', 'clarity']
  },
  {
    name: 'Journal Intelligent',
    path: '/app/journal',
    icon: <BookOpen className="w-5 h-5" />,
    category: 'core',
    description: 'Réflexions guidées et insights émotionnels',
    emotionBoost: ['gratitude', 'reflection']
  },

  // FUN-FIRST EXPERIENCES
  {
    name: 'Flash Glow',
    path: '/app/flash-glow',
    icon: <Sparkles className="w-5 h-5" />,
    category: 'fun',
    description: 'Thérapie lumineuse instantanée',
    emotionBoost: ['energy', 'positivity'],
    isNew: true
  },
  {
    name: 'Breathwork',
    path: '/app/breath',
    icon: <Wind className="w-5 h-5" />,
    category: 'fun',
    description: 'Respiration guidée immersive',
    emotionBoost: ['calm', 'balance']
  },
  {
    name: 'AR Filters',
    path: '/app/face-ar',
    icon: <Camera className="w-5 h-5" />,
    category: 'fun',
    description: 'Filtres de réalité augmentée thérapeutiques',
    emotionBoost: ['playfulness', 'creativity']
  },
  {
    name: 'Bubble Beat',
    path: '/app/bubble-beat',
    icon: <Gamepad2 className="w-5 h-5" />,
    category: 'fun',
    description: 'Jeu de rythme anti-stress',
    emotionBoost: ['joy', 'focus']
  },
  {
    name: 'Mood Mixer',
    path: '/app/mood-mixer',
    icon: <Zap className="w-5 h-5" />,
    category: 'fun',
    description: 'Mixeur d\'humeurs interactif',
    emotionBoost: ['creativity', 'balance']
  },
  {
    name: 'VR Galactique',
    path: '/app/vr-galaxy',
    icon: <Sparkles className="w-5 h-5" />,
    category: 'fun',
    description: 'Voyage spatial relaxant',
    emotionBoost: ['wonder', 'peace'],
    isPremium: true
  },

  // ANALYTICS
  {
    name: 'Classement',
    path: '/app/leaderboard',
    icon: <TrendingUp className="w-5 h-5" />,
    category: 'analytics',
    description: 'Votre progression et défis',
    emotionBoost: ['motivation', 'achievement']
  },
  {
    name: 'Activité',
    path: '/app/activity',
    icon: <TrendingUp className="w-5 h-5" />,
    category: 'analytics',
    description: 'Historique et tendances',
    emotionBoost: ['insight', 'progress']
  },

  // SOCIAL
  {
    name: 'Cocon Social',
    path: '/app/social-cocon',
    icon: <Users className="w-5 h-5" />,
    category: 'social',
    description: 'Communauté bienveillante',
    emotionBoost: ['connection', 'support']
  },

  // SETTINGS
  {
    name: 'Paramètres',
    path: '/settings/general',
    icon: <Settings className="w-5 h-5" />,
    category: 'settings',
    description: 'Personnalisez votre expérience',
    emotionBoost: ['control', 'comfort']
  }
];

const PerfectNavigation: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');
  const [recommendedItems, setRecommendedItems] = useState<NavigationItem[]>([]);

  // Analyse de l'émotion actuelle (simulation)
  useEffect(() => {
    // Dans une vraie app, ceci viendrait de l'API d'analyse émotionnelle
    const emotions = ['calm', 'energetic', 'stressed', 'creative', 'social'];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    setCurrentEmotion(randomEmotion);
  }, [location]);

  // Recommandations intelligentes
  useEffect(() => {
    const recommended = navigationItems.filter(item => 
      item.emotionBoost?.includes(currentEmotion) || 
      (currentEmotion === 'stressed' && ['breathwork', 'music', 'flash-glow'].some(name => 
        item.name.toLowerCase().includes(name)
      ))
    ).slice(0, 3);
    
    setRecommendedItems(recommended);
  }, [currentEmotion]);

  const getEmotionColor = (emotion: string) => {
    const colors = {
      calm: 'from-blue-500/20 to-cyan-500/20',
      energetic: 'from-orange-500/20 to-red-500/20',
      stressed: 'from-purple-500/20 to-pink-500/20',
      creative: 'from-green-500/20 to-teal-500/20',
      social: 'from-indigo-500/20 to-purple-500/20',
      neutral: 'from-gray-500/20 to-slate-500/20'
    };
    return colors[emotion] || colors.neutral;
  };

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const categorizeItems = () => {
    const categories = {
      core: navigationItems.filter(item => item.category === 'core'),
      fun: navigationItems.filter(item => item.category === 'fun'),
      analytics: navigationItems.filter(item => item.category === 'analytics'),
      social: navigationItems.filter(item => item.category === 'social'),
      settings: navigationItems.filter(item => item.category === 'settings')
    };
    return categories;
  };

  const categories = categorizeItems();

  return (
    <motion.div 
      className={`perfect-navigation bg-gradient-to-br ${getEmotionColor(currentEmotion)} backdrop-blur-sm rounded-2xl p-6 shadow-xl`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Emotion Context Header */}
      <motion.div 
        className="mb-6 p-4 rounded-xl bg-background/50 backdrop-blur-sm"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Smile className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">État émotionnel détecté</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="capitalize">
            {currentEmotion}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Recommandations adaptées
          </span>
        </div>
      </motion.div>

      {/* Recommended Actions */}
      {recommendedItems.length > 0 && (
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-sm font-semibold mb-3 text-primary">
            💡 Recommandé pour vous
          </h3>
          <div className="grid gap-2">
            {recommendedItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Link to={item.path}>
                  <Button 
                    variant={isActivePath(item.path) ? "default" : "ghost"}
                    className="w-full justify-start gap-3 h-auto p-3 hover:bg-primary/10"
                  >
                    {item.icon}
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.name}</span>
                        {item.isNew && <Badge variant="secondary" className="text-xs">New</Badge>}
                        {item.isPremium && <Badge variant="default" className="text-xs">Premium</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.description}
                      </div>
                    </div>
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Core Navigation */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-sm font-semibold mb-3 text-foreground">
          🏠 Modules Principaux
        </h3>
        <div className="grid gap-1">
          {categories.core.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.05 }}
            >
              <Link to={item.path}>
                <Button 
                  variant={isActivePath(item.path) ? "default" : "ghost"}
                  className="w-full justify-start gap-3 hover:bg-primary/5"
                >
                  {item.icon}
                  <span>{item.name}</span>
                  {item.isNew && <Badge variant="secondary" className="ml-auto text-xs">New</Badge>}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Fun Experiences */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h3 className="text-sm font-semibold mb-3 text-foreground">
          ⚡ Expériences Immersives
        </h3>
        <div className="grid gap-1">
          {categories.fun.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + index * 0.05 }}
            >
              <Link to={item.path}>
                <Button 
                  variant={isActivePath(item.path) ? "default" : "ghost"}
                  className="w-full justify-start gap-3 hover:bg-primary/5"
                >
                  {item.icon}
                  <span>{item.name}</span>
                  <div className="ml-auto flex gap-1">
                    {item.isNew && <Badge variant="secondary" className="text-xs">New</Badge>}
                    {item.isPremium && <Badge variant="default" className="text-xs">Pro</Badge>}
                  </div>
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Analytics & Social */}
      <motion.div 
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        <div className="grid grid-cols-2 gap-2">
          <div>
            <h4 className="text-xs font-medium mb-2 text-muted-foreground">Analytics</h4>
            {categories.analytics.map(item => (
              <Link key={item.path} to={item.path}>
                <Button 
                  variant={isActivePath(item.path) ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start gap-2"
                >
                  {item.icon}
                  <span className="text-xs">{item.name}</span>
                </Button>
              </Link>
            ))}
          </div>
          <div>
            <h4 className="text-xs font-medium mb-2 text-muted-foreground">Social</h4>
            {categories.social.map(item => (
              <Link key={item.path} to={item.path}>
                <Button 
                  variant={isActivePath(item.path) ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start gap-2"
                >
                  {item.icon}
                  <span className="text-xs">{item.name}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Settings */}
      {categories.settings.map(item => (
        <Link key={item.path} to={item.path}>
          <Button 
            variant={isActivePath(item.path) ? "default" : "outline"}
            className="w-full justify-start gap-3 mt-2"
          >
            {item.icon}
            <span>{item.name}</span>
          </Button>
        </Link>
      ))}
    </motion.div>
  );
};

export default PerfectNavigation;