
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
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
      // Cycle through themes: light -> dark -> system
      const themeOrder: Theme[] = ['light', 'dark', 'system'];
      const currentIndex = themeOrder.indexOf(theme as Theme);
      const nextIndex = (currentIndex + 1) % themeOrder.length;
      const newTheme = themeOrder[nextIndex];
      themeContext.setTheme(newTheme);
    }
  };
  
  // Determine if the current theme is dark
  // This works with both direct 'dark' theme and system preference resulting in dark
  const isDark = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark');
  
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
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Changer de thème</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          {isDark ? 'Mode clair' : 'Mode sombre'}
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
      {isDark ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
      <span>{isDark ? 'Mode clair' : 'Mode sombre'}</span>
    </Button>
  );
};

export default ThemeButton;
