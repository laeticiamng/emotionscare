
import React, { createContext, useState, useEffect, useContext } from 'react';
import { ThemeContextType, Theme, FontFamily, FontSize } from '@/types/theme';

// Contexte de thème avec valeurs par défaut
export const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  toggleTheme: () => {},
  isDark: false
});

export const useTheme = () => useContext(ThemeContext);

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'system'
}) => {
  // État pour le thème, avec fallback sur system
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  // État pour le thème système détecté (dark ou light)
  const [systemTheme, setSystemTheme] = useState<'dark' | 'light'>('light');
  // État pour les préférences de police
  const [fontFamily, setFontFamily] = useState<FontFamily>('system');
  // État pour la taille de police
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  // État pour les préférences d'accessibilité
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);
  
  // Effet pour charger le thème depuis localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const storedFontFamily = localStorage.getItem('fontFamily') as FontFamily | null;
    const storedFontSize = localStorage.getItem('fontSize') as FontSize | null;
    
    // Utiliser le thème stocké si disponible, sinon le thème par défaut
    if (storedTheme && ['light', 'dark', 'system', 'pastel'].includes(storedTheme)) {
      setThemeState(storedTheme);
    }
    
    // Charger les préférences de police si disponibles
    if (storedFontFamily) {
      setFontFamily(storedFontFamily as FontFamily);
    }
    
    if (storedFontSize) {
      setFontSize(storedFontSize as FontSize);
    }
    
    // Charger les préférences d'accessibilité
    const storedSoundEnabled = localStorage.getItem('soundEnabled');
    const storedReduceMotion = localStorage.getItem('reduceMotion');
    
    if (storedSoundEnabled !== null) {
      setSoundEnabled(storedSoundEnabled === 'true');
    }
    
    if (storedReduceMotion !== null) {
      setReduceMotion(storedReduceMotion === 'true');
    }
  }, []);
  
  // Effet pour détecter le thème du système
  useEffect(() => {
    // Détecter le thème du système
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    
    // Appliquer immédiatement
    handleChange(mediaQuery);
    
    // Écouter les changements
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback pour navigateurs plus anciens
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);
  
  // Effet pour appliquer le thème au document
  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');
    
    // Nettoyer les classes existantes
    root.classList.remove('light', 'dark', 'pastel');
    
    // Appliquer la classe appropriée
    if (theme === 'pastel') {
      root.classList.add('pastel');
    } else {
      root.classList.add(isDark ? 'dark' : 'light');
    }
    
    // Appliquer les préférences de police
    if (fontFamily) {
      document.body.style.fontFamily = getActualFontFamily(fontFamily);
    }
    
    // Appliquer la taille de police
    if (fontSize) {
      document.body.setAttribute('data-font-size', fontSize);
    }
    
    // Appliquer les préférences d'accessibilité
    document.body.setAttribute('data-reduce-motion', reduceMotion ? 'true' : 'false');
  }, [theme, systemTheme, fontFamily, fontSize, reduceMotion]);
  
  // Fonction pour définir le thème et le stocker
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };
  
  // Helper pour basculer entre les thèmes
  const toggleTheme = () => {
    const currentIsDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');
    setTheme(currentIsDark ? 'light' : 'dark');
  };
  
  // Fonction pour définir la police et la stocker
  const setFontFamilyValue = (family: FontFamily) => {
    setFontFamily(family);
    localStorage.setItem('fontFamily', family);
  };
  
  // Fonction pour définir la taille de police et la stocker
  const setFontSizeValue = (size: FontSize) => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
  };
  
  // Détecter si le mode actuel est sombre
  const isDarkMode = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');
  const isDark = isDarkMode; // Alias pour compatibilité
  
  // Fonction d'aide pour obtenir la véritable famille de police CSS
  function getActualFontFamily(family: FontFamily): string {
    switch (family) {
      case 'sans':
        return 'ui-sans-serif, system-ui, sans-serif';
      case 'serif':
        return 'ui-serif, Georgia, Cambria, serif';
      case 'mono':
        return 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
      case 'rounded':
        return 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
      case 'monospace':
        return 'Consolas, Monaco, "Andale Mono", monospace';
      case 'sans-serif':
        return 'Helvetica, Arial, sans-serif';
      case 'system':
      default:
        return 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
    }
  }
  
  // Fonction pour déterminer si un texte doit être blanc ou noir sur un fond de couleur
  const getContrastText = (color: string): 'black' | 'white' => {
    // Conversion hex à RGB
    let r, g, b;
    
    if (color.startsWith('#')) {
      if (color.length === 4) {
        r = parseInt(color[1] + color[1], 16);
        g = parseInt(color[2] + color[2], 16);
        b = parseInt(color[3] + color[3], 16);
      } else {
        r = parseInt(color.slice(1, 3), 16);
        g = parseInt(color.slice(3, 5), 16);
        b = parseInt(color.slice(5, 7), 16);
      }
    } else if (color.startsWith('rgb')) {
      const match = color.match(/(\d+),\s*(\d+),\s*(\d+)/);
      if (match) {
        r = parseInt(match[1]);
        g = parseInt(match[2]);
        b = parseInt(match[3]);
      } else {
        return 'black'; // Fallback
      }
    } else {
      return 'black'; // Fallback pour les autres formats
    }
    
    // Calculer la luminance (formule YIQ)
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
  };
  
  // Mettre à jour les préférences d'accessibilité
  const updatePreferences = (prefs: { soundEnabled?: boolean; reduceMotion?: boolean }) => {
    if (prefs.soundEnabled !== undefined) {
      setSoundEnabled(prefs.soundEnabled);
      localStorage.setItem('soundEnabled', prefs.soundEnabled.toString());
    }
    
    if (prefs.reduceMotion !== undefined) {
      setReduceMotion(prefs.reduceMotion);
      localStorage.setItem('reduceMotion', prefs.reduceMotion.toString());
    }
  };
  
  return (
    <ThemeContext.Provider 
      value={{
        theme,
        setTheme,
        isDark,
        isDarkMode,
        fontSize,
        setFontSize: setFontSizeValue,
        fontFamily,
        setFontFamily: setFontFamilyValue,
        toggleTheme,
        getContrastText,
        soundEnabled,
        reduceMotion,
        systemTheme,
        preferences: { soundEnabled, reduceMotion },
        updatePreferences
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
