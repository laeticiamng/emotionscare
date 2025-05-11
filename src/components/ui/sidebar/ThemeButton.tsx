
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme, Theme } from '@/contexts/ThemeContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ThemeButtonProps {
  collapsed: boolean;
}

const ThemeButton: React.FC<ThemeButtonProps> = ({ collapsed }) => {
  const themeContext = useTheme();
  const theme = themeContext?.theme || 'light';
  const resolvedTheme = themeContext?.resolvedTheme;
  
  const toggleTheme = () => {
    if (themeContext?.setTheme) {
      // Cycle through themes: light -> dark -> system -> pastel -> light
      const themeOrder: Theme[] = ['light', 'dark', 'system', 'pastel'];
      const currentIndex = themeOrder.indexOf(theme as Theme);
      const nextIndex = (currentIndex + 1) % themeOrder.length;
      const newTheme = themeOrder[nextIndex];
      themeContext.setTheme(newTheme);
    }
  };
  
  // Determine the current theme state for displaying the correct icon
  const getThemeIcon = () => {
    if (theme === 'system') {
      return <Laptop className={`h-5 w-5 ${!collapsed ? 'mr-2' : ''}`} />;
    }
    
    // For light theme or system preference resulting in light
    if (theme === 'light' || (theme === 'system' && resolvedTheme === 'light')) {
      return <Sun className={`h-5 w-5 ${!collapsed ? 'mr-2' : ''}`} />;
    }
    
    // Default to dark theme icon
    return <Moon className={`h-5 w-5 ${!collapsed ? 'mr-2' : ''}`} />;
  };
  
  // Get label text based on current theme
  const getThemeLabel = () => {
    switch (theme) {
      case 'light': return 'Mode sombre';
      case 'dark': return 'Mode système';
      case 'system': return 'Mode pastel';
      case 'pastel': return 'Mode clair';
      default: return 'Changer de thème';
    }
  };
  
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-full h-10"
            onClick={toggleTheme}
          >
            {getThemeIcon()}
            <span className="sr-only">Changer de thème</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          {getThemeLabel()}
        </TooltipContent>
      </Tooltip>
    );
  }
  
  return (
    <Button
      variant="ghost"
      className="w-full justify-start px-3"
      onClick={toggleTheme}
    >
      {getThemeIcon()}
      <span>{getThemeLabel()}</span>
    </Button>
  );
};

export default ThemeButton;
