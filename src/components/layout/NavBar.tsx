
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useUserMode } from '@/contexts/UserModeContext';

interface NavBarProps {
  // Add any props here
}

const NavBar: React.FC<NavBarProps> = () => {
  const { theme, setTheme } = useTheme();
  const { userMode } = useUserMode();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-medium">EmotionsCare</h1>
          {/* Add navigation links here if needed */}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <span className="text-sm font-medium">
            Mode: {userMode === 'b2c' ? 'Particulier' : 
                  userMode === 'b2b-user' || userMode === 'b2b_user' ? 'Collaborateur' : 
                  userMode === 'b2b-admin' || userMode === 'b2b_admin' ? 'Administration' : 'Standard'}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
