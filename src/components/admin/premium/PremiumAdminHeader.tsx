
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Settings } from 'lucide-react';

export interface PremiumAdminHeaderProps {
  user?: any;
  pageTitle?: string;
  onSettingsClick?: () => void;
}

const PremiumAdminHeader: React.FC<PremiumAdminHeaderProps> = ({
  user,
  pageTitle = "Dashboard Administrateur",
  onSettingsClick
}) => {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  const toggleDarkMode = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <div className="flex justify-between items-center p-4 border-b">
      <h1 className="text-2xl font-bold">{pageTitle}</h1>
      
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon"
          className="rounded-full"
          onClick={toggleDarkMode}
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        
        {onSettingsClick && (
          <Button 
            variant="outline" 
            size="icon"
            className="rounded-full"
            onClick={onSettingsClick}
          >
            <Settings className="h-4 w-4" />
          </Button>
        )}
        
        {user && (
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name || 'User avatar'} 
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  {user.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <span className="text-sm font-medium hidden md:block">
              {user.name || 'Admin User'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumAdminHeader;
