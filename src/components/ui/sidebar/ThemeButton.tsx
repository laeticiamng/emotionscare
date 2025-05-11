
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ThemeButtonProps {
  collapsed: boolean;
}

const ThemeButton: React.FC<ThemeButtonProps> = ({ collapsed }) => {
  const themeContext = useTheme();
  const theme = themeContext?.theme || 'light';
  const setTheme = themeContext?.setTheme || ((t: any) => console.log('Theme would change to:', t));
  
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };
  
  const isDark = theme === 'dark';
  
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
