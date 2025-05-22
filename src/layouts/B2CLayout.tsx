
import React from 'react';
import { Outlet } from 'react-router-dom';
import Shell from '@/Shell';

const B2CLayout: React.FC = () => {
  return (
    <Shell>
      <Outlet />
    </Shell>
  );
};

export default B2CLayout;
