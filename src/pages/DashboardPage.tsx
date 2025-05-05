
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UserDashboard from '@/components/dashboard/UserDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import { isAdminRole } from '@/utils/roleUtils';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  // Determine if the user is an admin/direction or a regular user
  const isAdmin = isAdminRole(user?.role);
  
  return (
    <div className="container mx-auto py-6">
      {isAdmin ? <AdminDashboard /> : <UserDashboard />}
    </div>
  );
};

export default DashboardPage;
