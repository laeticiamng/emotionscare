/**
 * B2BLayout - Layout entreprise avec style Apple élégant
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import AppleStyleShell from '@/components/layout/AppleStyleShell';

const B2BLayout: React.FC = () => {
  return (
    <AppleStyleShell showBackButton={true}>
      <Outlet />
    </AppleStyleShell>
  );
};

export default B2BLayout;
