
import React from 'react';
import { Outlet } from 'react-router-dom';

// Define the props interface
interface ShellProps {
  children?: React.ReactNode;
}

const Shell: React.FC<ShellProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default Shell;
