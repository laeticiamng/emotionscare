
import React, { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useBranding } from '@/contexts/BrandingContext';
import { useSoundscape } from '@/providers/SoundscapeProvider';
import StoryDrawer from '@/components/storytelling/StoryDrawer';
import StoryNotification from '@/components/storytelling/StoryNotification';
import { useStorytelling } from '@/providers/StorytellingProvider';
import { useNavigate } from 'react-router-dom';
import { usePredictiveAnalytics } from '@/providers/PredictiveAnalyticsProvider';
import PredictiveInsightToast from '@/components/predictive/PredictiveInsightToast';
import { Recommendation } from '@/types';

interface BrandingManagerProps {
  children: React.ReactNode;
}

const BrandingManager: React.FC<BrandingManagerProps> = ({ children }) => {
  const { brandingTheme, emotionalTone, colors } = useBranding();
  const { soundscapeType } = useSoundscape();
  const { theme } = useTheme();
  const { activeStory } = useStorytelling();
  const { recommendations } = usePredictiveAnalytics();
  const [storyDrawerOpen, setStoryDrawerOpen] = useState(false);
  const [showPredictiveToast, setShowPredictiveToast] = useState(false);
  const navigate = useNavigate();
  
  // Apply CSS variables for theming
  useEffect(() => {
    const root = document.documentElement;
    
    // Set primary colors
    root.style.setProperty('--color-brand-primary', colors.primary);
    root.style.setProperty('--color-brand-secondary', colors.secondary);
    root.style.setProperty('--color-brand-accent', colors.accent);
    root.style.setProperty('--color-brand-highlight', colors.highlight || '#22c55e');
    
    // Set additional variables based on theme
    root.setAttribute('data-branding', brandingTheme);
    root.setAttribute('data-emotional-tone', emotionalTone);
    root.setAttribute('data-soundscape', soundscapeType);
    
    // Apply premium styles
    if (brandingTheme === 'ultra-premium') {
      document.body.classList.add('ultra-premium');
    } else {
      document.body.classList.remove('ultra-premium');
    }
    
  }, [theme, brandingTheme, emotionalTone, colors, soundscapeType]);
  
  // Open story drawer when active story changes
  useEffect(() => {
    if (activeStory) {
      setStoryDrawerOpen(true);
    }
  }, [activeStory]);
  
  // Show predictive toast when new recommendations arrive
  useEffect(() => {
    if (recommendations && recommendations.length > 0) {
      // Only show toast for high confidence recommendations
      const highConfidenceRecs = recommendations.filter(rec => rec.priority > 0);
      if (highConfidenceRecs.length > 0) {
        setShowPredictiveToast(true);
        
        // Auto-hide after 10 seconds
        const timer = setTimeout(() => {
          setShowPredictiveToast(false);
        }, 10000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [recommendations]);
  
  // Handle CTA click by navigating to the provided route
  const handleCTAClick = (route: string) => {
    navigate(route);
  };
  
  return (
    <>
      {children}
      
      {/* Story components */}
      <StoryNotification position="bottom-right" />
      <StoryDrawer 
        open={storyDrawerOpen} 
        onClose={() => setStoryDrawerOpen(false)} 
        onCTAClick={handleCTAClick}
      />
      
      {/* Predictive insights toast */}
      {showPredictiveToast && recommendations.length > 0 && (
        <PredictiveInsightToast 
          recommendation={{
            ...recommendations[0],
            confidence: recommendations[0].confidence || 0.8  // Add default confidence if missing
          }}
          onClose={() => setShowPredictiveToast(false)}
        />
      )}
    </>
  );
};

export default BrandingManager;
