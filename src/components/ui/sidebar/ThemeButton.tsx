
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Laptop, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeButtonProps } from '@/types/theme';

const ThemeButton: React.FC<ThemeButtonProps> = ({ collapsed = false }) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    switch (theme) {
      case 'dark':
        setTheme('system');
        break;
      case 'system':
        setTheme('light');
        break;
      case 'light':
        setTheme('pastel');
        break;
      case 'pastel':
        setTheme('dark');
        break;
      default:
        setTheme('light');
    }
  };

  const getIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'system':
        return <Laptop className="h-4 w-4" />;
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'pastel':
        return <Palette className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'dark':
        return 'Thème: Sombre';
      case 'system':
        return 'Thème: Système';
      case 'light':
        return 'Thème: Clair';
      case 'pastel':
        return 'Thème: Pastel';
      default:
        return 'Thème';
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={cn(
        "flex items-center", 
        collapsed ? "justify-center w-10 h-10 p-0" : "justify-start w-full"
      )}
    >
      {getIcon()}
      {!collapsed && <span className="ml-2">{getLabel()}</span>}
    </Button>
  );
};

export default ThemeButton;
