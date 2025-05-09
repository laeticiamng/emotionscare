
import React from 'react';
import AdminDashboard from '@/components/dashboard/admin/AdminDashboard';
import { SegmentProvider } from '@/contexts/SegmentContext';

const AdminDashboardPage: React.FC = () => {
  return (
    <SegmentProvider>
      <AdminDashboard />
    </SegmentProvider>
  );
};

export default AdminDashboardPage;
