
import React from 'react';
import AdminDashboard from '@/components/dashboard/admin/AdminDashboard';
import { SegmentProvider } from '@/contexts/SegmentContext';
import Shell from '@/Shell';

const AdminDashboardPage: React.FC = () => {
  return (
    <Shell>
      <SegmentProvider>
        <AdminDashboard />
      </SegmentProvider>
    </Shell>
  );
};

export default AdminDashboardPage;
