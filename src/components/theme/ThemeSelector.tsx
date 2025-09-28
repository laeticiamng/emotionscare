
import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

type Theme = 'light' | 'dark' | 'system';

interface ThemeSelectorProps {
  currentTheme: Theme;
  onChange: (theme: Theme) => void;
  minimal?: boolean;
  className?: string;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onChange,
  minimal = false,
  className = '',
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={minimal ? 'icon' : 'default'} className={cn("", className)}>
          {currentTheme === 'light' && <Sun className="h-[1.2rem] w-[1.2rem]" />}
          {currentTheme === 'dark' && <Moon className="h-[1.2rem] w-[1.2rem]" />}
          {currentTheme === 'system' && <Monitor className="h-[1.2rem] w-[1.2rem]" />}
          {!minimal && <span className="ml-2">Thème</span>}
          <span className="sr-only">Changer le thème</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onChange('light')}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Clair</span>
          {currentTheme === 'light' && (
            <span className="ml-auto text-xs font-medium text-primary">✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChange('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Sombre</span>
          {currentTheme === 'dark' && (
            <span className="ml-auto text-xs font-medium text-primary">✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChange('system')}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>Système</span>
          {currentTheme === 'system' && (
            <span className="ml-auto text-xs font-medium text-primary">✓</span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSelector;
