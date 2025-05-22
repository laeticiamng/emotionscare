
import React from 'react';
import MainNavbar from './components/navigation/MainNavbar';
import FooterLinks from './components/home/FooterLinks';

interface ShellProps {
  children: React.ReactNode;
  hideNav?: boolean;
  hideFooter?: boolean;
}

const Shell: React.FC<ShellProps> = ({ 
  children, 
  hideNav = false,
  hideFooter = false
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!hideNav && <MainNavbar />}
      
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      
      {!hideFooter && <FooterLinks />}
    </div>
  );
};

export default Shell;
