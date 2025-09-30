// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search,
  Brain,
  Heart,
  Music,
  MessageSquare,
  Eye,
  Calendar,
  Settings,
  User,
  BarChart3,
  Target,
  Zap,
  Camera,
  Headphones,
  BookOpen,
  Users,
  Shield,
  Activity,
  Star,
  Wind,
  Palette,
  Trophy,
  RefreshCw,
  Monitor,
  Medal,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NavigationItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  category: string;
  tags: string[];
  badge?: {
    type: 'new' | 'popular' | 'premium' | 'beta';
    text?: string;
  };
  isActive?: boolean;
  requiredRole?: string[];
}

/**
 * Hub de navigation intelligent avec recherche et filtres
 * Centralise l'accès à toutes les fonctionnalités de l'application
 */
const NavigationHub: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  // Configuration complète de navigation
  const navigationItems: NavigationItem[] = [
    // Core Analytics & Scanning
    {
      id: 'scan',
      title: 'Scanner Émotionnel IA',
      description: 'Analyse faciale temps réel avec IA avancée',
      icon: Camera,
      path: '/app/scan',
      category: 'analytics',
      tags: ['ai', 'emotion', 'camera', 'realtime'],
      badge: { type: 'popular' }
    },
    {
      id: 'emotions',
      title: 'Tracking Émotions',
      description: 'Suivi détaillé de vos patterns émotionnels',
      icon: Heart,
      path: '/app/emotions',
      category: 'analytics',
      tags: ['tracking', 'emotions', 'analytics']
    },
    {
      id: 'dashboard',
      title: 'Dashboard Principal',
      description: 'Vue d\'ensemble complète de votre bien-être',
      icon: BarChart3,
      path: '/app/home',
      category: 'overview',
      tags: ['dashboard', 'overview', 'stats']
    },

    // Audio & Music Therapy
    {
      id: 'music',
      title: 'Musicothérapie IA',
      description: 'Génération musicale adaptée à vos émotions',
      icon: Headphones,
      path: '/app/music',
      category: 'audio',
      tags: ['music', 'therapy', 'ai', 'generation'],
      badge: { type: 'premium' }
    },
    {
      id: 'mood-mixer',
      title: 'Mood Mixer',
      description: 'Créez vos ambiances sonores personnalisées',
      icon: Palette,
      path: '/app/mood-mixer',
      category: 'audio',
      tags: ['music', 'creativity', 'ambient']
    },
    {
      id: 'bubble-beat',
      title: 'Bubble Beat',
      description: 'Synchronisation avec votre rythme cardiaque',
      icon: Activity,
      path: '/app/bubble-beat',
      category: 'audio',
      tags: ['heartrate', 'biometric', 'sync']
    },

    // VR & Immersive Experiences
    {
      id: 'vr-breath',
      title: 'Respiration VR',
      description: 'Méditation guidée en réalité virtuelle',
      icon: Eye,
      path: '/app/vr-breath',
      category: 'vr',
      tags: ['vr', 'meditation', 'breathing'],
      badge: { type: 'new' }
    },
    {
      id: 'vr-galaxy',
      title: 'Galaxie VR',
      description: 'Exploration spatiale immersive et apaisante',
      icon: Star,
      path: '/app/vr-galaxy',
      category: 'vr',
      tags: ['vr', 'space', 'relaxation']
    },

    // Coaching & Communication
    {
      id: 'coach',
      title: 'Coach IA Nyvée',
      description: 'Assistant personnel intelligent 24/7',
      icon: MessageSquare,
      path: '/app/coach',
      category: 'coaching',
      tags: ['ai', 'coach', 'chat', 'support'],
      badge: { type: 'popular' }
    },
    {
      id: 'messages',
      title: 'Messages & Support',
      description: 'Communication et assistance personnalisée',
      icon: MessageSquare,
      path: '/app/messages',
      category: 'coaching',
      tags: ['messages', 'support', 'communication']
    },

    // Journal & Expression
    {
      id: 'journal',
      title: 'Journal Intelligent',
      description: 'Écriture thérapeutique avec analyse IA',
      icon: BookOpen,
      path: '/app/journal',
      category: 'expression',
      tags: ['journal', 'writing', 'ai', 'analysis']
    },
    {
      id: 'story-synth',
      title: 'Story Synth Lab',
      description: 'Création d\'histoires thérapeutiques',
      icon: Sparkles,
      path: '/app/story-synth',
      category: 'expression',
      tags: ['stories', 'creativity', 'therapy']
    },

    // Wellness & Micro-interventions
    {
      id: 'flash-glow',
      title: 'Flash Glow',
      description: 'Thérapie lumière express (2 minutes)',
      icon: Zap,
      path: '/app/flash-glow',
      category: 'wellness',
      tags: ['light', 'therapy', 'quick', 'flash']
    },
    {
      id: 'breathwork',
      title: 'Exercices Respiration',
      description: 'Techniques de breathing guidées',
      icon: Wind,
      path: '/app/breathwork',
      category: 'wellness',
      tags: ['breathing', 'exercises', 'calm']
    },
    {
      id: 'screen-silk',
      title: 'Screen Silk Break',
      description: 'Pauses écran intelligentes et adaptatives',
      icon: Monitor,
      path: '/app/screen-silk',
      category: 'wellness',
      tags: ['screen', 'break', 'eyes', 'health']
    },

    // Gamification & Motivation
    {
      id: 'boss-grit',
      title: 'Boss Level Grit',
      description: 'Développement de la résilience mentale',
      icon: Target,
      path: '/app/boss-grit',
      category: 'gamification',
      tags: ['resilience', 'grit', 'mental', 'strength']
    },
    {
      id: 'ambition-arcade',
      title: 'Ambition Arcade',
      description: 'Gamification de vos objectifs personnels',
      icon: Trophy,
      path: '/app/ambition-arcade',
      category: 'gamification',
      tags: ['gamification', 'goals', 'motivation']
    },
    {
      id: 'leaderboard',
      title: 'Classements',
      description: 'Compétitions bienveillantes et achievements',
      icon: Medal,
      path: '/app/leaderboard',
      category: 'gamification',
      tags: ['leaderboard', 'competition', 'social']
    },
    {
      id: 'bounce-back',
      title: 'Bounce Back Battle',
      description: 'Rebondir après les moments difficiles',
      icon: RefreshCw,
      path: '/app/bounce-back',
      category: 'gamification',
      tags: ['resilience', 'recovery', 'battle']
    },

    // Calendar & Planning
    {
      id: 'calendar',
      title: 'Calendrier Bien-être',
      description: 'Planification intelligente de vos activités',
      icon: Calendar,
      path: '/app/calendar',
      category: 'planning',
      tags: ['calendar', 'planning', 'schedule']
    },

    // Profile & Settings
    {
      id: 'profile',
      title: 'Profil Personnel',
      description: 'Gestion complète de votre profil utilisateur',
      icon: User,
      path: '/profile',
      category: 'account',
      tags: ['profile', 'settings', 'personal']
    },
    {
      id: 'settings',
      title: 'Paramètres',
      description: 'Configuration et préférences application',
      icon: Settings,
      path: '/settings',
      category: 'account',
      tags: ['settings', 'config', 'preferences']
    },

    // B2B Specific (conditionally shown)
    {
      id: 'b2b-dashboard',
      title: 'Dashboard Entreprise',
      description: 'Vue d\'ensemble des équipes et KPIs',
      icon: Users,
      path: '/b2b/admin/dashboard',
      category: 'b2b',
      tags: ['b2b', 'team', 'admin', 'enterprise'],
      requiredRole: ['manager', 'b2b_admin']
    },
    {
      id: 'b2b-reports',
      title: 'Rapports B2B',
      description: 'Analytics détaillés pour entreprises',
      icon: BarChart3,
      path: '/reports',
      category: 'b2b',
      tags: ['reports', 'analytics', 'b2b'],
      requiredRole: ['manager', 'b2b_admin']
    }
  ];

  const categories = [
    { id: 'all', name: 'Tout', icon: BarChart3 },
    { id: 'analytics', name: 'Analyse', icon: Brain },
    { id: 'audio', name: 'Audio', icon: Headphones },
    { id: 'vr', name: 'VR', icon: Eye },
    { id: 'coaching', name: 'Coaching', icon: MessageSquare },
    { id: 'expression', name: 'Expression', icon: BookOpen },
    { id: 'wellness', name: 'Bien-être', icon: Heart },
    { id: 'gamification', name: 'Motivation', icon: Trophy },
    { id: 'planning', name: 'Planning', icon: Calendar },
    { id: 'account', name: 'Compte', icon: User },
    { id: 'b2b', name: 'Entreprise', icon: Users }
  ];

  // Filtrer les éléments selon la recherche et catégorie
  const filteredItems = navigationItems.filter(item => {
    // Filtrer par rôle utilisateur
    if (item.requiredRole && (!user?.role || !item.requiredRole.includes(user.role))) {
      return false;
    }

    // Filtrer par catégorie
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }

    // Filtrer par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return true;
  });

  // Marquer les éléments actifs
  const itemsWithActiveState = filteredItems.map(item => ({
    ...item,
    isActive: location.pathname === item.path
  }));

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'new': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'popular': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'premium': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'beta': return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header et recherche */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Navigation Complète</h2>
          <p className="text-muted-foreground">
            Accédez à toutes les fonctionnalités d'EmotionsCare
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une fonctionnalité..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              <category.icon className="h-4 w-4" />
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Résultats */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {itemsWithActiveState.length} fonctionnalité{itemsWithActiveState.length > 1 ? 's' : ''} trouvée{itemsWithActiveState.length > 1 ? 's' : ''}
          </p>
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery('')}
            >
              Effacer la recherche
            </Button>
          )}
        </div>

        {/* Grille des fonctionnalités */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itemsWithActiveState.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card 
                className={cn(
                  "h-full hover:shadow-lg transition-all duration-300 cursor-pointer group",
                  item.isActive && "ring-2 ring-primary border-primary"
                )}
                asChild
              >
                <Link to={item.path}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg transition-colors",
                          item.isActive 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted group-hover:bg-primary/10"
                        )}>
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <CardTitle className="text-base leading-tight">
                            {item.title}
                          </CardTitle>
                          {item.badge && (
                            <Badge 
                              variant="secondary" 
                              className={cn("text-xs", getBadgeVariant(item.badge.type))}
                            >
                              {item.badge.text || item.badge.type.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {item.description}
                    </CardDescription>
                    
                    {/* Tags */}
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {item.tags.slice(0, 3).map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className="text-xs px-2 py-0 h-5"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {item.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                            +{item.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* État vide */}
        {itemsWithActiveState.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun résultat trouvé</h3>
            <p className="text-muted-foreground mb-4">
              Essayez avec d'autres mots-clés ou explorez les catégories
            </p>
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}>
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationHub;