
import React from 'react';
import { UserModeType } from '@/types/types';

export interface UserSidePanelProps {
  collapsed: boolean;
  onToggle: () => void;
  userId?: string;
  userMode?: UserModeType;
}

const UserSidePanel: React.FC<UserSidePanelProps> = ({ collapsed, onToggle, userId, userMode }) => {
  return (
    <div>
      <p>User Side Panel</p>
      {userMode && <p>User Mode: {userMode}</p>}
    </div>
  );
};

export default UserSidePanel;
