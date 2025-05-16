
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Palette } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ThemeButtonProps } from '@/types/theme';

const ThemeToggle = ({ 
  variant = 'outline', 
  size = 'icon',
  className = ''
}: ThemeButtonProps) => {
  const { theme, setTheme } = useTheme();

  const getIcon = () => {
    switch (theme) {
      case 'light': return <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />;
      case 'dark': return <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />;
      case 'pastel': return <Palette className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />;
      default: return <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={`relative ${className}`}>
          <span className="sr-only">Changer de thème</span>
          {getIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-border">
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className={`cursor-pointer ${theme === 'light' ? 'bg-primary/10 font-medium' : ''}`}
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Clair</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className={`cursor-pointer ${theme === 'dark' ? 'bg-primary/10 font-medium' : ''}`}
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Sombre</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('pastel')}
          className={`cursor-pointer ${theme === 'pastel' ? 'bg-primary/10 font-medium' : ''}`}
        >
          <Palette className="mr-2 h-4 w-4" />
          <span>Pastel</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
