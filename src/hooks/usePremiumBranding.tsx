// @ts-nocheck

import { useContext } from 'react';
import { BrandingContext, BrandingContextType } from '@/contexts/BrandingContext';

export const usePremiumBranding = () => {
  const context = useContext(BrandingContext);
  
  if (context === undefined) {
    throw new Error("usePremiumBranding must be used within a BrandingProvider");
  }
  
  const {
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
    logoUrl,
    setLogoUrl,
    companyName,
    setCompanyName,
    customCss,
    setCustomCss,
    theme,
    setTheme
  } = context;
  
  // Predefined themes
  const applyTheme = (themeName: string) => {
    switch (themeName) {
      case 'ocean':
        setPrimaryColor('#1a73e8');
        setSecondaryColor('#34a853');
        theme === 'dark' ? setTheme('dark') : setTheme('light');
        break;
      case 'sunset':
        setPrimaryColor('#ff7043');
        setSecondaryColor('#ffb74d');
        theme === 'dark' ? setTheme('dark') : setTheme('light');
        break;
      case 'forest':
        setPrimaryColor('#4caf50');
        setSecondaryColor('#8bc34a');
        theme === 'dark' ? setTheme('dark') : setTheme('light');
        break;
      case 'purple':
        setPrimaryColor('#673ab7');
        setSecondaryColor('#9c27b0');
        theme === 'dark' ? setTheme('dark') : setTheme('light');
        break;
      case 'corporate':
        setPrimaryColor('#0277bd');
        setSecondaryColor('#0288d1');
        theme === 'dark' ? setTheme('dark') : setTheme('light');
        break;
      default:
        setPrimaryColor('#1a73e8');
        setSecondaryColor('#34a853');
        theme === 'dark' ? setTheme('dark') : setTheme('light');
    }
  };
  
  return {
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
    logoUrl,
    setLogoUrl,
    companyName,
    setCompanyName,
    customCss,
    setCustomCss,
    theme,
    setTheme,
    applyTheme
  };
};

export default usePremiumBranding;
