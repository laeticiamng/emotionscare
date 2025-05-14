
import React from 'react';
import { UserRole } from '@/types/user';

export interface UserSidePanelProps {
  collapsed: boolean;
  onToggle: () => void;
  userId?: string;
  userMode?: UserRole;
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
