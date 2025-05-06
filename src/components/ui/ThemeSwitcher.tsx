
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
          className="focus-premium hover-lift"
        >
          <ThemeIcon className="h-[1.2rem] w-[1.2rem]" />
          {showLabel && <span className="ml-2">{themeText}</span>}
          <span className="sr-only">Changer de thème</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        <DropdownMenuItem 
          onClick={() => handleThemeChange('light')}
          className="cursor-pointer"
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Mode clair</span>
          {theme === 'light' && (
            <span className="ml-auto text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
              Actif
            </span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange('dark')}
          className="cursor-pointer"
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Mode sombre</span>
          {theme === 'dark' && (
            <span className="ml-auto text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
              Actif
            </span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange('pastel')}
          className="cursor-pointer"
        >
          <Palette className="mr-2 h-4 w-4" />
          <span>Mode pastel</span>
          {theme === 'pastel' && (
            <span className="ml-auto text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
              Actif
            </span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
