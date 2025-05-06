
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Moon, Sun, CloudSun } from 'lucide-react';

interface ThemeButtonProps {
  collapsed: boolean;
}

const ThemeButton: React.FC<ThemeButtonProps> = ({ collapsed }) => {
  const { theme, toggleTheme } = useTheme();

  // Get the appropriate theme icon
  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Moon className="h-5 w-5" />;
      case 'dark':
        return <Sun className="h-5 w-5" />;
      case 'pastel':
        return <CloudSun className="h-5 w-5" />;
      default:
        return <Moon className="h-5 w-5" />;
    }
  };

  // Get theme tooltip text
  const getThemeTooltipText = () => {
    switch (theme) {
      case 'light':
        return 'Mode sombre';
      case 'dark':
        return 'Mode pastel';
      case 'pastel':
        return 'Mode clair';
      default:
        return 'Changer de thème';
    }
  };

  return collapsed ? (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-full h-10"
            onClick={toggleTheme}
          >
            {getThemeIcon()}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          {getThemeTooltipText()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <Button
      variant="ghost"
      className="w-full justify-start px-3"
      onClick={toggleTheme}
    >
      {getThemeIcon()}
      <span className="ml-2">{getThemeTooltipText()}</span>
    </Button>
  );
};

export default ThemeButton;
