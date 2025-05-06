
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

export const Shell: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="flex-1">
        {children || <Outlet />}
      </div>
      <Toaster />
    </div>
  );
};
