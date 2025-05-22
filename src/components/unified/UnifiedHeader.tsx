
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { Link } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';
import { getUserModeDisplayName } from '@/utils/userModeHelpers';
import { UserNav } from '@/components/layout/UserNav';

interface UnifiedHeaderProps {
  onMenuClick?: () => void;
}

const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
  onMenuClick,
}) => {
  const { theme, setTheme } = useTheme();
  const { userMode } = useUserMode();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  const userModeDisplay = getUserModeDisplayName(userMode);
  
  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b bg-background/95 backdrop-blur z-40">
      <div className="container flex h-full items-center px-4 sm:px-6">
        <div className="md:hidden mr-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
        
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold">EmotionsCare</span>
          </Link>
          {userMode && (
            <span className="ml-4 px-2 py-1 bg-primary/10 text-primary text-sm rounded-md hidden sm:block">
              {userModeDisplay}
            </span>
          )}
        </div>
        
        <div className="flex-1" />
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Changer de thème</span>
          </Button>
          
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          
          <UserNav />
        </div>
      </div>
    </header>
  );
};

export default UnifiedHeader;
