
import React from 'react';

export interface UserSidePanelProps {
  collapsed: boolean;
  onToggle: () => void;
  userId?: string;
}

const UserSidePanel: React.FC<UserSidePanelProps> = ({ collapsed, onToggle, userId }) => {
  return (
    <div>
      <p>User Side Panel</p>
    </div>
  );
};

export default UserSidePanel;
