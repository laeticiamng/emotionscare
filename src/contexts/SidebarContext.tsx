
import React from 'react';
import SidebarProvider from '@/components/ui/sidebar/SidebarContext';

export const SidebarContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <SidebarProvider>{children}</SidebarProvider>;
};

export default SidebarContext;
