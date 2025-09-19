import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Brain, Music, MessageCircle, Users, Settings,
  Zap, Wind, Camera, Eye, Mic, Activity, Trophy,
  Target, Gamepad2, Sparkles, Star, Heart, Compass,
  BarChart3, TrendingUp, Calendar, BookOpen,
  Shield, Search, Bell, Menu, X, ChevronDown,
  Layers, Wand2, Headphones, Globe, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { routes } from '@/routerV2';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NavigationModule {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  category: string;
  badge?: string;
  premium?: boolean;
  new?: boolean;
  xp?: number;
  segment: 'consumer' | 'employee' | 'manager';
}

interface NavigationCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  modules: NavigationModule[];
}

const PremiumNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('core');
  
  // Définition complète des modules par segment
  const navigationData: NavigationCategory[] = [
    {
      id: 'core',
      title: 'Modules Essentiels',
      icon: <Home className="w-5 h-5" />,
      color: 'bg-blue-500',
      modules: [
        {
          id: 'dashboard',
          title: 'Tableau de Bord',
          description: 'Vue d\'ensemble de votre bien-être',
          icon: <BarChart3 className="w-5 h-5" />,
          path: Routes.consumerHome(),
          category: 'core',
          xp: 50,
          segment: 'consumer'
        },
        {
          id: 'emotions',
          title: 'Centre Émotionnel',
          description: 'Analyse et développement émotionnel',
          icon: <Brain className="w-5 h-5" />,
          path: '/app/emotions',
          category: 'core',
          new: true,
          xp: 150,
          segment: 'consumer'
        },
        {
          id: 'scan',
          title: 'Scan Rapide',
          description: 'Analyse instantanée de votre état',
          icon: <Eye className="w-5 h-5" />,
          path: Routes.scan(),
          category: 'core',
          xp: 75,
          segment: 'consumer'
        },
        {
          id: 'community',
          title: 'Communauté',
          description: 'Connectez-vous et partagez',
          icon: <Users className="w-5 h-5" />,
          path: '/app/community',
          category: 'core',
          badge: '2.4k',
          xp: 100,
          segment: 'consumer'
        }
      ]
    },
    {
      id: 'therapy',
      title: 'Thérapies Immersives',
      icon: <Heart className="w-5 h-5" />,
      color: 'bg-purple-500',
      modules: [
        {
          id: 'music',
          title: 'Musicothérapie IA',
          description: 'Musique adaptative pour votre humeur',
          icon: <Music className="w-5 h-5" />,
          path: Routes.music(),
          category: 'therapy',
          premium: true,
          xp: 200,
          segment: 'consumer'
        },
        {
          id: 'coach',
          title: 'Coach IA Personnel',
          description: 'Accompagnement personnalisé 24/7',
          icon: <MessageCircle className="w-5 h-5" />,
          path: Routes.coach(),
          category: 'therapy',
          premium: true,
          xp: 180,
          segment: 'consumer'
        },
        {
          id: 'breathwork',
          title: 'Respiration Thérapeutique',
          description: 'Techniques avancées de respiration',
          icon: <Wind className="w-5 h-5" />,
          path: Routes.breath(),
          category: 'therapy',
          xp: 120,
          segment: 'consumer'
        },
        {
          id: 'vr',
          title: 'Expérience VR Immersive',
          description: 'Environnements virtuels thérapeutiques',
          icon: <Compass className="w-5 h-5" />,
          path: Routes.vr(),
          category: 'therapy',
          premium: true,
          new: true,
          xp: 250,
          segment: 'consumer'
        }
      ]
    },
    {
      id: 'creative',
      title: 'Modules Créatifs',
      icon: <Sparkles className="w-5 h-5" />,
      color: 'bg-pink-500',
      modules: [
        {
          id: 'journal',
          title: 'Journal Intelligent',
          description: 'Journaling avec IA émotionnelle',
          icon: <BookOpen className="w-5 h-5" />,
          path: Routes.journal(),
          category: 'creative',
          xp: 90,
          segment: 'consumer'
        },
        {
          id: 'voice-journal',
          title: 'Journal Vocal',
          description: 'Enregistrement et analyse vocale',
          icon: <Mic className="w-5 h-5" />,
          path: '/app/voice-journal',
          category: 'creative',
          xp: 110,
          segment: 'consumer'
        },
        {
          id: 'ar-filters',
          title: 'Filtres AR Émotionnels',
          description: 'Réalité augmentée pour l\'expression',
          icon: <Camera className="w-5 h-5" />,
          path: '/app/face-ar',
          category: 'creative',
          new: true,
          xp: 140,
          segment: 'consumer'
        }
      ]
    },
    {
      id: 'games',
      title: 'Modules Ludiques',
      icon: <Gamepad2 className="w-5 h-5" />,
      color: 'bg-green-500',
      modules: [
        {
          id: 'flash-glow',
          title: 'Flash Glow Boost',
          description: 'Boost d\'énergie instantané',
          icon: <Zap className="w-5 h-5" />,
          path: Routes.flashGlow(),
          category: 'games',
          xp: 80,
          segment: 'consumer'
        },
        {
          id: 'bubble-beat',
          title: 'Bubble Beat Sync',
          description: 'Jeu rythmique anti-stress',
          icon: <Activity className="w-5 h-5" />,
          path: Routes.bubbleBeat(),
          category: 'games',
          xp: 100,
          segment: 'consumer'
        },
        {
          id: 'mood-mixer',
          title: 'Mood Mixer DJ',
          description: 'DJ personnel émotionnel',
          icon: <Headphones className="w-5 h-5" />,
          path: Routes.moodMixer(),
          category: 'games',
          xp: 130,
          segment: 'consumer'
        },
        {
          id: 'boss-grit',
          title: 'Boss Level Grit',
          description: 'Développement de la détermination',
          icon: <Target className="w-5 h-5" />,
          path: Routes.bossGrit(),
          category: 'games',
          premium: true,
          xp: 200,
          segment: 'consumer'
        }
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics & Suivi',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'bg-orange-500',
      modules: [
        {
          id: 'gamification',
          title: 'Classements & Récompenses',
          description: 'Système de progression gamifié',
          icon: <Trophy className="w-5 h-5" />,
          path: '/app/leaderboard',
          category: 'analytics',
          badge: 'Niv.15',
          xp: 160,
          segment: 'consumer'
        },
        {
          id: 'activity',
          title: 'Historique d\'Activité',
          description: 'Suivi détaillé de vos progrès',
          icon: <BarChart3 className="w-5 h-5" />,
          path: '/app/activity',
          category: 'analytics',
          xp: 70,
          segment: 'consumer'
        },
        {
          id: 'scores',
          title: 'Scores & Vibes',
          description: 'Visualisation douce des humeurs et séances',
          icon: <Layers className="w-5 h-5" />,
          path: '/app/scores',
          category: 'analytics',
          premium: true,
          xp: 190,
          segment: 'consumer'
        }
      ]
    }
  ];

  // B2B Modules pour employés
  const b2bEmployeeModules: NavigationCategory[] = [
    {
      id: 'collaboration',
      title: 'Collaboration d\'Équipe',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-blue-600',
      modules: [
        {
          id: 'teams',
          title: 'Équipes & Projets',
          description: 'Gestion collaborative du bien-être',
          icon: <Users className="w-5 h-5" />,
          path: '/app/teams',
          category: 'collaboration',
          segment: 'employee'
        },
        {
          id: 'social-b2b',
          title: 'Cocon Social Entreprise',
          description: 'Réseau social d\'entreprise',
          icon: <Globe className="w-5 h-5" />,
          path: '/app/social',
          category: 'collaboration',
          segment: 'employee'
        }
      ]
    }
  ];

  // B2B Modules pour managers/RH
  const b2bManagerModules: NavigationCategory[] = [
    {
      id: 'management',
      title: 'Gestion & Analytics',
      icon: <Shield className="w-5 h-5" />,
      color: 'bg-red-600',
      modules: [
        {
          id: 'reports',
          title: 'Rapports & Analytics',
          description: 'Tableaux de bord détaillés',
          icon: <BarChart3 className="w-5 h-5" />,
          path: '/app/reports',
          category: 'management',
          segment: 'manager'
        },
        {
          id: 'events',
          title: 'Événements & Programmes',
          description: 'Organisation d\'activités bien-être',
          icon: <Calendar className="w-5 h-5" />,
          path: '/app/events',
          category: 'management',
          segment: 'manager'
        },
        {
          id: 'optimization',
          title: 'Optimisation RH',
          description: 'Outils d\'amélioration continue',
          icon: <TrendingUp className="w-5 h-5" />,
          path: '/app/optimization',
          category: 'management',
          segment: 'manager'
        },
        {
          id: 'security',
          title: 'Sécurité & Conformité',
          description: 'Gestion de la sécurité des données',
          icon: <Shield className="w-5 h-5" />,
          path: '/app/security',
          category: 'management',
          segment: 'manager'
        }
      ]
    }
  ];

  // Déterminer les modules à afficher selon le rôle
  const getActiveModules = (): NavigationCategory[] => {
    const userRole = user?.role || 'consumer';
    
    switch (userRole) {
      case 'employee':
        return [...navigationData, ...b2bEmployeeModules];
      case 'manager':
        return [...navigationData, ...b2bEmployeeModules, ...b2bManagerModules];
      default:
        return navigationData;
    }
  };

  const activeModules = getActiveModules();
  const currentPath = location.pathname;

  const isModuleActive = (module: NavigationModule) => {
    return currentPath === module.path || currentPath.startsWith(module.path + '/');
  };

  const handleModuleClick = (module: NavigationModule) => {
    navigate(module.path);
    setIsMobileOpen(false);
  };

  const renderModule = (module: NavigationModule) => (
    <TooltipProvider key={module.id}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "p-4 rounded-xl border cursor-pointer transition-all duration-300",
              isModuleActive(module)
                ? "bg-primary/10 border-primary shadow-lg shadow-primary/25"
                : "bg-card hover:bg-accent/50 border-border hover:border-primary/30",
              module.premium && "ring-2 ring-yellow-500/20",
              module.new && "ring-2 ring-green-500/20"
            )}
            onClick={() => handleModuleClick(module)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={cn(
                "p-2 rounded-lg",
                isModuleActive(module) ? "bg-primary text-primary-foreground" : "bg-primary/10"
              )}>
                {module.icon}
              </div>
              <div className="flex items-center gap-1">
                {module.premium && (
                  <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
                    <Star className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
                {module.new && (
                  <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/30">
                    Nouveau
                  </Badge>
                )}
                {module.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {module.badge}
                  </Badge>
                )}
              </div>
            </div>
            
            <h3 className="font-semibold text-sm mb-1 line-clamp-1">{module.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{module.description}</p>
            
            {module.xp && (
              <div className="flex items-center text-xs text-yellow-600">
                <Star className="w-3 h-3 mr-1" />
                {module.xp} XP
              </div>
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{module.title}</p>
          <p className="text-sm opacity-90">{module.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const renderCategory = (category: NavigationCategory) => (
    <div key={category.id} className="mb-8">
      <button
        onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
        className="flex items-center justify-between w-full mb-4 p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg text-white", category.color)}>
            {category.icon}
          </div>
          <div className="text-left">
            <h2 className="font-bold text-lg">{category.title}</h2>
            <p className="text-sm text-muted-foreground">{category.modules.length} modules</p>
          </div>
        </div>
        <ChevronDown className={cn(
          "w-5 h-5 transition-transform",
          expandedCategory === category.id && "rotate-180"
        )} />
      </button>

      <AnimatePresence>
        {expandedCategory === category.id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {category.modules.map(renderModule)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Navigation Premium
              </h1>
              <p className="text-muted-foreground mt-1">
                Explorez tous les modules de votre plateforme bien-être
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">{user?.name || 'Utilisateur'}</p>
                  <p className="text-muted-foreground text-xs">
                    {user?.role === 'consumer' ? 'B2C' : user?.role === 'employee' ? 'Employé' : 'Manager'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {activeModules.map(renderCategory)}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full p-0 overflow-y-auto">
            <SheetHeader className="p-6 border-b">
              <SheetTitle className="text-xl">Navigation</SheetTitle>
            </SheetHeader>
            
            <div className="p-6 space-y-6">
              {activeModules.map(category => (
                <div key={category.id}>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    {category.icon}
                    {category.title}
                  </h3>
                  <div className="space-y-2">
                    {category.modules.map(module => (
                      <button
                        key={module.id}
                        onClick={() => handleModuleClick(module)}
                        className={cn(
                          "w-full p-3 rounded-lg text-left transition-colors flex items-center gap-3",
                          isModuleActive(module)
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent"
                        )}
                      >
                        {module.icon}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{module.title}</p>
                          <p className="text-xs opacity-75">{module.description}</p>
                        </div>
                        {module.premium && <Star className="w-4 h-4" />}
                        {module.new && <Badge variant="secondary" className="text-xs">New</Badge>}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default PremiumNavigation;