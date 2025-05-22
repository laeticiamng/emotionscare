
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, Bell } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { UserNav } from '@/components/layout/UserNav';
import { ModeToggle } from '@/components/theme/ModeToggle';
import { useAuth } from '@/contexts/AuthContext';
import UserModeButton from './UserModeButton';

interface UnifiedHeaderProps {
  onMenuClick?: () => void;
}

const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b bg-background h-16 px-4">
      <div className="flex h-full items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
          
          <div 
            className="font-semibold text-lg flex items-center cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="font-bold text-white">EC</span>
            </div>
            <span className="ml-2 hidden sm:inline">EmotionsCare</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                  3
                </span>
              </Button>
              <UserModeButton />
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/mode-switcher')}
                className="text-xs hidden md:block"
              >
                Changer de mode
              </Button>
            </>
          )}
          
          <ModeToggle />
          
          {isAuthenticated ? (
            <UserNav />
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/b2c/login')}
              >
                Connexion
              </Button>
              <Button 
                size="sm"
                onClick={() => navigate('/b2c/register')}
              >
                Inscription
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default UnifiedHeader;
