
import { useState } from 'react';

interface DashboardState {
  minimalView: boolean;
  collapsedSections: {
    [key: string]: boolean;
  };
}

export default function useDashboardState() {
  const [state, setState] = useState<DashboardState>({
    minimalView: false,
    collapsedSections: {
      emotionScan: false,
      charts: false,
      recommendations: false,
      gamification: false,
      social: false,
      sidePanel: false,
      modules: false
    }
  });

  const toggleMinimalView = () => {
    setState(prev => ({
      ...prev,
      minimalView: !prev.minimalView
    }));
  };

  const toggleSection = (section: string) => {
    setState(prev => ({
      ...prev,
      collapsedSections: {
        ...prev.collapsedSections,
        [section]: !prev.collapsedSections[section]
      }
    }));
  };

  return {
    minimalView: state.minimalView,
    collapsedSections: state.collapsedSections,
    toggleMinimalView,
    toggleSection
  };
}
