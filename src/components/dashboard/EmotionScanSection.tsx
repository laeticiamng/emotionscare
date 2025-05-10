
import React from 'react';
import { Separator } from '@/components/ui/separator';
import EmotionScanCard from '@/components/dashboard/EmotionScanCard';
import SocialCocoonWidget from '@/components/dashboard/SocialCocoonWidget';

interface EmotionScanSectionProps {
  className?: string;
  collapsed?: boolean;
  onToggle?: () => void;
  userId?: string;
  latestEmotion?: {
    emotion: string;
    score: number;
  };
}

const EmotionScanSection: React.FC<EmotionScanSectionProps> = ({ 
  className,
  collapsed,
  onToggle,
  userId,
  latestEmotion
}) => {
  return (
    <div className={`md:col-span-2 ${className || ''}`}>
      <EmotionScanCard className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }} />
      <SocialCocoonWidget className="animate-slide-up" style={{ animationDelay: '0.2s' }} />
    </div>
  );
};

export default EmotionScanSection;
