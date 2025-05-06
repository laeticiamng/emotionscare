
import React, { useState } from 'react';
import DashboardHeader from './DashboardHeader';
import UserSidePanel from './UserSidePanel';
import ModulesSection from '@/components/home/ModulesSection';
import EmotionScanSection from './EmotionScanSection';
import SocialCocoonWidget from './SocialCocoonWidget';
import GamificationWidget from './GamificationWidget';
import DashboardFooter from './DashboardFooter';
import type { User } from '@/types';
import VRPromptWidget from '../vr/VRPromptWidget';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, LayoutDashboard, LayoutGrid } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [collapsedSections, setCollapsedSections] = useState({
    modules: false,
    emotionScan: isMobile,
    sidePanel: isMobile,
    social: isMobile,
    gamification: isMobile,
    vr: isMobile
  });
  
  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  return (
    <div className="animate-fade-in w-full">
      <div className="flex justify-between items-center flex-wrap gap-3 mb-8">
        <DashboardHeader user={user} />
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
      
      {/* Modules Section - Using our reusable component */}
      <ModulesSection collapsed={collapsedSections.modules} onToggle={() => toggleSection('modules')} />
      
      <div className="dashboard-premium mt-6">
        {/* Main Content Area */}
        <div className="dashboard-main">
          {/* Emotion Scan Section */}
          <div className="card-premium p-6 lg:p-8">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('emotionScan')}
            >
              <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold heading-elegant`}>
                {isMobile ? 'Santé Émotionnelle' : 'Votre Santé Émotionnelle'}
              </h2>
              <Button variant="ghost" size="sm" className="p-1 h-auto focus-premium">
                {collapsedSections.emotionScan ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
              </Button>
            </div>
            
            {!collapsedSections.emotionScan && (
              <div className="mt-6">
                <EmotionScanSection />
              </div>
            )}
          </div>
          
          {/* Social Section - Only in full view */}
          {(!minimalView || isMobile) && (
            <div className="card-premium p-6 lg:p-8 mt-6">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('social')}
              >
                <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold heading-elegant`}>Communauté</h2>
                <Button variant="ghost" size="sm" className="p-1 h-auto focus-premium">
                  {collapsedSections.social ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                </Button>
              </div>
              
              {!collapsedSections.social && (
                <div className="mt-6">
                  <SocialCocoonWidget />
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Side Panel */}
        <div className="dashboard-side">
          {/* User Side Panel */}
          <div className="card-premium p-6 lg:p-8">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('sidePanel')}
            >
              <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold heading-elegant`}>Profil</h2>
              <Button variant="ghost" size="sm" className="p-1 h-auto focus-premium">
                {collapsedSections.sidePanel ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
              </Button>
            </div>
            
            {!collapsedSections.sidePanel && (
              <div className="mt-6">
                <UserSidePanel />
              </div>
            )}
          </div>
          
          {/* VR Prompt Widget */}
          <div className="card-premium p-6 lg:p-8 mt-6">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('vr')}
            >
              <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold heading-elegant`}>Micro-pause VR</h2>
              <Button variant="ghost" size="sm" className="p-1 h-auto focus-premium">
                {collapsedSections.vr ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
              </Button>
            </div>
            
            {!collapsedSections.vr && (
              <div className="mt-6">
                <VRPromptWidget 
                  userId={user?.id || '00000000-0000-0000-0000-000000000000'} 
                  latestEmotion={latestEmotion}
                />
              </div>
            )}
          </div>
          
          {/* Gamification Widget - Only in full view or on mobile */}
          {(!minimalView || isMobile) && (
            <div className="card-premium p-6 lg:p-8 mt-6">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('gamification')}
              >
                <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold heading-elegant`}>Récompenses</h2>
                <Button variant="ghost" size="sm" className="p-1 h-auto focus-premium">
                  {collapsedSections.gamification ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                </Button>
              </div>
              
              {!collapsedSections.gamification && (
                <div className="mt-6">
                  <GamificationWidget />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {!isMobile && <DashboardFooter />}
    </div>
  );
};

export default UserDashboard;
