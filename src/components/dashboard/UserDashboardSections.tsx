
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import EmotionScanSection from './EmotionScanSection';
import SocialCocoonWidget from './SocialCocoonWidget';
import UserSidePanel from './UserSidePanel';
import VRPromptWidget from '../vr/VRPromptWidget';
import GamificationWidget from './GamificationWidget';
import { User } from '@/types/user';
import { VRSessionTemplate } from '@/types/vr';

interface SectionProps {
  title: string;
  collapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
  children: React.ReactNode;
}

export const DashboardSection: React.FC<SectionProps> = ({
  title,
  collapsed,
  onToggle,
  isMobile = false,
  children
}) => {
  return (
    <div className="card-premium p-4 lg:p-4">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={onToggle}
      >
        <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold heading-elegant`}>
          {title}
        </h2>
        <Button variant="ghost" size="sm" className="p-1 h-auto focus-premium">
          {collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </Button>
      </div>
      
      {!collapsed && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
};

interface EmotionSectionProps {
  collapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
  userId?: string;
}

export const EmotionDashboardSection: React.FC<EmotionSectionProps> = ({ 
  collapsed, 
  onToggle, 
  isMobile,
  userId
}) => {
  return (
    <DashboardSection 
      title={isMobile ? 'Santé Émotionnelle' : 'Votre Santé Émotionnelle'} 
      collapsed={collapsed} 
      onToggle={onToggle}
      isMobile={isMobile}
    >
      <EmotionScanSection collapsed={collapsed} onToggle={onToggle} userId={userId} />
    </DashboardSection>
  );
};

interface SocialSectionProps {
  collapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
  userId?: string;
}

export const SocialDashboardSection: React.FC<SocialSectionProps> = ({ 
  collapsed, 
  onToggle, 
  isMobile,
  userId
}) => {
  return (
    <DashboardSection 
      title="Communauté" 
      collapsed={collapsed} 
      onToggle={onToggle}
      isMobile={isMobile}
    >
      <SocialCocoonWidget collapsed={collapsed} onToggle={onToggle} userId={userId} />
    </DashboardSection>
  );
};

interface ProfileSectionProps {
  collapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
  userId?: string;
}

export const ProfileDashboardSection: React.FC<ProfileSectionProps> = ({ 
  collapsed, 
  onToggle, 
  isMobile,
  userId
}) => {
  return (
    <DashboardSection 
      title="Profil" 
      collapsed={collapsed} 
      onToggle={onToggle}
      isMobile={isMobile}
    >
      <UserSidePanel collapsed={collapsed} onToggle={onToggle} userId={userId} />
    </DashboardSection>
  );
};

interface VRSectionProps {
  collapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
  latestEmotion?: {
    emotion: string;
    score: number;
  };
}

export const VRDashboardSection: React.FC<VRSectionProps> = ({ 
  collapsed, 
  onToggle, 
  isMobile,
  latestEmotion
}) => {
  // Find a suitable VR template based on the latest emotion
  const recommendedTemplate: VRSessionTemplate = latestEmotion ? {
    id: 'recommended',
    title: 'Session recommandée',
    description: 'Session recommandée basée sur votre état émotionnel',
    duration: 5 * 60, // Convert to seconds
    emotion: latestEmotion.emotion,
    tags: ['recommandation', 'personnalisé'],
    // Additional properties for backward compatibility
    theme: 'Méditation guidée',
    is_audio_only: true,
    preview_url: '',
    audio_url: '/audio/meditation-guided.mp3',
    emotion_target: latestEmotion.emotion,
    difficulty: 'easy',
    benefits: ['Réduction du stress', 'Amélioration de la concentration']
  } : undefined;
  
  return (
    <DashboardSection 
      title="Micro-pause VR" 
      collapsed={collapsed} 
      onToggle={onToggle}
      isMobile={isMobile}
    >
      <VRPromptWidget template={recommendedTemplate} />
    </DashboardSection>
  );
};

interface GamificationSectionProps {
  collapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
  userId?: string;
}

export const GamificationDashboardSection: React.FC<GamificationSectionProps> = ({ 
  collapsed, 
  onToggle, 
  isMobile,
  userId
}) => {
  return (
    <DashboardSection 
      title="Récompenses" 
      collapsed={collapsed} 
      onToggle={onToggle}
      isMobile={isMobile}
    >
      <GamificationWidget collapsed={collapsed} onToggle={onToggle} userId={userId} />
    </DashboardSection>
  );
};
