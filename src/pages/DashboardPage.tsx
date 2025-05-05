
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UserDashboard from '@/components/dashboard/UserDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import { isAdminRole, isUserRole } from '@/utils/roleUtils';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  // Determine dashboard type based on user role with appropriate fallback
  const isAdmin = isAdminRole(user?.role);
  const isUser = isUserRole(user?.role);
  
  // Default to UserDashboard if role is not explicitly admin/direction
  const renderDashboard = () => {
    if (isAdmin) {
      return <AdminDashboard />;
    } else if (isUser || !user?.role) {
      return <UserDashboard />;
    } else {
      console.warn(`Unknown user role: ${user?.role}, defaulting to UserDashboard`);
      return <UserDashboard />;
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      {renderDashboard()}
    </div>
  );
};

export default DashboardPage;
