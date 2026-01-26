// @ts-nocheck
/**
 * RoleBasedNavigation - Navigation adaptée selon le rôle utilisateur
 * Séparation stricte B2C/B2B selon les spécifications
 */

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Users, 
  Shield, 
  Home, 
  Briefcase, 
  BarChart3,
  Music,
  Mic,
  Camera,
  Sparkles,
  MessageSquare,
  Settings,
  Building,
  Calendar,
  TrendingUp,
  Activity,
  HelpCircle
} from 'lucide-react';

interface NavigationItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  badge?: string;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

const RoleBasedNavigation: React.FC = () => {
  const { user } = useAuth();
  const { userMode } = useUserMode();
  const location = useLocation();

  // Déterminer le rôle actuel
  const currentRole = user?.role || userMode;

  const isActive = (path: string) => location.pathname === path;

  // Navigation B2C (Particuliers)
  const b2cNavigation: NavigationSection[] = [
    {
      title: "Espace Personnel",
      items: [
        { label: "Accueil", path: "/app/home", icon: Home, description: "Tableau de bord principal" },
        { label: "Scan Émotionnel", path: "/app/scan", icon: Camera, description: "Analysez vos émotions" },
        { label: "Musicothérapie", path: "/app/music", icon: Music, description: "Sons adaptatifs" },
        { label: "Journal Vocal", path: "/app/journal", icon: Mic, description: "Exprimez-vous librement" },
        { label: "Flash Glow", path: "/app/flash-glow", icon: Sparkles, description: "Boost énergétique" },
      ]
    },
    {
      title: "Social B2C",
      items: [
        { label: "Réseau Social", path: "/app/social-b2c", icon: Users, description: "Communauté particuliers", badge: "Exclusif" },
      ]
    },
    {
      title: "Compte",
      items: [
        { label: "Profil", path: "/settings/profile", icon: User },
        { label: "Paramètres", path: "/settings/general", icon: Settings },
        { label: "Aide", path: "/faq", icon: HelpCircle },
      ]
    }
  ];

  // Navigation B2B User (Collaborateurs)
  const b2bUserNavigation: NavigationSection[] = [
    {
      title: "Accueil Collaborateur",
      items: [
        { label: "Dashboard Collab", path: "/app/collab", icon: Briefcase, description: "Espace collaborateur" },
      ]
    },
    {
      title: "Espace Personnel",
      items: [
        { label: "Scan Émotionnel", path: "/app/scan", icon: Camera, description: "100% privé" },
        { label: "Musicothérapie", path: "/app/music", icon: Music, description: "Sons adaptatifs" },
        { label: "Journal Vocal", path: "/app/journal", icon: Mic, description: "Chiffré bout-en-bout" },
        { label: "Flash Glow", path: "/app/flash-glow", icon: Sparkles, description: "Boost énergétique" },
      ]
    },
    {
      title: "Collaboratif",
      items: [
        { label: "Social Cocon", path: "/app/social-cocon", icon: MessageSquare, description: "Entreprise uniquement" },
        { label: "Équipes", path: "/app/teams", icon: Building, description: "Mes équipes" },
      ]
    },
    {
      title: "Compte",
      items: [
        { label: "Profil", path: "/settings/profile", icon: User },
        { label: "Paramètres", path: "/settings/general", icon: Settings },
        { label: "Aide", path: "/faq", icon: HelpCircle },
      ]
    }
  ];

  // Navigation B2B Admin/RH (Managers)
  const b2bAdminNavigation: NavigationSection[] = [
    {
      title: "Accueil Manager",
      items: [
        { label: "Dashboard RH", path: "/app/rh", icon: Shield, description: "Vision complète" },
      ]
    },
    {
      title: "Espace Personnel",
      items: [
        { label: "Scan Émotionnel", path: "/app/scan", icon: Camera, description: "100% privé" },
        { label: "Musicothérapie", path: "/app/music", icon: Music, description: "Sons adaptatifs" },
        { label: "Journal Vocal", path: "/app/journal", icon: Mic, description: "Chiffré bout-en-bout" },
        { label: "Flash Glow", path: "/app/flash-glow", icon: Sparkles, description: "Boost énergétique" },
      ]
    },
    {
      title: "Collaboratif",
      items: [
        { label: "Social Cocon", path: "/app/social-cocon", icon: MessageSquare, description: "Modération" },
        { label: "Équipes", path: "/app/teams", icon: Building, description: "Gestion équipes" },
      ]
    },
    {
      title: "Outils RH",
      items: [
        { label: "Gestion des Rôles", path: "/admin/user-roles", icon: Shield, description: "Attribution rôles" },
        { label: "Rapports", path: "/app/reports", icon: BarChart3, description: "Données anonymisées" },
        { label: "Événements", path: "/app/events", icon: Calendar, description: "Organisation" },
        { label: "Optimisation", path: "/app/optimization", icon: TrendingUp, description: "Amélioration continue" },
        { label: "Analytics", path: "/app/analytics", icon: Activity, description: "Métriques avancées" },
      ]
    },
    {
      title: "Compte",
      items: [
        { label: "Profil", path: "/settings/profile", icon: User },
        { label: "Paramètres", path: "/settings/general", icon: Settings },
        { label: "Aide", path: "/faq", icon: HelpCircle },
      ]
    }
  ];

  // Déterminer la navigation à afficher
  let navigation: NavigationSection[] = [];
  let roleLabel = "Non défini";
  let roleIcon = User;
  let roleColor = "default";

  switch (currentRole) {
    case 'b2c':
    case 'consumer':
      navigation = b2cNavigation;
      roleLabel = "Particulier";
      roleIcon = User;
      roleColor = "default";
      break;
    case 'b2b_user':
    case 'employee':
      navigation = b2bUserNavigation;
      roleLabel = "Collaborateur";
      roleIcon = Briefcase;
      roleColor = "secondary";
      break;
    case 'b2b_admin':
    case 'manager':
      navigation = b2bAdminNavigation;
      roleLabel = "Manager RH";
      roleIcon = Shield;
      roleColor = "outline";
      break;
    default:
      navigation = b2cNavigation; // Par défaut
  }

  const RoleIcon = roleIcon;

  return (
    <nav className="w-64 bg-card border-r h-full overflow-y-auto">
      <div className="p-4">
        {/* Role Badge */}
        <div className="mb-6">
          <Badge variant={roleColor as any} className="flex items-center gap-2 w-full justify-center py-2">
            <RoleIcon className="h-4 w-4" />
            {roleLabel}
          </Badge>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-6">
          {navigation.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  
                  return (
                    <Link key={itemIndex} to={item.path}>
                      <Button
                        variant={active ? "secondary" : "ghost"}
                        className={`w-full justify-start gap-3 h-auto py-3 px-3 ${
                          active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{item.label}</span>
                            {item.badge && (
                              <Badge variant="outline" className="text-xs">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          {item.description && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </Button>
                    </Link>
                  );
                })}
              </div>
              {sectionIndex < navigation.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-8 p-3 bg-muted/50 rounded-lg">
          <div className="text-xs text-muted-foreground">
            <div className="font-medium mb-1">Confidentialité</div>
            {currentRole === 'b2c' || currentRole === 'consumer' ? (
              <div>Vos données personnelles restent 100% privées.</div>
            ) : (
              <div>Données entreprise anonymisées selon RGPD.</div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default RoleBasedNavigation;