
import React, { useCallback } from 'react';
import DashboardHeader from './DashboardHeader';
import ModulesSection from '@/components/home/ModulesSection';
import DashboardHero from './DashboardHero';
import type { User } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDashboardHero } from '@/hooks/useDashboardHero';
import DashboardViewToggle from './DashboardViewToggle';
import DashboardContent from './DashboardContent';
import useDashboardState from '@/hooks/useDashboardState';
import useLogger from '@/hooks/useLogger';
import { useUserMode } from '@/contexts/UserModeContext';
import { LucideIcon } from 'lucide-react';

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
  const { userMode } = useUserMode();
  
  // Refresh all user dashboard data
  const refreshDashboardData = useCallback(async () => {
    logger.debug('Refreshing dashboard data');
    await refetchDashboardHero();
  }, [refetchDashboardHero, logger]);

  logger.debug('Rendering UserDashboard component');
  
  // Map the KPI and shortcut types correctly between different interfaces
  const typedKpis: DashboardHero["props"]["kpis"] = kpis ? kpis.map((kpi: any) => ({
    key: kpi.id || kpi.key || kpi.label,
    value: kpi.value,
    label: kpi.label,
    trend: kpi.trend || kpi.change,
    icon: kpi.icon as LucideIcon
  })) : [];

  const typedShortcuts: DashboardHero["props"]["shortcuts"] = shortcuts ? shortcuts.map((shortcut: any) => ({
    name: shortcut.name || shortcut.label,
    label: shortcut.label || shortcut.name,
    icon: shortcut.icon as LucideIcon,
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
      
      {/* Only show modules section for non-admin users */}
      {userMode !== 'b2b-admin' && (
        <ModulesSection 
          collapsed={collapsedSections.modules} 
          onToggle={() => toggleSection('modules')} 
          selectedMood={latestEmotion?.emotion}
        />
      )}
      
      {/* Main Dashboard Content */}
      <DashboardContent
        isMobile={isMobile}
        minimalView={minimalView}
        collapsedSections={collapsedSections}
        toggleSection={toggleSection}
        userId={user?.id || ''}
        latestEmotion={latestEmotion}
        userMode={userMode}
      />
    </div>
  );
};

export default UserDashboard;
