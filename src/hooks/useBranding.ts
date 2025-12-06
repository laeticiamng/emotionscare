// @ts-nocheck

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase';
import { logger } from '@/lib/logger';

interface Branding {
  logoUrl: string;
  companyName: string;
  primaryColor: string;
  accentColor: string;
  isLoading: boolean;
}

export const useBranding = (): Branding => {
  const [logoUrl, setLogoUrl] = useState<string>('/logo.svg');
  const [companyName, setCompanyName] = useState<string>('EmotionsCare');
  const [primaryColor, setPrimaryColor] = useState<string>('#3b82f6');
  const [accentColor, setAccentColor] = useState<string>('#10b981');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadBranding = async () => {
      try {
        // In a real app, you'd fetch branding from the database
        // This is a mock implementation
        
        // Check if we have organization settings in localStorage first
        const cachedBranding = localStorage.getItem('organizationBranding');
        if (cachedBranding) {
          const brandingData = JSON.parse(cachedBranding);
          setLogoUrl(brandingData.logoUrl || '/logo.svg');
          setCompanyName(brandingData.companyName || 'EmotionsCare');
          setPrimaryColor(brandingData.primaryColor || '#3b82f6');
          setAccentColor(brandingData.accentColor || '#10b981');
          setIsLoading(false);
          return;
        }

        // Simulate loading from API/database
        setTimeout(() => {
          setLogoUrl('/logo.svg');
          setCompanyName('EmotionsCare');
          setPrimaryColor('#3b82f6');
          setAccentColor('#10b981');
          setIsLoading(false);
          
          // Cache the branding
          localStorage.setItem('organizationBranding', JSON.stringify({
            logoUrl: '/logo.svg',
            companyName: 'EmotionsCare',
            primaryColor: '#3b82f6',
            accentColor: '#10b981'
          }));
        }, 500);
      } catch (error) {
        logger.error('Error loading branding', error as Error, 'UI');
        setIsLoading(false);
      }
    };

    loadBranding();
  }, []);

  return {
    logoUrl,
    companyName,
    primaryColor,
    accentColor,
    isLoading
  };
};
