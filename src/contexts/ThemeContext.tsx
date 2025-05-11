
import React, { createContext, useContext, useState } from 'react';
import { Theme, FontFamily, FontSize } from '@/types/user';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  setThemePreference: (theme: Theme) => void;
  toggleTheme: () => void;
  fontFamily: FontFamily;
  setFontFamily: (fontFamily: FontFamily) => void;
  fontSize: FontSize;
  setFontSize: (fontSize: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  setThemePreference: () => {},
  toggleTheme: () => {},
  fontFamily: 'inter',
  setFontFamily: () => {},
  fontSize: 'medium',
  setFontSize: () => {}
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [fontFamily, setFontFamily] = useState<FontFamily>('inter');
  const [fontSize, setFontSize] = useState<FontSize>('medium');

  const setThemePreference = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      setThemePreference, 
      toggleTheme,
      fontFamily,
      setFontFamily,
      fontSize,
      setFontSize
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
