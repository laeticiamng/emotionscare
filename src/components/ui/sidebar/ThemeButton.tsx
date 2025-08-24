
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

interface ThemeButtonProps {
  className?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const ThemeButton: React.FC<ThemeButtonProps> = ({ 
  className = "", 
  variant = "ghost",
  size = "icon"
}) => {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <Button 
      variant={variant} 
      size={size}
      onClick={toggleTheme}
      className={className}
      title={theme === 'dark' ? "Passer en mode clair" : "Passer en mode sombre"}
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
};

export default ThemeButton;
