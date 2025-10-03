
import React from 'react';
import { Settings, Help } from 'lucide-react';
import NavItem from './NavItem';

interface UnifiedFooterNavProps {
  collapsed?: boolean;
  onItemClick?: () => void;
}

const UnifiedFooterNav: React.FC<UnifiedFooterNavProps> = ({ 
  collapsed = false, 
  onItemClick 
}) => {
  const footerItems = [
    {
      href: '/settings',
      label: 'Paramètres',
      icon: <Settings className="h-4 w-4" />,
      requiresAuth: true,
    },
    {
      href: '/help',
      label: 'Aide',
      icon: <Help className="h-4 w-4" />,
    },
  ];

  return (
    <nav className="space-y-2">
      {footerItems.map((item) => (
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

export default UnifiedFooterNav;
