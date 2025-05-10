
import React from 'react';
import { Bell, Download, Search, Settings, SunMoon, Users, Moon, Sun, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/hooks/use-theme';
import { User } from '@/types';

interface PremiumAdminHeaderProps {
  user: User;
  onPresentationMode?: () => void;
}

const PremiumAdminHeader: React.FC<PremiumAdminHeaderProps> = ({ 
  user, 
  onPresentationMode 
}) => {
  const { theme, setTheme } = useTheme();
  
  // Toggle between light and dark mode
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Left side - Logo/brand */}
          <div className="flex items-center">
            <LayoutDashboard className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-lg font-semibold">
              EmotionsCare <span className="text-sm font-normal text-muted-foreground">Premium</span>
            </h1>
          </div>
          
          {/* Center - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="w-full pl-9 bg-background"
              />
            </div>
          </div>
          
          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
              <span className="sr-only">Changer le thème</span>
            </Button>
            
            <Button variant="outline" size="icon">
              <Bell className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Notifications</span>
            </Button>
            
            {onPresentationMode && (
              <Button 
                variant="outline" 
                className="hidden md:flex items-center gap-2" 
                onClick={onPresentationMode}
              >
                <Download className="h-4 w-4" />
                <span>Présentation</span>
              </Button>
            )}
            
            <Button variant="outline" size="icon">
              <Settings className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Paramètres</span>
            </Button>
            
            {/* User avatar */}
            <Button variant="ghost" className="gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="hidden md:inline">{user.name || 'Utilisateur'}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PremiumAdminHeader;
