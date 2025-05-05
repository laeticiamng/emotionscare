
import React from 'react';
import CoachAssistant from '@/components/dashboard/CoachAssistant';
import GamificationWidget from '@/components/dashboard/GamificationWidget';

interface UserSidePanelProps {
  className?: string;
}

const UserSidePanel: React.FC<UserSidePanelProps> = ({ className }) => {
  return (
    <div className={`flex flex-col ${className || ''}`}>
      <CoachAssistant className="mb-6 animate-slide-up glass-card" style={{ animationDelay: '0.3s' }} />
      <GamificationWidget className="animate-slide-up glass-card" style={{ animationDelay: '0.4s' }} />
    </div>
  );
};

export default UserSidePanel;
