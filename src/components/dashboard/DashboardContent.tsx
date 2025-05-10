
import React from 'react';
import { Card } from '@/components/ui/card';
import TrendCharts from './TrendCharts';
import EmotionScanSection from './EmotionScanSection';
import CoachRecommendations from '../coach/CoachRecommendations';
import GamificationWidget from './GamificationWidget';
import SocialCocoonWidget from './SocialCocoonWidget';
import UserSidePanel from './UserSidePanel';
import FeatureHub from '../features/FeatureHub';
import SecurityCertifications from '../features/SecurityCertifications';
import { UserMode } from '@/contexts/UserModeContext';

interface DashboardContentProps {
  isMobile: boolean;
  minimalView: boolean;
  collapsedSections: {
    [key: string]: boolean;
  };
  toggleSection: (section: string) => void;
  userId: string;
  latestEmotion?: {
    emotion: string;
    score: number;
  };
  userMode?: UserMode;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  isMobile,
  minimalView,
  collapsedSections,
  toggleSection,
  userId,
  latestEmotion,
  userMode
}) => {
  // Specific B2B admin components would be rendered here
  if (userMode === 'b2b-admin') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Vue d'ensemble de l'équipe</h2>
            <div className="h-64 bg-muted/20 rounded-md flex items-center justify-center">
              Graphique des tendances émotionnelles de l'équipe (données anonymisées)
            </div>
          </Card>
          
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Analyse des tendances</h2>
            <div className="h-64 bg-muted/20 rounded-md flex items-center justify-center">
              Données anonymisées d'absentéisme et de bien-être
            </div>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Suggestions d'activités</h2>
            <div className="space-y-2">
              <div className="p-3 bg-muted/20 rounded-md">Atelier de respiration en groupe</div>
              <div className="p-3 bg-muted/20 rounded-md">Session de team building</div>
              <div className="p-3 bg-muted/20 rounded-md">Pause musicale collective</div>
            </div>
          </Card>
          
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Notifications importantes</h2>
            <div className="space-y-2">
              <div className="p-3 bg-muted/20 rounded-md">Rappel: Semaine du bien-être</div>
              <div className="p-3 bg-muted/20 rounded-md">3 nouveaux membres ont rejoint l'équipe</div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Render different layouts based on screen size and preferences
  if (isMobile) {
    return (
      <div className="space-y-8">
        <EmotionScanSection 
          collapsed={collapsedSections.emotionScan}
          onToggle={() => toggleSection('emotionScan')}
          userId={userId}
          latestEmotion={latestEmotion}
        />
        
        <TrendCharts 
          collapsed={collapsedSections.charts}
          onToggle={() => toggleSection('charts')}
          userId={userId}
        />
        
        <CoachRecommendations 
          collapsed={collapsedSections.recommendations}
          onToggle={() => toggleSection('recommendations')}
          emotion={latestEmotion?.emotion}
        />
        
        <FeatureHub />
        
        {userMode === 'b2c' && (
          <GamificationWidget
            collapsed={collapsedSections.gamification}
            onToggle={() => toggleSection('gamification')}
            userId={userId}
          />
        )}
        
        {userMode === 'b2c' && (
          <SocialCocoonWidget 
            collapsed={collapsedSections.social}
            onToggle={() => toggleSection('social')}
            userId={userId}
          />
        )}
        
        <SecurityCertifications />
      </div>
    );
  }

  if (minimalView) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmotionScanSection 
          collapsed={collapsedSections.emotionScan}
          onToggle={() => toggleSection('emotionScan')}
          userId={userId}
          latestEmotion={latestEmotion}
        />
        
        <TrendCharts 
          collapsed={collapsedSections.charts}
          onToggle={() => toggleSection('charts')}
          userId={userId}
        />
        
        <CoachRecommendations 
          collapsed={collapsedSections.recommendations}
          onToggle={() => toggleSection('recommendations')}
          emotion={latestEmotion?.emotion}
        />
        
        <FeatureHub />
        
        {userMode === 'b2c' && (
          <GamificationWidget
            collapsed={collapsedSections.gamification}
            onToggle={() => toggleSection('gamification')}
            userId={userId}
          />
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <EmotionScanSection 
          collapsed={collapsedSections.emotionScan}
          onToggle={() => toggleSection('emotionScan')}
          userId={userId}
          latestEmotion={latestEmotion}
        />
        
        <TrendCharts 
          collapsed={collapsedSections.charts}
          onToggle={() => toggleSection('charts')}
          userId={userId}
        />
        
        <FeatureHub />
        
        <CoachRecommendations 
          collapsed={collapsedSections.recommendations}
          onToggle={() => toggleSection('recommendations')}
          emotion={latestEmotion?.emotion}
        />
        
        {userMode === 'b2c' && (
          <GamificationWidget
            collapsed={collapsedSections.gamification}
            onToggle={() => toggleSection('gamification')}
            userId={userId}
          />
        )}
      </div>
      
      <div className="space-y-6">
        <UserSidePanel
          collapsed={collapsedSections.sidePanel}
          onToggle={() => toggleSection('sidePanel')}
          userId={userId}
          userMode={userMode}
        />
        
        <SecurityCertifications />
      </div>
    </div>
  );
};

export default DashboardContent;
