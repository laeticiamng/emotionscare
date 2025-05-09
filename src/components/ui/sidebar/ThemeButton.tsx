
import React from 'react';
import { Button } from "@/components/ui/button";
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeButtonProps {
  collapsed: boolean;
}

const ThemeButton: React.FC<ThemeButtonProps> = ({ collapsed }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size={collapsed ? "icon" : "sm"}
      onClick={toggleTheme}
      className={`${collapsed ? 'w-10' : 'w-full justify-start'}`}
      aria-label="Changer le thème"
    >
      {theme === 'dark' ? (
        <>
          <Sun className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Mode clair</span>}
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Mode sombre</span>}
        </>
      )}
    </Button>
  );
};

export default ThemeButton;
