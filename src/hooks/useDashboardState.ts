import { useState, useCallback, useEffect } from 'react';
import { logger } from '@/lib/logger';

interface CollapsedSections {
  [key: string]: boolean;
}

interface DashboardState {
  minimalView: boolean;
  collapsedSections: CollapsedSections;
  toggleMinimalView: () => void;
  toggleSection: (section: string) => void;
}

const DEFAULT_COLLAPSED_SECTIONS: CollapsedSections = {
  emotion: false,
  social: true,
  modules: false,
  vr: true,
  gamification: true,
  profile: true
};

export const useDashboardState = (): DashboardState => {
  const [minimalView, setMinimalView] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<CollapsedSections>(DEFAULT_COLLAPSED_SECTIONS);
  
  // Load state from localStorage on mount
  useEffect(() => {
    const storedMinimalView = localStorage.getItem('dashboard_minimal_view');
    if (storedMinimalView) {
      setMinimalView(storedMinimalView === 'true');
    }
    
    const storedCollapsedSections = localStorage.getItem('dashboard_collapsed_sections');
    if (storedCollapsedSections) {
      try {
        const parsedSections = JSON.parse(storedCollapsedSections);
        setCollapsedSections(prevSections => ({
          ...prevSections,
          ...parsedSections
        }));
      } catch (error) {
        logger.error('Error parsing stored collapsed sections', error as Error, 'SYSTEM');
      }
    }
  }, []);
  
  // Toggle minimal view
  const toggleMinimalView = useCallback(() => {
    setMinimalView(prev => {
      const newValue = !prev;
      localStorage.setItem('dashboard_minimal_view', String(newValue));
      return newValue;
    });
  }, []);
  
  // Toggle section collapse state
  const toggleSection = useCallback((section: string) => {
    setCollapsedSections(prev => {
      const newSections = {
        ...prev,
        [section]: !prev[section]
      };
      
      localStorage.setItem('dashboard_collapsed_sections', JSON.stringify(newSections));
      return newSections;
    });
  }, []);
  
  return {
    minimalView,
    collapsedSections,
    toggleMinimalView,
    toggleSection
  };
};

export default useDashboardState;
