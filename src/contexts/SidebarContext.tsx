
import React, { createContext, useContext, useState } from 'react';
import type { SidebarContextType } from '@/types/sidebar';

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode; defaultCollapsed?: boolean }> = ({ 
  children, 
  defaultCollapsed = false 
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const toggleCollapsed = () => {
    setCollapsed(prev => !prev);
  };

  return (
    <SidebarContext.Provider value={{
      collapsed,
      toggleCollapsed,
      setCollapsed,
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
