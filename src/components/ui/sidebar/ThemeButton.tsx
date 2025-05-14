
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { Theme } from '@/types';

interface ThemeButtonProps {
  theme?: Theme;
  onClick?: () => void;
}

export function ThemeButton({ theme, onClick }: ThemeButtonProps) {
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
    >
      {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

// Add default export for compatibility
export default ThemeButton;
