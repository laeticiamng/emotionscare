/**
 * B2CLayout - Layout consommateur avec style Apple élégant
 */

import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AppleStyleShell from '@/components/layout/AppleStyleShell';
import '@/styles/b2c-theme.css';

const B2CLayout: React.FC = () => {
  useEffect(() => {
    document.body.classList.add('b2c-layout');
    return () => {
      document.body.classList.remove('b2c-layout');
    };
  }, []);

  return (
    <AppleStyleShell showBackButton={true}>
      <Outlet />
    </AppleStyleShell>
  );
};

export default B2CLayout;
