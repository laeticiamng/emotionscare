/**
 * CompleteNavigationMenu - Menu de navigation complet
 * Accès à toutes les fonctionnalités de la plateforme
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, Grid3X3, Heart, Brain, Music, Gamepad2, Camera,
  Zap, Wind, Palette, Trophy, BarChart3, Settings, Users,
  FileText, Calendar, Shield, Monitor, Headphones, Star,
  Sparkles, Target, Flame, Waves, Filter, ArrowRight,
  CheckCircle, Navigation
} from 'lucide-react';
import { cn } from '@/lib/utils';
import RouteValidator from '@/components/navigation/RouteValidator';

interface NavigationCategory {
  name: string;
  icon: React.ElementType;
  color: string;
  routes: NavigationRoute[];
}

interface NavigationRoute {
  name: string;
  path: string;
  icon: React.ElementType;
  description: string;
  badge?: string;
  premium?: boolean;
}

const navigationCategories: NavigationCategory[] = [
  {
    name: 'Modules Core',
    icon: Heart,
    color: 'from-pink-500 to-red-500',
    routes: [
      { name: 'Dashboard', path: '/app/home', icon: Grid3X3, description: 'Tableau de bord principal' },
      { name: 'Scan Émotionnel', path: '/app/scan', icon: Brain, description: 'Analyse de vos émotions' },
      { name: 'Thérapie Musicale', path: '/app/music', icon: Music, description: 'Musique personnalisée IA', premium: true },
      { name: 'Coach IA', path: '/app/coach', icon: Sparkles, description: 'Assistant empathique', premium: true },
      { name: 'Journal', path: '/app/journal', icon: FileText, description: 'Journal personnel intelligent' },
      { name: 'VR Experiences', path: '/app/vr', icon: Monitor, description: 'Réalité virtuelle immersive' },
    ]
  },
  {
    name: 'Modules Fun-First',
    icon: Gamepad2,
    color: 'from-purple-500 to-indigo-500',
    routes: [
      { name: 'Flash Glow', path: '/app/flash-glow', icon: Zap, description: 'Thérapie lumière rapide' },
      { name: 'Breathwork', path: '/app/breath', icon: Wind, description: 'Techniques de respiration' },
      { name: 'AR Filters', path: '/app/face-ar', icon: Camera, description: 'Filtres émotionnels AR' },
      { name: 'Bubble Beat', path: '/app/bubble-beat', icon: Waves, description: 'Jeu rythmique interactif' },
      { name: 'Screen Silk', path: '/app/screen-silk', icon: Monitor, description: 'Pauses écran thérapeutiques' },
      { name: 'VR Galaxy', path: '/app/vr-galaxy', icon: Star, description: 'Exploration spatiale 3D' },
      { name: 'Boss Level Grit', path: '/app/boss-grit', icon: Target, description: 'Défis de résilience' },
      { name: 'Mood Mixer', path: '/app/mood-mixer', icon: Palette, description: 'Mélangeur d\'émotions' },
    ]
  },
  {
    name: 'Social & Gaming',
    icon: Users,
    color: 'from-green-500 to-teal-500',
    routes: [
      { name: 'Communauté', path: '/app/community', icon: Users, description: 'Partage et entraide' },
      { name: 'Social Cocon', path: '/app/social-cocon', icon: Heart, description: 'Espaces privés' },
      { name: 'Gamification', path: '/app/leaderboard', icon: Trophy, description: 'Niveaux et badges' },
      { name: 'Ambition Arcade', path: '/app/ambition-arcade', icon: Flame, description: 'Quêtes personnelles' },
      { name: 'Bounce Back', path: '/app/bounce-back', icon: Target, description: 'Récupération émotionnelle' },
      { name: 'Story Synth Lab', path: '/app/story-synth', icon: Sparkles, description: 'Création narrative' },
    ]
  },
  {
    name: 'Analytics & Insights',
    icon: BarChart3,
    color: 'from-blue-500 to-cyan-500',
    routes: [
      { name: 'Activité', path: '/app/activity', icon: BarChart3, description: 'Historique détaillé' },
      { name: 'Scores & Vibes', path: '/app/scores', icon: Filter, description: 'Courbes et heatmap émotionnelle' },
      { name: 'Journal Vocal', path: '/app/journal', icon: Headphones, description: 'Journal vocal IA' },
    ]
  },
  {
    name: 'Paramètres',
    icon: Settings,
    color: 'from-gray-500 to-slate-500',
    routes: [
      { name: 'Général', path: '/settings/general', icon: Settings, description: 'Configuration générale' },
      { name: 'Profil', path: '/settings/profile', icon: Users, description: 'Informations personnelles' },
      { name: 'Confidentialité', path: '/settings/privacy', icon: Shield, description: 'Contrôles de confidentialité' },
      { name: 'Notifications', path: '/settings/notifications', icon: Sparkles, description: 'Préférences de notifications' },
      { name: 'Données', path: '/settings/data-privacy', icon: Shield, description: 'Gestion des données' },
    ]
  },
  {
    name: 'Outils de Développement',
    icon: Monitor,
    color: 'from-slate-500 to-gray-500',
    routes: [
      { name: 'Validateur Complet', path: '/validation', icon: CheckCircle, description: 'Test de toutes les routes' },
      { name: 'Navigation Tools', path: '/navigation', icon: Navigation, description: 'Menu complet de navigation' },
      { name: 'Feature Matrix', path: '/feature-matrix', icon: Grid3X3, description: 'Matrice des fonctionnalités' },
    ]
  },
];

export default function CompleteNavigationMenu() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showValidator, setShowValidator] = useState(false);

  // Filtrer les routes selon la recherche
  const filteredCategories = navigationCategories.map(category => ({
    ...category,
    routes: category.routes.filter(route => 
      route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.routes.length > 0);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Navigation Complète
          </motion.h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez toutes les fonctionnalités de votre plateforme EmotionsCare
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher une fonctionnalité..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-lg h-12"
          />
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Modules Core', count: 6, color: 'from-pink-500/20 to-red-500/20' },
            { label: 'Fun-First', count: 7, color: 'from-purple-500/20 to-indigo-500/20' },
            { label: 'Social & Gaming', count: 6, color: 'from-green-500/20 to-teal-500/20' },
            { label: 'Analytics', count: 5, color: 'from-blue-500/20 to-cyan-500/20' },
          ].map((stat, index) => (
            <Card key={index} className={cn("bg-gradient-to-br", stat.color)}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{stat.count}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Catégories et Routes */}
        <div className="space-y-8">
          {filteredCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <Card className="overflow-hidden">
                <CardHeader 
                  className={cn(
                    "cursor-pointer transition-all duration-300 bg-gradient-to-r",
                    category.color,
                    selectedCategory === category.name ? "pb-4" : "pb-4"
                  )}
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.name ? null : category.name
                  )}
                >
                  <CardTitle className="flex items-center gap-3 text-white">
                    <category.icon className="h-6 w-6" />
                    {category.name}
                    <Badge variant="secondary" className="ml-auto">
                      {category.routes.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                
                <AnimatePresence>
                  {(selectedCategory === category.name || !selectedCategory) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {category.routes.map((route, routeIndex) => (
                            <motion.div
                              key={route.path}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: routeIndex * 0.05 }}
                            >
                              <Card 
                                className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-card to-accent/5"
                                onClick={() => handleNavigate(route.path)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-3">
                                    <div className={cn(
                                      "p-2 rounded-lg bg-gradient-to-br",
                                      category.color,
                                      "text-white"
                                    )}>
                                      <route.icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                                          {route.name}
                                        </h3>
                                        {route.premium && (
                                          <Badge variant="secondary" className="text-xs">
                                            Premium
                                          </Badge>
                                        )}
                                        {route.badge && (
                                          <Badge variant="outline" className="text-xs">
                                            {route.badge}
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                        {route.description}
                                      </p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Validator des routes */}
        {showValidator && (
          <div className="space-y-6">
            <RouteValidator />
          </div>
        )}

        {/* Actions rapides */}
        <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Actions Avancées</h3>
              <div className="flex flex-wrap justify-center gap-3">
                <Button 
                  onClick={() => navigate('/app/home')}
                  className="bg-gradient-to-r from-primary to-primary/80"
                >
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button 
                  onClick={() => navigate('/app/scan')}
                  variant="outline"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Scan Express
                </Button>
                <Button 
                  onClick={() => setShowValidator(!showValidator)}
                  variant="ghost"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {showValidator ? 'Masquer' : 'Tester'} Routes
                </Button>
                <Button 
                  onClick={() => navigate('/settings/general')}
                  variant="ghost"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}