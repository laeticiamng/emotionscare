import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import NavbarBadge from './NavbarBadge';
import { useNotificationBadge } from '@/hooks/useNotificationBadge';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleHomePath, getRoleName } from '@/utils/roleUtils';

// Main Navigation Component
// Responsible for rendering the appropriate navigation bar based on user's authentication status and role

interface NavigationItemProps {
  label: string;
  href: string;
  isActive?: boolean;
  hasNotification?: boolean;
  badgesCount?: number;
}

const NavigationItem: React.FC<NavigationItemProps> = ({
  label,
  href,
  isActive = false,
  hasNotification = false,
  badgesCount = 0,
}) => {
  return (
    <li className="relative">
      <Link
        to={href}
        className={cn(
          'block px-4 py-2 text-sm rounded-md transition-colors',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-accent text-foreground'
        )}
      >
        {label}
        {hasNotification && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
        {badgesCount > 0 && <NavbarBadge badgesCount={badgesCount} />}
      </Link>
    </li>
  );
};

const MainNavigation: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { badgesCount } = useNotificationBadge(user?.id);
  
  // Determine the appropriate navigation items based on authentication status and user role
  let navigationItems: NavigationItemProps[] = [];
  
  if (isAuthenticated && user) {
    navigationItems = [
      { label: 'Tableau de bord', href: getRoleHomePath(user.role), isActive: true, badgesCount: badgesCount },
      { label: 'Préférences', href: '/preferences' },
      { label: 'Déconnexion', href: '/logout' },
    ];
  } else {
    navigationItems = [
      { label: 'Connexion', href: '/login' },
      { label: 'Inscription', href: '/register' },
    ];
  }
  
  return (
    <nav className="bg-background border-b">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="font-bold text-xl">
          Bien-Être
        </Link>
        
        <ul className="flex items-center space-x-2">
          {navigationItems.map((item) => (
            <NavigationItem key={item.label} {...item} />
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default MainNavigation;
