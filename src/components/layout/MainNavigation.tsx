// @ts-nocheck
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain, Music, MessageCircle, BookOpen, Headset, Wind, Users, BarChart3,
  Settings, Home, Calendar, Target, Heart, Zap, Play, Globe, Shield,
  TrendingUp, Award, Sparkles, Activity, Camera, Gamepad2, Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface NavigationItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  category: string;
  premium?: boolean;
  new?: boolean;
  hot?: boolean;
  subItems?: Array<{
    title: string;
    route: string;
    description?: string;
  }>;
}

export const MainNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      title: 'Accueil',
      description: 'Tableau de bord principal',
      icon: Home,
      route: '/app/consumer/home',
      category: 'Accueil'
    },
    
    // Thérapies & Bien-être
    {
      id: 'emotion-scan',
      title: 'Scan Émotionnel',
      description: 'Analyse IA de votre état émotionnel',
      icon: Brain,
      route: '/app/scan',
      category: 'Thérapies',
      premium: true,
      hot: true,
      subItems: [
        { title: 'Scan Facial', route: '/app/scan/facial', description: 'Analyse faciale' },
        { title: 'Scan Vocal', route: '/app/scan/voice', description: 'Analyse vocale' },
        { title: 'Scan Texte', route: '/app/scan/text', description: 'Analyse textuelle' },
      ]
    },
    {
      id: 'music-therapy',
      title: 'Musicothérapie',
      description: 'Thérapie musicale personnalisée',
      icon: Music,
      route: '/app/music',
      category: 'Thérapies',
      premium: true,
      subItems: [
        { title: 'Analytics Musique', route: '/app/music/analytics', description: 'Vos statistiques' },
        { title: 'Profil Musical', route: '/app/music/profile', description: 'Vos préférences' },
        { title: 'Premium', route: '/app/music-premium', description: 'Fonctionnalités avancées' },
      ]
    },
    {
      id: 'breathwork',
      title: 'Respiration',
      description: 'Exercices de respiration guidés',
      icon: Wind,
      route: '/app/breath',
      category: 'Thérapies',
    },

    // Expériences Immersives
    {
      id: 'vr-hub',
      title: 'VR Galactique',
      description: 'Expériences de réalité virtuelle',
      icon: Headset,
      route: '/app/vr',
      category: 'Immersif',
      premium: true,
      new: true,
      subItems: [
        { title: 'VR Galaxie', route: '/app/vr-galaxy', description: 'Voyage spatial' },
        { title: 'VR Respiration', route: '/app/vr-breath-guide', description: 'Respiration guidée' },
      ]
    },
    {
      id: 'ar-filters',
      title: 'Filtres AR',
      description: 'Réalité augmentée émotionnelle',
      icon: Camera,
      route: '/app/face-ar',
      category: 'Immersif',
      new: true,
    },
    {
      id: 'gamification',
      title: 'Gamification',
      description: 'Objectifs et récompenses',
      icon: Gamepad2,
      route: '/gamification',
      category: 'Immersif',
      hot: true,
      subItems: [
        { title: 'Classement', route: '/app/leaderboard', description: 'Compétition amicale' },
        { title: 'Défis', route: '/app/daily-challenges', description: 'Défis quotidiens' },
        { title: 'Récompenses', route: '/app/rewards', description: 'Badges et prix' },
        { title: 'Badges', route: '/app/badges', description: 'Vos succès' }
      ]
    },

    // Communication & Social
    {
      id: 'ai-coach',
      title: 'Coach IA',
      description: 'Assistant personnel intelligent',
      icon: MessageCircle,
      route: '/app/coach',
      category: 'Social',
      premium: true,
      subItems: [
        { title: 'Micro-Coach', route: '/app/coach-micro', description: 'Coaching rapide' },
        { title: 'Programmes', route: '/app/coach/programs', description: 'Plans personnalisés' },
        { title: 'Sessions', route: '/app/coach/sessions', description: 'Historique' },
      ]
    },
    {
      id: 'community',
      title: 'Communauté',
      description: 'Espace de partage et entraide',
      icon: Users,
      route: '/app/community',
      category: 'Social',
      subItems: [
        { title: 'Social Cocon', route: '/app/social-cocon', description: 'Espace bienveillant' },
      ]
    },

    // Suivi & Analytics
    {
      id: 'journal',
      title: 'Journal',
      description: 'Carnet de bord émotionnel',
      icon: BookOpen,
      route: '/app/journal',
      category: 'Suivi',
      subItems: [
        { title: 'Nouvelle Entrée', route: '/app/journal-new', description: 'Écrire aujourd\'hui' },
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Tableaux de bord et métriques',
      icon: BarChart3,
      route: '/app/analytics',
      category: 'Suivi',
      premium: true,
      subItems: [
        { title: 'Weekly Bars', route: '/app/weekly-bars', description: 'Progression hebdo' },
        { title: 'Insights', route: '/app/insights', description: 'Analyses IA' },
        { title: 'Tendances', route: '/app/trends', description: 'Évolution temporelle' },
      ]
    },
    {
      id: 'progress',
      title: 'Progrès',
      description: 'Suivi de votre évolution',
      icon: TrendingUp,
      route: '/app/activity',
      category: 'Suivi',
      subItems: [
        { title: 'Objectifs', route: '/app/goals', description: 'Définir vos cibles' },
        { title: 'Sessions', route: '/app/sessions', description: 'Historique sessions' },
        { title: 'Achievements', route: '/app/achievements', description: 'Succès débloqués' }
      ]
    },

    // Configuration
    {
      id: 'settings',
      title: 'Paramètres',
      description: 'Configuration personnelle',
      icon: Settings,
      route: '/settings/general',
      category: 'Configuration',
      subItems: [
        { title: 'Profil', route: '/settings/profile', description: 'Informations personnelles' },
        { title: 'Notifications', route: '/settings/notifications', description: 'Alertes et rappels' },
        { title: 'Confidentialité', route: '/settings/privacy', description: 'Protection des données' },
        { title: 'Accessibilité', route: '/settings/accessibility', description: 'Options d\'accessibilité' },
        { title: 'Langue', route: '/settings/language', description: 'Langue de l\'application' },
        { title: 'Sécurité', route: '/settings/security', description: 'Authentification et sécurité' }
      ]
    }
  ];

  const groupedItems = navigationItems.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as Record<string, NavigationItem[]>);

  const isActive = (route: string) => {
    return location.pathname === route || location.pathname.startsWith(route + '/');
  };

  return (
    <div className="w-full space-y-6 p-6">
      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={category} className="space-y-3">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-foreground">{category}</h3>
            <Separator className="flex-1" />
          </div>
          
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => navigate(item.route)}
                  variant={isActive(item.route) ? 'default' : 'outline'}
                  className={cn(
                    'w-full h-auto p-4 justify-start flex-col items-start space-y-2',
                    isActive(item.route) && 'bg-primary text-primary-foreground'
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {item.premium && (
                        <Badge variant="secondary" className="text-xs">
                          Premium
                        </Badge>
                      )}
                      {item.new && (
                        <Badge variant="destructive" className="text-xs">
                          Nouveau
                        </Badge>
                      )}
                      {item.hot && (
                        <Badge className="text-xs bg-orange-500 hover:bg-orange-600">
                          🔥 Populaire
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground text-left">
                    {item.description}
                  </p>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MainNavigation;