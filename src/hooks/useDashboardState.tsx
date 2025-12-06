
import { useState, useCallback } from 'react';

interface CollapsedSections {
  emotion: boolean;
  social: boolean;
  vr: boolean;
  gamification: boolean;
  profile: boolean;
  modules: boolean;
}

interface DashboardStateReturn {
  minimalView: boolean;
  collapsedSections: CollapsedSections;
  toggleMinimalView: () => void;
  toggleSection: (section: keyof CollapsedSections) => void;
  collapseAll: () => void;
  expandAll: () => void;
}

export default function useDashboardState(): DashboardStateReturn {
  const [minimalView, setMinimalView] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<CollapsedSections>({
    emotion: false,
    social: false,
    vr: false,
    gamification: false,
    profile: false,
    modules: false
  });

  const toggleMinimalView = useCallback(() => {
    setMinimalView(prev => !prev);
  }, []);

  const toggleSection = useCallback((section: keyof CollapsedSections) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  const collapseAll = useCallback(() => {
    setCollapsedSections({
      emotion: true,
      social: true,
      vr: true,
      gamification: true,
      profile: true,
      modules: true
    });
  }, []);

  const expandAll = useCallback(() => {
    setCollapsedSections({
      emotion: false,
      social: false,
      vr: false,
      gamification: false,
      profile: false,
      modules: false
    });
  }, []);

  return {
    minimalView,
    collapsedSections,
    toggleMinimalView,
    toggleSection,
    collapseAll,
    expandAll
  };
}
