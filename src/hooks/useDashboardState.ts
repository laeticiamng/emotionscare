
import { useState, useCallback, useEffect } from 'react';

export interface DashboardSectionState {
  [key: string]: boolean;
}

// Define the missing DashboardKpi and DashboardShortcut interfaces
export interface DashboardKpi {
  key: string;
  value: string | number;
  label: string;
  trend?: number;
  icon: React.ComponentType<any>;
}

export interface DashboardShortcut {
  name: string;
  icon: React.ComponentType<any>;
  to: string;
  description?: string;
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
