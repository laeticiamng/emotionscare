
import React from 'react';
import UnifiedLayout from '@/components/unified/UnifiedLayout';

interface ShellProps {
  children: React.ReactNode;
  hideNav?: boolean;
  hideHeader?: boolean;
  hideFooter?: boolean;
}

const Shell: React.FC<ShellProps> = ({
  children,
  hideNav = false,
  hideHeader = false,
  hideFooter = false,
}) => {
  // By default we use the UnifiedLayout which includes header and sidebar
  return <UnifiedLayout>{children}</UnifiedLayout>;
};

export default Shell;
