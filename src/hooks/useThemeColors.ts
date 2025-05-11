
import { useEffect, useState } from 'react';
import { useBranding } from './useBranding';
import { Theme } from '@/types/branding';

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  muted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export const useThemeColors = () => {
  const { theme, isDarkMode } = useBranding();
  const [colors, setColors] = useState<ColorPalette>({
    primary: '',
    secondary: '',
    accent: '',
    background: '',
    text: '',
    muted: '',
    border: '',
    success: '',
    warning: '',
    error: '',
    info: ''
  });

  useEffect(() => {
    let newColors: ColorPalette;
    
    if (isDarkMode) {
      newColors = {
        primary: 'hsl(210, 100%, 52%)',
        secondary: 'hsl(280, 60%, 52%)',
        accent: 'hsl(330, 80%, 52%)',
        background: 'hsl(220, 13%, 18%)',
        text: 'hsl(220, 6%, 90%)',
        muted: 'hsl(220, 6%, 50%)',
        border: 'hsl(220, 13%, 25%)',
        success: 'hsl(160, 84%, 39%)',
        warning: 'hsl(30, 100%, 50%)',
        error: 'hsl(0, 84%, 60%)',
        info: 'hsl(210, 100%, 77%)',
      };
    } else {
      newColors = {
        primary: 'hsl(210, 100%, 45%)',
        secondary: 'hsl(280, 60%, 45%)',
        accent: 'hsl(330, 80%, 45%)',
        background: 'hsl(0, 0%, 100%)',
        text: 'hsl(220, 13%, 10%)',
        muted: 'hsl(220, 13%, 40%)',
        border: 'hsl(220, 13%, 91%)',
        success: 'hsl(160, 84%, 39%)',
        warning: 'hsl(30, 100%, 50%)',
        error: 'hsl(0, 84%, 60%)',
        info: 'hsl(210, 100%, 60%)',
      };
    }
    
    // Apply "pastel" theme colors if that theme is active
    const isPastel = theme === 'pastel' as Theme;
    
    if (isPastel) {
      newColors = {
        ...newColors,
        primary: 'hsl(180, 60%, 60%)',
        secondary: 'hsl(310, 50%, 75%)',
        accent: 'hsl(30, 70%, 75%)',
        background: isDarkMode ? 'hsl(240, 10%, 20%)' : 'hsl(50, 30%, 96%)',
        text: isDarkMode ? 'hsl(240, 10%, 90%)' : 'hsl(240, 10%, 30%)',
        muted: isDarkMode ? 'hsl(240, 5%, 60%)' : 'hsl(240, 5%, 50%)',
        border: isDarkMode ? 'hsl(240, 10%, 28%)' : 'hsl(240, 20%, 90%)',
      };
    }
    
    setColors(newColors);
  }, [theme, isDarkMode]);
  
  // Color scheme detection helper
  const getPrimaryColorScheme = () => {
    // Check if pastel theme
    const isPastel = theme === 'pastel' as Theme;
    
    if (isPastel) {
      return 'pastel';
    }
    
    return isDarkMode ? 'dark' : 'light';
  };
  
  return {
    colors,
    getPrimaryColorScheme,
    isDarkMode
  };
};

export default useThemeColors;
