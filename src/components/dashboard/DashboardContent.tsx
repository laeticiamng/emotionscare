
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
import PredictiveRecommendations from '@/components/predictive/PredictiveRecommendations';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

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
  console.log('Rendering DashboardContent with userMode:', userMode);
  
  // Pour le mode B2B admin
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
          
          <div className="group relative">
            <Link to="/predictive" className="absolute inset-0 z-10" aria-label="Voir les prédictions avancées"></Link>
            <Card className="p-4 relative transition-all hover:shadow-md group-hover:border-primary/50">
              <h2 className="text-xl font-semibold mb-4">Prédictions avancées</h2>
              <div className="space-y-2">
                <div className="p-3 bg-muted/20 rounded-md">Prédiction de pic d'absentéisme</div>
                <div className="p-3 bg-muted/20 rounded-md">Alerte préventive burnout</div>
              </div>
              <div className="absolute right-4 top-4 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Premium
              </div>
            </Card>
          </div>
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

  // Pour les modes utilisateurs
  // Render différents layouts basés sur la taille de l'écran et les préférences
  if (isMobile) {
    return (
      <div className="space-y-8">
        <EmotionScanSection 
          collapsed={collapsedSections.emotionScan}
          onToggle={() => toggleSection('emotionScan')}
          userId={userId}
          latestEmotion={latestEmotion}
        />
        
        <div className="group relative">
          <Link to="/predictive" className="absolute inset-0 z-10" aria-label="Voir les prédictions avancées"></Link>
          <PredictiveRecommendations 
            maxRecommendations={1}
            className="relative transition-all hover:shadow-md group-hover:border-primary/50"
          />
          <div className="absolute right-4 top-4 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Premium
          </div>
        </div>
        
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
        
        <div className="group relative">
          <Link to="/predictive" className="absolute inset-0 z-10" aria-label="Voir les prédictions avancées"></Link>
          <PredictiveRecommendations 
            maxRecommendations={2}
            className="relative transition-all hover:shadow-md group-hover:border-primary/50"
          />
          <div className="absolute right-4 top-4 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Premium
          </div>
        </div>
        
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
        
        <div className="group relative">
          <Link to="/predictive" className="absolute inset-0 z-10" aria-label="Voir les prédictions avancées"></Link>
          <Card className="p-4 relative transition-all hover:shadow-md group-hover:border-primary/50">
            <h2 className="text-xl font-semibold mb-4">Prédictions personnalisées</h2>
            <div className="space-y-2">
              <div className="p-3 bg-muted/20 rounded-md">Recommandation d'activité: Méditation guidée</div>
              <div className="p-3 bg-muted/20 rounded-md">Alerte: Risque de stress détecté pour mardi</div>
              <div className="p-3 bg-muted/20 rounded-md">Suggestion: Planifier une pause à 15h30</div>
            </div>
            <div className="absolute right-4 top-4 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Premium
            </div>
          </Card>
        </div>
        
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
        
        {/* Conditionally render based on userMode */}
        {(userMode === 'b2c' || userMode === 'personal') && (
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
