
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  User, 
  Settings, 
  HelpCircle,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface UnifiedFooterNavProps {
  collapsed?: boolean;
  onItemClick?: () => void;
}

const UnifiedFooterNav: React.FC<UnifiedFooterNavProps> = ({ 
  collapsed = false, 
  onItemClick 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const footerItems = [
    {
      title: 'Profil',
      icon: <User className="h-4 w-4" />,
      path: '/profile'
    },
    {
      title: 'Paramètres',
      icon: <Settings className="h-4 w-4" />,
      path: '/settings'
    },
    {
      title: 'Aide',
      icon: <HelpCircle className="h-4 w-4" />,
      path: '/help'
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onItemClick?.();
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      onItemClick?.();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="space-y-2">
      {footerItems.map((item, index) => (
        <Button
          key={index}
          variant={isActive(item.path) ? "default" : "ghost"}
          onClick={() => handleNavigation(item.path)}
          className={`w-full justify-start ${collapsed ? 'px-2' : 'px-3'}`}
          size="sm"
        >
          {item.icon}
          {!collapsed && <span className="ml-2">{item.title}</span>}
        </Button>
      ))}
      
      <Button
        variant="ghost"
        onClick={handleLogout}
        className={`w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 ${collapsed ? 'px-2' : 'px-3'}`}
        size="sm"
      >
        <LogOut className="h-4 w-4" />
        {!collapsed && <span className="ml-2">Déconnexion</span>}
      </Button>
    </div>
  );
};

export default UnifiedFooterNav;
