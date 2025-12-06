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
  icon: React.ElementType;
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
      route: '/',
      category: 'Accueil'
    },
    
    // Thérapies & Bien-être
    {
      id: 'emotion-scan',
      title: 'Scan Émotionnel',
      description: 'Analyse IA de votre état émotionnel',
      icon: Brain,
      route: '/scan',
      category: 'Thérapies',
      premium: true,
      hot: true,
      subItems: [
        { title: 'Nouveau Scan', route: '/scan/new', description: 'Démarrer une analyse' },
        { title: 'Historique', route: '/scan/history', description: 'Vos analyses passées' },
        { title: 'Tendances', route: '/scan/trends', description: 'Évolution émotionnelle' },
        { title: 'Rapports', route: '/scan/reports', description: 'Analyses détaillées' },
        { title: 'Paramètres', route: '/scan/settings', description: 'Configuration du scan' }
      ]
    },
    {
      id: 'music-therapy',
      title: 'Musicothérapie',
      description: 'Thérapie musicale personnalisée',
      icon: Music,
      route: '/music',
      category: 'Thérapies',
      premium: true,
      subItems: [
        { title: 'Générateur IA', route: '/music/generator', description: 'Créer votre musique' },
        { title: 'Bibliothèque', route: '/music/library', description: 'Vos compositions' },
        { title: 'Playlists', route: '/music/playlists', description: 'Collections thématiques' },
        { title: 'Sessions Live', route: '/music/live', description: 'Écoute en temps réel' },
        { title: 'Préférences', route: '/music/preferences', description: 'Styles et humeurs' }
      ]
    },
    {
      id: 'breathwork',
      title: 'Respiration',
      description: 'Exercices de respiration guidés',
      icon: Wind,
      route: '/breathwork',
      category: 'Thérapies',
      subItems: [
        { title: 'Exercices', route: '/breathwork/exercises', description: 'Techniques guidées' },
        { title: 'Programmes', route: '/breathwork/programs', description: 'Plans personnalisés' },
        { title: 'Sessions', route: '/breathwork/sessions', description: 'Historique des séances' },
        { title: 'Défis', route: '/breathwork/challenges', description: 'Objectifs respiratoires' }
      ]
    },

    // Expériences Immersives
    {
      id: 'vr-hub',
      title: 'VR Galactique',
      description: 'Expériences de réalité virtuelle',
      icon: Headset,
      route: '/vr',
      category: 'Immersif',
      premium: true,
      new: true,
      subItems: [
        { title: 'Hub VR', route: '/vr/hub', description: 'Centre des expériences' },
        { title: 'Galaxie Zen', route: '/vr/zen-galaxy', description: 'Méditation spatiale' },
        { title: 'Forêt Mystique', route: '/vr/forest', description: 'Nature immersive' },
        { title: 'Océan Profond', route: '/vr/ocean', description: 'Plongée relaxante' },
        { title: 'Mes Sessions', route: '/vr/sessions', description: 'Historique VR' }
      ]
    },
    {
      id: 'ar-filters',
      title: 'Filtres AR',
      description: 'Réalité augmentée émotionnelle',
      icon: Camera,
      route: '/ar-filters',
      category: 'Immersif',
      new: true,
      subItems: [
        { title: 'Studio AR', route: '/ar/studio', description: 'Créer vos filtres' },
        { title: 'Collection', route: '/ar/collection', description: 'Vos créations' },
        { title: 'Communauté', route: '/ar/community', description: 'Partage et découverte' },
        { title: 'Défis', route: '/ar/challenges', description: 'Concours créatifs' }
      ]
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
        { title: 'Mes Quêtes', route: '/gamification/quests', description: 'Défis personnels' },
        { title: 'Achievements', route: '/gamification/achievements', description: 'Succès débloqués' },
        { title: 'Classements', route: '/gamification/leaderboard', description: 'Compétition amicale' },
        { title: 'Récompenses', route: '/gamification/rewards', description: 'Badges et prix' }
      ]
    },

    // Communication & Social
    {
      id: 'ai-coach',
      title: 'Coach IA',
      description: 'Assistant personnel intelligent',
      icon: MessageCircle,
      route: '/coach',
      category: 'Social',
      premium: true,
      subItems: [
        { title: 'Chat IA', route: '/coach/chat', description: 'Conversation en temps réel' },
        { title: 'Plans Personnalisés', route: '/coach/plans', description: 'Programmes adaptés' },
        { title: 'Objectifs', route: '/coach/goals', description: 'Suivi des progrès' },
        { title: 'Ressources', route: '/coach/resources', description: 'Guides et conseils' },
        { title: 'Historique', route: '/coach/history', description: 'Conversations passées' }
      ]
    },
    {
      id: 'community',
      title: 'Communauté',
      description: 'Espace de partage et entraide',
      icon: Users,
      route: '/community',
      category: 'Social',
      subItems: [
        { title: 'Feed', route: '/community/feed', description: 'Actualités communautaires' },
        { title: 'Groupes', route: '/community/groups', description: 'Communautés thématiques' },
        { title: 'Événements', route: '/community/events', description: 'Rencontres et ateliers' },
        { title: 'Messages', route: '/community/messages', description: 'Conversations privées' },
        { title: 'Buddy System', route: '/community/buddies', description: 'Partenaires de bien-être' }
      ]
    },

    // Suivi & Analytics
    {
      id: 'journal',
      title: 'Journal',
      description: 'Carnet de bord émotionnel',
      icon: BookOpen,
      route: '/journal',
      category: 'Suivi',
      subItems: [
        { title: 'Nouvelle Entrée', route: '/journal/new', description: 'Écrire aujourd\'hui' },
        { title: 'Mes Entrées', route: '/journal/entries', description: 'Historique complet' },
        { title: 'Insights IA', route: '/journal/insights', description: 'Analyses automatiques' },
        { title: 'Modèles', route: '/journal/templates', description: 'Structures guidées' },
        { title: 'Export', route: '/journal/export', description: 'Sauvegarder vos données' }
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Tableaux de bord et métriques',
      icon: BarChart3,
      route: '/analytics',
      category: 'Suivi',
      premium: true,
      subItems: [
        { title: 'Dashboard', route: '/analytics/dashboard', description: 'Vue d\'ensemble' },
        { title: 'Tendances', route: '/analytics/trends', description: 'Évolution temporelle' },
        { title: 'Rapports', route: '/analytics/reports', description: 'Analyses détaillées' },
        { title: 'Corrélations', route: '/analytics/correlations', description: 'Liens entre données' },
        { title: 'Prédictions', route: '/analytics/predictions', description: 'IA prédictive' }
      ]
    },
    {
      id: 'progress',
      title: 'Progrès',
      description: 'Suivi de votre évolution',
      icon: TrendingUp,
      route: '/progress',
      category: 'Suivi',
      subItems: [
        { title: 'Objectifs', route: '/progress/goals', description: 'Définir vos cibles' },
        { title: 'Milestones', route: '/progress/milestones', description: 'Étapes importantes' },
        { title: 'Streaks', route: '/progress/streaks', description: 'Séries consécutives' },
        { title: 'Achievements', route: '/progress/achievements', description: 'Succès débloqués' }
      ]
    },

    // Configuration
    {
      id: 'settings',
      title: 'Paramètres',
      description: 'Configuration personnelle',
      icon: Settings,
      route: '/settings',
      category: 'Configuration',
      subItems: [
        { title: 'Profil', route: '/settings/profile', description: 'Informations personnelles' },
        { title: 'Notifications', route: '/settings/notifications', description: 'Alertes et rappels' },
        { title: 'Confidentialité', route: '/settings/privacy', description: 'Protection des données' },
        { title: 'Accessibilité', route: '/settings/accessibility', description: 'Options d\'accessibilité' },
        { title: 'Intégrations', route: '/settings/integrations', description: 'Apps tierces' },
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