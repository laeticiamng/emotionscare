
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { ThemeName } from '@/types/types';

export interface ThemeButtonProps {
  theme?: ThemeName;
  onClick?: () => void;
  collapsed?: boolean;
}

export function ThemeButton({ theme, onClick, collapsed }: ThemeButtonProps) {
  const { isDarkMode, setTheme } = useTheme();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setTheme(isDarkMode ? 'light' : 'dark');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      aria-label="Toggle theme"
      className={collapsed ? "w-10 h-10 p-2" : ""}
    >
      {isDarkMode ? (
        <Sun className={collapsed ? "h-4 w-4" : "h-5 w-5"} />
      ) : (
        <Moon className={collapsed ? "h-4 w-4" : "h-5 w-5"} />
      )}
      {!collapsed && <span className="ml-2">Theme</span>}
    </Button>
  );
}

// Add default export for compatibility
export default ThemeButton;
