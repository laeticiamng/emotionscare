
import React from 'react';
import { Outlet } from 'react-router-dom';

const B2CLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4">
          <h1 className="text-2xl font-bold">EmotionsCare</h1>
        </div>
      </header>
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <footer className="border-t py-4">
        <div className="container mx-auto text-center text-muted-foreground px-4">
          &copy; 2025 EmotionsCare
        </div>
      </footer>
    </div>
  );
};

export default B2CLayout;
