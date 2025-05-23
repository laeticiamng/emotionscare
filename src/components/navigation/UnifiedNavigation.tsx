
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Scan, BookOpen, Music, Headphones, MessageSquare, 
  Users, Calendar, Settings, Glasses, HeartHandshake, Trophy, 
  Building, BarChart2, Brain, FileText
} from 'lucide-react';
import { useUserMode } from '@/contexts/UserModeContext';
import NavItemButton from './NavItemButton';
import { b2cNavItems, b2bUserNavItems, b2bAdminNavItems } from './navConfig';

interface UnifiedNavigationProps {
  collapsed?: boolean;
  onItemClick?: () => void;
}

const UnifiedNavigation: React.FC<UnifiedNavigationProps> = ({ collapsed = false, onItemClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userMode } = useUserMode();
  
  // Sélectionner les éléments de navigation en fonction du mode utilisateur
  let navItems = userMode === 'b2b_admin' 
    ? b2bAdminNavItems 
    : userMode === 'b2b_user' 
      ? b2bUserNavItems 
      : b2cNavItems;

  // Si aucun mode n'est détecté, afficher les éléments B2C par défaut
  if (!userMode) {
    navItems = b2cNavItems;
  }

  // Fonction pour gérer l'absence de chemin pour certaines fonctionnalités
  const handleNavigation = (path: string) => {
    // Si l'élément n'a pas encore de page implémentée, afficher un message
    if (path.includes('/coach') || path.includes('/journal') || path.includes('/audio') || 
        path.includes('/music') || path.includes('/cocon') || path.includes('/preferences') ||
        path.includes('/gamification')) {
      
      // Afficher un message indiquant que la fonctionnalité sera disponible prochainement
      alert('Cette fonctionnalité sera disponible prochainement');
      return;
    }
    
    // Sinon, naviguer vers la page
    navigate(path);
    if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <nav className="space-y-2 py-4">
      {navItems.map((item, index) => (
        <NavItemButton
          key={`${item.title}-${index}`}
          label={item.title}
          path={item.href}
          icon={item.icon}
          collapsed={collapsed}
          onClick={() => handleNavigation(item.href)}
          active={location.pathname === item.href || location.pathname.startsWith(item.href + '/')}
        />
      ))}
    </nav>
  );
};

export default UnifiedNavigation;
