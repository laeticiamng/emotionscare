/**
 * Shell - Composant wrapper principal pour l'application
 */

import React from 'react';

interface ShellProps {
  children: React.ReactNode;
}

const Shell: React.FC<ShellProps> = ({ children }) => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <div className="flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default Shell;