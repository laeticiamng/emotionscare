
import React, { createContext, useContext, useState } from 'react';

interface SidebarContextType {
  expanded: boolean;
  toggleSidebar: () => void;
  setExpanded: (expanded: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expanded, setExpanded] = useState(true);

  const toggleSidebar = () => setExpanded(!expanded);

  return (
    <SidebarContext.Provider value={{ expanded, toggleSidebar, setExpanded }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export default SidebarContext;
