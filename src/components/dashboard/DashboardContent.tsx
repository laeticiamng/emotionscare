import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UserDashboard from '@/components/dashboard/UserDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import B2BUserDashboard from '@/components/dashboard/B2BUserDashboard';
import { normalizeRole } from '@/utils/roleUtils';

const DashboardContent: React.FC = () => {
  const { user } = useAuth();

  // Fix the role comparison issue
  const renderDashboard = () => {
    if (!user) return null;
    
    const normalizedRole = normalizeRole(user.role);
    
    if (normalizedRole === 'b2b_user') {
      return <B2BUserDashboard />;
    } else if (normalizedRole === 'b2b_admin') {
      return <AdminDashboard />;
    } else {
      return <UserDashboard />;
    }
  };

  return (
    <div>
      {renderDashboard()}
    </div>
  );
};

export default DashboardContent;
