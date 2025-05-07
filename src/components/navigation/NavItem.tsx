
import React, { useCallback, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { isAdminRole } from '@/utils/roleUtils';
import useLogger from '@/hooks/useLogger';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, to, active }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const logger = useLogger('NavItem');
  const isAdmin = isAdminRole(user?.role);
  
  // Si active n'est pas explicitement fourni, déterminer à partir de l'emplacement actuel
  const isActive = active !== undefined 
    ? active 
    : location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    // Pour les utilisateurs admin, rediriger vers la version admin de certaines pages
    let targetPath = to;
    if (isAdmin && to === '/dashboard') {
      // L'admin reste sur /dashboard qui contient déjà la vue admin
      targetPath = '/dashboard';
    }
    
    logger.debug(`Navigation item clicked`, { label, to: targetPath });
    navigate(targetPath);
  }, [to, isAdmin, navigate, label, logger]);

  return (
    <button
      className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary ${
        isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground'
      }`}
      onClick={handleClick}
      data-active={isActive}
      aria-current={isActive ? 'page' : undefined}
      data-testid={`nav-item-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {icon}
      {label}
    </button>
  );
};

// Utiliser memo pour éviter les renders inutiles
export default memo(NavItem);
