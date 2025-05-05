
import React from 'react';
import DashboardHeader from './DashboardHeader';
import UserSidePanel from './UserSidePanel';
import ModulesSection from './ModulesSection';
import EmotionScanSection from './EmotionScanSection';
import SocialCocoonWidget from './SocialCocoonWidget';
import GamificationWidget from './GamificationWidget';
import DashboardFooter from './DashboardFooter';
import type { User } from '@/types';
import VRPromptWidget from '../vr/VRPromptWidget';

interface UserDashboardProps {
  user: User | null;
  latestEmotion?: {
    emotion: string;
    score: number;
  };
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, latestEmotion }) => {
  
  return (
    <div className="space-y-6">
      <DashboardHeader user={user} />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Area */}
        <div className="col-span-1 lg:col-span-8 space-y-6">
          
          <ModulesSection />
          <EmotionScanSection />
          
        </div>
        
        {/* Side Panel */}
        <div className="col-span-1 lg:col-span-4 space-y-6">
          <UserSidePanel />
          
          {/* Add VR Prompt Widget */}
          <VRPromptWidget 
            userId={user?.id || '00000000-0000-0000-0000-000000000000'} 
            latestEmotion={latestEmotion}
          />
          
          <SocialCocoonWidget />
          <GamificationWidget />
        </div>
      </div>
      
      <DashboardFooter />
    </div>
  );
};

export default UserDashboard;
