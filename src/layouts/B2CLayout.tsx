
import React from 'react';
import { Outlet } from 'react-router-dom';

const B2CLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-4">
          <h1 className="text-2xl font-bold">B2C Application</h1>
        </div>
      </header>
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <footer className="border-t py-4">
        <div className="container mx-auto text-center text-muted-foreground space-y-1">
          <div>&copy; 2025 B2C Application</div>
          <a href="/ethique" className="underline">Portail RGPD &amp; éthique</a>
        </div>
      </footer>
    </div>
  );
};

export default B2CLayout;
