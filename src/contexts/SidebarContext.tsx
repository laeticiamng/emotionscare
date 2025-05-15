
import React from 'react';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar/SidebarContext';

interface SidebarContextProps {
  children: React.ReactNode;
}

export const SidebarContext: React.FC<SidebarContextProps> = ({ children }) => {
  return <SidebarProvider>{children}</SidebarProvider>;
};

// Export SidebarProvider from components/ui/sidebar/SidebarContext.tsx
export { SidebarProvider, useSidebar };

export default SidebarContext;
