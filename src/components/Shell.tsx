
import React from 'react';
import { Outlet } from 'react-router-dom';
import MainNavbar from './navigation/MainNavbar';
import MainFooter from './navigation/MainFooter';

interface ShellProps {
  children?: React.ReactNode;
  hideNav?: boolean;
  hideFooter?: boolean;
  className?: string;
}

const Shell: React.FC<ShellProps> = ({ 
  children, 
  hideNav = false, 
  hideFooter = false,
  className = "" 
}) => {
  return (
    <div className={`flex flex-col min-h-screen ${className}`}>
      {!hideNav && <MainNavbar />}

      <main className="flex-1 bg-gradient-to-b from-background to-muted/20">
        {children || <Outlet />}
      </main>

      {!hideFooter && <MainFooter />}
    </div>
  );
};

export default Shell;
