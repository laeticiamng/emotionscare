
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggle: () => void;
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  setIsOpen: () => {},
  toggle: () => {},
  collapsed: false,
  toggleCollapsed: () => {},
});

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  
  const toggle = () => {
    setIsOpen((prev) => !prev);
  };
  
  const toggleCollapsed = () => {
    setCollapsed((prev) => !prev);
  };
  
  return (
    <SidebarContext.Provider value={{ 
      isOpen, 
      setIsOpen, 
      toggle, 
      collapsed, 
      toggleCollapsed 
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
