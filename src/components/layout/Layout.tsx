/**
 * Layout - Layout de base avec style Apple élégant
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import AppleStyleShell from '@/components/layout/AppleStyleShell';

const Layout: React.FC = () => {
  return (
    <AppleStyleShell showBackButton={true}>
      <Outlet />
    </AppleStyleShell>
  );
};

export default Layout;
