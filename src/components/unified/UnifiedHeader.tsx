
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { useNavigate } from 'react-router-dom';
import UserNav from '@/components/layout/UserNav';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';

interface UnifiedHeaderProps {
  onMenuToggle?: () => void;
}

const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({ onMenuToggle }) => {
  const { user, isAuthenticated } = useAuth();
  const { userMode } = useUserMode();
  const navigate = useNavigate();

  const getLogoText = () => {
    if (!isAuthenticated) return 'EmotionsCare';
    
    switch (userMode) {
      case 'b2b_admin':
        return 'EmotionsCare Admin';
      case 'b2b_user':
        return 'EmotionsCare Pro';
      default:
        return 'EmotionsCare';
    }
  };

  const getLogoColor = () => {
    switch (userMode) {
      case 'b2b_admin':
        return 'from-slate-600 to-slate-800';
      case 'b2b_user':
        return 'from-blue-600 to-slate-600';
      default:
        return 'from-blue-600 to-purple-600';
    }
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuToggle}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          <button
            onClick={() => navigate(isAuthenticated ? (userMode === 'b2b_admin' ? '/b2b/admin/dashboard' : userMode === 'b2b_user' ? '/b2b/user/dashboard' : '/b2c/dashboard') : '/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className={`text-xl font-bold bg-gradient-to-r ${getLogoColor()} bg-clip-text text-transparent hidden sm:block`}>
              {getLogoText()}
            </span>
          </button>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          
          {isAuthenticated && (
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </Button>
          )}
          
          <UserNav />
        </div>
      </div>
    </header>
  );
};

export default UnifiedHeader;
