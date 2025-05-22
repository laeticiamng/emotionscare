
import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useUserMode } from '@/contexts/UserModeContext';
import {
  BarChart2,
  Calendar,
  Home,
  LayoutDashboard,
  FileText,
  Music,
  Settings,
  Users,
  Star,
  MessageSquare,
  ScanLine,
  Building2,
  Shield,
  User,
  HeartHandshake,
  Lightbulb,
  Goal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface UnifiedNavigationProps {
  collapsed?: boolean;
  onItemClick?: () => void;
}

const UnifiedNavigation: React.FC<UnifiedNavigationProps> = ({ collapsed, onItemClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userMode } = useUserMode();
  const { toast } = useToast();
  
  const handleNavClick = (href: string) => {
    if (onItemClick) {
      onItemClick();
    }
    navigate(href);
  };
  
  // Fonction pour afficher un message "Bientôt disponible"
  const showComingSoon = (feature: string) => {
    toast({
      title: "Fonctionnalité à venir",
      description: `${feature} sera disponible prochainement`,
    });
  };
  
  // Define common navigation items
  const commonItems = [
    { 
      href: '/', 
      label: 'Accueil', 
      icon: <Home size={18} /> 
    },
    { 
      href: '/dashboard', 
      label: 'Tableau de bord', 
      icon: <LayoutDashboard size={18} /> 
    },
    { 
      href: '/events', 
      label: 'Événements', 
      icon: <Calendar size={18} /> 
    },
    { 
      href: '/journal', 
      label: 'Journal', 
      icon: <FileText size={18} /> 
    },
  ];
  
  // Define mode-specific navigation items
  const modeSpecificItems = {
    b2c: [
      { href: '/scan', label: 'Scan', icon: <ScanLine size={18} />, comingSoon: true },
      { href: '/music', label: 'Musique', icon: <Music size={18} />, comingSoon: true },
      { href: '/coach', label: 'Coach', icon: <MessageSquare size={18} /> },
      { href: '/social-cocoon', label: 'Social', icon: <HeartHandshake size={18} /> },
    ],
    b2b_user: [
      { href: '/scan', label: 'Scan', icon: <ScanLine size={18} />, comingSoon: true },
      { href: '/music', label: 'Musique', icon: <Music size={18} />, comingSoon: true },
      { href: '/coach', label: 'Coach', icon: <MessageSquare size={18} /> },
      { href: '/teams', label: 'Équipe', icon: <Users size={18} /> },
      { href: '/social-cocoon', label: 'Social', icon: <HeartHandshake size={18} /> },
      { href: '/gamification', label: 'Défis', icon: <Goal size={18} />, comingSoon: true },
    ],
    b2b_admin: [
      { href: '/reports', label: 'Rapports', icon: <BarChart2 size={18} />, comingSoon: true },
      { href: '/teams', label: 'Équipes', icon: <Users size={18} /> },
      { href: '/optimization', label: 'Optimisation', icon: <Lightbulb size={18} /> },
      { href: '/social-cocoon', label: 'Social', icon: <HeartHandshake size={18} /> },
      { href: '/organization', label: 'Organisation', icon: <Building2 size={18} />, comingSoon: true },
    ]
  };
  
  // Get the correct items based on user mode
  let navigationItems = [...commonItems];
  if (userMode && modeSpecificItems[userMode]) {
    navigationItems = [...navigationItems, ...modeSpecificItems[userMode]];
  } else {
    // Si pas de mode utilisateur spécifique, on met les éléments de base + quelques spécifiques
    navigationItems = [
      ...navigationItems,
      { href: '/coach', label: 'Coach', icon: <MessageSquare size={18} /> },
      { href: '/social-cocoon', label: 'Social', icon: <HeartHandshake size={18} /> },
    ];
  }
  
  // Always add settings at the end
  navigationItems.push({ 
    href: '/settings', 
    label: 'Paramètres', 
    icon: <Settings size={18} />,
    comingSoon: true 
  });
  
  return (
    <nav className="space-y-1 px-2">
      {navigationItems.map((item) => {
        const isActive = location.pathname === item.href;
        
        if (item.comingSoon) {
          return (
            <Button
              key={item.label}
              variant="ghost"
              className={cn(
                "flex items-center w-full justify-start px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-primary",
                collapsed && "justify-center px-0"
              )}
              onClick={() => showComingSoon(item.label)}
            >
              <span className={cn("mr-3", collapsed && "mr-0")}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Button>
          );
        }
        
        return (
          <Button
            key={item.label}
            variant="ghost"
            className={cn(
              "flex items-center w-full justify-start px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-primary",
              collapsed && "justify-center px-0"
            )}
            onClick={() => handleNavClick(item.href)}
          >
            <span className={cn("mr-3", collapsed && "mr-0")}>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </Button>
        );
      })}
    </nav>
  );
};

export default UnifiedNavigation;
