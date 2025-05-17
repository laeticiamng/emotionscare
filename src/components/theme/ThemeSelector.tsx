
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Palette } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeSelectorProps {
  minimal?: boolean;
  className?: string;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ minimal = false, className = '' }) => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={minimal ? "icon" : "default"} className={`relative ${className}`}>
          <div className="relative w-4 h-4">
            <Sun className={`absolute h-4 w-4 transition-all duration-300 ${theme === 'light' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
            <Moon className={`absolute h-4 w-4 transition-all duration-300 ${theme === 'dark' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
            <Palette className={`absolute h-4 w-4 transition-all duration-300 ${theme === 'pastel' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
          </div>
          {!minimal && <span className="ml-2 hidden md:inline">Thème</span>}
          <span className="sr-only">Sélectionner le thème</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-50">
        <DropdownMenuItem onClick={() => setTheme('light')} className="flex items-center gap-2 cursor-pointer">
          <Sun className="h-4 w-4" />
          <span>Clair</span>
          {theme === 'light' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} className="flex items-center gap-2 cursor-pointer">
          <Moon className="h-4 w-4" />
          <span>Sombre</span>
          {theme === 'dark' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('pastel')} className="flex items-center gap-2 cursor-pointer">
          <Palette className="h-4 w-4" />
          <span>Pastel</span>
          {theme === 'pastel' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSelector;
