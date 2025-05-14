
import React, { useCallback } from 'react';
import DashboardHeader from './DashboardHeader';
import ModulesSection from '@/components/home/ModulesSection';
import DashboardHero from './DashboardHero';
import type { User } from '@/types/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDashboardHero } from '@/hooks/useDashboardHero';
import DashboardViewToggle from './DashboardViewToggle';
import DashboardContent from './DashboardContent';
import useDashboardState from '@/hooks/useDashboardState';
import useLogger from '@/hooks/useLogger';
import { useUserMode } from '@/contexts/UserModeContext';
import { LucideIcon } from 'lucide-react';

// Import the types from DashboardHero
import type { DashboardKpi, DashboardShortcut } from './DashboardHero';

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
  const { kpis, shortcuts, isLoading, refetch } = useDashboardHero(user?.id);
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
    await refetch();
  }, [refetch, logger]);

  logger.debug('Rendering UserDashboard component');
  
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
        kpis={kpis}
        shortcuts={shortcuts}
        isLoading={isLoading}
      />
      
      {/* Only show modules section for non-admin users */}
      {userMode !== 'b2b_admin' && userMode !== 'b2b-admin' && (
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
