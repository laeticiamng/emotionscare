
import React from 'react';
import AdminDashboard from '@/components/dashboard/admin/AdminDashboard';
import { SegmentProvider } from '@/contexts/SegmentContext';
import Shell from '@/Shell';
import { useUserMode } from '@/contexts/UserModeContext';
import { useEffect } from 'react';

const AdminDashboardPage: React.FC = () => {
  const { setUserMode } = useUserMode();
  
  // S'assurer que le mode utilisateur est défini sur b2b-admin
  useEffect(() => {
    setUserMode('b2b-admin');
  }, [setUserMode]);
  
  return (
    <Shell>
      <div className="container mx-auto p-4">
        <SegmentProvider>
          <AdminDashboard />
        </SegmentProvider>
      </div>
    </Shell>
  );
};

export default AdminDashboardPage;
