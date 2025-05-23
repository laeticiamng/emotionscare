
import React from 'react';
import { Outlet } from 'react-router-dom';
import UnifiedLayout from '@/components/unified/UnifiedLayout';

const Shell: React.FC = () => {
  return (
    <UnifiedLayout>
      <Outlet />
    </UnifiedLayout>
  );
};

export default Shell;
