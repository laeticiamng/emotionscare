/**
 * NavigationPage - Page de navigation complète vers toutes les fonctionnalités
 * Point central d'accès à TOUTE la plateforme
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, ArrowRight, ExternalLink, Home, Settings, Users,
  Brain, Heart, Music, Camera, Gamepad2, BarChart3, Shield,
  Monitor, Zap, Wind, Palette, Target, Flame, Waves, Star,
  Sparkles, Trophy, FileText, Grid3X3, Play, HelpCircle
} from 'lucide-react';
import { Routes } from '@/routerV2/helpers';
import { cn } from '@/lib/utils';
import PremiumBackground from '@/components/premium/PremiumBackground';
import EnhancedCard from '@/components/premium/EnhancedCard';

interface NavigationItem {
  title: string;
  description: string;
  path: string;
  icon: React.ElementType;
  category: string;
  status: 'active' | 'beta' | 'new';
  priority: 'high' | 'medium' | 'low';
  action: () => void;
}

const NavigationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const navigationItems: NavigationItem[] = [
    // Core Features - Priorité haute
    { title: 'Dashboard Principal', description: 'Centre de contrôle principal avec widgets intelligents', path: '/app/home', icon: Grid3X3, category: 'core', status: 'active', priority: 'high', action: () => navigate(Routes.consumerHome()) },
    { title: 'Scan Émotionnel IA', description: 'Analyse faciale en temps réel avec IA avancée', path: '/app/scan', icon: Brain, category: 'core', status: 'active', priority: 'high', action: () => navigate(Routes.scan()) },
    { title: 'Thérapie Musicale', description: 'Playlists adaptatives et fréquences binaurales', path: '/app/music', icon: Music, category: 'core', status: 'active', priority: 'high', action: () => navigate(Routes.music()) },
    { title: 'Coach IA Empathique', description: 'Assistant personnel disponible 24/7', path: '/app/coach', icon: Sparkles, category: 'core', status: 'active', priority: 'high', action: () => navigate(Routes.coach()) },
    { title: 'Journal Personnel', description: 'Journal intelligent avec insights IA', path: '/app/journal', icon: FileText, category: 'core', status: 'active', priority: 'high', action: () => navigate(Routes.journal()) },
    { title: 'VR Experiences', description: 'Expériences immersives en réalité virtuelle', path: '/app/vr', icon: Monitor, category: 'core', status: 'active', priority: 'high', action: () => navigate(Routes.vr()) },

    // Fun-First Features
    { title: 'Flash Glow Therapy', description: 'Thérapie par lumière pour boost instantané', path: '/app/flash-glow', icon: Zap, category: 'fun', status: 'active', priority: 'medium', action: () => navigate(Routes.flashGlow()) },
    { title: 'Breathwork Guidé', description: 'Techniques de respiration avec feedback', path: '/app/breath', icon: Wind, category: 'fun', status: 'active', priority: 'medium', action: () => navigate(Routes.breath()) },
    { title: 'AR Filters Émotionnels', description: 'Filtres de réalité augmentée interactifs', path: '/app/face-ar', icon: Camera, category: 'fun', status: 'beta', priority: 'medium', action: () => navigate(Routes.faceAR()) },
    { title: 'Bubble Beat Game', description: 'Jeu rythmique thérapeutique', path: '/app/bubble-beat', icon: Waves, category: 'fun', status: 'active', priority: 'medium', action: () => navigate(Routes.bubbleBeat()) },
    { title: 'VR Galaxy Explorer', description: 'Exploration spatiale relaxante', path: '/app/vr-galaxy', icon: Star, category: 'fun', status: 'new', priority: 'medium', action: () => navigate(Routes.vrGalaxy()) },
    { title: 'Boss Level Grit', description: 'Défis de résilience progressive', path: '/app/boss-grit', icon: Target, category: 'fun', status: 'active', priority: 'medium', action: () => navigate(Routes.bossGrit()) },
    { title: 'Mood Mixer Lab', description: 'Laboratoire de mélange émotionnel', path: '/app/mood-mixer', icon: Palette, category: 'fun', status: 'beta', priority: 'medium', action: () => navigate(Routes.moodMixer()) },
    { title: 'Ambition Arcade', description: 'Quêtes personnelles gamifiées', path: '/app/ambition-arcade', icon: Flame, category: 'fun', status: 'active', priority: 'medium', action: () => navigate(Routes.ambitionArcade()) },
    { title: 'Bounce Back Battle', description: 'Récupération émotionnelle rapide', path: '/app/bounce-back', icon: Target, category: 'fun', status: 'active', priority: 'medium', action: () => navigate(Routes.bounceBack()) },
    { title: 'Story Synth Lab', description: 'Création narrative thérapeutique', path: '/app/story-synth', icon: Sparkles, category: 'fun', status: 'new', priority: 'medium', action: () => navigate(Routes.storySynth()) },

    // Social & Analytics
    { title: 'Centre Émotionnel', description: 'Hub central de gestion émotionnelle', path: '/app/emotions', icon: Heart, category: 'social', status: 'active', priority: 'high', action: () => navigate(Routes.emotions()) },
    { title: 'Communauté', description: 'Partage et entraide entre utilisateurs', path: '/app/community', icon: Users, category: 'social', status: 'active', priority: 'medium', action: () => navigate(Routes.community()) },
    { title: 'Social Cocon', description: 'Espaces privés et discussions', path: '/app/social-cocon', icon: Heart, category: 'social', status: 'active', priority: 'medium', action: () => navigate(Routes.socialCoconB2C()) },
    { title: 'Gamification Hub', description: 'Niveaux, badges et défis', path: '/app/leaderboard', icon: Trophy, category: 'social', status: 'active', priority: 'medium', action: () => navigate(Routes.leaderboard()) },
    { title: 'Analytics Activité', description: 'Suivi détaillé de progression', path: '/app/activity', icon: BarChart3, category: 'analytics', status: 'active', priority: 'medium', action: () => navigate(Routes.activity()) },
    { title: 'Heatmap Émotionnelle', description: 'Cartographie des émotions', path: '/app/heatmap', icon: Waves, category: 'analytics', status: 'active', priority: 'medium', action: () => navigate(Routes.heatmap()) },
    { title: 'Journal Vocal IA', description: 'Analyse vocale des émotions', path: '/app/voice-journal', icon: Music, category: 'analytics', status: 'beta', priority: 'medium', action: () => navigate(Routes.voiceJournal()) },
    { title: 'Scan Émotionnel Avancé', description: 'Analyse faciale multi-angle', path: '/app/emotion-scan', icon: Brain, category: 'analytics', status: 'new', priority: 'medium', action: () => navigate(Routes.emotionScan()) },

    // Settings & System
    { title: 'Paramètres Généraux', description: 'Configuration de l\'application', path: '/settings/general', icon: Settings, category: 'settings', status: 'active', priority: 'low', action: () => navigate(Routes.settingsGeneral()) },
    { title: 'Profil Utilisateur', description: 'Gestion des informations personnelles', path: '/settings/profile', icon: Users, category: 'settings', status: 'active', priority: 'low', action: () => navigate(Routes.settingsProfile()) },
    { title: 'Confidentialité', description: 'Contrôles de confidentialité', path: '/settings/privacy', icon: Shield, category: 'settings', status: 'active', priority: 'low', action: () => navigate(Routes.settingsPrivacy()) },
    { title: 'Notifications', description: 'Préférences de notifications', path: '/settings/notifications', icon: Sparkles, category: 'settings', status: 'active', priority: 'low', action: () => navigate(Routes.settingsNotifications()) },
    { title: 'Données RGPD', description: 'Gestion des données personnelles', path: '/settings/data-privacy', icon: Shield, category: 'settings', status: 'active', priority: 'low', action: () => navigate(Routes.settingsDataPrivacy()) },

    // Navigation & Tools
    { title: 'Test Fonctionnalités', description: 'Validation de toutes les features', path: '/feature-matrix', icon: Grid3X3, category: 'tools', status: 'active', priority: 'high', action: () => navigate(Routes.featureMatrix()) },
    { title: 'Page d\'Accueil', description: 'Retour à l\'accueil public', path: '/', icon: Home, category: 'navigation', status: 'active', priority: 'low', action: () => navigate(Routes.home()) },
    { title: 'Aide & Support', description: 'Documentation et assistance', path: '/help', icon: HelpCircle, category: 'navigation', status: 'active', priority: 'low', action: () => navigate(Routes.help()) }
  ];

  const categories = {
    all: { name: 'Toutes', color: 'from-gray-500 to-slate-500' },
    core: { name: 'Core Features', color: 'from-blue-500 to-purple-500' },
    fun: { name: 'Fun-First', color: 'from-purple-500 to-pink-500' },
    social: { name: 'Social', color: 'from-green-500 to-teal-500' },
    analytics: { name: 'Analytics', color: 'from-orange-500 to-red-500' },
    settings: { name: 'Paramètres', color: 'from-gray-500 to-slate-600' },
    tools: { name: 'Outils', color: 'from-cyan-500 to-blue-500' },
    navigation: { name: 'Navigation', color: 'from-indigo-500 to-purple-500' }
  };

  const filteredItems = navigationItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'beta': return 'bg-yellow-100 text-yellow-800';
      case 'new': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <div className="min-h-screen relative" data-testid="page-root">
      <PremiumBackground />
      
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Navigation Complète
          </motion.h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Accès direct à toutes les fonctionnalités de la plateforme EmotionsCare
          </p>
        </div>

        {/* Contrôles de recherche et filtres */}
        <EnhancedCard className="mb-8">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher une fonctionnalité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {Object.entries(categories).map(([key, category]) => (
                <Button
                  key={key}
                  variant={selectedCategory === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(key)}
                  className={cn(
                    "text-xs",
                    selectedCategory === key && `bg-gradient-to-r ${category.color} text-white`
                  )}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </EnhancedCard>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-blue-600">{navigationItems.length}</div>
            <div className="text-sm text-muted-foreground">Fonctionnalités</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-green-600">
              {navigationItems.filter(item => item.status === 'active').length}
            </div>
            <div className="text-sm text-muted-foreground">Actives</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {navigationItems.filter(item => item.status === 'beta').length}
            </div>
            <div className="text-sm text-muted-foreground">Beta</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-purple-600">
              {navigationItems.filter(item => item.status === 'new').length}
            </div>
            <div className="text-sm text-muted-foreground">Nouvelles</div>
          </Card>
        </div>

        {/* Grille des fonctionnalités */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item, index) => {
              const IconComponent = item.icon;
              
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  <Card 
                    className={cn(
                      "h-full cursor-pointer transition-all duration-300 hover:shadow-lg border-l-4",
                      getPriorityColor(item.priority)
                    )}
                    onClick={item.action}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{item.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge 
                                variant="outline" 
                                className={cn("text-xs", getStatusColor(item.status))}
                              >
                                {item.status}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {item.priority}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {item.path}
                        </code>
                        
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            item.action();
                          }}
                        >
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Aucun résultat */}
        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              Aucune fonctionnalité trouvée
            </h3>
            <p className="text-sm text-muted-foreground">
              Essayez de modifier votre recherche ou vos filtres
            </p>
          </motion.div>
        )}

        {/* Actions rapides */}
        <EnhancedCard title="Actions Rapides" className="mt-8">
          <div className="grid md:grid-cols-4 gap-4">
            <Button 
              onClick={() => navigate(Routes.consumerHome())}
              className="h-auto flex-col gap-2 p-6"
            >
              <Grid3X3 className="h-6 w-6" />
              <span>Dashboard</span>
            </Button>
            
            <Button 
              onClick={() => navigate(Routes.scan())}
              variant="outline"
              className="h-auto flex-col gap-2 p-6"
            >
              <Brain className="h-6 w-6" />
              <span>Scan Express</span>
            </Button>
            
            <Button 
              onClick={() => navigate(Routes.featureMatrix())}
              variant="outline"
              className="h-auto flex-col gap-2 p-6"
            >
              <Play className="h-6 w-6" />
              <span>Test Features</span>
            </Button>
            
            <Button 
              onClick={() => navigate(Routes.settingsGeneral())}
              variant="ghost"
              className="h-auto flex-col gap-2 p-6"
            >
              <Settings className="h-6 w-6" />
              <span>Paramètres</span>
            </Button>
          </div>
        </EnhancedCard>
      </div>
    </div>
  );
};

export default NavigationPage;