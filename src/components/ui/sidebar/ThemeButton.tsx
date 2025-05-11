
import React from 'react';
import { Moon, Sun, Laptop, Palette, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/utils';

interface ThemeButtonProps {
  collapsed?: boolean;
}

const ThemeButton = ({ collapsed = false }: ThemeButtonProps) => {
  const { theme, resolvedTheme, setTheme } = useTheme();

  // Toggle theme in sequence: light -> dark -> pastel -> system -> light
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('pastel');
    } else if (theme === 'pastel') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  // Get icon based on current theme
  const getIcon = () => {
    if (theme === 'system') {
      return <Laptop size={18} />;
    } else if (theme === 'dark') {
      return <Moon size={18} />;
    } else if (theme === 'pastel') {
      return <Palette size={18} />;
    } else {
      return <Sun size={18} />;
    }
  };

  // Get theme name for display
  const getThemeName = () => {
    switch (theme) {
      case 'light': return 'Clair';
      case 'dark': return 'Sombre';
      case 'pastel': return 'Pastel';
      case 'system': return 'Système';
      default: return 'Thème';
    }
  };

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            {getIcon()}
            <span className="sr-only">Changer de thème</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Thème: {getThemeName()}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      className={cn(
        "w-full justify-start",
        resolvedTheme === 'dark' && "text-slate-400 hover:text-slate-100",
      )}
    >
      {getIcon()}
      <span className="ml-2">Thème: {getThemeName()}</span>
    </Button>
  );
};

export default ThemeButton;
