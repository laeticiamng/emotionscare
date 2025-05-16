
import React from 'react';

interface ShellProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

const Shell: React.FC<ShellProps> = ({ children, hideNav = false }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {!hideNav && (
        <header className="border-b">
          <div className="container mx-auto p-4">
            <nav>Navigation</nav>
          </div>
        </header>
      )}
      
      <main className="flex-grow">
        {children}
      </main>
      
      {!hideNav && (
        <footer className="border-t">
          <div className="container mx-auto p-4 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} EmotionsCare
          </div>
        </footer>
      )}
    </div>
  );
};

export default Shell;
