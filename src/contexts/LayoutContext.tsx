
import React, { createContext, useState, useContext } from 'react';

export type LayoutContextType = {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  sidebarOpen?: boolean; // Added for compatibility
};

export const LayoutContext = createContext<LayoutContextType>({
  sidebarCollapsed: false,
  toggleSidebar: () => {},
  setSidebarCollapsed: () => {},
  sidebarOpen: true,
});

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
