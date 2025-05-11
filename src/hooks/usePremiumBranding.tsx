
import { useEffect } from 'react';
import { useBranding } from '@/contexts/BrandingContext';
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
  
  const {
    brandingTheme,
    emotionalTone,
    visualDensity,
    colors,
    soundEnabled,
    brandName,
    applyEmotionalBranding
  } = useBranding();
  
  const { pathname } = useRouter();
  const { currentPlaylist, loadPlaylistForEmotion } = useMusic();

  // Apply route-based branding
  useEffect(() => {
    const currentRoute = route || pathname;
    
    // Apply different branding based on routes
    if (currentRoute.includes('onboarding')) {
      // Welcoming, calm branding for onboarding
      applyEmotionalBranding('calm');
    } else if (currentRoute.includes('scan')) {
      // More focused branding for scan
      applyEmotionalBranding('focused');
    } else if (currentRoute.includes('music')) {
      // Energetic branding for music sections
      applyEmotionalBranding('energetic');
    } else if (currentRoute.includes('profile')) {
      // Neutral, professional branding for profile
      applyEmotionalBranding('neutral');
    } else if (currentRoute.includes('dashboard')) {
      // Default to calm for dashboard
      applyEmotionalBranding('calm');
    }
  }, [pathname, route]);

  // Apply emotion-based branding when emotion changes
  useEffect(() => {
    if (emotion && enableAdaptiveBranding) {
      applyEmotionalBranding(emotion);
    }
  }, [emotion, enableAdaptiveBranding]);

  // Apply sound branding
  useEffect(() => {
    if (enableSoundBranding && soundEnabled && !currentPlaylist && emotionalTone) {
      // Map emotional tone to playlist type
      const toneToPlaylist: Record<string, string> = {
        energetic: 'energetic',
        calm: 'calm',
        focused: 'focused',
        joyful: 'happy',
        reflective: 'calm',
        neutral: 'neutral'
      };
      
      const playlistType = toneToPlaylist[emotionalTone];
      loadPlaylistForEmotion(playlistType);
    }
  }, [emotionalTone, enableSoundBranding, soundEnabled]);

  // Build the appropriate CSS classes based on current branding
  const getCssClasses = () => {
    const densityClass = {
      compact: 'space-y-2 gap-2',
      balanced: 'space-y-4 gap-4',
      spacious: 'space-y-6 gap-6'
    }[visualDensity];
    
    const themeClass = {
      standard: '',
      premium: 'premium-branding',
      'ultra-premium': 'ultra-premium-branding',
      minimal: 'minimal-branding'
    }[brandingTheme];
    
    return `${densityClass} ${themeClass}`;
  };

  return {
    brandingTheme,
    emotionalTone,
    visualDensity,
    colors,
    soundEnabled,
    brandName,
    cssClasses: getCssClasses(),
    primaryColor: colors.primary,
    secondaryColor: colors.secondary,
    accentColor: colors.accent,
    highlightColor: colors.highlight
  };
}

export default usePremiumBranding;
