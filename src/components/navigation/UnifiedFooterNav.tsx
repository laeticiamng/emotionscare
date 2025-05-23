
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface UnifiedFooterNavProps {
  collapsed?: boolean;
  onItemClick?: () => void;
}

const UnifiedFooterNav: React.FC<UnifiedFooterNavProps> = ({ 
  collapsed = false, 
  onItemClick 
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/choose-mode');
    if (onItemClick) onItemClick();
  };

  const handleSettings = () => {
    navigate('/settings');
    if (onItemClick) onItemClick();
  };

  const handleHelp = () => {
    navigate('/help');
    if (onItemClick) onItemClick();
  };

  return (
    <div className="space-y-2">
      <Button
        variant="ghost"
        className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'}`}
        onClick={handleSettings}
      >
        <Settings className={`h-4 w-4 ${!collapsed ? 'mr-2' : ''}`} />
        {!collapsed && 'Paramètres'}
      </Button>
      
      <Button
        variant="ghost"
        className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'}`}
        onClick={handleHelp}
      >
        <HelpCircle className={`h-4 w-4 ${!collapsed ? 'mr-2' : ''}`} />
        {!collapsed && 'Aide'}
      </Button>
      
      <Button
        variant="ghost"
        className={`w-full ${collapsed ? 'justify-center px-2' : 'justify-start'}`}
        onClick={handleLogout}
      >
        <LogOut className={`h-4 w-4 ${!collapsed ? 'mr-2' : ''}`} />
        {!collapsed && 'Déconnexion'}
      </Button>
    </div>
  );
};

export default UnifiedFooterNav;
