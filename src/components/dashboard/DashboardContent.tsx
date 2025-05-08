
import React from 'react';
import { 
  EmotionDashboardSection, 
  SocialDashboardSection,
  ProfileDashboardSection,
  VRDashboardSection,
  GamificationDashboardSection
} from './UserDashboardSections';
import type { DashboardSectionState } from '@/hooks/useDashboardState';

interface DashboardContentProps {
  isMobile: boolean;
  minimalView: boolean;
  collapsedSections: DashboardSectionState;
  toggleSection: (section: keyof DashboardSectionState) => void;
  userId: string;
  latestEmotion?: {
    emotion: string;
    score: number;
  };
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  isMobile,
  minimalView,
  collapsedSections,
  toggleSection,
  userId,
  latestEmotion
}) => {
  return (
    <div className="dashboard-premium mt-6">
      {/* Main Content Area */}
      <div className="dashboard-main">
        {/* Emotion Scan Section */}
        <EmotionDashboardSection
          collapsed={collapsedSections.emotionScan}
          onToggle={() => toggleSection('emotionScan')}
          isMobile={isMobile}
        />
        
        {/* Social Section - Only in full view */}
        {(!minimalView || isMobile) && (
          <div className="mt-6">
            <SocialDashboardSection
              collapsed={collapsedSections.social}
              onToggle={() => toggleSection('social')}
              isMobile={isMobile}
            />
          </div>
        )}
      </div>
      
      {/* Side Panel */}
      <div className="dashboard-side">
        {/* User Side Panel */}
        <ProfileDashboardSection
          collapsed={collapsedSections.sidePanel}
          onToggle={() => toggleSection('sidePanel')}
          isMobile={isMobile}
        />
        
        {/* VR Prompt Widget */}
        <div className="mt-6">
          <VRDashboardSection
            collapsed={collapsedSections.vr}
            onToggle={() => toggleSection('vr')}
            isMobile={isMobile}
            latestEmotion={latestEmotion}
          />
        </div>
        
        {/* Gamification Widget - Only in full view or on mobile */}
        {(!minimalView || isMobile) && (
          <div className="mt-6">
            <GamificationDashboardSection
              collapsed={collapsedSections.gamification}
              onToggle={() => toggleSection('gamification')}
              isMobile={isMobile}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;
