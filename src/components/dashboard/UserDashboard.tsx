
import React, { useState, useCallback, useEffect } from 'react';
import DashboardHeader from './DashboardHeader';
import ModulesSection from '@/components/home/ModulesSection';
import DashboardHero from './DashboardHero';
import type { User } from '@/types';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, LayoutGrid } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDashboardHero } from '@/hooks/useDashboardHero';
import { 
  EmotionDashboardSection, 
  SocialDashboardSection,
  ProfileDashboardSection,
  VRDashboardSection,
  GamificationDashboardSection
} from './UserDashboardSections';

interface UserDashboardProps {
  user: User | null;
  latestEmotion?: {
    emotion: string;
    score: number;
  };
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, latestEmotion }) => {
  const [minimalView, setMinimalView] = useState(false);
  const isMobile = useIsMobile();
  const { kpis, shortcuts, isLoading, refetch: refetchDashboardHero } = useDashboardHero(user?.id);
  const [collapsedSections, setCollapsedSections] = useState({
    modules: false,
    emotionScan: isMobile,
    sidePanel: isMobile,
    social: isMobile,
    gamification: isMobile,
    vr: isMobile
  });
  
  const toggleSection = useCallback((section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);
  
  // Refresh all user dashboard data
  const refreshDashboardData = useCallback(async () => {
    await refetchDashboardHero();
  }, [refetchDashboardHero]);

  useEffect(() => {
    // Ajuster l'état de collapse des sections en fonction du type d'appareil
    if (isMobile) {
      setCollapsedSections(prev => ({
        ...prev,
        emotionScan: true,
        sidePanel: true,
        social: true,
        gamification: true,
        vr: true
      }));
    }
  }, [isMobile]);
  
  return (
    <div className="animate-fade-in w-full">
      <div className="flex justify-between items-center flex-wrap gap-2 mb-6">
        <DashboardHeader 
          user={user} 
          onRefresh={refreshDashboardData}
        />
        {!isMobile && (
          <Button 
            variant="outline" 
            className="ml-auto focus-premium btn-premium"
            onClick={() => setMinimalView(!minimalView)}
          >
            {minimalView ? (
              <>
                <LayoutDashboard size={18} />
                <span className="ml-2">Vue Complète</span>
              </>
            ) : (
              <>
                <LayoutGrid size={18} />
                <span className="ml-2">Vue Minimaliste</span>
              </>
            )}
          </Button>
        )}
      </div>
      
      {/* Hero Section */}
      <DashboardHero 
        userName={user?.name || 'Utilisateur'}
        kpis={kpis}
        shortcuts={shortcuts}
        isLoading={isLoading}
      />
      
      {/* Modules Section - Using our reusable component */}
      <ModulesSection 
        collapsed={collapsedSections.modules} 
        onToggle={() => toggleSection('modules')} 
      />
      
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
              userId={user?.id || '00000000-0000-0000-0000-000000000000'}
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
    </div>
  );
};

export default UserDashboard;
