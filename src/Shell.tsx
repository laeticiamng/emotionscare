
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
  if (!hideNav && !hideHeader) {
    return <UnifiedLayout>{children}</UnifiedLayout>;
  }

  // If we need to hide parts of the UI, we render a simpler layout
  return (
    <div className="flex min-h-screen flex-col">
      {children}
    </div>
  );
};

export default Shell;
