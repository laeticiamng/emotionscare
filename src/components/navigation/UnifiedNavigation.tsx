
import React from 'react';
import { Home, Brain, Music, BookOpen } from 'lucide-react';
import NavItem from './NavItem';

interface UnifiedNavigationProps {
  collapsed?: boolean;
  onItemClick?: () => void;
}

const UnifiedNavigation: React.FC<UnifiedNavigationProps> = ({ 
  collapsed = false, 
  onItemClick 
}) => {
  const navItems = [
    {
      href: '/',
      label: 'Accueil',
      icon: <Home className="h-4 w-4" />,
    },
    {
      href: '/dashboard',
      label: 'Tableau de bord',
      icon: <Brain className="h-4 w-4" />,
      requiresAuth: true,
    },
    {
      href: '/music',
      label: 'Musicothérapie',
      icon: <Music className="h-4 w-4" />,
      requiresAuth: true,
    },
    {
      href: '/journal',
      label: 'Journal',
      icon: <BookOpen className="h-4 w-4" />,
      requiresAuth: true,
    },
  ];

  return (
    <nav className="space-y-2">
      {navItems.map((item) => (
        <NavItem
          key={item.href}
          href={item.href}
          label={collapsed ? '' : item.label}
          icon={item.icon}
          requiresAuth={item.requiresAuth}
          onClick={onItemClick}
        />
      ))}
    </nav>
  );
};

export default UnifiedNavigation;
