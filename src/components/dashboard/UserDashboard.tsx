
import React, { useState } from 'react';
import DashboardHeader from './DashboardHeader';
import UserSidePanel from './UserSidePanel';
import ModulesSection from './ModulesSection';
import EmotionScanSection from './EmotionScanSection';
import SocialCocoonWidget from './SocialCocoonWidget';
import GamificationWidget from './GamificationWidget';
import DashboardFooter from './DashboardFooter';
import type { User } from '@/types';
import VRPromptWidget from '../vr/VRPromptWidget';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface UserDashboardProps {
  user: User | null;
  latestEmotion?: {
    emotion: string;
    score: number;
  };
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, latestEmotion }) => {
  const [minimalView, setMinimalView] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({
    modules: false,
    emotionScan: false,
    sidePanel: false,
    social: false,
    gamification: false,
    vr: false
  });
  
  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <DashboardHeader user={user} />
        <Button 
          variant="outline" 
          className="ml-auto"
          onClick={() => setMinimalView(!minimalView)}
        >
          {minimalView ? 'Vue Complète' : 'Vue Minimaliste'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Area */}
        <div className="col-span-1 lg:col-span-8 space-y-6">
          {/* Modules Section */}
          <div className="bg-card rounded-lg shadow-sm border p-4">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('modules')}
            >
              <h2 className="text-xl font-semibold">Modules</h2>
              <Button variant="ghost" size="sm">
                {collapsedSections.modules ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </Button>
            </div>
            
            {!collapsedSections.modules && (
              <div className="mt-4">
                <ModulesSection />
              </div>
            )}
          </div>
          
          {/* Emotion Scan Section */}
          <div className="bg-card rounded-lg shadow-sm border p-4">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('emotionScan')}
            >
              <h2 className="text-xl font-semibold">Votre Santé Émotionnelle</h2>
              <Button variant="ghost" size="sm">
                {collapsedSections.emotionScan ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </Button>
            </div>
            
            {!collapsedSections.emotionScan && (
              <div className="mt-4">
                <EmotionScanSection />
              </div>
            )}
          </div>
          
          {/* Social Section - Only in full view */}
          {!minimalView && (
            <div className="bg-card rounded-lg shadow-sm border p-4">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('social')}
              >
                <h2 className="text-xl font-semibold">Communauté</h2>
                <Button variant="ghost" size="sm">
                  {collapsedSections.social ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </Button>
              </div>
              
              {!collapsedSections.social && (
                <div className="mt-4">
                  <SocialCocoonWidget />
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Side Panel */}
        <div className="col-span-1 lg:col-span-4 space-y-6">
          {/* User Side Panel */}
          <div className="bg-card rounded-lg shadow-sm border p-4">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('sidePanel')}
            >
              <h2 className="text-xl font-semibold">Profil</h2>
              <Button variant="ghost" size="sm">
                {collapsedSections.sidePanel ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </Button>
            </div>
            
            {!collapsedSections.sidePanel && (
              <div className="mt-4">
                <UserSidePanel />
              </div>
            )}
          </div>
          
          {/* VR Prompt Widget */}
          <div className="bg-card rounded-lg shadow-sm border p-4">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('vr')}
            >
              <h2 className="text-xl font-semibold">Micro-pause VR</h2>
              <Button variant="ghost" size="sm">
                {collapsedSections.vr ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </Button>
            </div>
            
            {!collapsedSections.vr && (
              <div className="mt-4">
                <VRPromptWidget 
                  userId={user?.id || '00000000-0000-0000-0000-000000000000'} 
                  latestEmotion={latestEmotion}
                />
              </div>
            )}
          </div>
          
          {/* Gamification Widget - Only in full view */}
          {!minimalView && (
            <div className="bg-card rounded-lg shadow-sm border p-4">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('gamification')}
              >
                <h2 className="text-xl font-semibold">Récompenses</h2>
                <Button variant="ghost" size="sm">
                  {collapsedSections.gamification ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </Button>
              </div>
              
              {!collapsedSections.gamification && (
                <div className="mt-4">
                  <GamificationWidget />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <DashboardFooter />
    </div>
  );
};

export default UserDashboard;
