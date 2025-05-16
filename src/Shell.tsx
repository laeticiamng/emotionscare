
import React from 'react';
import { Outlet } from 'react-router-dom';
import MainNavbar from './components/navigation/MainNavbar';
import MainFooter from './components/navigation/MainFooter';

interface ShellProps {
  children?: React.ReactNode;
  hideNav?: boolean;
}

const Shell: React.FC<ShellProps> = ({ children, hideNav = false }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {!hideNav && <MainNavbar />}

      <main className="flex-1 bg-gradient-to-b from-background to-muted/20">
        {children || <Outlet />}
      </main>

      {!hideNav && <MainFooter />}
    </div>
  );
};

export default Shell;
