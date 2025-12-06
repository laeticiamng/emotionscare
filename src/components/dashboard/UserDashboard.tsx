// @ts-nocheck

import React from 'react';
import EnhancedUserDashboard from '@/components/modern-features/EnhancedUserDashboard';
import { User } from '@/types/user';

interface UserDashboardProps {
  user: User;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  return <EnhancedUserDashboard user={user} />;
};

export default UserDashboard;
