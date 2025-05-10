
import React from 'react';
import CoachAssistant from '@/components/dashboard/CoachAssistant';
import GamificationWidget from '@/components/dashboard/GamificationWidget';
import { UserMode } from '@/contexts/UserModeContext';

interface UserSidePanelProps {
  className?: string;
  collapsed?: boolean;
  onToggle?: () => void;
  userId?: string;
  userMode?: UserMode;
}

const UserSidePanel: React.FC<UserSidePanelProps> = ({ 
  className,
  collapsed,
  onToggle,
  userId,
  userMode
}) => {
  return (
    <div className={`flex flex-col ${className || ''}`}>
      <CoachAssistant className="mb-6 animate-slide-up glass-card" style={{ animationDelay: '0.3s' }} />
      <GamificationWidget className="animate-slide-up glass-card" style={{ animationDelay: '0.4s' }} />
    </div>
  );
};

export default UserSidePanel;
