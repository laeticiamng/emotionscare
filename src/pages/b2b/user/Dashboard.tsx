
import React, { useState } from 'react';
import { useUserMode } from '@/contexts/UserModeContext';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { useIsMobile } from '@/hooks/use-mobile';
import useDashboardState from '@/hooks/useDashboardState';
import { useAuth } from '@/contexts/AuthContext';

const B2BUserDashboard: React.FC = () => {
  const { userMode, setUserMode } = useUserMode();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { 
    minimalView, 
    collapsedSections, 
    toggleSection, 
    toggleMinimalView 
  } = useDashboardState();
  const [latestEmotion, setLatestEmotion] = useState({ emotion: 'focused', score: 0.7 });
  
  // Ensure the user mode is set correctly
  React.useEffect(() => {
    setUserMode('b2b-user');
  }, [setUserMode]);
  
  return (
    <DashboardContent 
      isMobile={isMobile}
      minimalView={minimalView}
      collapsedSections={collapsedSections}
      toggleSection={toggleSection}
      userId={user?.id || ''}
      latestEmotion={latestEmotion}
      userMode={userMode}
    />
  );
};

export default B2BUserDashboard;
