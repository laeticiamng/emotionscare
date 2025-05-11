
import React from 'react';
import AdminDashboard from '@/components/dashboard/admin/AdminDashboard';
import { SegmentProvider } from '@/contexts/SegmentContext';
import { useUserMode } from '@/contexts/UserModeContext';

const AdminDashboardPage: React.FC = () => {
  const { setUserMode } = useUserMode();
  
  // S'assurer que le mode utilisateur est défini sur b2b-admin
  React.useEffect(() => {
    setUserMode('b2b-admin');
  }, [setUserMode]);
  
  return (
    <div className="container mx-auto p-4">
      <SegmentProvider>
        <AdminDashboard />
      </SegmentProvider>
    </div>
  );
};

export default AdminDashboardPage;
