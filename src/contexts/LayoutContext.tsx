
import React, { createContext, useState, useContext } from 'react';
import { LayoutContextType, LayoutProviderProps } from '@/types/layout';

export const LayoutContext = createContext<LayoutContextType>({
  sidebarCollapsed: false,
  toggleSidebar: () => {},
  setSidebarCollapsed: () => {},
  sidebarOpen: true,
});

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <LayoutContext.Provider value={{ 
      sidebarCollapsed, 
      toggleSidebar, 
      setSidebarCollapsed,
      sidebarOpen: !sidebarCollapsed 
    }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => useContext(LayoutContext);
export default LayoutContext;
