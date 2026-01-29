/**
 * EnhancedShell - Layout principal avec style Apple élégant
 * Wrapper autour de AppleStyleShell pour compatibilité
 */

import React, { memo } from 'react';
import { Outlet } from 'react-router-dom';
import AppleStyleShell from './AppleStyleShell';

interface EnhancedShellProps {
  children?: React.ReactNode;
  hideNav?: boolean;
  hideFooter?: boolean;
  immersive?: boolean;
  className?: string;
}

const EnhancedShell: React.FC<EnhancedShellProps> = memo(({
  children,
  hideNav = false,
  hideFooter = false,
  immersive = false,
  className = '',
}) => {
  return (
    <AppleStyleShell
      hideNav={hideNav}
      hideFooter={hideFooter}
      showBackButton={true}
      className={className}
    >
      {children || <Outlet />}
    </AppleStyleShell>
  );
});

EnhancedShell.displayName = 'EnhancedShell';

export default EnhancedShell;