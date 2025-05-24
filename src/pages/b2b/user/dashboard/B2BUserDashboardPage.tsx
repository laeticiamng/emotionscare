
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UserDashboard from '@/components/dashboard/UserDashboard';
import { User } from '@/types/user';

const B2BUserDashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Chargement...</div>;
  }

  const userWithRole: User = {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.firstName || user.user_metadata?.name || 'Collaborateur',
    role: 'b2b_user',
    avatar: user.user_metadata?.avatar
  };

  return <UserDashboard user={userWithRole} />;
};

export default B2BUserDashboardPage;
