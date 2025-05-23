
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
