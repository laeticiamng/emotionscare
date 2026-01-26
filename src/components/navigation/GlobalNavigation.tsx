// @ts-nocheck
import React from 'react';
import { LucideIconType } from '@/types/common';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { routes } from '@/routerV2';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Menu,
  Brain,
  Music,
  Camera,
  Heart,
  Users,
  Building2,
  Shield,
  Home,
  User,
  Settings,
  Gamepad2,
  Glasses,
  Sparkles,
  Eye
} from 'lucide-react';

interface NavigationItem {
  title: string;
  route: string;
  icon: LucideIconType;
  description?: string;
}

const GlobalNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const featureRoutes: NavigationItem[] = [
    { title: 'Scanner Émotionnel', route: routes.b2c.scan(), icon: Camera, description: 'Analyse IA temps réel' },
    { title: 'Musique Thérapie', route: routes.b2c.music(), icon: Music, description: 'Musique adaptée' },
    { title: 'Flash Glow', route: routes.b2c.flashGlow(), icon: Sparkles, description: 'Boost instantané' },
    { title: 'Boss Level Grit', route: routes.b2c.bossLevel(), icon: Gamepad2, description: 'Défis progressifs' },
    { title: 'Mood Mixer', route: routes.b2c.moodMixer(), icon: Heart, description: 'Mélange d\'humeurs' },
    { title: 'Bounce Back Battle', route: routes.b2c.bounceBackBattle(), icon: Gamepad2, description: 'Résilience gaming' },
    { title: 'Breathwork', route: routes.b2c.breathwork(), icon: Brain, description: 'Respiration guidée' },
    { title: 'Coach IA', route: routes.b2c.coach(), icon: Brain, description: 'Assistant personnel' },
  ];

  const immersiveRoutes: NavigationItem[] = [
    { title: 'VR Standard', route: routes.b2c.vr(), icon: Glasses, description: 'Réalité virtuelle' },
    { title: 'VR Galactique', route: routes.b2c.vr(), icon: Glasses, description: 'Expérience spatiale' },
    { title: 'Screen Silk Break', route: routes.b2c.arFilters(), icon: Eye, description: 'Pause écran' },
    { title: 'Story Synth Lab', route: routes.b2c.arFilters(), icon: Brain, description: 'Histoires génératives' },
    { title: 'AR Filters', route: routes.b2c.arFilters(), icon: Camera, description: 'Réalité augmentée' },
    { title: 'Bubble Beat', route: routes.b2c.bubbleBeat(), icon: Music, description: 'Jeu musical' },
  ];

  const progressionRoutes: NavigationItem[] = [
    { title: 'Ambition Arcade', route: routes.b2c.bossLevel(), icon: Gamepad2, description: 'Objectifs gamifiés' },
    { title: 'Gamification', route: routes.b2c.bossLevel(), icon: Gamepad2, description: 'Système de points' },
    { title: 'Weekly Bars', route: routes.b2c.activity(), icon: Heart, description: 'Progression hebdo' },
    { title: 'Scores & vibes', route: routes.b2c.heatmap(), icon: Brain, description: 'Visualisation des humeurs' },
  ];

  const userRoutes: NavigationItem[] = [
    { title: 'Accueil', route: routes.public.home(), icon: Home, description: 'Page d\'accueil' },
    { title: 'Choisir Mode', route: routes.b2c.home(), icon: User, description: 'Sélection espace' },
    { title: 'Dashboard B2C', route: routes.b2c.dashboard(), icon: Heart, description: 'Espace personnel' },
    { title: 'Préférences', route: routes.b2c.settings(), icon: Settings, description: 'Paramètres utilisateur' },
    { title: 'Cocon Social', route: routes.b2c.community(), icon: Users, description: 'Communauté' },
    { title: 'Profil', route: routes.b2c.profile(), icon: User, description: 'Gestion profil' },
    { title: 'Journal', route: routes.b2c.journal(), icon: Brain, description: 'Journal personnel' },
    { title: 'Notifications', route: routes.b2c.notifications(), icon: Heart, description: 'Alertes système' },
  ];

  const b2bRoutes: NavigationItem[] = [
    { title: 'B2B Accueil', route: routes.b2b.home(), icon: Building2, description: 'Espace entreprise' },
    { title: 'Dashboard User', route: routes.b2b.user.dashboard(), icon: Users, description: 'Collaborateur' },
    { title: 'Dashboard Admin', route: routes.b2b.admin.dashboard(), icon: Shield, description: 'Administration' },
    { title: 'Équipes', route: routes.b2b.teams(), icon: Users, description: 'Gestion équipes' },
    { title: 'Rapports', route: routes.b2b.reports(), icon: Brain, description: 'Analytics' },
    { title: 'Événements', route: routes.b2b.events(), icon: Heart, description: 'Planning RH' },
    { title: 'Optimisation', route: routes.b2b.admin.analytics(), icon: Brain, description: 'IA prédictive' },
    { title: 'Paramètres', route: routes.b2c.settings(), icon: Settings, description: 'Configuration' },
    { title: 'Sécurité', route: routes.b2b.admin.settings(), icon: Shield, description: 'Protection données' },
    { title: 'Audit', route: routes.b2b.admin.analytics(), icon: Shield, description: 'Traçabilité' },
    { title: 'Accessibilité', route: routes.b2b.admin.settings(), icon: Heart, description: 'Conformité a11y' },
  ];

  const renderMenuItem = (item: NavigationItem) => (
    <DropdownMenuItem
      key={item.route}
      onClick={() => navigate(item.route)}
      className={`cursor-pointer ${location.pathname === item.route ? 'bg-primary/10' : ''}`}
    >
      <item.icon className="mr-2 h-4 w-4" />
      <div className="flex flex-col">
        <span className="font-medium">{item.title}</span>
        {item.description && (
          <span className="text-xs text-muted-foreground">{item.description}</span>
        )}
      </div>
    </DropdownMenuItem>
  );

  return (
    <div className="fixed top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="bg-background/80 backdrop-blur-md border-primary/20 hover:bg-primary/5"
            aria-label="Menu de navigation global - Accès à toutes les pages"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-80 max-h-96 overflow-y-auto bg-background/95 backdrop-blur-md"
          align="end"
        >
          <DropdownMenuLabel className="text-lg font-bold">
            Navigation EmotionsCare
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuLabel className="text-sm text-primary">
            🎯 Fonctionnalités Principales
          </DropdownMenuLabel>
          {featureRoutes.map(renderMenuItem)}
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-sm text-primary">
            🌍 Expériences Immersives
          </DropdownMenuLabel>
          {immersiveRoutes.map(renderMenuItem)}
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-sm text-primary">
            🚀 Ambition & Progression
          </DropdownMenuLabel>
          {progressionRoutes.map(renderMenuItem)}
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-sm text-primary">
            👤 Espaces Utilisateur
          </DropdownMenuLabel>
          {userRoutes.map(renderMenuItem)}
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-sm text-primary">
            🏢 Espaces Entreprise
          </DropdownMenuLabel>
          {b2bRoutes.map(renderMenuItem)}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default GlobalNavigation;