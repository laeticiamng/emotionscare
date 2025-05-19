
import React, { createContext, useState, useContext } from 'react';
import { LayoutContextType, LayoutProviderProps } from '@/types/layout';
import { Theme } from '@/types/theme';

const defaultContext: LayoutContextType = {
  sidebarCollapsed: false,
  toggleSidebar: () => {},
  setSidebarCollapsed: () => {},
  sidebarOpen: true,
  setSidebarOpen: () => {},
  theme: 'light',
  setTheme: () => {},
  fullscreen: false,
  setFullscreen: () => {},
};

export const LayoutContext = createContext<LayoutContextType>(defaultContext);

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const setSidebarOpen = (open: boolean) => {
    setSidebarCollapsed(!open);
  };

  return (
    <LayoutContext.Provider value={{ 
      sidebarCollapsed, 
      toggleSidebar, 
      setSidebarCollapsed,
      sidebarOpen: !sidebarCollapsed,
      setSidebarOpen,
      theme,
      setTheme,
      fullscreen,
      setFullscreen
    }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => useContext(LayoutContext);
export default LayoutContext;
