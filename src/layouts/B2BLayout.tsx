// @ts-nocheck
import React from 'react';
import { Outlet } from 'react-router-dom';
import Shell from '@/Shell';

const B2BLayout: React.FC = () => {
  return (
    <Shell>
      <Outlet />
    </Shell>
  );
};

export default B2BLayout;
