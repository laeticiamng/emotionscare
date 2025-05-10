
import { useState, useCallback, useEffect } from 'react';

export interface DashboardSectionState {
  [key: string]: boolean;
}

const useDashboardState = () => {
  const [minimalView, setMinimalView] = useState(() => {
    const stored = localStorage.getItem('dashboard_minimal_view');
    return stored ? JSON.parse(stored) : false;
  });

  const [collapsedSections, setCollapsedSections] = useState<DashboardSectionState>(() => {
    const stored = localStorage.getItem('dashboard_collapsed_sections');
    return stored ? JSON.parse(stored) : {
      modules: false,
      emotions: false,
      charts: false,
      recommendations: false,
      emotionScan: false,
      social: false,
      sidePanel: false,
      vr: false,
      gamification: false
    };
  });

  useEffect(() => {
    localStorage.setItem('dashboard_minimal_view', JSON.stringify(minimalView));
  }, [minimalView]);

  useEffect(() => {
    localStorage.setItem('dashboard_collapsed_sections', JSON.stringify(collapsedSections));
  }, [collapsedSections]);

  const toggleMinimalView = useCallback(() => {
    setMinimalView(prev => !prev);
  }, []);

  const toggleSection = useCallback((sectionKey: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  }, []);

  return {
    minimalView,
    collapsedSections,
    toggleMinimalView,
    toggleSection
  };
};

export default useDashboardState;
