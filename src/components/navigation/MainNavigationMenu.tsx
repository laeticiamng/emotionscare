import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Menu, 
  X, 
  Home, 
  Brain, 
  Music, 
  BookOpen, 
  Wind, 
  Eye, 
  Palette, 
  Wand2,
  Zap,
  Target,
  Heart,
  Users,
  Settings,
  BarChart3,
  Shield,
  HelpCircle,
  FileDown,
  Bell,
  User,
  ChevronDown,
  Sparkles
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

const navigationItems: NavigationItem[] = [
  // Accueil & Dashboards
  { id: 'home', label: 'Accueil', icon: Home, href: '/', category: 'Principal', description: 'Page d\'accueil' },
  { id: 'dashboard-b2c', label: 'Mon Espace', icon: User, href: '/app/home', category: 'Principal', description: 'Tableau de bord personnel' },
  
  // Fonctionnalités principales
  { id: 'scan', label: 'Scanner Émotionnel', icon: Brain, href: '/app/scan', category: 'Analyse', description: 'Analyse IA temps réel', badge: 'IA' },
  { id: 'music', label: 'Musicothérapie', icon: Music, href: '/app/music', category: 'Thérapie', description: 'Musique adaptative' },
  { id: 'journal', label: 'Journal', icon: BookOpen, href: '/app/journal', category: 'Réflexion', description: 'Journal émotionnel' },
  { id: 'breathwork', label: 'Respiration', icon: Wind, href: '/app/breath', category: 'Bien-être', description: 'Exercices guidés' },
  { id: 'coach', label: 'Coach IA', icon: Sparkles, href: '/app/coach', category: 'Accompagnement', description: 'Assistant personnel', isNew: true },
  
  // Modules innovants
  { id: 'vr', label: 'Réalité Virtuelle', icon: Eye, href: '/app/vr', category: 'Immersif', description: 'Expériences VR', isPremium: true },
  { id: 'mood-mixer', label: 'Mood Mixer', icon: Palette, href: '/app/mood-mixer', category: 'Créatif', description: 'Mix personnalisé' },
  { id: 'story-synth', label: 'Story Synth Lab', icon: Wand2, href: '/app/story-synth', category: 'Créatif', description: 'Histoires IA' },
  { id: 'boss-level', label: 'Boss Level Grit', icon: Target, href: '/app/boss-grit', category: 'Développement', description: 'Défis gamifiés' },
  
  // Modules fun
  { id: 'ambition-arcade', label: 'Ambition Arcade', icon: Zap, href: '/app/ambition-arcade', category: 'Gamification', description: 'Jeux motivationnels' },
  { id: 'bounce-back', label: 'Bounce Back Battle', icon: Shield, href: '/app/bounce-back', category: 'Résilience', description: 'Récupération émotionnelle' },
  { id: 'flash-glow', label: 'Flash Glow', icon: Sparkles, href: '/app/flash-glow', category: 'Instantané', description: 'Boost rapide', isNew: true },
  { id: 'ar-filters', label: 'AR Filters', icon: Eye, href: '/app/face-ar', category: 'Immersif', description: 'Réalité augmentée' },
  { id: 'bubble-beat', label: 'Bubble Beat', icon: Heart, href: '/app/bubble-beat', category: 'Instantané', description: 'Défouloir ludique', isNew: true },
  
  // Analytics
  { id: 'weekly-bars', label: 'Weekly Bars', icon: BarChart3, href: '/app/activity', category: 'Analytics', description: 'Graphiques hebdo' },
  { id: 'scores-vibes', label: 'Scores & vibes', icon: Heart, href: '/app/scores', category: 'Analytics', description: 'Courbes d’humeur et heatmap quotidienne' },
  { id: 'leaderboard', label: 'Classements', icon: Target, href: '/app/leaderboard', category: 'Analytics', description: 'Compétition amicale' },
  
  // Social & Communauté
  { id: 'social-cocon', label: 'Social Cocon', icon: Users, href: '/app/social-cocon', category: 'Social', description: 'Communauté bienveillante' },
  { id: 'gamification', label: 'Gamification', icon: Target, href: '/gamification', category: 'Social', description: 'Défis et récompenses' },
  
  // Paramètres & Outils
  { id: 'preferences', label: 'Préférences', icon: Settings, href: '/preferences', category: 'Paramètres', description: 'Configuration' },
  { id: 'notifications', label: 'Notifications', icon: Bell, href: '/notifications', category: 'Paramètres', description: 'Alertes personnalisées' },
  { id: 'export-csv', label: 'Export Données', icon: FileDown, href: '/export-csv', category: 'Outils', description: 'Sauvegarde CSV' },
  { id: 'help-center', label: 'Centre d\'Aide', icon: HelpCircle, href: '/help-center', category: 'Support', description: 'Documentation' },
];

const categories = [
  'Principal', 'Analyse', 'Thérapie', 'Réflexion', 'Bien-être', 'Accompagnement',
  'Immersif', 'Créatif', 'Développement', 'Gamification', 'Résilience', 'Instantané',
  'Analytics', 'Social', 'Paramètres', 'Outils', 'Support'
];

interface MainNavigationMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MainNavigationMenu: React.FC<MainNavigationMenuProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [expandedCategory, setExpandedCategory] = useState<string>('Principal');

  const getItemsByCategory = (category: string) => {
    return navigationItems.filter(item => item.category === category);
  };

  const isActiveRoute = (href: string) => {
    return location.pathname === href || 
           (href !== '/' && location.pathname.startsWith(href));
  };

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

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
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <Heart className="h-4 w-4 text-primary-foreground" />
            </div>
            <h2 className="font-bold text-lg">EmotionsCare</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onToggle} className="md:hidden" aria-label="Fermer le menu">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-2">
            {categories.map((category) => {
              const items = getItemsByCategory(category);
              if (items.length === 0) return null;

              const isExpanded = expandedCategory === category;
              const hasActiveItem = items.some(item => isActiveRoute(item.href));

              return (
                <div key={category} className="space-y-1">
                  <Button
                    variant="ghost"
                    onClick={() => setExpandedCategory(isExpanded ? '' : category)}
                    className={cn(
                      "w-full justify-between text-sm font-medium h-8 px-2",
                      (isExpanded || hasActiveItem) && "text-primary"
                    )}
                  >
                    <span>{category}</span>
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform",
                      isExpanded && "rotate-180"
                    )} />
                  </Button>

                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1 ml-2"
                    >
                      {items.map((item) => {
                        const isActive = isActiveRoute(item.href);
                        const IconComponent = item.icon;

                        return (
                          <Link
                            key={item.id}
                            to={item.href}
                            onClick={onToggle}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors group relative",
                              isActive 
                                ? "bg-primary text-primary-foreground shadow-sm" 
                                : "hover:bg-muted text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <IconComponent className={cn(
                              "h-4 w-4 shrink-0",
                              isActive && "text-primary-foreground"
                            )} />
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="truncate">{item.label}</span>
                                {item.badge && (
                                  <Badge variant="secondary" className="text-xs h-5">
                                    {item.badge}
                                  </Badge>
                                )}
                                {item.isNew && (
                                  <Badge variant="default" className="text-xs h-5 bg-green-500">
                                    Nouveau
                                  </Badge>
                                )}
                                {item.isPremium && (
                                  <Badge variant="outline" className="text-xs h-5 border-amber-500 text-amber-700">
                                    Pro
                                  </Badge>
                                )}
                              </div>
                              {item.description && (
                                <p className="text-xs opacity-70 truncate">
                                  {item.description}
                                </p>
                              )}
                            </div>

                            {/* Indicateur actif */}
                            {isActive && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-foreground rounded-r" />
                            )}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Footer avec stats */}
        <div className="p-4 border-t bg-muted/20">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-2">
              Plateforme d'intelligence émotionnelle
            </p>
            <div className="flex justify-center gap-4 text-xs">
              <span className="text-green-600 font-medium">
                {navigationItems.length} modules
              </span>
              <span className="text-blue-600 font-medium">
                {navigationItems.filter(i => i.isNew).length} nouveautés
              </span>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default MainNavigationMenu;