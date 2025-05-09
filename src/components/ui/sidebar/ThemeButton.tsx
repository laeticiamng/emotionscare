
import React from 'react';
import { Button } from "@/components/ui/button";
import { Moon, Sun, Palette } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeButtonProps {
  collapsed: boolean;
}

const ThemeButton: React.FC<ThemeButtonProps> = ({ collapsed }) => {
  const { theme, toggleTheme } = useTheme();

  // Select the appropriate icon and text based on current theme
  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'pastel':
        return <Palette className="h-4 w-4" />;
      default: // 'light'
        return <Sun className="h-4 w-4" />;
    }
  };

  const getThemeText = () => {
    switch (theme) {
      case 'dark':
        return 'Mode clair';
      case 'pastel':
        return 'Mode sombre';
      default: // 'light'
        return 'Mode pastel';
    }
  };

  return (
    <Button
      variant="ghost"
      size={collapsed ? "icon" : "sm"}
      onClick={toggleTheme}
      className={`${collapsed ? 'w-10' : 'w-full justify-start'}`}
      aria-label="Changer le thème"
    >
      {getThemeIcon()}
      {!collapsed && <span className="ml-2">{getThemeText()}</span>}
    </Button>
  );
};

export default ThemeButton;
