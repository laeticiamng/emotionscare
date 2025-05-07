
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import EmotionScanSection from './EmotionScanSection';
import SocialCocoonWidget from './SocialCocoonWidget';
import UserSidePanel from './UserSidePanel';
import VRPromptWidget from '../vr/VRPromptWidget';
import GamificationWidget from './GamificationWidget';
import { User } from '@/types';

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
}

export const EmotionDashboardSection: React.FC<EmotionSectionProps> = ({ 
  collapsed, 
  onToggle, 
  isMobile 
}) => {
  return (
    <DashboardSection 
      title={isMobile ? 'Santé Émotionnelle' : 'Votre Santé Émotionnelle'} 
      collapsed={collapsed} 
      onToggle={onToggle}
      isMobile={isMobile}
    >
      <EmotionScanSection />
    </DashboardSection>
  );
};

interface SocialSectionProps {
  collapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

export const SocialDashboardSection: React.FC<SocialSectionProps> = ({ 
  collapsed, 
  onToggle, 
  isMobile 
}) => {
  return (
    <DashboardSection 
      title="Communauté" 
      collapsed={collapsed} 
      onToggle={onToggle}
      isMobile={isMobile}
    >
      <SocialCocoonWidget />
    </DashboardSection>
  );
};

interface ProfileSectionProps {
  collapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

export const ProfileDashboardSection: React.FC<ProfileSectionProps> = ({ 
  collapsed, 
  onToggle, 
  isMobile 
}) => {
  return (
    <DashboardSection 
      title="Profil" 
      collapsed={collapsed} 
      onToggle={onToggle}
      isMobile={isMobile}
    >
      <UserSidePanel />
    </DashboardSection>
  );
};

interface VRSectionProps {
  collapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
  userId: string;
  latestEmotion?: {
    emotion: string;
    score: number;
  };
}

export const VRDashboardSection: React.FC<VRSectionProps> = ({ 
  collapsed, 
  onToggle, 
  isMobile,
  userId,
  latestEmotion
}) => {
  return (
    <DashboardSection 
      title="Micro-pause VR" 
      collapsed={collapsed} 
      onToggle={onToggle}
      isMobile={isMobile}
    >
      <VRPromptWidget 
        userId={userId} 
        latestEmotion={latestEmotion}
      />
    </DashboardSection>
  );
};

interface GamificationSectionProps {
  collapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

export const GamificationDashboardSection: React.FC<GamificationSectionProps> = ({ 
  collapsed, 
  onToggle, 
  isMobile 
}) => {
  return (
    <DashboardSection 
      title="Récompenses" 
      collapsed={collapsed} 
      onToggle={onToggle}
      isMobile={isMobile}
    >
      <GamificationWidget />
    </DashboardSection>
  );
};
