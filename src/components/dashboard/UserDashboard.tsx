
import React, { useCallback } from 'react';
import DashboardHeader from './DashboardHeader';
import ModulesSection from '@/components/home/ModulesSection';
import DashboardHero from './DashboardHero';
import type { User } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDashboardHero } from '@/hooks/useDashboardHero';
import DashboardViewToggle from './DashboardViewToggle';
import DashboardContent from './DashboardContent';
import useDashboardState, { DashboardKpi, DashboardShortcut } from '@/hooks/useDashboardState';
import useLogger from '@/hooks/useLogger';

interface UserDashboardProps {
  user: User | null;
  latestEmotion?: {
    emotion: string;
    score: number;
  };
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, latestEmotion }) => {
  const logger = useLogger('UserDashboard');
  const isMobile = useIsMobile();
  const { kpis, shortcuts, isLoading, refetch: refetchDashboardHero } = useDashboardHero(user?.id);
  const { 
    minimalView, 
    collapsedSections, 
    toggleSection, 
    toggleMinimalView 
  } = useDashboardState();
  
  // Refresh all user dashboard data
  const refreshDashboardData = useCallback(async () => {
    logger.debug('Refreshing dashboard data');
    await refetchDashboardHero();
  }, [refetchDashboardHero, logger]);

  logger.debug('Rendering UserDashboard component');
  
  // Convert KPI and Shortcut types to required DashboardKpi and DashboardShortcut types
  // Updated to ensure correct type mapping including the label property
  const typedKpis: DashboardKpi[] = kpis ? kpis.map((kpi: any) => ({
    key: kpi.id || kpi.key || kpi.label,
    value: kpi.value,
    label: kpi.label,
    trend: kpi.trend || kpi.change,
    icon: kpi.icon
  })) : [];

  const typedShortcuts: DashboardShortcut[] = shortcuts ? shortcuts.map((shortcut: any) => ({
    name: shortcut.name || shortcut.label,
    label: shortcut.label || shortcut.name, // Ensure label is always set
    icon: shortcut.icon,
    to: shortcut.to || shortcut.url || shortcut.route || '/',
    description: shortcut.description
  })) : [];
  
  return (
    <div className="animate-fade-in w-full">
      <div className="flex justify-between items-center flex-wrap gap-2 mb-6">
        <DashboardHeader 
          user={user} 
          onRefresh={refreshDashboardData}
        />
        {!isMobile && (
          <DashboardViewToggle
            minimalView={minimalView}
            onToggle={toggleMinimalView}
          />
        )}
      </div>
      
      {/* Hero Section */}
      <DashboardHero 
        userName={user?.name || 'Utilisateur'}
        kpis={typedKpis}
        shortcuts={typedShortcuts}
        isLoading={isLoading}
      />
      
      {/* Modules Section - Using our reusable component */}
      <ModulesSection 
        collapsed={collapsedSections.modules} 
        onToggle={() => toggleSection('modules')} 
      />
      
      {/* Main Dashboard Content */}
      <DashboardContent
        isMobile={isMobile}
        minimalView={minimalView}
        collapsedSections={collapsedSections}
        toggleSection={toggleSection}
        userId={user?.id || ''}
        latestEmotion={latestEmotion}
      />
    </div>
  );
};

export default UserDashboard;
