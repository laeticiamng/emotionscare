
import React from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';
import { ROUTES } from '@/types/navigation';
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
  Lightbulb
} from 'lucide-react';

interface UnifiedNavigationProps {
  collapsed: boolean;
}

const UnifiedNavigation: React.FC<UnifiedNavigationProps> = ({ collapsed }) => {
  const location = useLocation();
  const { userMode } = useUserMode();
  
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
  ];
  
  // Define mode-specific navigation items
  const modeSpecificItems = {
    b2c: [
      { href: '/b2c/journal', label: 'Journal', icon: <FileText size={18} /> },
      { href: '/b2c/scan', label: 'Scan', icon: <ScanLine size={18} /> },
      { href: '/b2c/music', label: 'Musique', icon: <Music size={18} /> },
      { href: '/b2c/coach', label: 'Coach', icon: <MessageSquare size={18} /> },
    ],
    b2b_user: [
      { href: '/b2b/user/journal', label: 'Journal', icon: <FileText size={18} /> },
      { href: '/b2b/user/scan', label: 'Scan', icon: <ScanLine size={18} /> },
      { href: '/b2b/user/music', label: 'Musique', icon: <Music size={18} /> },
      { href: '/b2b/user/coach', label: 'Coach', icon: <MessageSquare size={18} /> },
      { href: '/teams', label: 'Équipe', icon: <Users size={18} /> },
    ],
    b2b_admin: [
      { href: '/b2b/admin/reports', label: 'Rapports', icon: <BarChart2 size={18} /> },
      { href: '/teams', label: 'Équipes', icon: <Users size={18} /> },
      { href: '/optimization', label: 'Optimisation', icon: <Lightbulb size={18} /> },
    ]
  };
  
  // Get the correct items based on user mode
  let navigationItems = [...commonItems];
  if (userMode && modeSpecificItems[userMode]) {
    navigationItems = [...navigationItems, ...modeSpecificItems[userMode]];
  }
  
  // Always add settings at the end
  navigationItems.push({ 
    href: userMode ? `/${userMode}/settings` : '/settings', 
    label: 'Paramètres', 
    icon: <Settings size={18} /> 
  });
  
  return (
    <nav className="space-y-1 px-2">
      {navigationItems.map((item) => {
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-primary",
              collapsed && "justify-center px-0"
            )}
          >
            <span className="mr-3">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
};

export default UnifiedNavigation;
