
import React, { createContext, useState, ReactNode } from 'react';

export interface BrandingContextType {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  secondaryColor: string;
  setSecondaryColor: (color: string) => void;
  logoUrl: string;
  setLogoUrl: (url: string) => void;
  companyName: string;
  setCompanyName: (name: string) => void;
  customCss: string;
  setCustomCss: (css: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
  isDarkMode?: boolean;
}

export const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

interface BrandingProviderProps {
  children: ReactNode;
}

export const BrandingProvider: React.FC<BrandingProviderProps> = ({ children }) => {
  const [primaryColor, setPrimaryColor] = useState<string>('#1a73e8');
  const [secondaryColor, setSecondaryColor] = useState<string>('#34a853');
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('Your Company');
  const [customCss, setCustomCss] = useState<string>('');
  const [theme, setTheme] = useState<string>('light');

  const value: BrandingContextType = {
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
    isDarkMode: theme === 'dark'
  };

  return <BrandingContext.Provider value={value}>{children}</BrandingContext.Provider>;
};

export default BrandingProvider;
