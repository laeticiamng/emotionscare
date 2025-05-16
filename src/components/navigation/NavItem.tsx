
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { isAdminRole } from '@/utils/roleUtils';

interface NavItemProps {
  href?: string;
  to?: string;  // Support for both 'to' and 'href' props
  label: string;
  isActive?: boolean;
  active?: boolean; // Alternative name for isActive
  icon?: React.ReactNode;
  onClick?: () => void;
  requiresAuth?: boolean;
  adminOnly?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  href,
  to,
  label,
  isActive = false,
  active = false,
  icon,
  onClick,
  requiresAuth = false,
  adminOnly = false,
}) => {
  const { user, isAuthenticated } = useAuth();
  const finalHref = to || href || '#';
  const finalIsActive = isActive || active;
  
  // Don't render if item requires authentication but user is not authenticated
  if (requiresAuth && !isAuthenticated) return null;
  
  // Don't render if item is admin-only and user is not an admin
  if (adminOnly && (!user || !isAdminRole(user.role))) return null;
  
  return (
    <Link
      to={finalHref}
      onClick={onClick}
      className={cn(
        "flex items-center px-4 py-2 text-sm font-medium transition-colors",
        finalIsActive 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-accent hover:text-accent-foreground",
        "rounded-md"
      )}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </Link>
  );
};

export default NavItem;
