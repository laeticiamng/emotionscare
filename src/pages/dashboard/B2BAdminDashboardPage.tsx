
import React from 'react';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import { useAuth } from '@/contexts/AuthContext';

const B2BAdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <div>Chargement...</div>;
  }

  return <AdminDashboard user={user} />;
};

export default B2BAdminDashboardPage;
