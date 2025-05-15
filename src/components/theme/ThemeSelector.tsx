
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
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ minimal = false }) => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={minimal ? "icon" : "default"} className="relative">
          <Sun className={`h-4 w-4 transition-opacity ${theme === 'light' ? 'opacity-100' : 'opacity-0 absolute'}`} />
          <Moon className={`h-4 w-4 transition-opacity ${theme === 'dark' ? 'opacity-100' : 'opacity-0 absolute'}`} />
          <Palette className={`h-4 w-4 transition-opacity ${theme === 'pastel' ? 'opacity-100' : 'opacity-0 absolute'}`} />
          {!minimal && <span className="ml-2 hidden md:inline">Thème</span>}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="h-4 w-4 mr-2" />
          <span>Clair</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="h-4 w-4 mr-2" />
          <span>Sombre</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('pastel')}>
          <Palette className="h-4 w-4 mr-2" />
          <span>Pastel</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
