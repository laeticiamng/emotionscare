
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { isAdminRole } from '@/utils/roleUtils';
import { motion } from 'framer-motion';

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
  highlight?: boolean;
  className?: string; // Added className prop for custom styling
  testId?: string; // Added for testing purposes
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
  highlight = false,
  className = '',
  testId,
}) => {
  const { user, isAuthenticated } = useAuth();
  const finalHref = to || href || '#';
  const finalIsActive = isActive || active;
  
  // Don't render if item requires authentication but user is not authenticated
  if (requiresAuth && !isAuthenticated) return null;
  
  // Don't render if item is admin-only and user is not an admin
  if (adminOnly && (!user || !isAdminRole(user.role))) return null;
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={className}
      data-testid={testId}
    >
      <Link
        to={finalHref}
        onClick={onClick}
        className={cn(
          "flex items-center px-4 py-2 text-sm font-medium transition-colors",
          finalIsActive 
            ? "bg-primary text-primary-foreground" 
            : "hover:bg-accent hover:text-accent-foreground",
          highlight ? "ring-2 ring-primary ring-offset-1" : "",
          "rounded-md"
        )}
        aria-current={finalIsActive ? 'page' : undefined}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </Link>
    </motion.div>
  );
};

export default NavItem;
