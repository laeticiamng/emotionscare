
import React from 'react';
import { Outlet } from 'react-router-dom';
import MainNavbar from './components/navigation/MainNavbar';
import MainFooter from './components/navigation/MainFooter';

// Define the props interface correctly
interface ShellProps {
  children?: React.ReactNode;
}

const Shell: React.FC<ShellProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNavbar />

      <main className="flex-1 bg-gradient-to-b from-background to-muted/20">
        {children || <Outlet />}
      </main>

      <MainFooter />
    </div>
  );
};

export default Shell;
