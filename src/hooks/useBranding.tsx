
import { useTheme } from '@/contexts/ThemeContext';

export interface BrandingOptions {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  variant?: 'default' | 'minimal' | 'text-only';
}

export const useBranding = () => {
  const { theme } = useTheme();
  
  const getPrimaryColor = () => {
    switch (theme) {
      case 'dark': return '#9b87f5'; // Purple glow in dark mode
      case 'pastel': return '#7E69AB'; // Softer purple for pastel
      default: return '#6E59A5'; // Standard purple
    }
  };
  
  return {
    primaryColor: getPrimaryColor(),
    brandName: 'EmotionsCare',
    theme
  };
};

export default useBranding;
