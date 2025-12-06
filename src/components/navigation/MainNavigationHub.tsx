// @ts-nocheck
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Home, Scan, Music, MessageSquare, Calendar, Settings,
  Brain, Heart, Zap, Sparkles, Star, Target, Crown,
  Gamepad2, Camera, Wind, Palette, Trophy, BarChart3,
  Users, Shield, Monitor, Headphones, Search,
  Grid3X3, ArrowRight, Play, Menu, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavigationItem {
  id: string; // Clé unique pour chaque item
  title: string;
  description: string;
  path: string;
  icon: React.ElementType;
  category: 'core' | 'wellness' | 'fun' | 'analytics' | 'settings';
  badge?: string;
  isNew?: boolean;
  isPremium?: boolean;
}

const MainNavigationHub: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState(false);

  const navigationItems: NavigationItem[] = [
    // Core Features
    { id: 'dashboard', title: 'Dashboard', description: 'Tableau de bord principal', path: '/app/consumer/home', icon: Home, category: 'core' },
    { id: 'scan-main', title: 'Scan Émotionnel', description: 'Analyse IA en temps réel', path: '/app/scan', icon: Scan, category: 'core', badge: 'IA' },
    { id: 'music', title: 'Musicothérapie', description: 'Thérapie musicale adaptative', path: '/app/music', icon: Music, category: 'core' },
    { id: 'coach', title: 'Coach IA', description: 'Assistant personnel intelligent', path: '/app/coach', icon: Brain, category: 'core', badge: 'IA' },
    { id: 'journal', title: 'Journal', description: 'Journal émotionnel intelligent', path: '/app/journal', icon: Calendar, category: 'core' },
    
    // Wellness & Mindfulness
    { id: 'flash-glow', title: 'Flash Glow', description: 'Boost énergétique instantané', path: '/app/flash-glow', icon: Zap, category: 'wellness', isNew: true },
    { id: 'breath', title: 'Respiration', description: 'Exercices de breathwork', path: '/app/breath', icon: Wind, category: 'wellness' },
    { id: 'vr', title: 'Réalité Virtuelle', description: 'Immersion thérapeutique', path: '/app/vr', icon: Monitor, category: 'wellness', isPremium: true },
    { id: 'scan-facial', title: 'Scan Facial', description: 'Scan émotionnel par caméra', path: '/app/scan/facial', icon: Heart, category: 'wellness', badge: 'IA' },
    { id: 'scan-voice', title: 'Scan Vocal', description: 'Analyse vocale émotionnelle', path: '/app/scan/voice', icon: Headphones, category: 'wellness', badge: 'IA' },
    
    // Fun & Interactive
    { id: 'face-ar', title: 'Filtres AR', description: 'Réalité augmentée émotionnelle', path: '/app/face-ar', icon: Camera, category: 'fun', badge: 'AR' },
    { id: 'bubble-beat', title: 'Bubble Beat', description: 'Jeu rythmique relaxant', path: '/app/bubble-beat', icon: Gamepad2, category: 'fun' },
    { id: 'screen-silk', title: 'Screen Silk', description: 'Pause écran intelligente', path: '/app/screen-silk', icon: Shield, category: 'fun' },
    { id: 'vr-galaxy', title: 'VR Galaxy', description: 'Voyage galactique immersif', path: '/app/vr-galaxy', icon: Star, category: 'fun', isPremium: true },
    { id: 'boss-grit', title: 'Boss Level Grit', description: 'Défi de résilience', path: '/app/boss-grit', icon: Crown, category: 'fun' },
    { id: 'mood-mixer', title: 'Mood Mixer', description: 'Création d\'ambiances', path: '/app/mood-mixer', icon: Palette, category: 'fun' },
    { id: 'ambition-arcade', title: 'Ambition Arcade', description: 'Jeux d\'ambition', path: '/app/ambition-arcade', icon: Target, category: 'fun' },
    { id: 'bounce-back', title: 'Bounce Back', description: 'Combat contre l\'adversité', path: '/app/bounce-back', icon: Sparkles, category: 'fun' },
    { id: 'story-synth', title: 'Story Synth', description: 'Laboratoire d\'histoires', path: '/app/story-synth', icon: Play, category: 'fun' },
    
    // Analytics & Progress
    { id: 'leaderboard', title: 'Gamification', description: 'Système de récompenses', path: '/app/leaderboard', icon: Trophy, category: 'analytics' },
    { id: 'activity', title: 'Activité', description: 'Historique et tendances', path: '/app/activity', icon: BarChart3, category: 'analytics' },
    { id: 'scores', title: 'Scores & vibes', description: 'Courbes d\'humeur et heatmap quotidienne', path: '/app/scores', icon: Grid3X3, category: 'analytics' },
    { id: 'community', title: 'Communauté', description: 'Réseau social thérapeutique', path: '/app/community', icon: Users, category: 'analytics' },
    
    // Settings
    { id: 'settings-general', title: 'Paramètres', description: 'Configuration générale', path: '/settings/general', icon: Settings, category: 'settings' },
    { id: 'settings-profile', title: 'Profil', description: 'Informations personnelles', path: '/settings/profile', icon: Users, category: 'settings' },
    { id: 'settings-privacy', title: 'Confidentialité', description: 'Gestion des données', path: '/settings/privacy', icon: Shield, category: 'settings' },
    { id: 'settings-notifications', title: 'Notifications', description: 'Alertes et rappels', path: '/settings/notifications', icon: MessageSquare, category: 'settings' },
  ];

  const categories = [
    { key: 'all', label: 'Tout', icon: Grid3X3 },
    { key: 'core', label: 'Essentiel', icon: Heart },
    { key: 'wellness', label: 'Bien-être', icon: Sparkles },
    { key: 'fun', label: 'Ludique', icon: Gamepad2 },
    { key: 'analytics', label: 'Analyse', icon: BarChart3 },
    { key: 'settings', label: 'Paramètres', icon: Settings },
  ];

  const filteredItems = navigationItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsExpanded(false);
  };

  return (
    <>
      {/* Bouton d'ouverture flottant */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <Button
          onClick={() => setIsExpanded(true)}
          size="lg"
          className="rounded-full h-14 w-14 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
          aria-label="Ouvrir la navigation"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </Button>
      </motion.div>

      {/* Modal de navigation */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsExpanded(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation EmotionsCare"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-background rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b bg-gradient-to-r from-primary/5 to-accent/5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      Navigation EmotionsCare
                    </h2>
                    <p className="text-muted-foreground">Explorez toutes nos fonctionnalités</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(false)}
                    className="rounded-full"
                    aria-label="Fermer la navigation"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </div>

                {/* Recherche */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <Input
                    placeholder="Rechercher une fonctionnalité..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    aria-label="Rechercher une fonctionnalité"
                  />
                </div>

                {/* Filtres de catégorie */}
                <div className="flex gap-2 mt-4 flex-wrap" role="group" aria-label="Filtrer par catégorie">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <Button
                        key={category.key}
                        variant={selectedCategory === category.key ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category.key)}
                        className="text-xs"
                        aria-pressed={selectedCategory === category.key}
                      >
                        <Icon className="h-3 w-3 mr-1" aria-hidden="true" />
                        {category.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card 
                          className={cn(
                            "cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105",
                            "bg-gradient-to-br from-background to-accent/5",
                            item.isPremium && "border-amber-200 bg-gradient-to-br from-amber-50 to-background dark:from-amber-950/20 dark:to-background"
                          )}
                          onClick={() => handleNavigate(item.path)}
                          tabIndex={0}
                          role="button"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleNavigate(item.path);
                            }
                          }}
                          aria-label={`${item.title} - ${item.description}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className={cn(
                                "p-2 rounded-lg shrink-0",
                                item.isPremium 
                                  ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" 
                                  : "bg-primary/10 text-primary"
                              )}>
                                <Icon className="h-5 w-5" aria-hidden="true" />
                              </div>
                              
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                                  {item.badge && (
                                    <Badge variant="secondary" className="text-xs px-1 py-0">
                                      {item.badge}
                                    </Badge>
                                  )}
                                  {item.isNew && (
                                    <Badge className="text-xs px-1 py-0 bg-green-500">
                                      Nouveau
                                    </Badge>
                                  )}
                                  {item.isPremium && (
                                    <Badge className="text-xs px-1 py-0 bg-amber-500">
                                      Premium
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {item.description}
                                </p>
                              </div>
                              
                              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                {filteredItems.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
                    <h3 className="text-lg font-semibold mb-2">Aucune fonctionnalité trouvée</h3>
                    <p className="text-muted-foreground">
                      Essayez de modifier votre recherche ou de changer de catégorie
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t bg-muted/20 text-center">
                <p className="text-xs text-muted-foreground">
                  {filteredItems.length} fonctionnalité{filteredItems.length > 1 ? 's' : ''} disponible{filteredItems.length > 1 ? 's' : ''}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MainNavigationHub;