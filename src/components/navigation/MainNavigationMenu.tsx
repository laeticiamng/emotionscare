import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  X, 
  Home, 
  Brain, 
  Music, 
  BookOpen, 
  Wind, 
  Eye,
  Sparkles,
  Target,
  Heart,
  Users,
  Settings,
  HelpCircle,
  User,
  ChevronDown,
  Gamepad2,
  Trophy,
  Map,
  MessageCircle,
  Crown,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  category: string;
  badge?: string;
  description?: string;
  isNew?: boolean;
  isPremium?: boolean;
}

/**
 * Navigation simplifiée : ~30 liens essentiels organisés en 5 catégories
 * (réduit depuis ~90 liens / 15 catégories)
 */
const navigationItems: NavigationItem[] = [
  // ═══════════════════════════════════════════════════════════
  // ACCUEIL
  // ═══════════════════════════════════════════════════════════
  { id: 'dashboard', label: 'Mon Espace', icon: Home, href: '/app/home', category: 'Accueil', description: 'Tableau de bord' },
  { id: 'emotional-park', label: 'Parc Émotionnel', icon: Map, href: '/app/emotional-park', category: 'Accueil', description: 'Monde immersif' },
  { id: 'modules', label: 'Explorer les modules', icon: Sparkles, href: '/app/modules', category: 'Accueil', description: 'Catalogue complet' },

  // ═══════════════════════════════════════════════════════════
  // COMPRENDRE — Scanner, Évaluations, Insights
  // ═══════════════════════════════════════════════════════════
  { id: 'scan', label: 'Scanner Émotionnel', icon: Brain, href: '/app/scan', category: 'Comprendre', description: 'Analyse IA temps réel', badge: 'IA' },
  { id: 'journal', label: 'Journal', icon: BookOpen, href: '/app/journal', category: 'Comprendre', description: 'Journal émotionnel' },
  { id: 'weekly-bars', label: 'Bilan Hebdo', icon: Target, href: '/app/weekly-bars', category: 'Comprendre', description: 'Visualisation semaine' },

  // ═══════════════════════════════════════════════════════════
  // AGIR — Respiration, Coach, Méditation
  // ═══════════════════════════════════════════════════════════
  { id: 'breath', label: 'Respiration', icon: Wind, href: '/app/breath', category: 'Agir', description: 'Exercices guidés' },
  { id: 'coach', label: 'Coach IA', icon: MessageCircle, href: '/app/coach', category: 'Agir', description: 'Assistant personnel', badge: 'IA' },
  { id: 'meditation', label: 'Méditation', icon: Heart, href: '/app/meditation', category: 'Agir', description: 'Sessions guidées' },
  { id: 'flash-glow', label: 'Flash Glow', icon: Sparkles, href: '/app/flash-glow', category: 'Agir', description: 'Boost rapide 2min' },

  // ═══════════════════════════════════════════════════════════
  // S'ÉVADER — Musique, VR, Parc Émotionnel
  // ═══════════════════════════════════════════════════════════
  { id: 'music', label: 'Musicothérapie', icon: Music, href: '/app/music', category: "S'évader", description: 'Vinyls adaptatifs' },
  { id: 'vr', label: 'Espace VR', icon: Eye, href: '/app/vr', category: "S'évader", description: 'Réalité virtuelle', isPremium: true },
  { id: 'bubble-beat', label: 'Bubble Beat', icon: Gamepad2, href: '/app/bubble-beat', category: "S'évader", description: 'Jeu anti-stress' },
  { id: 'story-synth', label: 'Story Synth', icon: Sparkles, href: '/app/story-synth', category: "S'évader", description: 'Histoires IA' },

  // ═══════════════════════════════════════════════════════════
  // PROGRESSER — Gamification, Défis, Classement
  // ═══════════════════════════════════════════════════════════
  { id: 'boss-grit', label: 'Boss Grit', icon: Target, href: '/app/boss-grit', category: 'Progresser', description: 'Défis résilience' },
  { id: 'ambition-arcade', label: 'Ambition Arcade', icon: Gamepad2, href: '/app/ambition-arcade', category: 'Progresser', description: 'Objectifs gamifiés' },
  { id: 'leaderboard', label: 'Classements', icon: Trophy, href: '/app/leaderboard', category: 'Progresser', description: 'Top joueurs' },

  // ═══════════════════════════════════════════════════════════
  // COMMUNAUTÉ — Entraide, Buddies
  // ═══════════════════════════════════════════════════════════
  { id: 'entraide', label: 'Entraide', icon: Users, href: '/app/entraide', category: 'Communauté', description: 'Espace bienveillant' },
  { id: 'buddies', label: 'Buddies', icon: Heart, href: '/app/buddies', category: 'Communauté', description: 'Trouver un binôme' },
  { id: 'exchange', label: 'Exchange Hub', icon: Sparkles, href: '/app/exchange', category: 'Communauté', description: 'Marchés émotions' },

  // ═══════════════════════════════════════════════════════════
  // PARAMÈTRES
  // ═══════════════════════════════════════════════════════════
  { id: 'profile', label: 'Mon Profil', icon: User, href: '/app/profile', category: 'Paramètres', description: 'Infos personnelles' },
  { id: 'settings', label: 'Paramètres', icon: Settings, href: '/settings/general', category: 'Paramètres', description: 'Configuration' },
  { id: 'privacy', label: 'Confidentialité', icon: Lock, href: '/settings/privacy', category: 'Paramètres', description: 'Données privées' },
  { id: 'premium', label: 'Premium', icon: Crown, href: '/app/premium', category: 'Paramètres', description: 'Abonnement', isPremium: true },
  { id: 'help', label: 'Aide', icon: HelpCircle, href: '/help', category: 'Paramètres', description: 'Documentation' },
];

const categories = [
  'Accueil',
  'Comprendre',
  'Agir',
  "S'évader",
  'Progresser',
  'Communauté',
  'Paramètres',
];

interface MainNavigationMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MainNavigationMenu: React.FC<MainNavigationMenuProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Accueil', 'Agir']);

  const getItemsByCategory = (category: string) => {
    return navigationItems.filter(item => item.category === category);
  };

  const isActiveRoute = (href: string) => {
    return location.pathname === href || 
           (href !== '/' && location.pathname.startsWith(href));
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <>
      {/* Overlay mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Menu principal */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn(
          "fixed top-0 left-0 h-full w-80 bg-background border-r z-50 flex flex-col",
          "md:translate-x-0 md:static md:z-auto",
          "shadow-xl md:shadow-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <Heart className="h-4 w-4 text-primary-foreground" />
            </div>
            <h2 className="font-bold text-lg">EmotionsCare</h2>
          </Link>
          <Button variant="ghost" size="icon" onClick={onToggle} className="md:hidden">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-1">
            {categories.map((category) => {
              const items = getItemsByCategory(category);
              if (items.length === 0) return null;

              const isExpanded = expandedCategories.includes(category);
              const hasActiveItem = items.some(item => isActiveRoute(item.href));

              return (
                <div key={category} className="space-y-0.5">
                  <Button
                    variant="ghost"
                    onClick={() => toggleCategory(category)}
                    className={cn(
                      "w-full justify-between text-sm font-semibold h-9 px-3",
                      (isExpanded || hasActiveItem) && "text-primary bg-primary/5"
                    )}
                  >
                    <span>{category}</span>
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      isExpanded && "rotate-180"
                    )} />
                  </Button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-0.5 ml-2 pl-2 border-l border-border/50">
                          {items.map((item) => {
                            const isActive = isActiveRoute(item.href);
                            const IconComponent = item.icon;

                            return (
                              <Link
                                key={item.id}
                                to={item.href}
                                onClick={() => {
                                  if (window.innerWidth < 768) onToggle();
                                }}
                                className={cn(
                                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all group",
                                  isActive 
                                    ? "bg-primary text-primary-foreground shadow-sm" 
                                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                )}
                              >
                                <IconComponent className={cn(
                                  "h-4 w-4 shrink-0",
                                  isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                                )} />
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="truncate font-medium">{item.label}</span>
                                    {item.badge && (
                                      <Badge variant="secondary" className="text-[10px] h-4 px-1">
                                        {item.badge}
                                      </Badge>
                                    )}
                                    {item.isPremium && (
                                      <Crown className="h-3 w-3 text-amber-500" />
                                    )}
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t bg-muted/30">
          <div className="text-center space-y-1">
            <p className="text-xs text-muted-foreground">
              Intelligence Émotionnelle
            </p>
            <p className="text-xs text-primary font-medium">
              {navigationItems.length} modules disponibles
            </p>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default MainNavigationMenu;
