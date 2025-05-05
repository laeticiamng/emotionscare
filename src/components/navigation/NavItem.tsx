
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { isAdminRole } from '@/utils/roleUtils';

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
  const isAdmin = isAdminRole(user?.role);
  
  console.log(`NavItem render: ${label}, to: ${to}, current path: ${location.pathname}, isAdmin: ${isAdmin}`);
  
  // Si active n'est pas explicitement fourni, déterminer à partir de l'emplacement actuel
  // Pour une correspondance plus précise, vérifiez si le chemin commence par la route
  // Cela aide avec les routes imbriquées comme /buddy/123
  const isActive = active !== undefined 
    ? active 
    : location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Pour les utilisateurs admin, rediriger vers la version admin de certaines pages
    let targetPath = to;
    if (isAdmin && to === '/dashboard') {
      // L'admin reste sur /dashboard qui contient déjà la vue admin
      targetPath = '/dashboard';
    }
    
    console.log(`NavItem clicked: ${label}, navigating to ${targetPath}`);
    navigate(targetPath);
  };

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

export default NavItem;
