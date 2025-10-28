import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Home, Scan, Music, MessageSquare, Calendar, Settings,
  Brain, Heart, Zap, Sparkles, Star, Target, Crown,
  Gamepad2, Camera, Wind, Palette, Trophy, BarChart3,
  Users, Shield, Monitor, Search, Grid3X3, ArrowRight, Play, Filter,
  type LucideIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Helmet } from 'react-helmet-async';

interface NavigationItem {
  title: string;
  description: string;
  path: string;
  icon: LucideIcon;
  category: 'core' | 'wellness' | 'fun' | 'analytics' | 'settings' | 'b2b';
  badge?: string;
  isNew?: boolean;
  isPremium?: boolean;
}

export default function NavigationPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const navigationItems: NavigationItem[] = [
    // Core Features
    { title: 'Dashboard', description: 'Tableau de bord principal', path: '/app/home', icon: Home, category: 'core' },
    { title: 'Scan Émotionnel', description: 'Analyse IA en temps réel', path: '/app/scan', icon: Scan, category: 'core', badge: 'IA' },
    { title: 'Musicothérapie', description: 'Thérapie musicale adaptative', path: '/app/music', icon: Music, category: 'core' },
    { title: 'Coach IA', description: 'Assistant personnel intelligent', path: '/app/coach', icon: Brain, category: 'core', badge: 'IA' },
    { title: 'Journal', description: 'Journal émotionnel intelligent', path: '/app/journal', icon: Calendar, category: 'core' },
    
    // Wellness & Mindfulness
    { title: 'Flash Glow', description: 'Boost énergétique instantané', path: '/app/flash-glow', icon: Zap, category: 'wellness', isNew: true },
    { title: 'Respiration', description: 'Exercices de breathwork', path: '/app/breath', icon: Wind, category: 'wellness' },
    { title: 'Réalité Virtuelle', description: 'Immersion thérapeutique', path: '/app/vr', icon: Monitor, category: 'wellness', isPremium: true },
    { title: 'Scan Émotions', description: 'Analyse faciale avancée', path: '/app/emotion-scan', icon: Heart, category: 'wellness', badge: 'IA' },
    { title: 'Journal Vocal', description: 'Expression vocale libre', path: '/app/voice-journal', icon: MessageSquare, category: 'wellness' },
    
    // Fun & Interactive
    { title: 'Filtres AR', description: 'Réalité augmentée émotionnelle', path: '/app/face-ar', icon: Camera, category: 'fun', badge: 'AR' },
    { title: 'Bubble Beat', description: 'Jeu rythmique relaxant', path: '/app/bubble-beat', icon: Gamepad2, category: 'fun' },
    { title: 'Screen Silk', description: 'Pause écran intelligente', path: '/app/screen-silk', icon: Shield, category: 'fun' },
    { title: 'VR Galaxy', description: 'Voyage galactique immersif', path: '/app/vr-galaxy', icon: Star, category: 'fun', isPremium: true },
    { title: 'Boss Level Grit', description: 'Défi de résilience', path: '/app/boss-grit', icon: Crown, category: 'fun' },
    { title: 'Mood Mixer', description: 'Création d\'ambiances', path: '/app/mood-mixer', icon: Palette, category: 'fun' },
    { title: 'Ambition Arcade', description: 'Jeux d\'ambition', path: '/app/ambition-arcade', icon: Target, category: 'fun' },
    { title: 'Bounce Back', description: 'Combat contre l\'adversité', path: '/app/bounce-back', icon: Sparkles, category: 'fun' },
    { title: 'Story Synth', description: 'Laboratoire d\'histoires', path: '/app/story-synth', icon: Play, category: 'fun' },
    
    // Analytics & Progress
    { title: 'Gamification', description: 'Système de récompenses', path: '/app/leaderboard', icon: Trophy, category: 'analytics' },
    { title: 'Activité', description: 'Historique et tendances', path: '/app/activity', icon: BarChart3, category: 'analytics' },
    { title: 'Scores & vibes', description: 'Courbes d\'humeur et heatmap quotidienne', path: '/app/scores', icon: Grid3X3, category: 'analytics' },
    { title: 'Communauté', description: 'Réseau social thérapeutique', path: '/app/community', icon: Users, category: 'analytics' },
    
    // Settings
    { title: 'Paramètres', description: 'Configuration générale', path: '/settings/general', icon: Settings, category: 'settings' },
    { title: 'Profil', description: 'Informations personnelles', path: '/settings/profile', icon: Users, category: 'settings' },
    { title: 'Confidentialité', description: 'Gestion des données', path: '/settings/privacy', icon: Shield, category: 'settings' },
    { title: 'Notifications', description: 'Alertes et rappels', path: '/settings/notifications', icon: MessageSquare, category: 'settings' },
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
  };

  return (
    <>
      <Helmet>
        <title>Navigation - EmotionsCare</title>
        <meta name="description" content="Explorez toutes les fonctionnalités EmotionsCare : scan émotionnel, musicothérapie, coach IA, VR et bien plus" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
                Navigation EmotionsCare
              </h1>
              <p className="text-muted-foreground text-lg">
                Explorez toutes nos fonctionnalités pour votre bien-être émotionnel
              </p>
            </motion.div>

            {/* Recherche */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative mb-6"
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Rechercher une fonctionnalité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 text-lg"
              />
            </motion.div>

            {/* Filtres de catégorie */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-2 flex-wrap justify-center"
            >
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.key}
                    variant={selectedCategory === category.key ? "default" : "outline"}
                    size="lg"
                    onClick={() => setSelectedCategory(category.key)}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {category.label}
                  </Button>
                );
              })}
            </motion.div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {filteredItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card 
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 h-full",
                      "bg-gradient-to-br from-background to-accent/10",
                      item.isPremium && "border-amber-200 bg-gradient-to-br from-amber-50/50 to-background"
                    )}
                    onClick={() => handleNavigate(item.path)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={cn(
                          "p-3 rounded-xl shrink-0",
                          item.isPremium 
                            ? "bg-amber-100 text-amber-600" 
                            : "bg-primary/10 text-primary"
                        )}>
                          <Icon className="h-6 w-6" />
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="font-semibold text-base">{item.title}</h3>
                            {item.badge && (
                              <Badge variant="secondary" className="text-xs">
                                {item.badge}
                              </Badge>
                            )}
                            {item.isNew && (
                              <Badge className="text-xs bg-green-500">
                                Nouveau
                              </Badge>
                            )}
                            {item.isPremium && (
                              <Badge className="text-xs bg-amber-500">
                                Premium
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-3">Aucune fonctionnalité trouvée</h3>
              <p className="text-muted-foreground text-lg">
                Essayez de modifier votre recherche ou de changer de catégorie
              </p>
            </motion.div>
          )}

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12 p-6 bg-muted/30 rounded-2xl"
          >
            <p className="text-muted-foreground">
              {filteredItems.length} fonctionnalité{filteredItems.length > 1 ? 's' : ''} disponible{filteredItems.length > 1 ? 's' : ''}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Toutes les fonctionnalités sont conçues pour votre bien-être émotionnel
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
