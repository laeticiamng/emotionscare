import React from 'react';
import { Outlet } from 'react-router-dom';
import { InAppNotificationCenter } from '@/components/InAppNotificationCenter';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
      <InAppNotificationCenter />
    </div>
  );
};

export default AppLayout;