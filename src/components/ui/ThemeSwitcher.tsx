
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
import { ThemeName } from '@/themes/theme';

interface ThemeSwitcherProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
}

/**
 * Composant pour changer de thème
 * Permet à l'utilisateur de basculer entre les thèmes clair, sombre et pastel
 */
const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  variant = 'outline',
  size = 'icon',
  showLabel = false
}) => {
  const { theme, setThemePreference } = useTheme();

  // Icône à afficher en fonction du thème actuel
  const ThemeIcon = theme === 'dark' ? Moon : theme === 'pastel' ? Palette : Sun;
  
  // Texte à afficher en fonction du thème actuel
  const themeText = theme === 'dark' ? 'Sombre' : theme === 'pastel' ? 'Pastel' : 'Clair';
  
  // Fonction pour changer de thème
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
          <ThemeIcon className="h-[1.3rem] w-[1.3rem]" />
          {showLabel && <span className="ml-2 font-medium">{themeText}</span>}
          <span className="sr-only">Changer de thème</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[220px] shadow-premium">
        <DropdownMenuItem 
          onClick={() => handleThemeChange('light')}
          className="cursor-pointer py-3"
        >
          <Sun className="mr-3 h-5 w-5 text-amber-500" />
          <span className="font-medium">Mode clair</span>
          {theme === 'light' && (
            <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Actif
            </span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange('dark')}
          className="cursor-pointer py-3"
        >
          <Moon className="mr-3 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <span className="font-medium">Mode sombre</span>
          {theme === 'dark' && (
            <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Actif
            </span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange('pastel')}
          className="cursor-pointer py-3"
        >
          <Palette className="mr-3 h-5 w-5 text-blue-500" />
          <span className="font-medium">Mode pastel</span>
          {theme === 'pastel' && (
            <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Actif
            </span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
