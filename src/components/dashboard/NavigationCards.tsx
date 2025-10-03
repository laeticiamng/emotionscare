/**
 * NavigationCards - Cartes de navigation pour le dashboard
 * Accès à toutes les fonctionnalités principales
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, Music, Sparkles, FileText, Monitor, Zap, Wind, Camera,
  Waves, Star, Target, Palette, Users, Trophy, BarChart3, Settings,
  Heart, Gamepad2, Headphones, Filter, Grid3X3, Calendar, Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationCard {
  title: string;
  description: string;
  path: string;
  icon: React.ElementType;
  color: string;
  category: string;
  premium?: boolean;
  new?: boolean;
}

const navigationCards: NavigationCard[] = [
  // Core Modules
  {
    title: 'Scan Émotionnel',
    description: 'Analysez vos émotions en temps réel',
    path: '/app/scan',
    icon: Brain,
    color: 'from-pink-500 to-rose-500',
    category: 'Core'
  },
  {
    title: 'Thérapie Musicale',
    description: 'Musique personnalisée par IA',
    path: '/app/music',
    icon: Music,
    color: 'from-purple-500 to-indigo-500',
    category: 'Core',
    premium: true
  },
  {
    title: 'Coach IA',
    description: 'Assistant empathique personnalisé',
    path: '/app/coach',
    icon: Sparkles,
    color: 'from-blue-500 to-cyan-500',
    category: 'Core',
    premium: true
  },
  {
    title: 'Journal',
    description: 'Journal personnel intelligent',
    path: '/app/journal',
    icon: FileText,
    color: 'from-green-500 to-emerald-500',
    category: 'Core'
  },
  {
    title: 'VR Experiences',
    description: 'Immersion thérapeutique',
    path: '/app/vr',
    icon: Monitor,
    color: 'from-orange-500 to-red-500',
    category: 'Core'
  },
  
  // Fun-First Modules
  {
    title: 'Flash Glow',
    description: 'Thérapie lumière instantanée',
    path: '/app/flash-glow',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    category: 'Fun-First'
  },
  {
    title: 'Breathwork',
    description: 'Techniques de respiration guidées',
    path: '/app/breath',
    icon: Wind,
    color: 'from-teal-500 to-green-500',
    category: 'Fun-First'
  },
  {
    title: 'AR Filters',
    description: 'Filtres émotionnels AR',
    path: '/app/face-ar',
    icon: Camera,
    color: 'from-indigo-500 to-purple-500',
    category: 'Fun-First',
    new: true
  },
  {
    title: 'Bubble Beat',
    description: 'Jeu rythmique interactif',
    path: '/app/bubble-beat',
    icon: Waves,
    color: 'from-cyan-500 to-blue-500',
    category: 'Fun-First'
  },
  {
    title: 'VR Galaxy',
    description: 'Exploration spatiale 3D',
    path: '/app/vr-galaxy',
    icon: Star,
    color: 'from-violet-500 to-purple-500',
    category: 'Fun-First'
  },
  
  // Social & Gaming
  {
    title: 'Communauté',
    description: 'Partage et entraide',
    path: '/app/community',
    icon: Users,
    color: 'from-green-500 to-teal-500',
    category: 'Social'
  },
  {
    title: 'Gamification',
    description: 'Niveaux et achievements',
    path: '/app/leaderboard',
    icon: Trophy,
    color: 'from-amber-500 to-yellow-500',
    category: 'Social'
  },
  {
    title: 'Social Cocon',
    description: 'Espaces privés sécurisés',
    path: '/app/social-cocon',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    category: 'Social'
  },
  
  // Analytics
  {
    title: 'Analytics',
    description: 'Historique et insights',
    path: '/app/activity',
    icon: BarChart3,
    color: 'from-blue-500 to-indigo-500',
    category: 'Analytics'
  },
  {
    title: 'Scores & vibes',
    description: 'Courbes d’humeur et heatmap quotidienne',
    path: '/app/scores',
    icon: Filter,
    color: 'from-purple-500 to-pink-500',
    category: 'Analytics'
  },
  
  // Settings
  {
    title: 'Paramètres',
    description: 'Configuration personnalisée',
    path: '/settings/general',
    icon: Settings,
    color: 'from-gray-500 to-slate-500',
    category: 'Settings'
  }
];

interface NavigationCardsProps {
  maxCards?: number;
  showAllButton?: boolean;
}

export default function NavigationCards({ maxCards, showAllButton = true }: NavigationCardsProps) {
  const navigate = useNavigate();
  
  const displayedCards = maxCards ? navigationCards.slice(0, maxCards) : navigationCards;
  
  const handleCardClick = (path: string) => {
    navigate(path);
  };

  const handleShowAll = () => {
    navigate('/navigation');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayedCards.map((card, index) => (
          <motion.div
            key={card.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card 
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-card to-accent/5 overflow-hidden"
              onClick={() => handleCardClick(card.path)}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header avec icône et badges */}
                  <div className="flex items-start justify-between">
                    <div className={cn(
                      "p-3 rounded-xl bg-gradient-to-br shadow-lg",
                      card.color,
                      "text-white group-hover:scale-110 transition-transform duration-300"
                    )}>
                      <card.icon className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col gap-1">
                      {card.premium && (
                        <Badge variant="secondary" className="text-xs font-medium">
                          Premium
                        </Badge>
                      )}
                      {card.new && (
                        <Badge variant="default" className="text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-500">
                          Nouveau
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Contenu */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {card.description}
                    </p>
                  </div>
                  
                  {/* Catégorie */}
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {card.category}
                    </Badge>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <span className="text-primary text-sm">→</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Bouton Voir Tout */}
      {showAllButton && maxCards && (
        <div className="text-center">
          <Button 
            onClick={handleShowAll}
            variant="outline"
            size="lg"
            className="bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20"
          >
            <Grid3X3 className="h-4 w-4 mr-2" />
            Voir toutes les fonctionnalités ({navigationCards.length})
          </Button>
        </div>
      )}
    </div>
  );
}