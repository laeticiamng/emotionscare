
import React from 'react';
import { Outlet } from 'react-router-dom';

console.log('Shell component rendering...');

const Shell: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <div data-testid="page-root">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Shell;
