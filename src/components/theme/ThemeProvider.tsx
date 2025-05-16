
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, FontFamily, FontSize, ThemeContextType } from '@/types/theme';

// Export the context so it can be imported elsewhere
export const ThemeContext = createContext<ThemeContextType>({
  theme: 'system', 
  setTheme: () => {}, 
  isDarkMode: false,
  fontSize: 'medium',
  setFontSize: () => {},
  fontFamily: 'system',
  setFontFamily: () => {},
  getContrastText: () => 'black',
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('system');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [fontFamily, setFontFamily] = useState<FontFamily>('system');

  useEffect(() => {
    // Initialize theme from localStorage or default
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    // Initialize font size from localStorage or default
    const savedFontSize = localStorage.getItem('fontSize') as FontSize | null;
    if (savedFontSize) {
      setFontSize(savedFontSize);
    }
    
    // Initialize font family from localStorage or default
    const savedFontFamily = localStorage.getItem('fontFamily') as FontFamily | null;
    if (savedFontFamily) {
      setFontFamily(savedFontFamily);
    }
    
    // Add global transition styles for theme changes
    document.documentElement.style.transition = 'background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease';
    document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
    
    // Clean up transition styles on unmount
    return () => {
      document.documentElement.style.transition = '';
      document.body.style.transition = '';
    };
  }, []);

  useEffect(() => {
    // Apply theme to document
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'pastel');

    let appliedTheme = theme;

    if (theme === 'system') {
      appliedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    root.classList.add(appliedTheme);
    setIsDarkMode(appliedTheme === 'dark');
    localStorage.setItem('theme', theme);
    
    // Apply enhanced theme-specific styles
    if (appliedTheme === 'dark') {
      // Dark theme: deeper shadows, glows on interactive elements
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light', 'theme-pastel');
      
      // Adjust font size slightly larger for dark mode readability if needed
      if (fontSize === 'medium') {
        root.style.fontSize = '1.05rem';
      }
    } else if (appliedTheme === 'pastel') {
      // Pastel theme: softer shadows, airy feel
      document.body.classList.add('theme-pastel');
      document.body.classList.remove('theme-light', 'theme-dark');
      
      // Reset font size
      root.style.fontSize = '';
    } else {
      // Light theme: crisp shadows, airy feel
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark', 'theme-pastel');
      
      // Reset font size
      root.style.fontSize = '';
    }
  }, [theme, fontSize]);
  
  useEffect(() => {
    // Save font settings to localStorage
    if (fontSize) localStorage.setItem('fontSize', fontSize);
    if (fontFamily) localStorage.setItem('fontFamily', fontFamily);
    
    // Apply font settings to document
    const root = window.document.documentElement;
    
    // Remove previous font size classes
    root.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl');
    
    // Add new font size class
    switch (fontSize) {
      case 'small':
      case 'sm':
        root.classList.add('text-sm');
        break;
      case 'medium':
      case 'md':
        root.classList.add('text-base');
        break;
      case 'large':
      case 'lg':
        root.classList.add('text-lg');
        break;
      case 'x-large':
      case 'xl':
        root.classList.add('text-xl');
        break;
      case 'extra-large':
        root.classList.add('text-2xl');
        break;
      default:
        root.classList.add('text-base');
    }
    
    // Apply font family
    document.body.style.fontFamily = getFontFamilyValue(fontFamily);
  }, [fontSize, fontFamily]);

  // Helper to convert font family enum to actual CSS value
  const getFontFamilyValue = (font: FontFamily): string => {
    switch (font) {
      case 'system':
      case 'system-ui':
      case 'default':
        return "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";
      case 'serif':
        return "Georgia, 'Times New Roman', serif";
      case 'sans-serif':
      case 'sans':
        return "Arial, Helvetica, sans-serif";
      case 'monospace':
      case 'mono':
        return "Consolas, Monaco, 'Courier New', monospace";
      case 'rounded':
        return "'Quicksand', 'Comic Sans MS', cursive, sans-serif";
      case 'inter':
        return "'Inter', sans-serif";
      default:
        return "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";
    }
  };

  // Helper function to get contrast text color
  const getContrastText = (color: string): 'black' | 'white' => {
    // Simple contrast calculation - can be enhanced later
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? 'black' : 'white';
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      isDarkMode,
      fontSize,
      setFontSize,
      fontFamily,
      setFontFamily,
      getContrastText
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
