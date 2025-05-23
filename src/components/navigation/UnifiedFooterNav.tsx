
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Settings, User, LogOut, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import NavItemButton from './NavItemButton';

interface UnifiedFooterNavProps {
  collapsed?: boolean;
  onItemClick?: () => void;
}

const UnifiedFooterNav: React.FC<UnifiedFooterNavProps> = ({ collapsed = false, onItemClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      if (onItemClick) {
        onItemClick();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const handleNavigation = (path: string) => {
    navigate(path);
    if (onItemClick) {
      onItemClick();
    }
  };
  
  return (
    <nav className="space-y-2">
      <NavItemButton
        label="Profil"
        path="/profile"
        icon={<User className="h-5 w-5" />}
        collapsed={collapsed}
        onClick={() => handleNavigation('/profile')}
        active={location.pathname === '/profile'}
      />
      
      <NavItemButton
        label="Paramètres"
        path="/settings"
        icon={<Settings className="h-5 w-5" />}
        collapsed={collapsed}
        onClick={() => handleNavigation('/settings')}
        active={location.pathname === '/settings'}
      />
      
      <NavItemButton
        label="Aide"
        path="/help"
        icon={<HelpCircle className="h-5 w-5" />}
        collapsed={collapsed}
        onClick={() => handleNavigation('/help')}
        active={location.pathname === '/help'}
      />
      
      <NavItemButton
        label="Déconnexion"
        path="/logout"
        icon={<LogOut className="h-5 w-5" />}
        collapsed={collapsed}
        onClick={handleLogout}
        active={false}
      />
    </nav>
  );
};

export default UnifiedFooterNav;
