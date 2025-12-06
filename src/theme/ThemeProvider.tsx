// @ts-nocheck
/**
 * @deprecated Utiliser @/providers/theme à la place
 * Ce fichier est conservé pour la rétrocompatibilité
 */

import { useThemeToggle } from '@/providers/theme';

export { 
  ThemeProvider, 
  useTheme 
} from '@/providers/theme';

/**
 * @deprecated Utiliser useThemeToggle() à la place
 */
export function ThemeToggle() {
  const { toggle } = useThemeToggle();
  const { theme } = useTheme();
  
  const label = theme === "light" ? "Passer en sombre" : theme === "dark" ? "Thème système" : "Passer en clair";
  
  return (
    <button aria-label={label} onClick={toggle} style={{ padding: 8, borderRadius: 10 }}>
      {theme === "light" ? "🌞" : theme === "dark" ? "🌚" : "💻"}
    </button>
  );
}

// Import manquant
import { useTheme } from '@/providers/theme';
