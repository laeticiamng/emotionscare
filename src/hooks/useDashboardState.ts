
import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface DashboardState {
  minimalView: boolean;
  collapsedSections: { [key: string]: boolean };
  toggleSection: (section: string) => void;
  toggleMinimalView: () => void;
}

const useDashboardState = (): DashboardState => {
  const [minimalView, setMinimalView] = useLocalStorage('dashboard_minimal_view', false);
  const [collapsedSections, setCollapsedSections] = useLocalStorage('dashboard_collapsed_sections', {
    emotionalCheckin: false,
    trends: false,
    journal: false,
    reminders: false,
    coach: false,
    modules: false
  });

  const toggleSection = useCallback((section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, [setCollapsedSections]);

  const toggleMinimalView = useCallback(() => {
    setMinimalView(prev => !prev);
  }, [setMinimalView]);

  return {
    minimalView,
    collapsedSections,
    toggleSection,
    toggleMinimalView
  };
};

export default useDashboardState;
