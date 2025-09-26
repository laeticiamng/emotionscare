import React from 'react';
import { Outlet } from 'react-router-dom';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-white">
      <main id="main-content">
        <Outlet />
      </main>
    </div>
  );
}