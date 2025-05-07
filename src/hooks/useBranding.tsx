
import { useTheme } from '@/contexts/ThemeContext';

export interface BrandingOptions {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  variant?: 'default' | 'minimal' | 'text-only';
}

export const useBranding = () => {
  const { theme } = useTheme();
  
  const getLogoPath = () => {
    return '/lovable-uploads/e46a1af3-522c-43d2-bdb6-8d154343961a.png';
  };
  
  const getLogoSize = (size: BrandingOptions['size'] = 'md') => {
    switch (size) {
      case 'sm': return 'h-6 w-auto';
      case 'md': return 'h-8 w-auto';
      case 'lg': return 'h-12 w-auto';
      case 'xl': return 'h-24 w-auto';
      default: return 'h-8 w-auto';
    }
  };
  
  const getPrimaryColor = () => {
    switch (theme) {
      case 'dark': return '#9b87f5'; // Purple glow in dark mode
      case 'pastel': return '#7E69AB'; // Softer purple for pastel
      default: return '#6E59A5'; // Standard purple
    }
  };
  
  return {
    logoPath: getLogoPath(),
    getLogoSize,
    primaryColor: getPrimaryColor(),
    brandName: 'EmotionsCare',
    theme
  };
};

export default useBranding;
