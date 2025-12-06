// @ts-nocheck
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ArrowRight,
  Clock,
  Star,
  Zap,
  Heart,
  Brain,
  Music,
  Eye,
  Calendar,
  User,
  Settings,
  BarChart3,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  path: string;
  icon: React.ElementType;
  keywords: string[];
  priority: number;
  badge?: string;
}

interface GlobalSearchCommandProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

/**
 * Commande de recherche globale style Spotlight/Command Palette
 * Recherche instantanée avec navigation clavier et suggestions intelligentes
 */
const GlobalSearchCommand: React.FC<GlobalSearchCommandProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Base de données de recherche étendue
  const searchDatabase: SearchResult[] = [
    // Core Features
    {
      id: 'scan',
      title: 'Scanner Émotionnel IA',
      description: 'Analyse faciale en temps réel',
      category: 'Analyse',
      path: '/app/scan',
      icon: Eye,
      keywords: ['scan', 'camera', 'emotions', 'facial', 'ai', 'analysis'],
      priority: 10,
      badge: 'Populaire'
    },
    {
      id: 'dashboard',
      title: 'Dashboard Principal',
      description: 'Vue d\'ensemble de votre bien-être',
      category: 'Vue d\'ensemble',
      path: '/app/home',
      icon: BarChart3,
      keywords: ['dashboard', 'home', 'overview', 'stats', 'metrics'],
      priority: 9
    },
    {
      id: 'music',
      title: 'Musicothérapie IA',
      description: 'Musique générée selon vos émotions',
      category: 'Audio',
      path: '/app/music',
      icon: Music,
      keywords: ['music', 'therapy', 'audio', 'sounds', 'generation'],
      priority: 9,
      badge: 'Premium'
    },
    {
      id: 'coach',
      title: 'Coach IA Nyvée',
      description: 'Assistant personnel intelligent 24/7',
      category: 'Coaching',
      path: '/app/coach',
      icon: MessageSquare,
      keywords: ['coach', 'ai', 'chat', 'support', 'assistant', 'nyvee'],
      priority: 8,
      badge: 'IA'
    },
    {
      id: 'journal',
      title: 'Journal Intelligent',
      description: 'Écriture avec analyse de sentiment',
      category: 'Expression',
      path: '/app/journal',
      icon: Sparkles,
      keywords: ['journal', 'writing', 'diary', 'sentiment', 'analysis'],
      priority: 7
    },

    // VR Experiences
    {
      id: 'vr-breath',
      title: 'Méditation VR',
      description: 'Respiration guidée en réalité virtuelle',
      category: 'VR',
      path: '/app/vr-breath-guide',
      icon: Eye,
      keywords: ['vr', 'meditation', 'breathing', 'virtual', 'reality'],
      priority: 6,
      badge: 'Nouveau'
    },
    {
      id: 'vr-galaxy',
      title: 'Galaxie VR',
      description: 'Exploration spatiale immersive',
      category: 'VR',
      path: '/app/vr-galaxy',
      icon: Star,
      keywords: ['vr', 'space', 'galaxy', 'exploration', 'immersive'],
      priority: 5
    },

    // Wellness Tools
    {
      id: 'flash-glow',
      title: 'Flash Glow',
      description: 'Thérapie lumière express 2 minutes',
      category: 'Bien-être',
      path: '/app/flash-glow',
      icon: Zap,
      keywords: ['flash', 'light', 'therapy', 'quick', 'glow'],
      priority: 6
    },
    {
      id: 'emotions',
      title: 'Tracking Émotions',
      description: 'Suivi détaillé de vos patterns',
      category: 'Analyse',
      path: '/app/emotions',
      icon: Heart,
      keywords: ['emotions', 'tracking', 'patterns', 'analytics'],
      priority: 7
    },

    // Planning & Profile
    {
      id: 'calendar',
      title: 'Calendrier Bien-être',
      description: 'Planification intelligente activités',
      category: 'Planning',
      path: '/app/calendar',
      icon: Calendar,
      keywords: ['calendar', 'planning', 'schedule', 'activities'],
      priority: 5
    },
    {
      id: 'profile',
      title: 'Profil Personnel',
      description: 'Gestion de votre compte utilisateur',
      category: 'Compte',
      path: '/profile',
      icon: User,
      keywords: ['profile', 'account', 'settings', 'personal'],
      priority: 4
    },
    {
      id: 'settings',
      title: 'Paramètres',
      description: 'Configuration de l\'application',
      category: 'Compte',
      path: '/settings',
      icon: Settings,
      keywords: ['settings', 'configuration', 'preferences'],
      priority: 3
    }
  ];

  // Recherche et filtrage intelligents
  const filteredResults = React.useMemo(() => {
    if (!query.trim()) {
      // Afficher les résultats populaires par défaut
      return searchDatabase
        .filter(item => item.priority >= 7)
        .sort((a, b) => b.priority - a.priority)
        .slice(0, 6);
    }

    const normalizedQuery = query.toLowerCase().trim();
    
    return searchDatabase
      .map(item => {
        let score = 0;
        
        // Score pour correspondance exacte dans le titre
        if (item.title.toLowerCase().includes(normalizedQuery)) {
          score += 50;
        }
        
        // Score pour correspondance dans la description
        if (item.description.toLowerCase().includes(normalizedQuery)) {
          score += 30;
        }
        
        // Score pour correspondance dans les mots-clés
        const keywordMatches = item.keywords.filter(keyword => 
          keyword.toLowerCase().includes(normalizedQuery)
        ).length;
        score += keywordMatches * 20;
        
        // Bonus pour priorité élevée
        score += item.priority * 2;
        
        return { ...item, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [query]);

  // Gestion du clavier
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredResults.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredResults.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredResults[selectedIndex]) {
            handleNavigate(filteredResults[selectedIndex].path);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredResults, onClose]);

  // Auto-focus et reset
  React.useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset sélection quand les résultats changent
  React.useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults]);

  const handleNavigate = (path: string) => {
    onNavigate(path);
    onClose();
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'analyse': return Brain;
      case 'audio': return Music;
      case 'vr': return Eye;
      case 'coaching': return MessageSquare;
      case 'bien-être': return Heart;
      case 'planning': return Calendar;
      case 'compte': return User;
      default: return Sparkles;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge.toLowerCase()) {
      case 'populaire': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'nouveau': return 'bg-green-100 text-green-800';
      case 'ia': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="flex flex-col max-h-[80vh]"
        >
          {/* Header de recherche */}
          <div className="flex items-center gap-3 px-4 py-3 border-b">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Rechercher une fonctionnalité..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 bg-transparent text-base placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <div className="text-xs text-muted-foreground">
              <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">ESC</kbd>
            </div>
          </div>

          {/* Résultats */}
          <div className="flex-1 overflow-auto">
            {filteredResults.length > 0 ? (
              <div className="p-2">
                {!query && (
                  <div className="px-3 py-2 text-xs text-muted-foreground font-medium">
                    Fonctionnalités populaires
                  </div>
                )}
                
                <div className="space-y-1">
                  {filteredResults.map((result, index) => {
                    const CategoryIcon = getCategoryIcon(result.category);
                    
                    return (
                      <motion.button
                        key={result.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        onClick={() => handleNavigate(result.path)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                          "hover:bg-muted/50 focus:bg-muted/50 focus:outline-none",
                          selectedIndex === index && "bg-muted"
                        )}
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <result.icon className="h-5 w-5 text-primary" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium truncate">
                              {result.title}
                            </span>
                            {result.badge && (
                              <Badge 
                                variant="secondary" 
                                className={cn("text-xs", getBadgeColor(result.badge))}
                              >
                                {result.badge}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CategoryIcon className="h-3 w-3" />
                            <span className="truncate">{result.description}</span>
                          </div>
                        </div>
                        
                        <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">Aucun résultat trouvé</h3>
                <p className="text-sm text-muted-foreground">
                  Essayez avec d'autres mots-clés
                </p>
              </div>
            )}
          </div>

          {/* Footer avec raccourcis */}
          <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/30">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background rounded">↑↓</kbd>
                <span>Navigation</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background rounded">Enter</kbd>
                <span>Ouvrir</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {filteredResults.length} résultat{filteredResults.length > 1 ? 's' : ''}
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalSearchCommand;