
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UserDashboard from '@/components/dashboard/UserDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  // Determine if the user is an admin/direction or a regular user
  const isAdmin = user?.role === 'admin' || user?.role === 'direction';
  
  return (
    <div className="container mx-auto py-6">
      {isAdmin ? <AdminDashboard /> : <UserDashboard />}
    </div>
  );
};

export default DashboardPage;
