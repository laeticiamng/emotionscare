// @ts-nocheck

import React, { createContext, useContext, useState } from 'react';
import type { LayoutContextType } from '@/types/layout';

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <LayoutContext.Provider value={{
      sidebarCollapsed,
      toggleSidebar,
      setSidebarCollapsed,
      sidebarOpen,
      setSidebarOpen,
      fullscreen,
      setFullscreen,
      // Theme sera géré par le ThemeProvider
      theme: 'system',
      setTheme: () => {},
    }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
