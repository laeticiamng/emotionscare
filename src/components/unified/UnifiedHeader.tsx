
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { Menu, Heart, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUserModeDisplayName } from '@/utils/userModeHelpers';

interface UnifiedHeaderProps {
  onMenuClick?: () => void;
}

const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({ onMenuClick }) => {
  const { user, signOut } = useAuth();
  const { userMode } = useUserMode();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isDemo = user?.email?.endsWith('@exemple.fr');
  const modeDisplay = getUserModeDisplayName(userMode);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <a className="mr-6 flex items-center space-x-2" href="/">
            <Heart className="h-6 w-6 text-red-500" />
            <span className="hidden font-bold sm:inline-block">
              EmotionsCare
            </span>
          </a>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="mr-2 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none" />
          
          <nav className="flex items-center space-x-2">
            {user && (
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium">{user.user_metadata?.name || 'Utilisateur'}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {modeDisplay}
                    </Badge>
                    {isDemo && (
                      <Badge variant="outline" className="text-xs">
                        Démo
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/profile')}
                >
                  <User className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default UnifiedHeader;
