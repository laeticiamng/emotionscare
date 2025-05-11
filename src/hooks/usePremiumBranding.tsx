
import { useEffect } from 'react';
import { useBranding } from '@/hooks/useBranding';
import { useMusic } from '@/contexts/MusicContext';
import { useRouter } from '@/hooks/router';

interface PremiumBrandingOptions {
  enableSoundBranding?: boolean;
  enableAdaptiveBranding?: boolean;
  emotion?: string;
  route?: string;
}

/**
 * Hook for advanced branding features with premium sound and visual identity
 */
export function usePremiumBranding(options: PremiumBrandingOptions = {}) {
  const {
    enableSoundBranding = true,
    enableAdaptiveBranding = true,
    emotion,
    route,
  } = options;
  
  const branding = useBranding();
  const { pathname } = useRouter();
  const { currentPlaylist, loadPlaylistForEmotion } = useMusic();
  
  // Apply route-based branding
  useEffect(() => {
    const currentRoute = route || pathname;
    
    // Apply different branding based on routes
    if (currentRoute.includes('onboarding')) {
      // Welcoming, calm branding
      if (branding.setTheme) {
        branding.setTheme('light');
      }
    } else if (currentRoute.includes('scan')) {
      // More focused branding for scan
      if (branding.setTheme) {
        branding.setTheme('light');
      }
    } else if (currentRoute.includes('music')) {
      // Energetic branding for music sections
      if (branding.setTheme) {
        branding.setTheme('light');
      }
    } else if (currentRoute.includes('profile')) {
      // Neutral, professional branding for profile
      if (branding.setTheme) {
        branding.setTheme('light');
      }
    } else if (currentRoute.includes('dashboard')) {
      // Default to calm for dashboard
      if (branding.setTheme) {
        branding.setTheme('light');
      }
    }
  }, [pathname, route, branding]);

  // Apply emotion-based branding when emotion changes
  useEffect(() => {
    if (emotion && enableAdaptiveBranding) {
      if (branding.setTheme) {
        branding.setTheme('light');
      }
    }
  }, [emotion, enableAdaptiveBranding, branding]);

  // Apply sound branding
  useEffect(() => {
    if (enableSoundBranding && !currentPlaylist) {
      // Map emotional tone to playlist type
      const playlistType = 'calm';
      loadPlaylistForEmotion(playlistType);
    }
  }, [enableSoundBranding, currentPlaylist]);

  // Build the appropriate CSS classes based on current branding
  const getCssClasses = () => {
    const densityClass = 'space-y-4 gap-4';
    const themeClass = 'premium-branding';
    
    return `${densityClass} ${themeClass}`;
  };

  return {
    brandingTheme: 'premium',
    emotionalTone: 'calm',
    soundEnabled: true,
    brandName: 'EmotionAI',
    cssClasses: getCssClasses(),
    primaryColor: branding.primaryColor || '#9b87f5',
    secondaryColor: '#6c63ff',
    accentColor: '#ff6584',
    highlightColor: '#8be9fd'
  };
}

export default usePremiumBranding;
