
import { useState, useCallback, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import useLogger from '@/hooks/useLogger';

export interface DashboardSectionState {
  modules: boolean;
  emotionScan: boolean;
  sidePanel: boolean;
  social: boolean;
  gamification: boolean;
  vr: boolean;
}

export interface DashboardViewState {
  minimalView: boolean;
}

export function useDashboardState() {
  const logger = useLogger('useDashboardState');
  const isMobile = useIsMobile();
  const [minimalView, setMinimalView] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<DashboardSectionState>({
    modules: false,
    emotionScan: isMobile,
    sidePanel: isMobile,
    social: isMobile,
    gamification: isMobile,
    vr: isMobile
  });
  
  // Handle toggle for individual sections
  const toggleSection = useCallback((section: keyof DashboardSectionState) => {
    logger.debug(`Toggling section: ${section}`);
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, [logger]);

  // Toggle minimal view
  const toggleMinimalView = useCallback(() => {
    logger.debug(`Toggling minimal view: ${!minimalView}`);
    setMinimalView(prev => !prev);
  }, [minimalView, logger]);
  
  // Adjust collapsed state based on device type
  useEffect(() => {
    logger.debug('Adjusting sections based on device', { isMobile });
    if (isMobile) {
      setCollapsedSections(prev => ({
        ...prev,
        emotionScan: true,
        sidePanel: true,
        social: true,
        gamification: true,
        vr: true
      }));
    }
  }, [isMobile, logger]);
  
  return {
    isMobile,
    minimalView,
    collapsedSections,
    toggleSection,
    toggleMinimalView
  };
}

export default useDashboardState;
