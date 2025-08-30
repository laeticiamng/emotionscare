import React, { useState } from 'react';
import { LucideIconType } from '@/types/common';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Routes } from '@/routerV2';
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
    { title: 'Scanner Émotionnel', route: Routes.scan(), icon: Camera, description: 'Analyse IA temps réel' },
    { title: 'Musique Thérapie', route: Routes.music(), icon: Music, description: 'Musique adaptée' },
    { title: 'Flash Glow', route: Routes.flashGlow(), icon: Sparkles, description: 'Boost instantané' },
    { title: 'Boss Level Grit', route: Routes.bossGrit(), icon: Gamepad2, description: 'Défis progressifs' },
    { title: 'Mood Mixer', route: Routes.moodMixer(), icon: Heart, description: 'Mélange d\'humeurs' },
    { title: 'Bounce Back Battle', route: Routes.bounceBack(), icon: Gamepad2, description: 'Résilience gaming' },
    { title: 'Breathwork', route: Routes.breath(), icon: Brain, description: 'Respiration guidée' },
    { title: 'Coach IA', route: Routes.coach(), icon: Brain, description: 'Assistant personnel' },
  ];

  const immersiveRoutes: NavigationItem[] = [
    { title: 'VR Standard', route: Routes.vr(), icon: Glasses, description: 'Réalité virtuelle' },
    { title: 'VR Galactique', route: Routes.vrGalaxy(), icon: Glasses, description: 'Expérience spatiale' },
    { title: 'Screen Silk Break', route: Routes.screenSilk(), icon: Eye, description: 'Pause écran' },
    { title: 'Story Synth Lab', route: Routes.storySynth(), icon: Brain, description: 'Histoires génératives' },
    { title: 'AR Filters', route: Routes.faceAR(), icon: Camera, description: 'Réalité augmentée' },
    { title: 'Bubble Beat', route: Routes.bubbleBeat(), icon: Music, description: 'Jeu musical' },
  ];

  const progressionRoutes: NavigationItem[] = [
    { title: 'Ambition Arcade', route: Routes.ambitionArcade(), icon: Gamepad2, description: 'Objectifs gamifiés' },
    { title: 'Gamification', route: Routes.leaderboard(), icon: Gamepad2, description: 'Système de points' },
    { title: 'Weekly Bars', route: Routes.activity(), icon: Heart, description: 'Progression hebdo' },
    { title: 'Heatmap Vibes', route: Routes.heatmap(), icon: Brain, description: 'Visualisation données' },
  ];

  const userRoutes: NavigationItem[] = [
    { title: 'Accueil', route: Routes.home(), icon: Home, description: 'Page d\'accueil' },
    { title: 'Choisir Mode', route: Routes.b2cLanding(), icon: User, description: 'Sélection espace' },
    { title: 'Dashboard B2C', route: Routes.consumerHome(), icon: Heart, description: 'Espace personnel' },
    { title: 'Préférences', route: Routes.settingsGeneral(), icon: Settings, description: 'Paramètres utilisateur' },
    { title: 'Cocon Social', route: Routes.socialCocon(), icon: Users, description: 'Communauté' },
    { title: 'Profil', route: Routes.settingsProfile(), icon: User, description: 'Gestion profil' },
    { title: 'Journal', route: Routes.journal(), icon: Brain, description: 'Journal personnel' },
    { title: 'Notifications', route: Routes.settingsNotifications(), icon: Heart, description: 'Alertes système' },
  ];

  const b2bRoutes: NavigationItem[] = [
    { title: 'B2B Accueil', route: Routes.b2bLanding(), icon: Building2, description: 'Espace entreprise' },
    { title: 'Dashboard User', route: Routes.employeeHome(), icon: Users, description: 'Collaborateur' },
    { title: 'Dashboard Admin', route: Routes.managerHome(), icon: Shield, description: 'Administration' },
    { title: 'Équipes', route: Routes.teams(), icon: Users, description: 'Gestion équipes' },
    { title: 'Rapports', route: Routes.adminReports(), icon: Brain, description: 'Analytics' },
    { title: 'Événements', route: Routes.adminEvents(), icon: Heart, description: 'Planning RH' },
    { title: 'Optimisation', route: Routes.adminOptimization(), icon: Brain, description: 'IA prédictive' },
    { title: 'Paramètres', route: Routes.settingsGeneral(), icon: Settings, description: 'Configuration' },
    { title: 'Sécurité', route: Routes.adminSecurity(), icon: Shield, description: 'Protection données' },
    { title: 'Audit', route: Routes.adminAudit(), icon: Shield, description: 'Traçabilité' },
    { title: 'Accessibilité', route: Routes.adminAccessibility(), icon: Heart, description: 'Conformité a11y' },
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