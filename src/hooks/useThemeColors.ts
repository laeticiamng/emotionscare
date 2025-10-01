// @ts-nocheck

import { useContext } from 'react';
import { BrandingContext } from '@/contexts/BrandingContext';

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export function useThemeColors(): ThemeColors {
  const brandingContext = useContext(BrandingContext);
  
  if (!brandingContext) {
    throw new Error("useThemeColors must be used within BrandingProvider");
  }
  
  const { theme, isDarkMode, primaryColor, secondaryColor } = brandingContext;
  
  // Default colors based on theme
  const colors: ThemeColors = {
    primary: primaryColor || '#1a73e8',
    secondary: secondaryColor || '#34a853',
    background: isDarkMode ? '#121212' : '#ffffff',
    text: isDarkMode ? '#e0e0e0' : '#1f2937',
    border: isDarkMode ? '#333333' : '#e5e7eb',
    success: '#34a853',
    warning: '#fbbc05',
    error: '#ea4335',
    info: '#4285f4',
  };
  
  return colors;
}

export default useThemeColors;
