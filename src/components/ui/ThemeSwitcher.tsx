
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Palette } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeName } from '@/types';

interface ThemeSwitcherProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
}

/**
 * Premium theme switcher component
 * Allows users to toggle between light, dark and pastel themes
 * with a sleek Apple-inspired interface
 */
const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  variant = 'outline',
  size = 'icon',
  showLabel = false
}) => {
  const { theme, setThemePreference } = useTheme();

  // Icon to display based on current theme
  const ThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon className="h-[1.3rem] w-[1.3rem]" />;
      case 'pastel':
        return <Palette className="h-[1.3rem] w-[1.3rem]" />;
      default: // light
        return <Sun className="h-[1.3rem] w-[1.3rem]" />;
    }
  };
  
  // Text to display based on current theme
  const themeText = theme === 'dark' ? 'Sombre' : theme === 'pastel' ? 'Pastel' : 'Clair';
  
  // Function to change theme
  const handleThemeChange = (newTheme: ThemeName) => {
    setThemePreference(newTheme);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className="focus-premium hover-lift shadow-sm"
        >
          <ThemeIcon />
          {showLabel && <span className="ml-2 font-medium">{themeText}</span>}
          <span className="sr-only">Changer de thème</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[220px] shadow-premium rounded-xl border p-1">
        <DropdownMenuItem 
          onClick={() => handleThemeChange('light')}
          className="cursor-pointer py-3 rounded-lg"
        >
          <Sun className="mr-3 h-5 w-5 text-amber-500" />
          <span className="font-medium">Mode clair</span>
          {theme === 'light' && (
            <span className="ml-auto text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full">
              Actif
            </span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange('dark')}
          className="cursor-pointer py-3 rounded-lg"
        >
          <Moon className="mr-3 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <span className="font-medium">Mode sombre</span>
          {theme === 'dark' && (
            <span className="ml-auto text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full">
              Actif
            </span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange('pastel')}
          className="cursor-pointer py-3 rounded-lg"
        >
          <Palette className="mr-3 h-5 w-5 text-blue-500" />
          <span className="font-medium">Mode pastel</span>
          {theme === 'pastel' && (
            <span className="ml-auto text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full">
              Actif
            </span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
