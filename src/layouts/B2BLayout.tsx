import React from 'react';
import { Outlet } from 'react-router-dom';
import EnhancedShell from '@/components/layout/EnhancedShell';

const B2BLayout: React.FC = () => {
  return (
    <EnhancedShell>
      <Outlet />
    </EnhancedShell>
  );
};

export default B2BLayout;
