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
  Sparkles,
  Gamepad2,
  Star,
  Calendar,
  MessageCircle,
  Trophy,
  Compass,
  Map,
  Film,
  Volume2,
  Activity,
  Crown,
  Clock,
  Rocket,
  Globe,
  TrendingUp,
  Gift,
  Lock,
  Smartphone,
  RefreshCw,
  LayoutDashboard,
  Camera,
  Mic,
  FileText,
  Waves
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
  // ═══════════════════════════════════════════════════════════
  // ACCUEIL & DASHBOARDS
  // ═══════════════════════════════════════════════════════════
  { id: 'home', label: 'Accueil', icon: Home, href: '/', category: 'Accueil', description: 'Page d\'accueil' },
  { id: 'dashboard', label: 'Mon Espace', icon: LayoutDashboard, href: '/app/home', category: 'Accueil', description: 'Tableau de bord' },
  { id: 'modules', label: 'Tous les Modules', icon: Compass, href: '/app/modules', category: 'Accueil', description: 'Explorer les modules' },
  
  // ═══════════════════════════════════════════════════════════
  // ANALYSE ÉMOTIONNELLE
  // ═══════════════════════════════════════════════════════════
  { id: 'scan', label: 'Scanner Émotionnel', icon: Brain, href: '/app/scan', category: 'Analyse', description: 'Analyse IA temps réel', badge: 'IA' },
  { id: 'scan-facial', label: 'Scan Facial', icon: Camera, href: '/app/scan/facial', category: 'Analyse', description: 'Détection visage' },
  { id: 'scan-voice', label: 'Scan Vocal', icon: Mic, href: '/app/scan/voice', category: 'Analyse', description: 'Analyse vocale' },
  { id: 'scan-text', label: 'Scan Texte', icon: FileText, href: '/app/scan/text', category: 'Analyse', description: 'Analyse textuelle' },
  { id: 'hume-realtime', label: 'Hume AI Realtime', icon: Activity, href: '/app/hume-realtime', category: 'Analyse', description: 'Détection temps réel', isNew: true },
  
  // ═══════════════════════════════════════════════════════════
  // BIEN-ÊTRE & RELAXATION
  // ═══════════════════════════════════════════════════════════
  { id: 'flash-glow', label: 'Flash Glow', icon: Sparkles, href: '/app/flash-glow', category: 'Bien-être', description: 'Boost rapide 2min', isNew: true },
  { id: 'breath', label: 'Respiration', icon: Wind, href: '/app/breath', category: 'Bien-être', description: 'Exercices guidés' },
  { id: 'meditation', label: 'Méditation', icon: Heart, href: '/app/meditation', category: 'Bien-être', description: 'Sessions guidées' },
  { id: 'screen-silk', label: 'Screen Silk', icon: RefreshCw, href: '/app/screen-silk', category: 'Bien-être', description: 'Micro-pauses' },
  { id: 'bubble-beat', label: 'Bubble Beat', icon: Waves, href: '/app/bubble-beat', category: 'Bien-être', description: 'Défouloir ludique', isNew: true },
  
  // ═══════════════════════════════════════════════════════════
  // MUSIQUE & AUDIO
  // ═══════════════════════════════════════════════════════════
  { id: 'music', label: 'Musicothérapie', icon: Music, href: '/app/music', category: 'Musique', description: 'Vinyls adaptatifs' },
  { id: 'music-premium', label: 'Music Premium', icon: Crown, href: '/app/music-premium', category: 'Musique', description: 'Génération IA', isPremium: true },
  { id: 'mood-mixer', label: 'Mood Mixer', icon: Palette, href: '/app/mood-mixer', category: 'Musique', description: 'Mix personnalisé' },
  { id: 'voice-journal', label: 'Journal Vocal', icon: Volume2, href: '/app/voice-journal', category: 'Musique', description: 'Dictée vocale' },
  
  // ═══════════════════════════════════════════════════════════
  // JOURNAL & RÉFLEXION
  // ═══════════════════════════════════════════════════════════
  { id: 'journal', label: 'Journal', icon: BookOpen, href: '/app/journal', category: 'Journal', description: 'Journal émotionnel' },
  { id: 'journal-new', label: 'Nouvelle Entrée', icon: FileText, href: '/app/journal-new', category: 'Journal', description: 'Créer entrée' },
  { id: 'emotion-sessions', label: 'Historique Sessions', icon: Clock, href: '/app/emotion-sessions', category: 'Journal', description: 'Toutes vos sessions' },
  { id: 'insights', label: 'Insights', icon: TrendingUp, href: '/app/insights', category: 'Journal', description: 'Analyses personnelles' },
  
  // ═══════════════════════════════════════════════════════════
  // COACHING & ACCOMPAGNEMENT
  // ═══════════════════════════════════════════════════════════
  { id: 'coach', label: 'Coach IA', icon: Sparkles, href: '/app/coach', category: 'Coaching', description: 'Assistant personnel', badge: 'IA' },
  { id: 'coach-programs', label: 'Programmes', icon: Target, href: '/app/coach/programs', category: 'Coaching', description: 'Parcours guidés' },
  { id: 'coach-sessions', label: 'Sessions Coach', icon: MessageCircle, href: '/app/coach/sessions', category: 'Coaching', description: 'Historique coaching' },
  { id: 'nyvee', label: 'Nyvee Cocon', icon: Heart, href: '/app/nyvee', category: 'Coaching', description: 'Compagnon virtuel' },
  
  // ═══════════════════════════════════════════════════════════
  // IMMERSIF & VR
  // ═══════════════════════════════════════════════════════════
  { id: 'vr', label: 'Espace VR', icon: Eye, href: '/app/vr', category: 'Immersif', description: 'Réalité virtuelle', isPremium: true },
  { id: 'vr-galaxy', label: 'VR Galaxy', icon: Globe, href: '/app/vr-galaxy', category: 'Immersif', description: 'Exploration spatiale' },
  { id: 'vr-breath', label: 'VR Respiration', icon: Wind, href: '/app/vr-breath-guide', category: 'Immersif', description: 'Guidage immersif' },
  { id: 'ar-filters', label: 'AR Filters', icon: Camera, href: '/app/face-ar', category: 'Immersif', description: 'Filtres AR' },
  { id: 'emotional-park', label: 'Parc Émotionnel', icon: Map, href: '/app/emotional-park', category: 'Immersif', description: 'Monde 3D' },
  
  // ═══════════════════════════════════════════════════════════
  // CRÉATIF & HISTOIRES
  // ═══════════════════════════════════════════════════════════
  { id: 'story-synth', label: 'Story Synth Lab', icon: Wand2, href: '/app/story-synth', category: 'Créatif', description: 'Histoires IA' },
  { id: 'emotion-atlas', label: 'Atlas Émotions', icon: Compass, href: '/app/emotion-atlas', category: 'Créatif', description: 'Cartographie' },
  { id: 'discovery', label: 'Découverte', icon: Rocket, href: '/app/discovery', category: 'Créatif', description: 'Exploration' },
  { id: 'parcours-xl', label: 'Parcours XL', icon: Film, href: '/app/parcours-xl', category: 'Créatif', description: 'Immersion longue' },
  
  // ═══════════════════════════════════════════════════════════
  // GAMIFICATION & DÉFIS
  // ═══════════════════════════════════════════════════════════
  { id: 'boss-grit', label: 'Boss Level Grit', icon: Target, href: '/app/boss-grit', category: 'Gamification', description: 'Défis persévérance' },
  { id: 'ambition-arcade', label: 'Ambition Arcade', icon: Gamepad2, href: '/app/ambition-arcade', category: 'Gamification', description: 'Jeux motivationnels' },
  { id: 'bounce-back', label: 'Bounce Back', icon: Shield, href: '/app/bounce-back', category: 'Gamification', description: 'Résilience' },
  { id: 'daily-challenges', label: 'Défis Quotidiens', icon: Zap, href: '/app/daily-challenges', category: 'Gamification', description: 'Challenges du jour' },
  { id: 'challenges', label: 'Tous les Défis', icon: Trophy, href: '/app/challenges', category: 'Gamification', description: 'Liste des défis' },
  { id: 'gamification', label: 'Centre Gamification', icon: Star, href: '/gamification', category: 'Gamification', description: 'XP et niveaux' },
  { id: 'badges', label: 'Badges', icon: Star, href: '/app/badges', category: 'Gamification', description: 'Vos récompenses' },
  { id: 'rewards', label: 'Récompenses', icon: Gift, href: '/app/rewards', category: 'Gamification', description: 'Débloquer bonus' },
  { id: 'leaderboard', label: 'Classements', icon: Trophy, href: '/app/leaderboard', category: 'Gamification', description: 'Top joueurs' },
  
  // ═══════════════════════════════════════════════════════════
  // ANALYTICS & STATISTIQUES
  // ═══════════════════════════════════════════════════════════
  { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/app/analytics', category: 'Analytics', description: 'Statistiques globales' },
  { id: 'weekly-bars', label: 'Weekly Bars', icon: BarChart3, href: '/app/weekly-bars', category: 'Analytics', description: 'Graphiques hebdo' },
  { id: 'scores', label: 'Scores & Vibes', icon: Activity, href: '/app/scores', category: 'Analytics', description: 'Heatmap quotidienne' },
  { id: 'activity', label: 'Activité', icon: Activity, href: '/app/activity', category: 'Analytics', description: 'Historique activité' },
  { id: 'trends', label: 'Tendances', icon: TrendingUp, href: '/app/trends', category: 'Analytics', description: 'Évolution' },
  { id: 'sessions', label: 'Sessions', icon: Clock, href: '/app/sessions', category: 'Analytics', description: 'Historique complet' },
  { id: 'goals', label: 'Objectifs', icon: Target, href: '/app/goals', category: 'Analytics', description: 'Suivi objectifs' },
  
  // ═══════════════════════════════════════════════════════════
  // SOCIAL & COMMUNAUTÉ
  // ═══════════════════════════════════════════════════════════
  { id: 'community', label: 'Communauté', icon: Users, href: '/app/community', category: 'Social', description: 'Groupes' },
  { id: 'social-cocon', label: 'Social Cocon', icon: Heart, href: '/app/social-cocon', category: 'Social', description: 'Espace bienveillant' },
  { id: 'buddies', label: 'Buddies', icon: Users, href: '/app/buddies', category: 'Social', description: 'Trouver un binôme' },
  { id: 'group-sessions', label: 'Sessions Groupe', icon: Users, href: '/app/group-sessions', category: 'Social', description: 'Pratique collective' },
  { id: 'exchange', label: 'Exchange Hub', icon: RefreshCw, href: '/app/exchange', category: 'Social', description: 'Partage ressources' },
  { id: 'messages', label: 'Messages', icon: MessageCircle, href: '/messages', category: 'Social', description: 'Messagerie' },
  
  // ═══════════════════════════════════════════════════════════
  // OUTILS & INTÉGRATIONS
  // ═══════════════════════════════════════════════════════════
  { id: 'wearables', label: 'Wearables', icon: Smartphone, href: '/app/wearables', category: 'Outils', description: 'Montres connectées' },
  { id: 'data-export', label: 'Export Données', icon: FileDown, href: '/app/data-export', category: 'Outils', description: 'RGPD Export' },
  { id: 'calendar', label: 'Calendrier', icon: Calendar, href: '/calendar', category: 'Outils', description: 'Planning' },
  { id: 'notifications', label: 'Notifications', icon: Bell, href: '/app/notifications', category: 'Outils', description: 'Centre notifs' },
  { id: 'timecraft', label: 'TimeCraft', icon: Clock, href: '/app/timecraft', category: 'Outils', description: 'Gestion du temps' },
  
  // ═══════════════════════════════════════════════════════════
  // PARAMÈTRES
  // ═══════════════════════════════════════════════════════════
  { id: 'profile', label: 'Mon Profil', icon: User, href: '/app/profile', category: 'Paramètres', description: 'Infos personnelles' },
  { id: 'settings', label: 'Paramètres', icon: Settings, href: '/settings/general', category: 'Paramètres', description: 'Configuration' },
  { id: 'privacy', label: 'Confidentialité', icon: Lock, href: '/settings/privacy', category: 'Paramètres', description: 'Données privées' },
  { id: 'premium', label: 'Premium', icon: Crown, href: '/app/premium', category: 'Paramètres', description: 'Abonnement', isPremium: true },
  { id: 'billing', label: 'Facturation', icon: FileText, href: '/app/billing', category: 'Paramètres', description: 'Paiements' },
  
  // ═══════════════════════════════════════════════════════════
  // SUPPORT
  // ═══════════════════════════════════════════════════════════
  { id: 'help', label: 'Centre d\'Aide', icon: HelpCircle, href: '/help', category: 'Support', description: 'Documentation' },
  { id: 'faq', label: 'FAQ', icon: HelpCircle, href: '/faq', category: 'Support', description: 'Questions fréquentes' },
  { id: 'support', label: 'Support', icon: MessageCircle, href: '/app/support', category: 'Support', description: 'Contacter support' },
  { id: 'tickets', label: 'Mes Tickets', icon: FileText, href: '/app/tickets', category: 'Support', description: 'Suivi demandes' },
];

const categories = [
  'Accueil',
  'Analyse',
  'Bien-être',
  'Musique',
  'Journal',
  'Coaching',
  'Immersif',
  'Créatif',
  'Gamification',
  'Analytics',
  'Social',
  'Outils',
  'Paramètres',
  'Support'
];

interface MainNavigationMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MainNavigationMenu: React.FC<MainNavigationMenuProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Accueil']);

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
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs h-5 px-1.5">
                        {items.length}
                      </Badge>
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isExpanded && "rotate-180"
                      )} />
                    </div>
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
                                    {item.isNew && (
                                      <Badge className="text-[10px] h-4 px-1 bg-green-500 hover:bg-green-600">
                                        New
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
            <div className="flex justify-center gap-3 text-xs">
              <span className="text-primary font-medium">
                {navigationItems.length} modules
              </span>
              <span className="text-green-600 font-medium">
                {navigationItems.filter(i => i.isNew).length} nouveaux
              </span>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default MainNavigationMenu;
