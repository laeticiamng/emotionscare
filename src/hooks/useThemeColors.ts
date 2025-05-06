
/**
 * useThemeColors.ts
 * Hook personnalisé pour accéder aux couleurs du thème actuel
 */

import { useTheme } from '@/contexts/ThemeContext';
import { themes, wellnessColors } from '@/themes/theme';

/**
 * Hook pour accéder facilement aux couleurs du thème actuel
 * @returns Un objet contenant les couleurs du thème actif et les couleurs wellness
 */
export const useThemeColors = () => {
  const { theme } = useTheme();
  
  // Récupérer les couleurs du thème actif
  const colors = themes[theme];
  
  return {
    // Couleurs du thème actif
    colors,
    
    // Couleurs wellness toujours disponibles
    wellness: wellnessColors,
    
    // Indique si le thème actuel est le thème sombre
    isDarkTheme: theme === 'dark',
    
    // Indique si le thème actuel est le thème pastel
    isPastelTheme: theme === 'pastel',
    
    // Nom du thème actuel
    currentTheme: theme
  };
};

export default useThemeColors;
