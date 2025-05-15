
import React, { createContext, useContext, useState } from 'react';
import { SidebarContextType } from '@/types';

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  toggleCollapsed: () => {},
});

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  const toggleCollapsed = () => setCollapsed(!collapsed);

  return (
    <SidebarContext.Provider value={{ 
      collapsed, 
      toggleCollapsed, 
      isOpen, 
      setIsOpen,
      isMobile 
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
