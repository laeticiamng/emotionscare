
import React, { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useBranding } from '@/contexts/BrandingContext';
import { useSoundscape } from '@/providers/SoundscapeProvider';
import StoryDrawer from '@/components/storytelling/StoryDrawer';
import StoryNotification from '@/components/storytelling/StoryNotification';
import { useStorytelling } from '@/providers/StorytellingProvider';

interface BrandingManagerProps {
  children: React.ReactNode;
}

const BrandingManager: React.FC<BrandingManagerProps> = ({ children }) => {
  const { brandingTheme, emotionalTone, colors } = useBranding();
  const { soundscapeType } = useSoundscape();
  const { theme } = useTheme();
  const { activeStory } = useStorytelling();
  const [storyDrawerOpen, setStoryDrawerOpen] = useState(false);
  
  // Apply CSS variables for theming
  useEffect(() => {
    const root = document.documentElement;
    
    // Set primary colors
    root.style.setProperty('--color-brand-primary', colors.primary);
    root.style.setProperty('--color-brand-secondary', colors.secondary);
    root.style.setProperty('--color-brand-accent', colors.accent);
    root.style.setProperty('--color-brand-highlight', colors.highlight);
    
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
  
  return (
    <>
      {children}
      
      {/* Story components */}
      <StoryNotification position="bottom-right" />
      <StoryDrawer open={storyDrawerOpen} onClose={() => setStoryDrawerOpen(false)} />
    </>
  );
};

export default BrandingManager;
