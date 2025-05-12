
import React from 'react';
import { Outlet } from 'react-router-dom';
import MainNavbar from './navigation/MainNavbar';
import MainFooter from './navigation/MainFooter';

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
