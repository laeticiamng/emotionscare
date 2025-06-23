
import React from 'react';
import { Outlet } from 'react-router-dom';

console.log('🐚 Shell component rendering...');

const Shell: React.FC = () => {
  console.log('🐚 Shell function called');
  
  React.useEffect(() => {
    console.log('🐚 Shell mounted, current path:', window.location.pathname);
    return () => console.log('🐚 Shell unmounted');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div data-testid="page-root" className="min-h-screen">
        <div className="bg-gray-900 text-white p-2 text-xs">
          🐚 Shell actif - Route: {window.location.pathname}
        </div>
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Shell;
