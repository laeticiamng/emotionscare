
import { createContext, useContext, useState, useEffect } from 'react';

export interface BrandingContextType {
  logoUrl: string;
  companyName: string;
  primaryColor: string;
  accentColor: string;
  setPrimaryColor: (color: string) => void;
  setAccentColor: (color: string) => void;
  setLogoUrl: (url: string) => void;
  setCompanyName: (name: string) => void;
}

const BrandingContext = createContext<BrandingContextType>({
  logoUrl: '/logo.svg',
  companyName: 'EmotionsCare',
  primaryColor: '#4f46e5',
  accentColor: '#10b981',
  setPrimaryColor: () => {},
  setAccentColor: () => {},
  setLogoUrl: () => {},
  setCompanyName: () => {},
});

export const BrandingProvider = ({ children }: { children: React.ReactNode }) => {
  const [logoUrl, setLogoUrl] = useState<string>('/logo.svg');
  const [companyName, setCompanyName] = useState<string>('EmotionsCare');
  const [primaryColor, setPrimaryColor] = useState<string>('#4f46e5');
  const [accentColor, setAccentColor] = useState<string>('#10b981');
  
  // Load branding from localStorage on mount
  useEffect(() => {
    const savedBranding = localStorage.getItem('branding');
    if (savedBranding) {
      const { logoUrl, companyName, primaryColor, accentColor } = JSON.parse(savedBranding);
      if (logoUrl) setLogoUrl(logoUrl);
      if (companyName) setCompanyName(companyName);
      if (primaryColor) setPrimaryColor(primaryColor);
      if (accentColor) setAccentColor(accentColor);
    }
  }, []);
  
  // Save branding to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('branding', JSON.stringify({
      logoUrl,
      companyName,
      primaryColor,
      accentColor,
    }));
    
    // Apply branding as CSS variables
    document.documentElement.style.setProperty('--primary', primaryColor);
    document.documentElement.style.setProperty('--accent', accentColor);
  }, [logoUrl, companyName, primaryColor, accentColor]);
  
  return (
    <BrandingContext.Provider value={{
      logoUrl,
      companyName,
      primaryColor,
      accentColor,
      setLogoUrl,
      setCompanyName,
      setPrimaryColor,
      setAccentColor,
    }}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => useContext(BrandingContext);

export default useBranding;
