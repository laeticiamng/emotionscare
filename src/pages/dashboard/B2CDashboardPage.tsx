
import React from 'react';
import UserDashboard from '@/components/dashboard/UserDashboard';
import { useAuth } from '@/contexts/AuthContext';

const B2CDashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <div>Chargement...</div>;
  }

  return <UserDashboard user={user} />;
};

export default B2CDashboardPage;
