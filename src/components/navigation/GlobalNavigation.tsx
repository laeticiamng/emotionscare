import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { OFFICIAL_ROUTES, ROUTES_BY_CATEGORY } from '@/routesManifest';
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
  icon: React.ComponentType<any>;
  description?: string;
}

const GlobalNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const featureRoutes: NavigationItem[] = [
    { title: 'Scanner Émotionnel', route: OFFICIAL_ROUTES.SCAN, icon: Camera, description: 'Analyse IA temps réel' },
    { title: 'Musique Thérapie', route: OFFICIAL_ROUTES.MUSIC, icon: Music, description: 'Musique adaptée' },
    { title: 'Flash Glow', route: OFFICIAL_ROUTES.FLASH_GLOW, icon: Sparkles, description: 'Boost instantané' },
    { title: 'Boss Level Grit', route: OFFICIAL_ROUTES.BOSS_LEVEL_GRIT, icon: Gamepad2, description: 'Défis progressifs' },
    { title: 'Mood Mixer', route: OFFICIAL_ROUTES.MOOD_MIXER, icon: Heart, description: 'Mélange d\'humeurs' },
    { title: 'Bounce Back Battle', route: OFFICIAL_ROUTES.BOUNCE_BACK_BATTLE, icon: Gamepad2, description: 'Résilience gaming' },
    { title: 'Breathwork', route: OFFICIAL_ROUTES.BREATHWORK, icon: Brain, description: 'Respiration guidée' },
    { title: 'Instant Glow', route: OFFICIAL_ROUTES.INSTANT_GLOW, icon: Sparkles, description: '20s de bien-être' },
  ];

  const immersiveRoutes: NavigationItem[] = [
    { title: 'VR Standard', route: OFFICIAL_ROUTES.VR, icon: Glasses, description: 'Réalité virtuelle' },
    { title: 'VR Galactique', route: OFFICIAL_ROUTES.VR_GALACTIQUE, icon: Glasses, description: 'Expérience spatiale' },
    { title: 'Screen Silk Break', route: OFFICIAL_ROUTES.SCREEN_SILK_BREAK, icon: Eye, description: 'Pause écran' },
    { title: 'Story Synth Lab', route: OFFICIAL_ROUTES.STORY_SYNTH_LAB, icon: Brain, description: 'Histoires génératives' },
    { title: 'AR Filters', route: OFFICIAL_ROUTES.AR_FILTERS, icon: Camera, description: 'Réalité augmentée' },
    { title: 'Bubble Beat', route: OFFICIAL_ROUTES.BUBBLE_BEAT, icon: Music, description: 'Jeu musical' },
  ];

  const progressionRoutes: NavigationItem[] = [
    { title: 'Ambition Arcade', route: OFFICIAL_ROUTES.AMBITION_ARCADE, icon: Gamepad2, description: 'Objectifs gamifiés' },
    { title: 'Gamification', route: OFFICIAL_ROUTES.GAMIFICATION, icon: Gamepad2, description: 'Système de points' },
    { title: 'Weekly Bars', route: OFFICIAL_ROUTES.WEEKLY_BARS, icon: Heart, description: 'Progression hebdo' },
    { title: 'Heatmap Vibes', route: OFFICIAL_ROUTES.HEATMAP_VIBES, icon: Brain, description: 'Visualisation données' },
  ];

  const userRoutes: NavigationItem[] = [
    { title: 'Accueil', route: OFFICIAL_ROUTES.HOME, icon: Home, description: 'Page d\'accueil' },
    { title: 'Choisir Mode', route: OFFICIAL_ROUTES.CHOOSE_MODE, icon: User, description: 'Sélection espace' },
    { title: 'Dashboard B2C', route: OFFICIAL_ROUTES.B2C_DASHBOARD, icon: Heart, description: 'Espace personnel' },
    { title: 'Préférences', route: OFFICIAL_ROUTES.PREFERENCES, icon: Settings, description: 'Paramètres utilisateur' },
    { title: 'Cocon Social', route: OFFICIAL_ROUTES.SOCIAL_COCON, icon: Users, description: 'Communauté' },
    { title: 'Profil', route: OFFICIAL_ROUTES.PROFILE_SETTINGS, icon: User, description: 'Gestion profil' },
    { title: 'Historique', route: OFFICIAL_ROUTES.ACTIVITY_HISTORY, icon: Brain, description: 'Activités passées' },
    { title: 'Notifications', route: OFFICIAL_ROUTES.NOTIFICATIONS, icon: Heart, description: 'Alertes système' },
    { title: 'Feedback', route: OFFICIAL_ROUTES.FEEDBACK, icon: Heart, description: 'Vos retours' },
  ];

  const b2bRoutes: NavigationItem[] = [
    { title: 'B2B Accueil', route: OFFICIAL_ROUTES.B2B, icon: Building2, description: 'Espace entreprise' },
    { title: 'Sélection B2B', route: OFFICIAL_ROUTES.B2B_SELECTION, icon: Building2, description: 'Type utilisateur' },
    { title: 'Dashboard User', route: OFFICIAL_ROUTES.B2B_USER_DASHBOARD, icon: Users, description: 'Collaborateur' },
    { title: 'Dashboard Admin', route: OFFICIAL_ROUTES.B2B_ADMIN_DASHBOARD, icon: Shield, description: 'Administration' },
    { title: 'Équipes', route: OFFICIAL_ROUTES.TEAMS, icon: Users, description: 'Gestion équipes' },
    { title: 'Rapports', route: OFFICIAL_ROUTES.REPORTS, icon: Brain, description: 'Analytics' },
    { title: 'Événements', route: OFFICIAL_ROUTES.EVENTS, icon: Heart, description: 'Planning RH' },
    { title: 'Optimisation', route: OFFICIAL_ROUTES.OPTIMISATION, icon: Brain, description: 'IA prédictive' },
    { title: 'Paramètres', route: OFFICIAL_ROUTES.SETTINGS, icon: Settings, description: 'Configuration' },
    { title: 'Sécurité', route: OFFICIAL_ROUTES.SECURITY, icon: Shield, description: 'Protection données' },
    { title: 'Audit', route: OFFICIAL_ROUTES.AUDIT, icon: Shield, description: 'Traçabilité' },
    { title: 'Accessibilité', route: OFFICIAL_ROUTES.ACCESSIBILITY, icon: Heart, description: 'Conformité a11y' },
    { title: 'Innovation', route: OFFICIAL_ROUTES.INNOVATION, icon: Sparkles, description: 'R&D' },
    { title: 'Centre d\'Aide', route: OFFICIAL_ROUTES.HELP_CENTER, icon: Heart, description: 'Support' },
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